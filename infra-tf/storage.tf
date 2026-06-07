data "aws_caller_identity" "current" {}

# ─── S3: uploads (public, served via presigned URLs) ──────────────────────
resource "aws_s3_bucket" "uploads" {
  bucket = "${local.name}-uploads"
  tags   = { Name = "${local.name}-uploads" }
}

resource "aws_s3_bucket_public_access_block" "uploads" {
  bucket                  = aws_s3_bucket.uploads.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_versioning" "uploads" {
  bucket = aws_s3_bucket.uploads.id
  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "uploads" {
  bucket = aws_s3_bucket.uploads.id
  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

resource "aws_s3_bucket_lifecycle_configuration" "uploads" {
  bucket = aws_s3_bucket.uploads.id
  rule {
    id     = "abort-incomplete-multipart"
    status = "Enabled"
    filter {}
    abort_incomplete_multipart_upload { days_after_initiation = 7 }
  }
  rule {
    id     = "expire-noncurrent-versions"
    status = "Enabled"
    filter {}
    noncurrent_version_expiration { noncurrent_days = 30 }
  }
}

# ─── S3: nightly db backups (lifecycle to Glacier) ────────────────────────
resource "aws_s3_bucket" "backups" {
  bucket = "${local.name}-backups"
  tags   = { Name = "${local.name}-backups" }
}

resource "aws_s3_bucket_public_access_block" "backups" {
  bucket                  = aws_s3_bucket.backups.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_versioning" "backups" {
  bucket = aws_s3_bucket.backups.id
  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "backups" {
  bucket = aws_s3_bucket.backups.id
  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

resource "aws_s3_bucket_lifecycle_configuration" "backups" {
  bucket = aws_s3_bucket.backups.id
  rule {
    id     = "tier-and-expire"
    status = "Enabled"
    filter { prefix = "db/" }

    transition {
      days          = 30
      storage_class = "STANDARD_IA"
    }
    transition {
      days          = 90
      storage_class = "GLACIER"
    }
    expiration {
      days = 365
    }
    noncurrent_version_expiration { noncurrent_days = 30 }
  }
}

# ─── ECR: private docker registry ─────────────────────────────────────────
resource "aws_ecr_repository" "web" {
  name                 = "${local.name}-web"
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = true
  }

  encryption_configuration {
    encryption_type = "AES256"
  }
}

resource "aws_ecr_lifecycle_policy" "web" {
  repository = aws_ecr_repository.web.name
  policy = jsonencode({
    rules = [
      {
        rulePriority = 1
        description  = "Keep last 20 tagged images"
        selection = {
          tagStatus      = "tagged"
          tagPatternList = ["sha-*"]
          countType      = "imageCountMoreThan"
          countNumber    = 20
        }
        action = { type = "expire" }
      },
      {
        rulePriority = 2
        description  = "Expire untagged after 7 days"
        selection = {
          tagStatus   = "untagged"
          countType   = "sinceImagePushed"
          countUnit   = "days"
          countNumber = 7
        }
        action = { type = "expire" }
      }
    ]
  })
}

# ─── Secrets Manager: holds the entire .env.production ────────────────────
resource "aws_secretsmanager_secret" "env" {
  name        = "${var.project}/${var.env}/env"
  description = "CrackGate ${var.env} runtime env (entire .env.production)"

  # Recovery window: 7 days. Set to 0 if you really want immediate delete.
  recovery_window_in_days = 7
}

# Seed an empty placeholder so the resource doesn't drift on first apply.
# Populate by running:
#   aws secretsmanager put-secret-value \
#     --secret-id crackgate/prod/env \
#     --secret-string file://.env.production
resource "aws_secretsmanager_secret_version" "env_placeholder" {
  secret_id     = aws_secretsmanager_secret.env.id
  secret_string = "# placeholder — populate via aws secretsmanager put-secret-value"

  lifecycle {
    ignore_changes = [secret_string] # never overwrite real value
  }
}

# ─── CloudWatch log groups ────────────────────────────────────────────────
resource "aws_cloudwatch_log_group" "web" {
  name              = "/${var.project}/web"
  retention_in_days = 14
  tags              = { Name = "${local.name}-web-logs" }
}

resource "aws_cloudwatch_log_group" "caddy" {
  name              = "/${var.project}/caddy"
  retention_in_days = 14
  tags              = { Name = "${local.name}-caddy-logs" }
}

resource "aws_cloudwatch_log_group" "ec2_host" {
  name              = "/${var.project}/ec2"
  retention_in_days = 30
  tags              = { Name = "${local.name}-ec2-logs" }
}
