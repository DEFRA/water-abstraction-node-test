/**
 * Model for review_charge_versions
 * @module ReviewChargeVersionModel
 */

import { Model } from 'objection'

import BaseModel from './base.model.js'

import ChargeVersionModel from './charge-version.model.js'
import ReviewChargeReferenceModel from './review-charge-reference.model.js'
import ReviewLicenceModel from './review-licence.model.js'

export default class ReviewChargeVersionModel extends BaseModel {
  static get tableName() {
    return 'reviewChargeVersions'
  }

  static get relationMappings() {
    return {
      chargeVersion: {
        relation: Model.BelongsToOneRelation,
        modelClass: ChargeVersionModel,
        join: {
          from: 'reviewChargeVersions.chargeVersionId',
          to: 'chargeVersions.id'
        }
      },
      reviewChargeReferences: {
        relation: Model.HasManyRelation,
        modelClass: ReviewChargeReferenceModel,
        join: {
          from: 'reviewChargeVersions.id',
          to: 'reviewChargeReferences.reviewChargeVersionId'
        }
      },
      reviewLicence: {
        relation: Model.BelongsToOneRelation,
        modelClass: ReviewLicenceModel,
        join: {
          from: 'reviewChargeVersions.reviewLicenceId',
          to: 'reviewLicences.id'
        }
      }
    }
  }
}
