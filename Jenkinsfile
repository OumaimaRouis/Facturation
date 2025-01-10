pipeline {
    agent any

    triggers {
        pollSCM('H/5 * * * *') // Poll SCM every 5 minutes
    }

    environment {
        IMAGE_NAME_SERVER = 'oumaimarouis/facture-server' // Docker Hub username
        IMAGE_NAME_CLIENT = 'oumaimarouis/facture-client' // Docker Hub username
    }

    stages {
        stage('Checkout') {
            steps {
                script {
                    echo 'Starting Git checkout...'
                    git branch: 'version1',
                        url: 'git@github.com:OumaimaRouis/Facturation.git',
                        credentialsId: 'private_key' // Jenkins credentials ID for GitHub SSH key
                }
            }
        }

        stage('Build Images') {
            parallel {
                stage('Build Backend Image') {  
                    steps {
                        script {
                            echo 'Building backend image...'
                            dir('backend') {  
                                dockerImageServer = docker.build("${IMAGE_NAME_SERVER}")
                            }
                        }
                    }
                }
                stage('Build Frontend Image') {  
                    steps {
                        script {
                            echo 'Building frontend image...'
                            dir('frontend') {  
                                dockerImageClient = docker.build("${IMAGE_NAME_CLIENT}")
                            }
                        }
                    }
                }
            }
        }

        stage('Scan Backend Image') {  
            steps {
                script {
                    echo 'Scanning backend image...'
                    sh """
                        docker run --rm -v /var/run/docker.sock:/var/run/docker.sock \
                            aquasec/trivy:latest image --exit-code 1 \
                            --severity LOW,MEDIUM,HIGH,CRITICAL \
                            ${IMAGE_NAME_SERVER} || exit 1
                    """
                }
            }
        }

        stage('Scan Frontend Image') {  
            steps {
                script {
                    echo 'Scanning frontend image...'
                    sh """
                        docker run --rm -v /var/run/docker.sock:/var/run/docker.sock \
                            aquasec/trivy:latest image --exit-code 1 \
                            --severity LOW,MEDIUM,HIGH,CRITICAL \
                            ${IMAGE_NAME_CLIENT} || exit 1
                    """
                }
            }
        }

        stage('Push Images to Docker Hub') {
            steps {
                script {
                    echo 'Pushing images to Docker Hub...'
                    withCredentials([usernamePassword(credentialsId: 'dockerhub', usernameVariable: 'USERNAME', passwordVariable: 'PASSWORD')]) {
                        sh """
                            docker login -u ${USERNAME} -p ${PASSWORD} || exit 1
                        """
                        dockerImageServer.push("${BUILD_NUMBER}") // Use build number for tagging
                        dockerImageClient.push("${BUILD_NUMBER}")
                    }
                }
            }
        }
    }

    post {
        always {
            script {
                echo 'Cleaning up Docker resources...'

                // Remove dangling images (intermediate images with no tags)
                sh 'docker image prune -f'

                // Remove stopped containers
                sh 'docker container prune -f'

                // Optionally remove unused volumes
                sh 'docker volume prune -f'
            }
        }
    }
}
