# ─── EC2 instance profile (host runs as this role) ───────────────────────
data "aws_iam_policy_document" "ec2_assume" {
  statement {
    actions = ["sts:AssumeRole"]
    principals {
      type        = "Service"
      identifiers = ["ec2.amazonaws.com"]
    }
  }
}

resource "aws_iam_role" "ec2" {
  name               = "${local.name}-ec2"
  assume_role_policy = data.aws_iam_policy_document.ec2_assume.json
}

resource "aws_iam_role_policy_attachment" "ec2_ecr_read" {
  role       = aws_iam_role.ec2.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryReadOnly"
}

resource "aws_iam_role_policy_attachment" "ec2_cw_agent" {
  role       = aws_iam_role.ec2.name
  policy_arn = "arn:aws:iam::aws:policy/CloudWatchAgentServerPolicy"
}

resource "aws_iam_role_policy_attachment" "ec2_ssm" {
  role       = aws_iam_role.ec2.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore"
}

data "aws_iam_policy_document" "ec2_inline" {
  # Read the runtime secret
  statement {
    sid     = "ReadCrackgateSecrets"
    actions = ["secretsmanager:GetSecretValue", "secretsmanager:DescribeSecret"]
    resources = [
      aws_secretsmanager_secret.env.arn,
    ]
  }

  # Write to uploads + backups buckets
  statement {
    sid = "S3UploadsRW"
    actions = [
      "s3:PutObject", "s3:GetObject", "s3:DeleteObject",
      "s3:ListBucket", "s3:GetObjectVersion",
    ]
    resources = [
      aws_s3_bucket.uploads.arn,
      "${aws_s3_bucket.uploads.arn}/*",
    ]
  }
  statement {
    sid = "S3BackupsWrite"
    actions = [
      "s3:PutObject", "s3:GetObject",
      "s3:ListBucket", "s3:AbortMultipartUpload",
    ]
    resources = [
      aws_s3_bucket.backups.arn,
      "${aws_s3_bucket.backups.arn}/*",
    ]
  }

  # awslogs docker driver creates groups/streams + writes
  statement {
    sid = "CloudWatchLogsWrite"
    actions = [
      "logs:CreateLogGroup",
      "logs:CreateLogStream",
      "logs:PutLogEvents",
      "logs:DescribeLogStreams",
    ]
    resources = ["arn:aws:logs:${var.aws_region}:${data.aws_caller_identity.current.account_id}:log-group:/${var.project}/*"]
  }
}

resource "aws_iam_role_policy" "ec2_inline" {
  name   = "${local.name}-ec2-inline"
  role   = aws_iam_role.ec2.id
  policy = data.aws_iam_policy_document.ec2_inline.json
}

resource "aws_iam_instance_profile" "ec2" {
  name = "${local.name}-ec2"
  role = aws_iam_role.ec2.name
}

# ─── GitHub Actions OIDC role (no long-lived AWS keys in CI) ─────────────
data "aws_iam_openid_connect_provider" "github" {
  # Create this OIDC provider once per account:
  #   aws iam create-open-id-connect-provider \
  #     --url https://token.actions.githubusercontent.com \
  #     --client-id-list sts.amazonaws.com \
  #     --thumbprint-list 6938fd4d98bab03faadb97b34396831e3780aea1
  url = "https://token.actions.githubusercontent.com"
}

data "aws_iam_policy_document" "gha_assume" {
  statement {
    actions = ["sts:AssumeRoleWithWebIdentity"]
    principals {
      type        = "Federated"
      identifiers = [data.aws_iam_openid_connect_provider.github.arn]
    }
    condition {
      test     = "StringEquals"
      variable = "token.actions.githubusercontent.com:aud"
      values   = ["sts.amazonaws.com"]
    }
    condition {
      test     = "StringLike"
      variable = "token.actions.githubusercontent.com:sub"
      values   = ["repo:${var.github_org}/${var.github_repo}:ref:refs/heads/main"]
    }
  }
}

resource "aws_iam_role" "gha_deploy" {
  name               = "${local.name}-gha-deploy"
  assume_role_policy = data.aws_iam_policy_document.gha_assume.json
}

data "aws_iam_policy_document" "gha_inline" {
  # Push to ECR
  statement {
    sid       = "EcrAuth"
    actions   = ["ecr:GetAuthorizationToken"]
    resources = ["*"]
  }
  statement {
    sid = "EcrPush"
    actions = [
      "ecr:BatchCheckLayerAvailability",
      "ecr:CompleteLayerUpload",
      "ecr:InitiateLayerUpload",
      "ecr:PutImage",
      "ecr:UploadLayerPart",
      "ecr:DescribeRepositories",
      "ecr:DescribeImages",
      "ecr:BatchGetImage",
    ]
    resources = [aws_ecr_repository.web.arn]
  }

  # Optional: SSM Send-Command for in-place deploys instead of SSH
  statement {
    sid = "SsmDeploy"
    actions = [
      "ssm:SendCommand",
      "ssm:ListCommandInvocations",
      "ssm:GetCommandInvocation",
    ]
    resources = ["*"]
    condition {
      test     = "StringEquals"
      variable = "aws:ResourceTag/Project"
      values   = [var.project]
    }
  }
}

resource "aws_iam_role_policy" "gha_inline" {
  name   = "${local.name}-gha-inline"
  role   = aws_iam_role.gha_deploy.id
  policy = data.aws_iam_policy_document.gha_inline.json
}
