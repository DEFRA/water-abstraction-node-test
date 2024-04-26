// Test framework dependencies
import { describe, it, beforeEach } from 'node:test'
import assert from 'node:assert/strict'

// Thing under test
import filterRoutesService from '../../../app/services/plugins/filter-routes.service.js'

describe('Filter routes service', () => {
  let routes

  describe('when the environment is non-production', () => {
    beforeEach(() => {
      routes = _routes()
    })

    it('returns the routes unchanged', () => {
      const result = filterRoutesService(routes, 'dev')

      assert.deepEqual(result, routes)
    })
  })

  describe('when the environment is production', () => {
    beforeEach(() => {
      routes = _routes()
    })

    it('returns the routes filtered', () => {
      const result = filterRoutesService(routes, 'prd')

      assert.notDeepEqual(result, routes)
      assert.equal(result.length, 2)

      const includesPathToBeFiltered = result.some((path) => {
        return path.path === '/path-to-be-filtered'
      })

      assert.equal(includesPathToBeFiltered, false)
    })
  })
})

function _routes () {
  return [
    { path: '/' },
    { path: '/admin' },
    {
      path: '/path-to-be-filtered',
      options: { app: { excludeFromProd: true } }
    }
  ]
}
