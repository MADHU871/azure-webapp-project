pipeline {
    agent any

    stages {

        stage('Clone Repository') {
            steps {
                git 'https://github.com/MADHU871/azure-webapp-project.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t mad0008271/azure-webapp:latest .'
            }
        }

        stage('Docker Login') {
            steps {
                sh 'docker login -u mad0008271 -p YOUR_DOCKER_PASSWORD'
            }
        }

        stage('Push Docker Image') {
            steps {
                sh 'docker push mad0008271/azure-webapp:latest'
            }
        }

    }
}