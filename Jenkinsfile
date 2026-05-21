pipeline {

    agent any

    environment {

        DOCKER_IMAGE = "mad0008271/azure-webapp"
        CONTAINER_NAME = "azure-webapp-container"

        AZURE_WEBAPP_NAME = "myazurewebapp12345"
        AZURE_RESOURCE_GROUP = "azure-webapp-group"
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
                sh 'az --version || true'

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
                    docker build -t $DOCKER_IMAGE:latest .
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
                    docker tag $DOCKER_IMAGE:latest $DOCKER_IMAGE:v1
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
                    docker push $DOCKER_IMAGE:latest
                '''

            }
        }

        stage('Docker Push Version') {

            steps {

                sh '''
                    docker push $DOCKER_IMAGE:v1
                '''

            }
        }

        stage('Docker Pull') {

            steps {

                sh '''
                    docker pull $DOCKER_IMAGE:latest
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
                    $DOCKER_IMAGE:latest
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

                withCredentials([

                    string(
                        credentialsId: 'azure-client-id',
                        variable: 'AZURE_CLIENT_ID'
                    ),

                    string(
                        credentialsId: 'azure-client-secret',
                        variable: 'AZURE_CLIENT_SECRET'
                    ),

                    string(
                        credentialsId: 'azure-tenant-id',
                        variable: 'AZURE_TENANT_ID'
                    ),

                    string(
                        credentialsId: 'azure-subscription-id',
                        variable: 'AZURE_SUBSCRIPTION_ID'
                    )

                ]) {

                    sh '''
                        az login --service-principal \
                        --username $AZURE_CLIENT_ID \
                        --password $AZURE_CLIENT_SECRET \
                        --tenant $AZURE_TENANT_ID

                        az account set \
                        --subscription $AZURE_SUBSCRIPTION_ID
                    '''

                }
            }
        }

        stage('Azure Deploy') {

            steps {

                sh '''
                    az webapp config container set \
                    --name $AZURE_WEBAPP_NAME \
                    --resource-group $AZURE_RESOURCE_GROUP \
                    --container-image-name $DOCKER_IMAGE:latest
                '''

            }
        }

        stage('Azure Restart WebApp') {

            steps {

                sh '''
                    az webapp restart \
                    --name $AZURE_WEBAPP_NAME \
                    --resource-group $AZURE_RESOURCE_GROUP
                '''

            }
        }

        stage('Azure Logs') {

            steps {

                sh '''
                    az webapp log tail \
                    --name $AZURE_WEBAPP_NAME \
                    --resource-group $AZURE_RESOURCE_GROUP
                '''

            }
        }

        stage('Automation Cleanup') {

            steps {

                sh '''
                    docker system prune -f
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

        always {

            echo 'Pipeline Completed'
        }

        success {

            echo 'Pipeline Success ✅'
        }

        failure {

            echo 'Pipeline Failed ❌'
        }
    }
}
