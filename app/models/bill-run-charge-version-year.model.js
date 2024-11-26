/**
 * Model for bill_run_charge_version_years (water.billing_batch_charge_version_years)
 * @module BillRunChargeVersionYearModel
 */

import { Model } from 'objection'

import BaseModel from './base.model.js'

import BillRunModel from './bill-run.model.js'
import ChargeVersionModel from './charge-version.model.js'

/**
 * Represents an instance of a bill run charge version year record
 *
 * For reference, the bill run charge version year record is a 'nothing' record! Certainly as far as we are concerned.
 *
 * They use this table when generating pre-sroc bill runs. We think it was mainly to support supplementary bill runs
 * and the fact they cover a range of years rather than a single period.
 *
 * We haven't needed to do anything like this in our engine and nothing else appears to use this table. The only reason
 * we reference it is to delete stuff when a bill run gets cancelled.
 *
 * Welcome to dealing with the legacy database schema! ¯\_(ツ)_/¯
 */
export default class BillRunChargeVersionYearModel extends BaseModel {
  static get tableName() {
    return 'billRunChargeVersionYears'
  }

  static get relationMappings() {
    return {
      billRun: {
        relation: Model.BelongsToOneRelation,
        modelClass: BillRunModel,
        join: {
          from: 'billRunChargeVersionYears.billRunId',
          to: 'billRuns.id'
        }
      },
      chargeVersion: {
        relation: Model.BelongsToOneRelation,
        modelClass: ChargeVersionModel,
        join: {
          from: 'billRunChargeVersionYears.chargeVersionId',
          to: 'chargeVersions.id'
        }
      }
    }
  }
}
