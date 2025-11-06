#!/usr/bin/env bash
set -euo pipefail
kind delete cluster || true
kind create cluster --config kind-config.yaml
kubectl cluster-info
kubectl get nodes -o wide
kubectl get pods -n kube-system
