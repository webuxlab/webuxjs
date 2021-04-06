pipeline {
  agent {
    node {
      label 'nodejs'
    }

  }

  stages {
    stage('Preparation') {
      steps {
        sh 'git remote add prod https://github.com/studiowebux/webux-server.git || true'
      }
    }

    stage('Dependencies') {
      steps {
        sh 'npm install'
      }
    }

    stage('Lint') {
      steps {
        sh 'npm run-script lint'
      }
    }

    stage('Code Analysis') {
      steps {
        script {
          def scannerHome = tool 'sonarqube';
              withSonarQubeEnv("sonarqube") {
              sh "${tool("sonarqube")}/bin/sonar-scanner"            
              }
        }
      }
    }

    stage('Test') {
      steps {
        sh 'npm run test'
      }
    }

    stage('Versionning') {
      steps {
        script {
          env.RELEASE_SCOPE = input message: 'User input required', ok: 'Continue',
                            parameters: [choice(name: 'RELEASE_SCOPE', choices: 'patch\nminor\nmajor', description: 'What is the release scope?')]
        }
        echo "${env.RELEASE_SCOPE}"
      }
    }

    stage('Staging') {

        
      steps {
        withCredentials([usernamePassword(credentialsId: 'git:1f00e77842774986a932a1367b515be6efb49cae2d1a134a1988a651d8ff094b', usernameVariable: 'GIT_USERNAME', passwordVariable: 'GIT_PASSWORD')]){ 
          sh('''
              git config --local credential.helper "!f() { echo username=\\$GIT_USERNAME; echo password=\\$GIT_PASSWORD; }; f"
              git push origin master
              git config --unset credential.helper
          ''')
        }
        withCredentials([usernamePassword(credentialsId: 'GitHub', usernameVariable: 'GIT_USERNAME', passwordVariable: 'GIT_PASSWORD')]){ 
          sh('''
              git config --local credential.helper "!f() { echo username=\\$GIT_USERNAME; echo password=\\$GIT_PASSWORD; }; f"
              git push prod master
              git config --unset credential.helper
          ''')
        }
        sh "npm version ${env.RELEASE_SCOPE}"
        sh 'npm publish --registry=https://npm.webux.lab'
        input 'Deploy to  production ?'
      }
    }

    stage('Production') {
      

      steps {
        withCredentials([usernamePassword(credentialsId: 'git:1f00e77842774986a932a1367b515be6efb49cae2d1a134a1988a651d8ff094b', usernameVariable: 'GIT_USERNAME', passwordVariable: 'GIT_PASSWORD')]){ 
          sh('''
              git config --local credential.helper "!f() { echo username=\\$GIT_USERNAME; echo password=\\$GIT_PASSWORD; }; f"
              git push origin master
              git config --unset credential.helper
          ''')
        }
        withCredentials([usernamePassword(credentialsId: 'GitHub', usernameVariable: 'GIT_USERNAME', passwordVariable: 'GIT_PASSWORD')]){ 
          sh('''
              git config --local credential.helper "!f() { echo username=\\$GIT_USERNAME; echo password=\\$GIT_PASSWORD; }; f"
              git push prod master
              git config --unset credential.helper
          ''')
        }
        
        sh 'npm publish --access public'
        mail(to: 'tommy@studiowebux.com', subject: 'Webux-server - Published', body: 'Webux-server has been published to production')
      }
    }

  }
  post {
    failure {
        mail to: 'tommy@studiowebux.com',
        subject: "Failed Pipeline ${currentBuild.fullDisplayName}",
        body: " For details about the failure, see ${env.BUILD_URL}"


        sh 'git config --unset credential.helper'
    }
  }
}