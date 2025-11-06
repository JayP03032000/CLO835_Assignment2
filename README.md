# CLO835 — Assignment 2: End‑to‑end Starter Kit (kind on EC2)

This kit gives you EVERYTHING in one place so you can upload to Cloud9, unzip, run commands in order, record your video, and submit your repo.

> Tested on **Amazon Linux 2 Cloud9**. Node.js 18+, Docker, kubectl, and kind will be installed by the scripts below.

---

## Directory layout

```
assignment2-kit/
├─ README.md  ← this file (step‑by‑step)
├─ app/
│  ├─ webapp/           ← simple Express app that talks to MySQL
│  │  ├─ Dockerfile
│  │  ├─ package.json
│  │  ├─ server.js
│  └─ mysql/            ← (no custom code; uses official image)
├─ k8s/
│  ├─ namespaces.yaml
│  ├─ pods/
│  │  ├─ web-pod.yaml
│  │  └─ mysql-pod.yaml
│  ├─ replicasets/
│  │  ├─ web-rs.yaml
│  │  └─ mysql-rs.yaml
│  ├─ deployments/
│  │  ├─ web-deploy.yaml
│  │  └─ mysql-deploy.yaml
│  ├─ services/
│  │  ├─ web-svc-nodeport.yaml   (NodePort 30000)
│  │  └─ mysql-svc-clusterip.yaml
│  └─ config/
│     ├─ web-configmap.yaml
│     └─ mysql-secret.yaml
├─ kind/
│  ├─ install_tools.sh
│  ├─ kind-config.yaml
│  └─ create_cluster.sh
├─ scripts/
│  ├─ 01_build_images_local.sh
│  ├─ 02_create_ecr_and_push.sh
│  ├─ 03_deploy_pods.sh
│  ├─ 04_deploy_replicasets.sh
│  ├─ 05_deploy_deployments.sh
│  ├─ 06_expose_services.sh
│  ├─ 07_smoke_test.sh
│  ├─ 08_update_web_version.sh
│  └─ 99_cleanup.sh
└─ terraform/ (optional, do **NOT** submit per assignment)
   ├─ main.tf
   ├─ variables.tf
   └─ outputs.tf
```

---

## One‑by‑one commands (copy/paste in order)

> Run these from the folder you unzip to (e.g., `/home/ec2-user/environment/assignment2-kit`).

1) Install Docker, kubectl, kind, and helpers:
```
cd kind
bash install_tools.sh
```
2) Create the kind cluster:
```
bash create_cluster.sh
```
3) (Option A) Build local images (no ECR, fastest for practice/recording):
```
cd ../scripts
bash 01_build_images_local.sh
```
4) (Option B) Push images to Amazon ECR (use this for final demo if required):
```
bash 02_create_ecr_and_push.sh
```
5) Create namespaces, config, secrets:
```
kubectl apply -f ../k8s/namespaces.yaml
kubectl apply -f ../k8s/config/web-configmap.yaml
kubectl apply -f ../k8s/config/mysql-secret.yaml
```
6) **Pods** stage (record this part):
```
bash 03_deploy_pods.sh
kubectl -n web get pods -o wide
kubectl -n db  get pods -o wide
```
7) Validate app & logs (report/video requirements):
```
# Get API server IP & core components
kubectl cluster-info
kubectl get nodes -o wide
kubectl get pods -n kube-system

# Curl app via NodePort (hostNetwork mapping used during Pod stage)
curl -s http://localhost:30000/ | head -n 10

# Check app logs
kubectl -n web logs deploy/employees-deploy --tail=20 || true
kubectl -n web logs -l app=employees --tail=50
```
8) **ReplicaSets** (3 replicas):
```
bash 04_deploy_replicasets.sh
kubectl -n web get rs,pods -l app=employees -o wide
kubectl -n db  get rs,pods -l app=mysql -o wide
```
9) **Deployments**:
```
bash 05_deploy_deployments.sh
kubectl -n web get deploy,rs,pods -l app=employees -o wide
kubectl -n db  get deploy,rs,pods -l app=mysql -o wide
```
10) **Services** (web NodePort 30000, MySQL ClusterIP):
```
bash 06_expose_services.sh
kubectl -n web get svc
kubectl -n db  get svc
```
11) Smoke test from EC2 host:
```
bash 07_smoke_test.sh
```
12) **Rolling update** web → v2:
```
bash 08_update_web_version.sh
kubectl -n web rollout status deploy/employees-deploy
kubectl -n web get pods -l app=employees -o wide
```

---

## Full command list (for your final “script”)

Copy these into your report/video notes:
```
kubectl cluster-info
kubectl get nodes -o wide
kubectl get pods -n kube-system

kubectl apply -f k8s/namespaces.yaml
kubectl apply -f k8s/config/web-configmap.yaml
kubectl apply -f k8s/config/mysql-secret.yaml

# Pods
kubectl apply -f k8s/pods/mysql-pod.yaml
kubectl apply -f k8s/pods/web-pod.yaml
kubectl -n web get pods -o wide
kubectl -n db  get pods -o wide

# ReplicaSets
kubectl apply -f k8s/replicasets/mysql-rs.yaml
kubectl apply -f k8s/replicasets/web-rs.yaml
kubectl -n web get rs,pods -l app=employees -o wide
kubectl -n db  get rs,pods -l app=mysql -o wide

# Deployments
kubectl apply -f k8s/deployments/mysql-deploy.yaml
kubectl apply -f k8s/deployments/web-deploy.yaml
kubectl -n web get deploy,rs,pods -l app=employees -o wide
kubectl -n db  get deploy,rs,pods -l app=mysql -o wide

# Services
kubectl apply -f k8s/services/mysql-svc-clusterip.yaml
kubectl apply -f k8s/services/web-svc-nodeport.yaml
kubectl -n web get svc
kubectl -n db  get svc

# Test app then show logs
curl -s http://localhost:30000/ | head -n 10
kubectl -n web logs -l app=employees --tail=50
```

---

## Notes for your Report
- Show the **API server IP** from `kubectl cluster-info` output.
- Explain **same port** inside separate containers is OK due to isolated network namespaces.
- Explain why **web=NodePort** (external access) and **mysql=ClusterIP** (internal-only DB).

Good luck! ✨
