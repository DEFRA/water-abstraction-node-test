// Test framework dependencies
import { describe, it, beforeEach, afterEach, mock } from 'node:test'
import { expect } from 'chai'

// Things we need to stub
import { db } from '../../../db/db.js'

// Thing under test
import CheckBusyBillRunsService from '../../../app/services/bill-runs/check-busy-bill-runs.service.js'

describe('Check Busy Bill Runs service', () => {
  afterEach(() => {
    mock.reset()
  })

  describe('when there are both building and cancelling bill runs', () => {
    beforeEach(() => {
      mock.method(db, 'select', async () => {
        return [{ cancelling: true, building: true }]
      })
    })

    it('returns "both"', async () => {
      const result = await CheckBusyBillRunsService()

      expect(result).to.equal('both')
    })
  })

  describe('when there are cancelling bill runs', () => {
    beforeEach(() => {
      mock.method(db, 'select', async () => {
        return [{ cancelling: true, building: false }]
      })
    })

    it('returns "cancelling"', async () => {
      const result = await CheckBusyBillRunsService()

      expect(result).to.equal('cancelling')
    })
  })

  describe('when there are building bill runs', () => {
    beforeEach(() => {
      mock.method(db, 'select', async () => {
        return [{ cancelling: false, building: true }]
      })
    })

    it('returns "building"', async () => {
      const result = await CheckBusyBillRunsService()

      expect(result).to.equal('building')
    })
  })

  describe('when there are no building or cancelling bill runs', () => {
    beforeEach(() => {
      mock.method(db, 'select', async () => {
        return [{ cancelling: false, building: false }]
      })
    })

    it('returns "none"', async () => {
      const result = await CheckBusyBillRunsService()

      expect(result).to.equal('none')
    })
  })
})
