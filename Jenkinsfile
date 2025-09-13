pipeline{

    agent any 
   
    stages{
        stage("Checkout"){
            steps{
                sh "git --version"
                sh "docker -v"
                sh "echo Branch Name: ${GIT_BRANCH}"
            }
        }

        stage("Declare Variable"){
            steps{
            script{
                switch(env.GIT_BRANCH){
                    case 'origin/development':
                        env.DEPLOY_ENV = "dev"
                        break
                    case 'origin/qa':
                        env.DEPLOY_ENV = "qa"
                        break
                    default:
                       env.DEPLOY_ENV = "dev"
                       break       
                    }

                }
                sh "echo ${DEPLOY_ENV}"
            }
        }

        stage("Build_stage"){
            environment{
                ENV_FILE = credentials("greenland-dev-backend-env-file")
            }
            steps{
                    sh "docker compose -f docker-compose.yml -f docker/${DEPLOY_ENV}.yml  build backend"
            }
            
        }

        stage("Save Images"){
            steps{
                 sh "docker save greenland-backend-${DEPLOY_ENV}  -o greenland-backend-${DEPLOY_ENV}.tar "
            }
        } 


        stage("Transfer_images"){
            environment{
                ENV_FILE = credentials("greenland-${DEPLOY_ENV}-backend-env-file")
                REMOTE_HOST = credentials("greenland-${DEPLOY_ENV}-remote-host")
                REMOTE_USER = credentials("greenland-${DEPLOY_ENV}-remote-user")
                RWD = "deployments/greenland/${DEPLOY_ENV}/backend/"
                PORT = 2134
            }

            parallel{
                stage("tranfer_backend"){
                    steps{
                        sshagent(["greenland-${DEPLOY_ENV}-remote-backend-host"]){
                         sh "ssh -p ${PORT} -o StrictHostKeyChecking=no ${REMOTE_USER}@${REMOTE_HOST} 'mkdir -p ${RWD}'"
                         sh "scp -P ${PORT} -o StrictHostKeyChecking=no  greenland-backend-${DEPLOY_ENV}.tar ${REMOTE_USER}@${REMOTE_HOST}:${RWD}"   
                        }
                    }
                }


                stage("tranfer env and compose file "){
                    steps{
                        sshagent(["greenland-${DEPLOY_ENV}-remote-backend-host"]){
                           sh "scp -o StrictHostKeyChecking=no  -P ${PORT} docker-compose.yml ${ENV_FILE} docker/${DEPLOY_ENV}.yml ${REMOTE_USER}@${REMOTE_HOST}:${RWD}"     
                        }
                    }
                }
      
            }
        } 

        stage("loading_images"){
            environment{
                ENV_FILE = credentials("greenland-${DEPLOY_ENV}-backend-env-file")
                REMOTE_HOST = credentials("greenland-${DEPLOY_ENV}-remote-host")
                REMOTE_USER = credentials("greenland-${DEPLOY_ENV}-remote-user")
                RWD = "deployments/greenland/${DEPLOY_ENV}/backend/"
                PORT = 2134
            }
               steps{
                  sshagent(["greenland-${DEPLOY_ENV}-remote-backend-host"]){
                    sh "ssh -p ${PORT}  -o StrictHostKeyChecking=no ${REMOTE_USER}@${REMOTE_HOST} ' cd ${RWD} && docker load -i greenland-backend-${DEPLOY_ENV}.tar' "
                  }
               }
        }
       
       stage('Deploy'){
            environment{
                ENV_FILE = credentials("greenland-dev-backend-env-file")
                REMOTE_HOST = credentials("greenland-${DEPLOY_ENV}-remote-host")
                REMOTE_USER = credentials("greenland-${DEPLOY_ENV}-remote-user")
                RWD = "deployments/greenland/${DEPLOY_ENV}/backend/"
                PORT = 2134
            }

            steps{
                sshagent(["greenland-${DEPLOY_ENV}-remote-backend-host"]){
                    sh "ssh -p ${PORT} -o StrictHostKeyChecking=no ${REMOTE_USER}@${REMOTE_HOST} 'cd ${RWD} && DEPLOY_ENV=${DEPLOY_ENV} docker compose -f docker-compose.yml -f ${DEPLOY_ENV}.yml -p greenland-backend-dev  down'"
                    sh "ssh -p ${PORT} -o StrictHostKeyChecking=no ${REMOTE_USER}@${REMOTE_HOST} 'cd ${RWD} && DEPLOY_ENV=${DEPLOY_ENV} docker compose -f docker-compose.yml -f ${DEPLOY_ENV}.yml -p greenland-backend-dev up -d --no-build '"

                } 
            }
        }   
         
    }
     
    post {
    success {
        echo 'Pipeline succeeded! Deployment completed successfully.'
        sh 'rm -rf greenland-backend-dev.tar'
    }
    failure {
        echo 'Pipeline failed! Please check the logs and fix the issues.'
    }
    always {
        echo 'Pipeline finished (success or failure).'
    }
    }


}
