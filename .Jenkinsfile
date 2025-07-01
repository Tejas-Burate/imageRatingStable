pipeline {
    agent any

    tools {
        nodejs "NodeJS_18" // Name configured in Jenkins > Global Tool Configuration
    }

    environment {
        NODE_ENV = 'production'
    }

    stages {
        stage('Checkout Code') {
            steps {
                // git branch: 'main', url: 'https://github.com/your-repo/node-app.git'
                git branch: 'main', url: 'https://github.com/Tejas-Burate/imageRatingStable'
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Run Lint/Test') {
            steps {
                sh 'npm run lint'
                sh 'npm test'
            }
        }

        // stage('Build') {
        //     steps {
        //         sh 'npm run build' // If you have a build step
        //     }
        // }

        stage('Deploy') {
            steps {
                // Replace 'user' with your server's username
                // Replace 'your-server' with your server's IP or hostname
                // Replace '/var/www/app' with your deployment directory
                sh 'scp -P 8080 -r ./dist Tejas-Burate@localhost:/dist/'
            }
        }
    }

    post {
        success {
            echo '✅ Deployment completed successfully.'
        }
        failure {
            echo '❌ Pipeline failed!'
        }
    }
}
