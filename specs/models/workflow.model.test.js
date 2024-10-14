// Test framework dependencies
import { describe, it, before, after } from 'node:test'
import assert from 'node:assert/strict'

// Test helpers
import { closeConnection } from '../support/database.js'
import * as LicenceHelper from '../support/helpers/licence.helper.js'
import LicenceModel from '../../app/models/licence.model.js'
import * as WorkflowHelper from '../support/helpers/workflow.helper.js'

// Thing under test
import WorkflowModel from '../../app/models/workflow.model.js'

describe('Workflow model', () => {
  let testLicence
  let testRecord

  before(async () => {
    testLicence = await LicenceHelper.add()

    testRecord = await WorkflowHelper.add({ licenceId: testLicence.id })
  })

  after(async () => {
    await closeConnection()
  })

  describe('Basic query', async () => {
    it('can successfully run a basic query', async () => {
      const result = await WorkflowModel.query().findById(testRecord.id)

      assert(result instanceof WorkflowModel)
      assert.equal(result.id, testRecord.id)
    })
  })

  describe('Relationships', () => {
    describe('when linking to licence', () => {
      it('can successfully run a related query', async () => {
        const query = await WorkflowModel.query()
          .innerJoinRelated('licence')

        assert(query)
      })

      it('can eager load the licence', async () => {
        const result = await WorkflowModel.query()
          .findById(testRecord.id)
          .withGraphFetched('licence')

        assert(result instanceof WorkflowModel)
        assert.equal(result.id, testRecord.id)

        assert(result.licence instanceof LicenceModel)
        assert.deepEqual(result.licence, testLicence)
      })
    })
  })
})
