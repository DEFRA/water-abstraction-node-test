/**
 * Plugin that handles logging for the application
 *
 * {@link https://github.com/pinojs/hapi-pino|hapi-pino} wraps the
 * {@link https://github.com/pinojs/pino#low-overhead|pino} Node JSON logger as a logger for Hapi. We pretty much use it
 * as provided with its defaults.
 *
 * @module HapiPinoPlugin
 */

import HapiPino from 'hapi-pino'

import hapiPinoIgnoreRequestService from '../services/plugins/hapi-pino-ignore-request.service.js'
import hapiPinoLogInTestService from '../services/plugins/hapi-pino-log-in-test.service.js'

import LogConfig from '../../config/log.config.js'

const HapiPinoPlugin = () => {
  return {
    plugin: HapiPino,
    options: {
      // Include our test configuration
      ...hapiPinoLogInTestService(LogConfig.logInTest),
      // When not in the production environment we want a 'pretty' version of the JSON to make it easier to grok what has
      // happened
      transport: process.env.NODE_ENV !== 'production' ? { target: 'pino-pretty', options: { colorize: true } } : undefined,
      // Redact Authorization headers, see https://getpino.io/#/docs/redaction
      redact: ['req.headers.authorization'],
      // Adding this here means it will be passed to HapiPinoIgnoreRequestService.go() within the `options` arg when
      // Hapi-pino uses the ignoreFunc property
      logAssetRequests: LogConfig.logAssetRequests,
      // We want our logs to focus on the main requests and not become full of 'noise' from requests for /assets or
      // pings from the AWS load balancer to /status. We pass this function to hapi-pino to control what gets filtered
      // https://github.com/pinojs/hapi-pino#optionsignorefunc-options-request--boolean
      ignoreFunc: hapiPinoIgnoreRequestService
    }
  }
}

export default HapiPinoPlugin
