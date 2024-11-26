/**
 * Model for review_charge_references
 * @module ReviewChargeReferenceModel
 */

import { Model } from 'objection'

import BaseModel from './base.model.js'

import ChargeReferenceModel from './charge-reference.model.js'
import ReviewChargeElementModel from './review-charge-element.model.js'
import ReviewChargeVersionModel from './review-charge-version.model.js'

export default class ReviewChargeReferenceModel extends BaseModel {
  static get tableName() {
    return 'reviewChargeReferences'
  }

  static get relationMappings() {
    return {
      chargeReference: {
        relation: Model.BelongsToOneRelation,
        modelClass: ChargeReferenceModel,
        join: {
          from: 'reviewChargeReferences.chargeReferenceId',
          to: 'chargeReferences.id'
        }
      },
      reviewChargeElements: {
        relation: Model.HasManyRelation,
        modelClass: ReviewChargeElementModel,
        join: {
          from: 'reviewChargeReferences.id',
          to: 'reviewChargeElements.reviewChargeReferenceId'
        }
      },
      reviewChargeVersion: {
        relation: Model.BelongsToOneRelation,
        modelClass: ReviewChargeVersionModel,
        join: {
          from: 'reviewChargeReferences.reviewChargeVersionId',
          to: 'reviewChargeVersions.id'
        }
      }
    }
  }
}
