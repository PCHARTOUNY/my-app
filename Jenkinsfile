pipeline {
  agent {
    kubernetes {
      inheritFrom 'kaniko'
      defaultContainer 'kaniko'
    }
  }

  environment {
    REGISTRY  = "harbor.local"
    PROJECT   = "luigi"
    NAMESPACE = "luigi"
    TAG       = "${GIT_COMMIT.take(7)}"
  }

  stages {

    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Build & Push Frontend') {
      steps {
        sh """
        /kaniko/executor \
          --context \$(pwd)/frontend \
          --dockerfile Dockerfile \
          --destination ${REGISTRY}/${PROJECT}/react-frontend:${TAG}
        """
      }
    }

    stage('Build & Push Backend') {
      steps {
        sh """
        /kaniko/executor \
          --context \$(pwd)/backend \
          --dockerfile Dockerfile \
          --destination ${REGISTRY}/${PROJECT}/node-backend:${TAG}
        """
      }
    }

    stage('Deploy to Kubernetes') {
      steps {
        sh """
        kubectl -n ${NAMESPACE} set image deployment/react-frontend \
          react-frontend=${REGISTRY}/${PROJECT}/react-frontend:${TAG}

        kubectl -n ${NAMESPACE} set image deployment/node-backend \
          node-backend=${REGISTRY}/${PROJECT}/node-backend:${TAG}

        kubectl -n ${NAMESPACE} rollout status deployment/react-frontend
        kubectl -n ${NAMESPACE} rollout status deployment/node-backend
        """
      }
    }
  }
}
