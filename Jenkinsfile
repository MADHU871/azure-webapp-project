pipeline {

    agent any

    environment {

        DOCKER_IMAGE = "mad0008271/azure-webapp"
        CONTAINER_NAME = "azure-webapp-container"
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
