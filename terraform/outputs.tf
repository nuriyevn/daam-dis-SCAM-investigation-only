output "instance_id" {
  value = aws_instance.daam.id
}

output "public_ip" {
  value = aws_eip.daam.public_ip
}

output "ssh_command" {
  value = "ssh -i ${var.key_name}.pem ec2-user@${aws_eip.daam.public_ip}"
}

output "scp_command" {
  value = "scp -i ${var.key_name}.pem -r ../frontend ../backend ../package.json ../package-lock.json ec2-user@${aws_eip.daam.public_ip}:/home/ec2-user/daam/"
}

output "private_key_file" {
  value = local_sensitive_file.daam_private_key.filename
}