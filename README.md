# README

## Projet de Facturation MERN avec Kubernetes et Jenkins

Ce projet déploie une application de facturation MERN (MongoDB, Express, React, Node.js) en utilisant Docker, Kubernetes, Jenkins, et des outils de monitoring comme Prometheus et Grafana.

### Prérequis

- Docker
- Kubernetes (Minikube ou un cluster Kubernetes)
- Helm
- Jenkins
- kubectl
- Helm installé
- Accès à Docker Hub ou un registre Docker similaire

### Structure des Fichiers

| Fichier                      | Description                                    |
|------------------------------|------------------------------------------------|
| `Dockerfile`                 | Définit l'image Docker pour le client et le serveur |
| `Jenkinsfile`                | Script pour l'intégration continue avec Jenkins |
| `app-configmap.yaml`         | ConfigMap pour les variables d'environnement   |
| `client-deployment.yaml`     | Déploiement Kubernetes pour le client React    |
| `client-service.yaml`        | Service pour exposer le client                |
| `server-deployment.yaml`     | Déploiement Kubernetes pour le serveur Node.js |
| `server-service.yaml`        | Service pour exposer le serveur               |
| `mongodb-deployment.yaml`    | Déploiement Kubernetes pour MongoDB           |
| `mongodb-service.yaml`       | Service pour exposer MongoDB                  |
| `prometheus-config.yaml`     | Configuration pour Prometheus                 |
| `docker-compose.yml`         | Facilite le déploiement local avec Docker     |

### Instructions d'Installation

1. **Construire et Pousser les Images Docker**
   
   Assurez-vous de modifier les noms des images pour correspondre à votre registre Docker.
   ```sh
   docker build -t oumaimarouis/facture-client:latest ./client
   docker build -t oumaimarouis/facture-server:latest ./server
   docker push oumaimarouis/facture-client:latest
   docker push oumaimarouis/facture-server:latest
   ```

2. **Déployer MongoDB**
   ```sh
   kubectl apply -f mongodb-deployment.yaml
   kubectl apply -f mongodb-service.yaml
   ```

3. **Déployer le Serveur**
   ```sh
   kubectl apply -f server-deployment.yaml
   kubectl apply -f server-service.yaml
   ```

4. **Déployer le Client**
   ```sh
   kubectl apply -f client-deployment.yaml
   kubectl apply -f client-service.yaml
   ```

5. **Configurer Prometheus**
   ```sh
   kubectl apply -f prometheus-config.yaml
   ```

6. **Configurer Grafana (optionnel)**
   - Installer Grafana avec Helm ou appliquer une configuration YAML.
   - Connecter Prometheus comme source de données.

### Intégration Continue avec Jenkins

Le `Jenkinsfile` contient des étapes pour construire et déployer l'application automatiquement.

Exemple d'exécution :
```groovy
pipeline {
  agent any
  stages {
    stage('Build and Push Images') {
      steps {
        sh 'docker build -t oumaimarouis/facture-client:latest ./client'
        sh 'docker build -t oumaimarouis/facture-server:latest ./server'
        sh 'docker push oumaimarouis/facture-client:latest'
        sh 'docker push oumaimarouis/facture-server:latest'
      }
    }
  }
}
```

### Monitoring avec Prometheus et Grafana
1. Déployer Prometheus :
   ```sh
   helm install prometheus prometheus-community/prometheus --namespace monitoring
   ```
2. Déployer Grafana :
   ```sh
   helm install grafana grafana/grafana --namespace monitoring
   ```

Accédez à Grafana via l'URL et utilisez `admin/prometheus` comme source de données.

### Notes et Commandes Utilisées

#### Réseau Docker
```sh
docker network create facrure-network
```

#### Containers Docker
- MongoDB :
  ```sh
  docker run -d --name mongodbb --network facrure-network mongo
  ```
- Serveur :
  ```sh
  docker run -d --name server2 --network facrure-network -p 3000:3000 facture-server
  ```
- Client :
  ```sh
  docker run -d --name clientt --network facrure-network -p 3001:3001 facture-client
  ```

#### Jenkins
```sh
docker run -d -p 8090:8080 -p 50000:50000 --name jenkins21 --privileged -v jenkins_home:/var/jenkins_home salahgo/jenkins:dind
```
Pour récupérer le mot de passe initial :
```sh
docker exec -it jenkins21 cat /var/jenkins_home/secrets/initialAdminPassword
```

#### Accès Prometheus et Grafana
- Prometheus :
  ```sh
  kubectl port-forward -n monitoring svc/prometheus-server 9090:80
  ```
  Accédez à : http://127.0.0.1:9090/query

- Grafana :
  ```sh
  kubectl port-forward -n monitoring svc/grafana 3000:80
  ```
  Accédez à : http://127.0.0.1:3000/login

### Accès à l'Application
Ajoutez cette ligne au fichier `/etc/hosts` :
```plaintext
127.0.0.1 mern-app.local
```
Accédez au client :
```
http://mern-app.local
```

