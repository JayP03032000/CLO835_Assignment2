#!/usr/bin/env bash
set -euo pipefail
kubectl apply -f "$(dirname "$0")/../k8s/replicasets/mysql-rs.yaml"
kubectl apply -f "$(dirname "$0")/../k8s/replicasets/web-rs.yaml"
kubectl -n db  rollout status rs/mysql-rs --timeout=180s || true
kubectl -n web rollout status rs/employees-rs --timeout=180s || true
