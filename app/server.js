import Hapi from '@hapi/hapi'

import BlippPlugin from './plugins/blipp.plugin.js'
import HapiPinoPlugin from './plugins/hapi-pino.plugin.js'
import RouterPlugin from './plugins/router.plugin.js'
import StopPlugin from './plugins/stop.plugin.js'

import ServerConfig from '../config/server.config.js'

const registerPlugins = async (server) => {
  // Register the remaining plugins
  await server.register(StopPlugin)
  await server.register(RouterPlugin)
  await server.register(HapiPinoPlugin())

  // Register non-production plugins
  if (ServerConfig.environment === 'development') {
    await server.register(BlippPlugin)
  }
}

const init = async () => {
  // Create the hapi server
  const server = Hapi.server(ServerConfig.hapi)

  await registerPlugins(server)
  await server.initialize()

  return server
}

const start = async () => {
  const server = await init()
  await server.start()

  return server
}

process.on('unhandledRejection', err => {
  console.log(err)
  process.exit(1)
})

export { init, start }
