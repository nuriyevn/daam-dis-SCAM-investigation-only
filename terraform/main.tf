terraform {
  required_version = ">= 1.6"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 6.0"
    }

    tls = {
      source  = "hashicorp/tls"
      version = "~> 4.0"
    }

    local = {
      source  = "hashicorp/local"
      version = "~> 2.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

# ============================================================
# Latest Amazon Linux 2023 AMI
# ============================================================

data "aws_ssm_parameter" "al2023_ami" {
  name = "/aws/service/ami-amazon-linux-latest/al2023-ami-kernel-default-x86_64"
}

# ============================================================
# Default VPC
# ============================================================

data "aws_vpc" "default" {
  default = true
}

# ============================================================
# SSH key
# ============================================================

resource "tls_private_key" "daam_ssh" {
  algorithm = "RSA"
  rsa_bits  = 4096
}

resource "aws_key_pair" "daam" {
  key_name   = var.key_name
  public_key = tls_private_key.daam_ssh.public_key_openssh

  tags = {
    Name      = var.key_name
    Project   = "DAAM"
    ManagedBy = "terraform"
  }
}

# Save private key locally.
#
# IMPORTANT:
# The private key is also present in Terraform state because
# tls_private_key generates it.
#
resource "local_sensitive_file" "daam_private_key" {
  filename        = "${path.module}/${var.key_name}.pem"
  content         = tls_private_key.daam_ssh.private_key_pem
  file_permission = "0400"
}

# ============================================================
# Security Group
# ============================================================

resource "aws_security_group" "daam" {
  name        = "daam-sg"
  description = "Security group for DAAM application"
  vpc_id      = data.aws_vpc.default.id

  # SSH
  ingress {
    description = "SSH"

    from_port = 22
    to_port   = 22
    protocol  = "tcp"

    cidr_blocks = [var.ssh_cidr]
  }

  # HTTP
  ingress {
    description = "HTTP"

    from_port = 80
    to_port   = 80
    protocol  = "tcp"

    cidr_blocks = ["0.0.0.0/0"]
  }

  # HTTPS
  ingress {
    description = "HTTPS"

    from_port = 443
    to_port   = 443
    protocol  = "tcp"

    cidr_blocks = ["0.0.0.0/0"]
  }

  # Everything outbound
  egress {
    from_port = 0
    to_port   = 0
    protocol  = "-1"

    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name      = "daam-sg"
    Project   = "DAAM"
    ManagedBy = "terraform"
  }
}

# ============================================================
# EC2 Instance
# ============================================================

resource "aws_instance" "daam" {
  ami           = data.aws_ssm_parameter.al2023_ami.value
  instance_type = var.instance_type

  key_name = aws_key_pair.daam.key_name

  vpc_security_group_ids = [
    aws_security_group.daam.id
  ]

  associate_public_ip_address = true

  root_block_device {
    volume_size           = 30
    volume_type           = "gp3"
    encrypted             = true
    delete_on_termination = true
  }

  metadata_options {
    http_endpoint = "enabled"
    http_tokens   = "required"
  }

  user_data = <<-EOF
    #!/bin/bash

    set -eux

    # --------------------------------------------------------
    # System update
    # --------------------------------------------------------

    dnf update -y

    # --------------------------------------------------------
    # Basic tools
    # --------------------------------------------------------

    dnf install -y \
      git \
      curl \
      wget \
      jq \
      nginx

    # --------------------------------------------------------
    # Node.js 20
    # --------------------------------------------------------

    dnf install -y nodejs20

    # Make node/npm available as the standard commands.
    alternatives --install /usr/bin/node node /usr/bin/node-20 20 || true
    alternatives --install /usr/bin/npm npm /usr/bin/npm-20 20 || true

    # --------------------------------------------------------
    # Create application directory
    # --------------------------------------------------------

    mkdir -p /home/ec2-user/daam

    chown -R ec2-user:ec2-user /home/ec2-user/daam

    # --------------------------------------------------------
    # Enable nginx
    # --------------------------------------------------------

    systemctl enable nginx
    systemctl start nginx

    # --------------------------------------------------------
    # Useful version information
    # --------------------------------------------------------

    node --version || true
    npm --version || true

  EOF

  tags = {
    Name      = "daam-server"
    Project   = "DAAM"
    Environment = "dev"
    ManagedBy = "terraform"
  }
}

# ============================================================
# Elastic IP
# ============================================================

resource "aws_eip" "daam" {
  domain = "vpc"

  tags = {
    Name      = "daam-eip"
    Project   = "DAAM"
    ManagedBy = "terraform"
  }
}

resource "aws_eip_association" "daam" {
  instance_id   = aws_instance.daam.id
  allocation_id = aws_eip.daam.id
}