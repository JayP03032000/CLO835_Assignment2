#!/usr/bin/env bash
set -euo pipefail

# Docker
if ! command -v docker >/dev/null 2>&1; then
  sudo yum update -y
  sudo yum install -y docker git tar gzip
  sudo usermod -a -G docker ec2-user || true
  sudo service docker start
fi

# kubectl
if ! command -v kubectl >/dev/null 2>&1; then
  curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
  sudo install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl
  rm -f kubectl
fi

# kind
if ! command -v kind >/dev/null 2>&1; then
  curl -Lo ./kind https://kind.sigs.k8s.io/dl/v0.23.0/kind-linux-amd64
  chmod +x ./kind
  sudo mv ./kind /usr/local/bin/kind
fi

echo "Tools installed. Please open a new terminal or 'newgrp docker' if needed."
