/**
 * Model for review_charge_elements
 * @module ReviewChargeElementModel
 */

import { Model } from 'objection'

import BaseModel from './base.model.js'

import ChargeElementModel from './charge-element.model.js'
import ReviewChargeReferenceModel from './review-charge-reference.model.js'
import ReviewReturnModel from './review-return.model.js'

export default class ReviewChargeElementModel extends BaseModel {
  static get tableName () {
    return 'reviewChargeElements'
  }

  static get relationMappings () {
    return {
      chargeElement: {
        relation: Model.BelongsToOneRelation,
        modelClass: ChargeElementModel,
        join: {
          from: 'reviewChargeElements.chargeElementId',
          to: 'chargeElements.id'
        }
      },
      reviewChargeReference: {
        relation: Model.BelongsToOneRelation,
        modelClass: ReviewChargeReferenceModel,
        join: {
          from: 'reviewChargeElements.reviewChargeReferenceId',
          to: 'reviewChargeReferences.id'
        }
      },
      reviewReturns: {
        relation: Model.ManyToManyRelation,
        modelClass: ReviewReturnModel,
        join: {
          from: 'reviewChargeElements.id',
          through: {
            from: 'reviewChargeElementsReturns.reviewChargeElementId',
            to: 'reviewChargeElementsReturns.reviewReturnId'
          },
          to: 'reviewReturns.id'
        }
      }
    }
  }
}
