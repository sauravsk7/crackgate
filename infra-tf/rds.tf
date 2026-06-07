resource "random_password" "db" {
  length  = 48
  special = false # avoid URL-special chars; Prisma DSN is built by string concat
}

resource "aws_db_subnet_group" "main" {
  name       = "${local.name}-rds"
  subnet_ids = aws_subnet.private[*].id
  tags       = { Name = "${local.name}-rds-subnets" }
}

resource "aws_db_parameter_group" "pg16" {
  name        = "${local.name}-pg16"
  family      = "postgres16"
  description = "CrackGate Postgres 16 tuning"

  # Force SSL on every connection
  parameter {
    name  = "rds.force_ssl"
    value = "1"
  }

  # log slow queries (>500ms) for ops visibility
  parameter {
    name  = "log_min_duration_statement"
    value = "500"
  }
}

resource "aws_db_instance" "main" {
  identifier     = "${local.name}-pg"
  engine         = "postgres"
  engine_version = "16.14"
  instance_class = var.rds_instance_class

  allocated_storage     = var.rds_allocated_storage_gb
  max_allocated_storage = 50 # autoscale ceiling
  storage_type          = "gp3"
  storage_encrypted     = true

  db_name  = "crackgate"
  username = "crackgate"
  password = random_password.db.result
  port     = 5432

  db_subnet_group_name   = aws_db_subnet_group.main.name
  vpc_security_group_ids = [aws_security_group.rds.id]
  parameter_group_name   = aws_db_parameter_group.pg16.name
  publicly_accessible    = false

  multi_az                  = false # single-AZ to stay in budget
  backup_retention_period   = var.rds_backup_retention_days
  backup_window             = "18:00-19:00" # UTC = 23:30-00:30 IST (low traffic)
  maintenance_window        = "Mon:19:00-Mon:20:00"
  copy_tags_to_snapshot     = true
  deletion_protection       = true
  skip_final_snapshot       = false
  final_snapshot_identifier = "${local.name}-final-${formatdate("YYYYMMDD-hhmm", timestamp())}"

  performance_insights_enabled          = true
  performance_insights_retention_period = 7 # days; free tier

  apply_immediately = false

  lifecycle {
    ignore_changes = [final_snapshot_identifier]
  }

  tags = { Name = "${local.name}-pg" }
}
