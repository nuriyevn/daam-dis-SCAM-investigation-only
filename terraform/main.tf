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

variable "dev_password" {
  description = "Password for the DAAM development environment"
  type        = string
  sensitive   = true
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

    set -euxo pipefail

    exec > >(tee /var/log/daam-bootstrap.log | logger -t daam-bootstrap -s 2>/dev/console) 2>&1

    echo "============================================================"
    echo "DAAM bootstrap started"
    echo "============================================================"

    # ----------------------------------------------------------
    # System update
    # ----------------------------------------------------------

    dnf update -y

    # ----------------------------------------------------------
    # Basic tools
    # ----------------------------------------------------------

    dnf install -y git curl wget jq nginx policycoreutils-python-utils --allowerasing

    # ----------------------------------------------------------
    # Node.js 20
    # ----------------------------------------------------------

    dnf install -y nodejs20

    alternatives --install /usr/bin/node node /usr/bin/node-20 20 || true
    alternatives --install /usr/bin/npm npm /usr/bin/npm-20 20 || true

    node --version
    npm --version
    git --version
    nginx -v

    # ----------------------------------------------------------
    # GitHub SSH configuration
    # ----------------------------------------------------------

    install -d -m 700 -o ec2-user -g ec2-user /home/ec2-user/.ssh

    cat > /home/ec2-user/.ssh/daam_ec2_deploy <<'GITHUB_KEY'
    ${var.github_deploy_key}
    GITHUB_KEY

    chmod 600 /home/ec2-user/.ssh/daam_ec2_deploy
    chown ec2-user:ec2-user /home/ec2-user/.ssh/daam_ec2_deploy

    cat > /home/ec2-user/.ssh/config <<'SSH_CONFIG'
    Host github.com
        HostName github.com
        User git
        IdentityFile ~/.ssh/daam_ec2_deploy
        IdentitiesOnly yes
    SSH_CONFIG

    chmod 600 /home/ec2-user/.ssh/config
    chown ec2-user:ec2-user /home/ec2-user/.ssh/config

    # ----------------------------------------------------------
    # GitHub host verification
    # ----------------------------------------------------------

    ssh-keyscan github.com > /home/ec2-user/.ssh/known_hosts

    chmod 644 /home/ec2-user/.ssh/known_hosts
    chown ec2-user:ec2-user /home/ec2-user/.ssh/known_hosts

    # ----------------------------------------------------------
    # Clone application
    # ----------------------------------------------------------

    rm -rf /home/ec2-user/daam

    sudo -u ec2-user git clone \
      --branch codebase \
      --single-branch \
      git@github.com:nuriyevn/daam-dis.git \
      /home/ec2-user/daam

    cd /home/ec2-user/daam

    sudo -u ec2-user git status
    sudo -u ec2-user git branch --show-current

    # ----------------------------------------------------------
    # Install application dependencies / create .env
    # ----------------------------------------------------------

    sudo -u ec2-user npm run setup

    # ----------------------------------------------------------
    # Build frontend
    # ----------------------------------------------------------

    sudo -u ec2-user npm run build:frontend

    # ----------------------------------------------------------
    # Deploy frontend
    # ----------------------------------------------------------

    rm -rf /var/www/daam
    mkdir -p /var/www/daam

    cp -r /home/ec2-user/daam/frontend/dist/. /var/www/daam/

    chown -R nginx:nginx /var/www/daam

    find /var/www/daam -type d -exec chmod 755 {} \;
    find /var/www/daam -type f -exec chmod 644 {} \;

    # ----------------------------------------------------------
    # SELinux
    # ----------------------------------------------------------

    if command -v semanage >/dev/null 2>&1; then
        semanage fcontext -a -t httpd_sys_content_t "/var/www/daam(/.*)?" || true
        restorecon -Rv /var/www/daam || true
    fi

    # ----------------------------------------------------------
    # Backend systemd service
    # ----------------------------------------------------------

    cat > /etc/systemd/system/daam-backend.service <<'SYSTEMD'
    [Unit]
    Description=DAAM AI Agent Marketplace Backend
    After=network.target

    [Service]
    Type=simple
    User=ec2-user
    WorkingDirectory=/home/ec2-user/daam/backend
    ExecStart=/usr/bin/node /home/ec2-user/daam/backend/src/server.js
    Restart=always
    RestartSec=5
    Environment=NODE_ENV=production

    [Install]
    WantedBy=multi-user.target
    SYSTEMD

    chmod 644 /etc/systemd/system/daam-backend.service

    systemctl daemon-reload
    systemctl enable daam-backend
    systemctl restart daam-backend

    # ----------------------------------------------------------
    # Wait for backend
    # ----------------------------------------------------------

    for i in $(seq 1 30); do
        if curl -fsS http://127.0.0.1:3001/health >/dev/null; then
            echo "DAAM backend is healthy"
            break
        fi

        echo "Waiting for DAAM backend..."
        sleep 2
    done

    curl -fsS http://127.0.0.1:3001/health

    # ----------------------------------------------------------
    # Nginx configuration
    # ----------------------------------------------------------

    rm -f /etc/nginx/conf.d/daam.conf

    cat > /etc/nginx/nginx.conf <<'NGINX'
    user nginx;
    worker_processes auto;

    error_log /var/log/nginx/error.log notice;
    pid /run/nginx.pid;

    include /usr/share/nginx/modules/*.conf;

    events {
        worker_connections 1024;
    }

    http {
        log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                        '$status $body_bytes_sent "$http_referer" '
                        '"$http_user_agent" "$http_x_forwarded_for"';

        access_log /var/log/nginx/access.log main;

        sendfile on;
        tcp_nopush on;
        keepalive_timeout 65;
        types_hash_max_size 4096;

        include /etc/nginx/mime.types;
        default_type application/octet-stream;

        server {
            listen 80;
            listen [::]:80;

            server_name _;

            root /var/www/daam;
            index index.html;

            # React/Vite SPA
            location / {
                try_files $uri $uri/ /index.html;
            }

            # Backend API
            location /api/ {
                proxy_pass http://127.0.0.1:3001;
                proxy_http_version 1.1;

                proxy_set_header Host $host;
                proxy_set_header X-Real-IP $remote_addr;
                proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
                proxy_set_header X-Forwarded-Proto $scheme;
            }

            # Backend health
            location /health {
                proxy_pass http://127.0.0.1:3001;
                proxy_http_version 1.1;

                proxy_set_header Host $host;
                proxy_set_header X-Real-IP $remote_addr;
                proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
                proxy_set_header X-Forwarded-Proto $scheme;
            }

            # Never expose hidden files
            location ~ /\. {
                deny all;
            }
        }
    }
    NGINX

    # ----------------------------------------------------------
    # Validate Nginx configuration
    # ----------------------------------------------------------

    nginx -t

    systemctl enable nginx
    systemctl restart nginx

    # ----------------------------------------------------------
    # Final health checks
    # ----------------------------------------------------------

    echo "============================================================"
    echo "DAAM backend status"
    echo "============================================================"

    systemctl --no-pager --full status daam-backend

    echo "============================================================"
    echo "DAAM Nginx status"
    echo "============================================================"

    systemctl --no-pager --full status nginx

    echo "============================================================"
    echo "Frontend health"
    echo "============================================================"

    curl -I http://127.0.0.1/

    echo "============================================================"
    echo "API health"
    echo "============================================================"

    curl -fsS http://127.0.0.1/health

    echo
    echo "============================================================"
    echo "DAAM bootstrap completed successfully"
    echo "============================================================"

  EOF

  tags = {
    Name        = "daam-server"
    Project     = "DAAM"
    Environment = "dev"
    ManagedBy   = "terraform"
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