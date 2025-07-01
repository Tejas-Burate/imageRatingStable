pipeline {
    agent {
        docker {
            image 'node:20-alpine'  // Using Node.js 20 with Alpine (lightweight)
            args '--user root'      // Optional: Run as root to avoid permission issues
        }
    }

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
                sh 'node -v' // confirm node version
                sh 'npm -v'  // confirm npm version
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
                script {
                    // Ensure SSH agent is available for scp
                    withCredentials([sshUserPrivateKey(
                        credentialsId: 'your-ssh-credentials-id',  // Create in Jenkins Credentials
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