#!/usr/bin/env bash
set -euo pipefail
kubectl delete ns web db --ignore-not-found
kind delete cluster || true
