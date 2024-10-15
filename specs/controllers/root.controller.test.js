// Test framework dependencies
import { describe, it, beforeEach } from 'node:test'
import assert from 'node:assert/strict'

// For running our service
import { init } from '../../app/server.js'

describe('Root controller: GET /', () => {
  let options
  let server

  // Create server before each test
  beforeEach(async () => {
    server = await init()

    options = { method: 'GET', url: '/' }
  })

  it('displays the correct message', async () => {
    const response = await server.inject(options)
    const payload = JSON.parse(response.payload)

    assert.equal(response.statusCode, 200)
    assert.equal(payload.status, 'alive')
  })
})
