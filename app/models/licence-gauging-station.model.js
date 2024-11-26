/**
 * Model for licence_gauging_stations (water.licence_gauging_stations)
 * @module LicenceGaugingStationModel
 */

import { Model } from 'objection'

import BaseModel from './base.model.js'

import GaugingStationModel from './gauging-station.model.js'
import LicenceModel from './licence.model.js'

export default class LicenceGaugingStationModel extends BaseModel {
  static get tableName() {
    return 'licenceGaugingStations'
  }

  static get relationMappings() {
    return {
      gaugingStation: {
        relation: Model.BelongsToOneRelation,
        modelClass: GaugingStationModel,
        join: {
          from: 'licenceGaugingStations.gaugingStationId',
          to: 'gaugingStations.id'
        }
      },
      licence: {
        relation: Model.BelongsToOneRelation,
        modelClass: LicenceModel,
        join: {
          from: 'licenceGaugingStations.licenceId',
          to: 'licences.id'
        }
      }
    }
  }
}
