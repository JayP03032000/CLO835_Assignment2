#!/usr/bin/env bash
set -euo pipefail

AWS_REGION="${AWS_REGION:-us-east-1}"
ACCOUNT_ID="$(aws sts get-caller-identity --query Account --output text)"
REPO_WEB="clo835-webapp"
REPO_MYSQL="mysql"  # optional mirror, we will use public image in manifests

# Create repositories if missing
aws ecr describe-repositories --repository-names "$REPO_WEB" >/dev/null 2>&1 ||   aws ecr create-repository --repository-name "$REPO_WEB" >/dev/null

aws ecr get-login-password --region "$AWS_REGION" |   docker login --username AWS --password-stdin "$ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com"

# Build & push web images
cd "$(dirname "$0")/../app/webapp"
docker build -t "$ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$REPO_WEB:v1" .
docker push "$ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$REPO_WEB:v1"

docker tag "$ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$REPO_WEB:v1"            "$ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$REPO_WEB:v2"
docker push "$ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$REPO_WEB:v2"

echo "ECR images pushed. Update deployment image if you want to use ECR path."
