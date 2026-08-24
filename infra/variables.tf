variable "region" {
  description = "Region for the S3 origin. The certificate is always created in us-east-1 regardless."
  type        = string
  default     = "us-east-1"
}

variable "domain_name" {
  description = "Apex domain. www is added as an alias automatically."
  type        = string
  default     = "swornmail.com"
}

variable "bucket_name" {
  description = "S3 bucket holding the built site. Private; reachable only through CloudFront."
  type        = string
}

variable "hosted_zone_id" {
  description = "Route 53 hosted zone ID for domain_name."
  type        = string
}

variable "github_repository" {
  description = "owner/repo permitted to assume the deploy role. Scoped to refs/heads/main."
  type        = string
  default     = "swornmail/swornmail.com"
}

variable "price_class" {
  description = "CloudFront price class. PriceClass_100 covers North America and Europe, which is where this audience is."
  type        = string
  default     = "PriceClass_100"
}
