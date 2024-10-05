/**
 * Model for licence_version_purpose_conditions (water.licence_version_purpose_conditions)
 * @module LicenceVersionPurposeConditionModel
 */

import { Model } from 'objection'

import BaseModel from './base.model.js'

import LicenceVersionPurposeConditionTypeModel from './licence-version-purpose-condition-type.model.js'
import LicenceVersionPurposeModel from './licence-version-purpose.model.js'

export default class LicenceVersionPurposeConditionModel extends BaseModel {
  static get tableName () {
    return 'licenceVersionPurposeConditions'
  }

  static get relationMappings () {
    return {
      licenceVersionPurpose: {
        relation: Model.BelongsToOneRelation,
        modelClass: LicenceVersionPurposeModel,
        join: {
          from: 'licenceVersionPurposeConditions.licenceVersionPurposeId',
          to: 'licenceVersionPurposes.id'
        }
      },
      licenceVersionPurposeConditionType: {
        relation: Model.HasOneRelation,
        modelClass: LicenceVersionPurposeConditionTypeModel,
        join: {
          from: 'licenceVersionPurposeConditions.licenceVersionPurposeConditionTypeId',
          to: 'licenceVersionPurposeConditionTypes.id'
        }
      }
    }
  }
}
