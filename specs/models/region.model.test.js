// Test framework dependencies
import { describe, it, before, after } from 'node:test'
import assert from 'node:assert/strict'

// Test helpers
import * as BillRunHelper from '../support/helpers/bill-run.helper.js'
import BillRunModel from '../../app/models/bill-run.model.js'
import * as LicenceHelper from '../support/helpers/licence.helper.js'
import LicenceModel from '../../app/models/licence.model.js'
import * as RegionHelper from '../support/helpers/region.helper.js'
import { closeConnection } from '../support/database.js'

// Thing under test
import RegionModel from '../../app/models/region.model.js'

describe('Region model', () => {
  let testBillRuns
  let testLicences
  let testRecord

  before(async () => {
    testRecord = RegionHelper.select()

    testBillRuns = []
    testLicences = []
    for (let i = 0; i < 2; i++) {
      const billRun = await BillRunHelper.add({ regionId: testRecord.id })

      testBillRuns.push(billRun)

      const licence = await LicenceHelper.add({ regionId: testRecord.id })

      testLicences.push(licence)
    }
  })

  after(async () => {
    await closeConnection()
  })

  describe('Basic query', async () => {
    it('can successfully run a basic query', async () => {
      const result = await RegionModel.query().findById(testRecord.id)

      assert(result instanceof RegionModel)
      assert.equal(result.id, testRecord.id)
    })
  })

  describe('Relationships', () => {
    describe('when linking to bill runs', () => {
      it('can successfully run a related query', async () => {
        const query = await RegionModel.query()
          .innerJoinRelated('billRuns')

        assert(query)
      })

      it('can eager load the bill runs', async () => {
        const result = await RegionModel.query()
          .findById(testRecord.id)
          .withGraphFetched('billRuns')

        assert(result instanceof RegionModel)
        assert.equal(result.id, testRecord.id)

        assert(result.billRuns instanceof Array)
        assert(result.billRuns[0] instanceof BillRunModel)

        const includesFirstBillRun = result.billRuns.some((billRun) => {
          return billRun.id === testBillRuns[0].id
        })

        assert(includesFirstBillRun)

        const includesSecondBillRun = result.billRuns.some((billRun) => {
          return billRun.id === testBillRuns[1].id
        })

        assert(includesSecondBillRun)
      })
    })

    describe('when linking to licences', () => {
      it('can successfully run a related query', async () => {
        const query = await RegionModel.query()
          .innerJoinRelated('licences')

        assert(query)
      })

      it('can eager load the licences', async () => {
        const result = await RegionModel.query()
          .findById(testRecord.id)
          .withGraphFetched('licences')

        assert(result instanceof RegionModel)
        assert.equal(result.id, testRecord.id)

        assert(result.licences instanceof Array)
        assert(result.licences[0] instanceof LicenceModel)

        const includesFirstLicence = result.licences.some((licence) => {
          return licence.id === testLicences[0].id
        })

        assert(includesFirstLicence)

        const includesSecondLicence = result.licences.some((licence) => {
          return licence.id === testLicences[1].id
        })

        assert(includesSecondLicence)
      })
    })
  })
})
