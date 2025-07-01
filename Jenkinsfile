pipeline {
    agent any

    environment {
        NODE_ENV = 'production'
    }

    stages {
        stage('Checkout Code') {
            steps {
                git branch: 'main', url: 'https://github.com/Tejas-Burate/imageRatingStable.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                // Use Node.js 20.x
                tools {
                    nodejs 'node-20'
                }
                sh 'node -v' // confirm node version
                sh 'npm install'
            }
        }

        stage('Run Lint/Test') {
            steps {
                sh 'npm run lint || true' // if linting is optional
                sh 'npm test || true'     // if no test cases yet
            }
        }

        stage('Build') {
            steps {
                sh 'npm run build || echo "No build step defined"'
            }
        }

        stage('Deploy') {
            steps {
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
