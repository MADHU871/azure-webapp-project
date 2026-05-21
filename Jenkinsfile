pipeline {

    agent any

    environment {

        IMAGE_NAME = "mad0008271/azure-webapp"
        IMAGE_TAG = "latest"

        CONTAINER_NAME = "azure-webapp-container"

        AZURE_WEBAPP_NAME = "azure-webapp-project"

        RESOURCE_GROUP = "azure-webapp-project"

    }

    triggers {

        githubPush()

    }

    stages {

        stage('Clone Repository') {

            steps {

                git branch: 'main',
                url: 'https://github.com/MADHU871/azure-webapp-project.git'

            }
        }

        stage('Check Environment') {

            steps {

                sh 'node -v'
                sh 'npm -v'
                sh 'docker --version'

            }
        }

        stage('Install Dependencies') {

            steps {

                sh 'npm install'

            }
        }

        stage('Build Project') {

            steps {

                sh 'npm run build'

            }
        }

        stage('Docker Build') {

            steps {

                sh '''
                docker build -t $IMAGE_NAME:$IMAGE_TAG .
                '''

            }
        }

        stage('Docker Images') {

            steps {

                sh '''
                docker images
                '''

            }
        }

        stage('Docker Tag') {

            steps {

                sh '''
                docker tag $IMAGE_NAME:$IMAGE_TAG $IMAGE_NAME:v1
                '''

            }
        }

        stage('Docker Login') {

            steps {

                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-creds',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {

                    sh '''
                    echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin
                    '''

                }
            }
        }

        stage('Docker Push Latest') {

            steps {

                sh '''
                docker push $IMAGE_NAME:$IMAGE_TAG
                '''

            }
        }

        stage('Docker Push Version') {

            steps {

                sh '''
                docker push $IMAGE_NAME:v1
                '''

            }
        }

        stage('Docker Pull') {

            steps {

                sh '''
                docker pull $IMAGE_NAME:$IMAGE_TAG
                '''

            }
        }

        stage('Docker Run') {

            steps {

                sh '''
                docker rm -f $CONTAINER_NAME || true

                docker run -d \
                --name $CONTAINER_NAME \
                -p 3005:3000 \
                $IMAGE_NAME:$IMAGE_TAG
                '''

            }
        }

        stage('Docker PS') {

            steps {

                sh '''
                docker ps -a
                '''

            }
        }

        stage('Docker Logs') {

            steps {

                sh '''
                docker logs $CONTAINER_NAME
                '''

            }
        }

        stage('Docker Copy') {

            steps {

                sh '''
                docker cp package.json $CONTAINER_NAME:/app
                '''

            }
        }

        stage('Docker Inspect') {

            steps {

                sh '''
                docker inspect $CONTAINER_NAME
                '''

            }
        }

        stage('Azure Login') {

            steps {

                withCredentials([usernamePassword(
                    credentialsId: 'azure-creds',
                    usernameVariable: 'AZURE_USER',
                    passwordVariable: 'AZURE_PASS'
                )]) {

                    sh '''
                    az login -u $AZURE_USER -p $AZURE_PASS
                    '''

                }
            }
        }

        stage('Azure Deploy') {

            steps {

                sh '''
                az webapp deployment source config \
                --name $AZURE_WEBAPP_NAME \
                --resource-group $RESOURCE_GROUP \
                --repo-url https://github.com/MADHU871/azure-webapp-project.git \
                --branch main \
                --manual-integration
                '''

            }
        }

        stage('Azure Restart WebApp') {

            steps {

                sh '''
                az webapp restart \
                --name $AZURE_WEBAPP_NAME \
                --resource-group $RESOURCE_GROUP
                '''

            }
        }

        stage('Azure Logs') {

            steps {

                sh '''
                az webapp log tail \
                --name $AZURE_WEBAPP_NAME \
                --resource-group $RESOURCE_GROUP
                '''

            }
        }

        stage('Automation Cleanup') {

            steps {

                sh '''
                docker image prune -f
                docker container prune -f
                '''

            }
        }

        stage('Docker Logout') {

            steps {

                sh '''
                docker logout
                '''

            }
        }

    }

    post {

        success {

            echo 'CI/CD Pipeline Executed Successfully 🚀'

        }

        failure {

            echo 'Pipeline Failed ❌'

        }

        always {

            echo 'Pipeline Completed'

        }
    }
}