#!/usr/bin/env bash
set -euo pipefail
kubectl apply -f "$(dirname "$0")/../k8s/pods/mysql-pod.yaml"
kubectl apply -f "$(dirname "$0")/../k8s/pods/web-pod.yaml"
kubectl -n db  wait --for=condition=Ready pod/mysql-pod --timeout=180s
kubectl -n web wait --for=condition=Ready pod/employees-pod --timeout=180s
