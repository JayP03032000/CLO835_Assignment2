#!/usr/bin/env bash
set -euo pipefail
# Patch deployment image from v1 -> v2 (local tags loaded to kind in 01_build_images_local.sh)
kubectl -n web set image deploy/employees-deploy employees=employees-app:v2
