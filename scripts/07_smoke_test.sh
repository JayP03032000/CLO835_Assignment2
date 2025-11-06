#!/usr/bin/env bash
set -euo pipefail
echo "Waiting for web service endpoints..."
sleep 5
kubectl -n web get svc employees-svc
echo "Curling http://localhost:30000/ ..."
curl -s http://localhost:30000/ | head -n 20 || true
echo "Logs:"
kubectl -n web logs -l app=employees --tail=50 || true
