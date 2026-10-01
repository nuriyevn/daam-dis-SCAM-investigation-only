variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "ap-south-1"
}

variable "instance_type" {
  description = "EC2 instance type"
  type        = string
  default     = "t3.micro"
}

variable "key_name" {
  description = "EC2 SSH key pair name"
  type        = string
  default     = "daam-dis"
}

variable "ssh_cidr" {
  description = "CIDR allowed to access SSH"
  type        = string
  default     = "0.0.0.0/0"
}

variable "github_deploy_key" {
  description = "Private SSH deploy key for the DAAM GitHub repository"
  type        = string
  sensitive   = true
}