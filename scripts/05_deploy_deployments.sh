#!/usr/bin/env bash
set -euo pipefail
kubectl apply -f "$(dirname "$0")/../k8s/deployments/mysql-deploy.yaml"
kubectl apply -f "$(dirname "$0")/../k8s/deployments/web-deploy.yaml"
kubectl -n db  rollout status deploy/mysql-deploy --timeout=180s
kubectl -n web rollout status deploy/employees-deploy --timeout=180s
