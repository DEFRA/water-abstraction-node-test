/**
 * Model for regions (water.regions)
 * @module RegionModel
 */

import { Model } from 'objection'

import BaseModel from './base.model.js'

import LicenceModel from './licence.model.js'
import BillRunModel from './bill-run.model.js'

export default class RegionModel extends BaseModel {
  static get tableName() {
    return 'regions'
  }

  static get relationMappings() {
    return {
      licences: {
        relation: Model.HasManyRelation,
        modelClass: LicenceModel,
        join: {
          from: 'regions.id',
          to: 'licences.regionId'
        }
      },
      billRuns: {
        relation: Model.HasManyRelation,
        modelClass: BillRunModel,
        join: {
          from: 'regions.id',
          to: 'billRuns.regionId'
        }
      }
    }
  }
}
