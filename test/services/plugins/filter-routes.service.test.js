// Test framework dependencies
import { describe, it, beforeEach } from 'node:test'
import { expect } from 'chai'

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

      expect(result).to.deep.equal(routes)
    })
  })

  describe('when the environment is production', () => {
    beforeEach(() => {
      routes = _routes()
    })

    it('returns the routes filtered', () => {
      const result = filterRoutesService(routes, 'prd')

      expect(result).not.to.deep.equal(routes)
      expect(result).to.have.length(2)
      expect(result).not.to.include('/path-to-be-filtered')
    })
  })
})

function _routes() {
  return [
    { path: '/' },
    { path: '/admin' },
    {
      path: '/path-to-be-filtered',
      options: { app: { excludeFromProd: true } }
    }
  ]
}
