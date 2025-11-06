#!/usr/bin/env bash
set -euo pipefail
kubectl apply -f "$(dirname "$0")/../k8s/services/mysql-svc-clusterip.yaml"
kubectl apply -f "$(dirname "$0")/../k8s/services/web-svc-nodeport.yaml"
