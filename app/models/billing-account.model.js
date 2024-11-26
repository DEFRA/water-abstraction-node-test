/**
 * Model for billing_accounts (crm_v2.invoice_accounts)
 * @module BillingAccountModel
 */

import { Model } from 'objection'

import BaseModel from './base.model.js'

import BillingAccountAddressModel from './billing-account-address.model.js'
import BillModel from './bill.model.js'
import ChargeVersionModel from './charge-version.model.js'
import CompanyModel from './company.model.js'

export default class BillingAccountModel extends BaseModel {
  static get tableName() {
    return 'billingAccounts'
  }

  static get relationMappings() {
    return {
      billingAccountAddresses: {
        relation: Model.HasManyRelation,
        modelClass: BillingAccountAddressModel,
        join: {
          from: 'billingAccounts.id',
          to: 'billingAccountAddresses.billingAccountId'
        }
      },
      bills: {
        relation: Model.HasManyRelation,
        modelClass: BillModel,
        join: {
          from: 'billingAccounts.id',
          to: 'bills.billingAccountId'
        }
      },
      chargeVersions: {
        relation: Model.HasManyRelation,
        modelClass: ChargeVersionModel,
        join: {
          from: 'billingAccounts.id',
          to: 'chargeVersions.billingAccountId'
        }
      },
      company: {
        relation: Model.BelongsToOneRelation,
        modelClass: CompanyModel,
        join: {
          from: 'billingAccounts.companyId',
          to: 'companies.id'
        }
      }
    }
  }
}
