output "bucket_name" {
  description = "Set as the S3_BUCKET repository variable in GitHub Actions."
  value       = aws_s3_bucket.site.id
}

output "distribution_id" {
  description = "Set as the CLOUDFRONT_DISTRIBUTION_ID repository variable in GitHub Actions."
  value       = aws_cloudfront_distribution.site.id
}

output "deploy_role_arn" {
  description = "Set as the AWS_DEPLOY_ROLE_ARN repository variable in GitHub Actions."
  value       = aws_iam_role.github_deploy.arn
}

output "distribution_domain" {
  description = "CloudFront hostname, for checking the site before DNS is switched."
  value       = aws_cloudfront_distribution.site.domain_name
}
