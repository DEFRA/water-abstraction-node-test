/**
 * Model for gauging_stations (water.gauging_stations)
 * @module GaugingStationModel
 */

import { Model } from 'objection'

import BaseModel from './base.model.js'

import LicenceGaugingStationModel from './licence-gauging-station.model.js'

export default class GaugingStationModel extends BaseModel {
  static get tableName () {
    return 'gaugingStations'
  }

  // Defining which fields contain json allows us to insert an object without needing to stringify it first
  static get jsonAttributes () {
    return [
      'metadata'
    ]
  }

  static get relationMappings () {
    return {
      licenceGaugingStations: {
        relation: Model.HasManyRelation,
        modelClass: LicenceGaugingStationModel,
        join: {
          from: 'gaugingStations.id',
          to: 'licenceGaugingStations.gaugingStationId'
        }
      }
    }
  }
}
