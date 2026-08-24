# Infrastructure for swornmail.com: S3 origin, CloudFront distribution,
# ACM certificate, Route 53 records, and the OIDC role GitHub Actions assumes
# to publish.
#
# NOT YET APPLIED. Written from the AWS provider documentation and never run
# against an account, because the AWS session was expired at authoring time.
# Treat `terraform plan` output as the first real review of this file.
#
# Design notes worth keeping:
#
#   - The bucket is private. CloudFront reaches it through Origin Access
#     Control, not through the S3 website endpoint. A public bucket would work
#     and would also be directly reachable, bypassing every response header
#     configured below — including the CSP.
#   - GitHub Actions authenticates by OIDC. There are no long-lived AWS keys
#     in this repository or in its secrets, which is the point.
#   - Response headers are set on the distribution rather than in the objects,
#     so a header change does not require re-uploading the site.

terraform {
  required_version = ">= 1.9"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 6.0"
    }
  }
}

provider "aws" {
  region = var.region
}

# CloudFront only reads certificates from us-east-1, regardless of where
# everything else lives.
provider "aws" {
  alias  = "us_east_1"
  region = "us-east-1"
}

data "aws_caller_identity" "current" {}

locals {
  # www redirects to the apex rather than serving a second copy: one canonical
  # origin for the content, and no duplicate-content ambiguity.
  aliases = [var.domain_name, "www.${var.domain_name}"]
}

# --------------------------------------------------------------------------
# Origin bucket
# --------------------------------------------------------------------------

resource "aws_s3_bucket" "site" {
  bucket = var.bucket_name
}

