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

### Accès à l'Application
Ajoutez cette ligne au fichier `/etc/hosts` :
```plaintext
127.0.0.1 mern-app.local
```
Accédez au client :
```
http://mern-app.local
```

