pipeline {
    agent any

    environment {
        NODE_VERSION = '20.11.1'
    }

    stages {
        stage('Setup') {
            steps {
                // Install Node.js using nvm
                sh '''
                    export NVM_DIR="$HOME/.nvm"
                    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
                    nvm install ${NODE_VERSION}
                    nvm use ${NODE_VERSION}
                '''

                // Install dependencies
                sh 'npm ci'

                // Install Playwright browsers
                sh 'npx playwright install --with-deps'
            }
        }

        stage('Lint') {
            steps {
                sh 'npm run lint'
            }
        }

        stage('Run Tests') {
            steps {
                sh 'npm run test:ci:parallel'
            }
        }
    }

    post {
        always {
            // Publish HTML report
            publishHTML(target: [
                allowMissing: false,
                alwaysLinkToLastBuild: true,
                keepAll: true,
                reportDir: 'playwright-report',
                reportFiles: 'index.html',
                reportName: 'Playwright Test Report'
            ])

            // Clean workspace
            cleanWs()
        }
    }
}