resource "aws_s3_bucket_public_access_block" "site" {
  bucket                  = aws_s3_bucket.site.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_versioning" "site" {
  bucket = aws_s3_bucket.site.id
  # A bad deploy is one `terraform`-free rollback away instead of a rebuild
  # from whichever commit happened to be green.
  versioning_configuration { status = "Enabled" }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "site" {
  bucket = aws_s3_bucket.site.id
  rule {
    apply_server_side_encryption_by_default { sse_algorithm = "AES256" }
  }
}

# Only this distribution may read the bucket.
data "aws_iam_policy_document" "site" {
  statement {
    sid       = "AllowCloudFrontRead"
    actions   = ["s3:GetObject"]
    resources = ["${aws_s3_bucket.site.arn}/*"]

    principals {
      type        = "Service"
      identifiers = ["cloudfront.amazonaws.com"]
    }
    condition {
      test     = "StringEquals"
      variable = "AWS:SourceArn"
      values   = [aws_cloudfront_distribution.site.arn]
    }
  }
}

resource "aws_s3_bucket_policy" "site" {
  bucket = aws_s3_bucket.site.id
  policy = data.aws_iam_policy_document.site.json
}

# --------------------------------------------------------------------------
# Certificate
# --------------------------------------------------------------------------

resource "aws_acm_certificate" "site" {
  provider                  = aws.us_east_1
  domain_name               = var.domain_name
  subject_alternative_names = ["www.${var.domain_name}"]
  validation_method         = "DNS"

  lifecycle { create_before_destroy = true }
}

resource "aws_route53_record" "cert_validation" {
  for_each = {
    for o in aws_acm_certificate.site.domain_validation_options :
    o.domain_name => {
      name  = o.resource_record_name
      type  = o.resource_record_type
      value = o.resource_record_value
    }
  }

  zone_id         = var.hosted_zone_id
  name            = each.value.name
  type            = each.value.type
  records         = [each.value.value]
  ttl             = 60
  allow_overwrite = true
}

resource "aws_acm_certificate_validation" "site" {
  provider                = aws.us_east_1
  certificate_arn         = aws_acm_certificate.site.arn
  validation_record_fqdns = [for r in aws_route53_record.cert_validation : r.fqdn]
}

# --------------------------------------------------------------------------
# Distribution
# --------------------------------------------------------------------------

resource "aws_cloudfront_origin_access_control" "site" {
  name                              = "${var.bucket_name}-oac"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}

# Next.js with trailingSlash emits directories. S3 has no directory index, so
# a request for /docs/ would 404 against the raw object key. This rewrites
# such requests to /docs/index.html at the edge. Only "/" matters for a
# one-page site; it is here so the docs site does not have to rediscover it.
resource "aws_cloudfront_function" "index_rewrite" {
  name    = "swornmail-index-rewrite"
  runtime = "cloudfront-js-2.0"
  publish = true
  code    = file("${path.module}/index-rewrite.js")
}

resource "aws_cloudfront_response_headers_policy" "site" {
  name = "swornmail-security-headers"

  security_headers_config {
    strict_transport_security {
      override                   = true
      access_control_max_age_sec = 63072000
      include_subdomains         = true
      preload                    = true
    }
    content_type_options { override = true }
    frame_options {
      override     = true
      frame_option = "DENY"
    }
    referrer_policy {
      override        = true
      referrer_policy = "strict-origin-when-cross-origin"
    }

    content_security_policy {
      override = true
      # The site fetches nothing, so everything defaults to 'none' and the few
      # things it does need are named explicitly.
      #
      # script-src carries 'unsafe-inline' and that is a real weakening worth
      # stating plainly. A static Next.js export inlines bootstrap scripts
      # whose contents change every build, so neither a nonce (no server) nor
      # a fixed hash list (changes per build) works without extracting hashes
      # during CI. Given the page loads no third-party script and accepts no
      # user input, the residual risk is small — but it is not zero, and if
      # this site ever grows a form or an embed, revisit this first.
      content_security_policy = join("; ", [
        "default-src 'none'",
        "script-src 'self' 'unsafe-inline'",
        "style-src 'self' 'unsafe-inline'",
        "img-src 'self' data:",
        "font-src 'self'",
        "connect-src 'self'",
        "base-uri 'none'",
        "form-action 'none'",
        "frame-ancestors 'none'",
        "upgrade-insecure-requests",
      ])
    }
  }

  custom_headers_config {
    items {
      header   = "Permissions-Policy"
      override = true
      # Nothing on this page needs a device. Denying by name is clearer to a
      # reviewer than an empty policy.
      value = "accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=(), interest-cohort=()"
    }
  }
}

resource "aws_cloudfront_distribution" "site" {
  enabled             = true
  is_ipv6_enabled     = true
  comment             = "swornmail.com — protocol marketing site"
  default_root_object = "index.html"
  aliases             = local.aliases
  price_class         = var.price_class

  origin {
    domain_name              = aws_s3_bucket.site.bucket_regional_domain_name
    origin_id                = "s3-${aws_s3_bucket.site.id}"
    origin_access_control_id = aws_cloudfront_origin_access_control.site.id
  }

  default_cache_behavior {
    target_origin_id       = "s3-${aws_s3_bucket.site.id}"
    viewer_protocol_policy = "redirect-to-https"
    allowed_methods        = ["GET", "HEAD", "OPTIONS"]
    cached_methods         = ["GET", "HEAD"]
    compress               = true

    # AWS managed policies: CachingOptimized, and no origin request headers.
    cache_policy_id            = "658327ea-f89d-4fab-a63d-7e88639e58f6"
    response_headers_policy_id = aws_cloudfront_response_headers_policy.site.id

    function_association {
      event_type   = "viewer-request"
      function_arn = aws_cloudfront_function.index_rewrite.arn
    }
  }

  # Next emits 404.html; serve it with a real 404 rather than a 200, so a
  # broken link is not indexed as a page.
  custom_error_response {
    error_code            = 404
    response_code         = 404
    response_page_path    = "/404.html"
    error_caching_min_ttl = 300
  }

  restrictions {
    geo_restriction { restriction_type = "none" }
  }

  viewer_certificate {
    acm_certificate_arn      = aws_acm_certificate_validation.site.certificate_arn
    ssl_support_method       = "sni-only"
    minimum_protocol_version = "TLSv1.2_2021"
  }
}

# --------------------------------------------------------------------------
# DNS
# --------------------------------------------------------------------------

resource "aws_route53_record" "apex" {
  for_each = toset(["A", "AAAA"])

  zone_id = var.hosted_zone_id
  name    = var.domain_name
  type    = each.value

  alias {
    name                   = aws_cloudfront_distribution.site.domain_name
    zone_id                = aws_cloudfront_distribution.site.hosted_zone_id
    evaluate_target_health = false
  }
}

resource "aws_route53_record" "www" {
  for_each = toset(["A", "AAAA"])

  zone_id = var.hosted_zone_id
  name    = "www.${var.domain_name}"
  type    = each.value

  alias {
    name                   = aws_cloudfront_distribution.site.domain_name
    zone_id                = aws_cloudfront_distribution.site.hosted_zone_id
    evaluate_target_health = false
  }
}

# --------------------------------------------------------------------------
# Publishing identity for GitHub Actions
# --------------------------------------------------------------------------

data "aws_iam_policy_document" "github_assume" {
  statement {
    actions = ["sts:AssumeRoleWithWebIdentity"]

    principals {
      type        = "Federated"
      identifiers = ["arn:aws:iam::${data.aws_caller_identity.current.account_id}:oidc-provider/token.actions.githubusercontent.com"]
    }
    condition {
      test     = "StringEquals"
      variable = "token.actions.githubusercontent.com:aud"
      values   = ["sts.amazonaws.com"]
    }
    # Scoped to one branch of one repository. Without this condition any
    # GitHub repository in the world could assume the role.
    condition {
      test     = "StringEquals"
      variable = "token.actions.githubusercontent.com:sub"
      values   = ["repo:${var.github_repository}:ref:refs/heads/main"]
    }
  }
}

resource "aws_iam_role" "github_deploy" {
  name               = "swornmail-com-deploy"
  assume_role_policy = data.aws_iam_policy_document.github_assume.json
}

data "aws_iam_policy_document" "github_deploy" {
  statement {
    sid       = "SyncSite"
    actions   = ["s3:ListBucket", "s3:GetObject", "s3:PutObject", "s3:DeleteObject"]
    resources = [aws_s3_bucket.site.arn, "${aws_s3_bucket.site.arn}/*"]
  }
  statement {
    sid       = "InvalidateCache"
    actions   = ["cloudfront:CreateInvalidation", "cloudfront:GetInvalidation"]
    resources = [aws_cloudfront_distribution.site.arn]
  }
}

resource "aws_iam_role_policy" "github_deploy" {
  role   = aws_iam_role.github_deploy.id
  policy = data.aws_iam_policy_document.github_deploy.json
}
