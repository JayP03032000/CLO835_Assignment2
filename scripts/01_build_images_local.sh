#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/../app/webapp"
docker build -t employees-app:local -t employees-app:v1 .
# Build a "v2" tag to use during the rolling update
docker tag employees-app:v1 employees-app:v2
kind load docker-image employees-app:local
kind load docker-image employees-app:v1
kind load docker-image employees-app:v2
echo "Local images built and loaded into kind."
