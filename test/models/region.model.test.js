// Test framework dependencies
import { describe, it, before, after } from 'node:test'
import { expect } from 'chai'

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

      expect(result).to.be.instanceOf(RegionModel)
      expect(result.id).to.equal(testRecord.id)
    })
  })

  describe('Relationships', () => {
    describe('when linking to bill runs', () => {
      it('can successfully run a related query', async () => {
        const query = await RegionModel.query().innerJoinRelated('billRuns')

        expect(query).to.be.instanceOf(Array)
      })

      it('can eager load the bill runs', async () => {
        const result = await RegionModel.query().findById(testRecord.id).withGraphFetched('billRuns')

        expect(result).to.be.instanceOf(RegionModel)
        expect(result.id).to.equal(testRecord.id)

        expect(result.billRuns).to.be.instanceOf(Array)
        expect(result.billRuns[0]).to.be.instanceOf(BillRunModel)

        expect(result.billRuns).to.deep.include(testBillRuns[0])
        expect(result.billRuns).to.deep.include(testBillRuns[1])
      })
    })

    describe('when linking to licences', () => {
      it('can successfully run a related query', async () => {
        const query = await RegionModel.query().innerJoinRelated('licences')

        expect(query).to.be.instanceOf(Array)
      })

      it('can eager load the licences', async () => {
        const result = await RegionModel.query().findById(testRecord.id).withGraphFetched('licences')

        expect(result).to.be.instanceOf(RegionModel)
        expect(result.id).to.equal(testRecord.id)

        expect(result.licences).to.be.instanceOf(Array)
        expect(result.licences[0]).to.be.instanceOf(LicenceModel)
        expect(result.licences).to.deep.include(testLicences[0])
        expect(result.licences).to.deep.include(testLicences[1])
      })
    })
  })
})
