/**
 * Used by the `RouterPlugin` to determine if a route should be registered with Hapi
 * @module FilterRoutesService
 */

/**
 * When running in a production environment ('pre' or 'prd') filter the routes we register with Hapi.
 *
 * Initially conceived as a very simple 'feature toggle' solution. In the main our features are related to endpoints;
 * a new feature typically means a new endpoint. We want the ability to work on new features, but still push other
 * changes, for example, patches and fixes into production.
 *
 * So, we use this service to ensure any endpoint that is still being worked on is not available when the API is
 * running in production. We also include pre-production in our protected environments so we can test and ensure
 * an endpoint does not get registered as part of our release testing and sign-off.
 *
 * We identify routes to filter because they have a custom `excludeFromProd` property which has been added to the
 * {@link https://hapi.dev/api/?v=20.1.3#-routeoptionsapp|route options app property} the Hapi provided place apps
 * can store route configuration
 *
 * This service is used by the `RouterPlugin` to check which routes need filtering before it then registers them with
 * the Hapi server instance.
 *
 * @param {object[]} routes - An array of Hapi routes expected to be provided by the `RouterPlugin`
 * @param {string} environment - The current environment ('dev', 'tst', 'tra', 'pre' or 'prd')
 *
 * @returns {object[]} an array of Hapi routes, filtered depending on the current environment and whether any paths
 * have been registered as needing filtering
 */
export default function filterRoutesService(routes, environment) {
  if (_protectedEnvironment(environment)) {
    return _filteredRoutes(routes)
  }

  return routes
}

function _protectedEnvironment(environment) {
  return ['prd'].includes(environment)
}

function _filteredRoutes(routes) {
  return routes.filter((route) => {
    return !route?.options?.app?.excludeFromProd
  })
}
