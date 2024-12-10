// Test framework dependencies
import { describe, it, beforeEach, afterEach, mock } from 'node:test'
import { expect } from 'chai'
import Nock from 'nock'

// Thing under test
import * as BaseRequest from '../../app/requests/base.request.js'

describe('BaseRequest', () => {
  const testDomain = 'http://example.com'

  // NOTE: We make the tests run much faster by setting backoffLimit to 50 in Got's retry options. The time between
  // retries in Got is based on a computed value; ((2 ** (attemptCount - 1)) * 1000) + noise
  //
  // This means the delay increases exponentially between retries. That's great when making requests for real but it
  // drastically slows down our test suite. Prior to making this change the tests for this module took an avg of 40 secs
  // to finish. The backoffLimit sets an upper limit for the computed value. When applied here it brings the avg down
  // to 16 secs.
  //
  // The behaviour doesn't change; we are still retrying requests. But now we are only waiting a maximum of 50ms between
  // them.
  const shortBackoffLimitRetryOptions = {
    ...BaseRequest.defaultOptions().retry,
    backoffLimit: 50
  }

  let notifierStub

  beforeEach(() => {
    // BaseRequest depends on the GlobalNotifier to have been set. This happens in app/plugins/global-notifier.plugin.js
    // when the app starts up and the plugin is registered. As we're not creating an instance of Hapi server in this
    // test we recreate the condition by setting it directly with our own stub
    notifierStub = { omg: mock.fn(), omfg: mock.fn() }
    global.GlobalNotifier = notifierStub
  })

  afterEach(() => {
    mock.reset()
    Nock.cleanAll()
    delete global.GlobalNotifier
  })

  describe('#deleteRequest()', () => {
    describe('when a request succeeds', () => {
      beforeEach(() => {
        Nock(testDomain).delete('/').reply(200, { data: 'hello world' })
      })

      describe('the result it returns', () => {
        it('has a "succeeded" property marked as true', async () => {
          const result = await BaseRequest.deleteRequest(testDomain)

          expect(result.succeeded).to.be.true
        })

        it('has a "response" property containing the web response', async () => {
          const result = await BaseRequest.deleteRequest(testDomain)

          expect(result.response.statusCode).to.equal(200)
          expect(result.response.body).to.equal('{"data":"hello world"}')
        })
      })
    })

    describe('When a request fails', () => {
      describe('because the response was a 500', () => {
        beforeEach(() => {
          Nock(testDomain).delete('/').reply(500, { data: 'hello world' })
        })

        it('logs the failure', async () => {
          await BaseRequest.deleteRequest(testDomain)

          const logDataArgs = notifierStub.omg.mock.calls[0].arguments

          expect(logDataArgs[0]).to.equal('DELETE request failed')
          expect(logDataArgs[1].method).to.equal('DELETE')
          expect(logDataArgs[1].url).to.equal('http://example.com')
          expect(logDataArgs[1].additionalOptions).to.deep.equal({})
          expect(logDataArgs[1].result.succeeded).to.be.false
          expect(logDataArgs[1].result.response).to.deep.equal({
            statusCode: 500,
            body: '{"data":"hello world"}'
          })
        })

        describe('the result it returns', () => {
          it('has a "succeeded" property marked as false', async () => {
            const result = await BaseRequest.deleteRequest(testDomain)

            expect(result.succeeded).to.be.false
          })

          it('has a "response" property containing the web response', async () => {
            const result = await BaseRequest.deleteRequest(testDomain)

            expect(result.response.statusCode).to.equal(500)
            expect(result.response.body).to.equal('{"data":"hello world"}')
          })
        })
      })

      describe('because there was a network issue', () => {
        describe('and all retries fail', () => {
          beforeEach(async () => {
            Nock(testDomain)
              .delete(() => {
                return true
              })
              .replyWithError({ code: 'ECONNRESET' })
              .persist()
          })

          it('logs when a retry has happened', async () => {
            await BaseRequest.deleteRequest(testDomain, { retry: shortBackoffLimitRetryOptions })

            expect(notifierStub.omg.mock.calls.length).to.equal(2)
            expect(notifierStub.omg.mock.calls[0].arguments[0]).to.equal('Retrying HTTP request')
            expect(notifierStub.omg.mock.calls[1].arguments[0]).to.equal('Retrying HTTP request')
          })

          it('logs and records the error', async () => {
            await BaseRequest.deleteRequest(testDomain, { retry: shortBackoffLimitRetryOptions })

            const logDataArgs = notifierStub.omfg.mock.calls[0].arguments

            expect(logDataArgs[0]).to.equal('DELETE request errored')
            expect(logDataArgs[1].method).to.equal('DELETE')
            expect(logDataArgs[1].url).to.equal('http://example.com')
            expect(logDataArgs[1].additionalOptions).to.have.property('retry')
            expect(logDataArgs[1].result.succeeded).to.be.false
            expect(logDataArgs[1].result.response).to.be.an.instanceOf(Error)
          })

          describe('the result it returns', () => {
            it('has a "succeeded" property marked as false', async () => {
              const result = await BaseRequest.deleteRequest(testDomain, { retry: shortBackoffLimitRetryOptions })

              expect(result.succeeded).to.be.false
            })

            it('has a "response" property containing the error', async () => {
              const result = await BaseRequest.deleteRequest(testDomain, { retry: shortBackoffLimitRetryOptions })

              expect(result.response).to.be.an.instanceOf(Error)
              expect(result.response.code).to.equal('ECONNRESET')
            })
          })
        })

        describe('and a retry succeeds', () => {
          beforeEach(async () => {
            // The first response will error, the second response will return OK
            Nock(testDomain)
              .delete(() => {
                return true
              })
              .replyWithError({ code: 'ECONNRESET' })
              .delete(() => {
                return true
              })
              .reply(200, { data: 'econnreset hello world' })
          })

          it('logs when a retry has happened', async () => {
            await BaseRequest.deleteRequest(testDomain, { retry: shortBackoffLimitRetryOptions })

            expect(notifierStub.omg.mock.calls.length).to.equal(1)
            expect(notifierStub.omg.mock.calls[0].arguments[0]).to.equal('Retrying HTTP request')
          })

          describe('the result it returns', () => {
            it('has a "succeeded" property marked as true', async () => {
              const result = await BaseRequest.deleteRequest(testDomain, { retry: shortBackoffLimitRetryOptions })

              expect(result.succeeded).to.be.true
            })

            it('has a "response" property containing the web response', async () => {
              const result = await BaseRequest.deleteRequest(testDomain, { retry: shortBackoffLimitRetryOptions })

              expect(result.response.statusCode).to.equal(200)
              expect(result.response.body).to.equal('{"data":"econnreset hello world"}')
            })
          })
        })
      })
    })
  })
})
