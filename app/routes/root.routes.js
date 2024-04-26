import * as RootController from '../controllers/root.controller.js'

const RootRoutes = [
  {
    method: 'GET',
    path: '/',
    handler: RootController.index,
    options: {
      auth: false
    }
  },
  {
    method: 'GET',
    path: '/status',
    handler: RootController.index,
    options: {
      auth: false,
      description: 'Used by the AWS load balancers to confirm the service is running',
      app: {
        plainOutput: true
      }
    }
  }
]

export default RootRoutes
