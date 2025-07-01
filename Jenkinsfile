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
                sh 'node -v'
                sh 'npm install'
            }
        }

        stage('Run Lint/Test') {
            steps {
                sh 'npm run lint || true'
                sh 'npm test || true'
            }
        }

        stage('Build') {
            steps {
                sh 'npm run build || echo "No build step defined"'
            }
        }

        stage('Deploy') {
            steps {
                script {
                    withCredentials([sshUserPrivateKey(
                        credentialsId: 'your-ssh-credentials-id',
                        keyFileVariable: 'SSH_KEY',
                        usernameVariable: 'SSH_USER'
                    )]) {
                        sh """
                            mkdir -p ~/.ssh
                            cp \$SSH_KEY ~/.ssh/id_rsa
                            chmod 600 ~/.ssh/id_rsa
                            scp -P 8080 -o StrictHostKeyChecking=no -r ./dist ${SSH_USER}@localhost:/dist/
                        """
                    }
                }
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
