pipeline {
    agent any

    stages {

        stage('Git Pull') {
            steps {
                git 'https://github.com/MADHU871/azure-webapp-project.git
                // '
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Docker Build') {
            steps {
                sh 'docker build -t mad0008271/azure-webapp .'
            }
        }

        stage('Docker Push') {
            steps {
                sh 'docker push mad0008271/azure-webapp'
            }
        }

    }
}