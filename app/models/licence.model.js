/**
 * Model for licences (water.licences)
 * @module LicenceModel
 */

import { Model } from 'objection'

import BaseModel from './base.model.js'

import BillLicenceModel from './bill-licence.model.js'
import ChargeVersionModel from './charge-version.model.js'
import LicenceAgreementModel from './licence-agreement.model.js'
import LicenceDocumentModel from './licence-document.model.js'
import LicenceDocumentHeaderModel from './licence-document-header.model.js'
import LicenceGaugingStationModel from './licence-gauging-station.model.js'
import LicenceSupplementaryYearModel from './licence-supplementary-year.model.js'
import LicenceVersionModel from './licence-version.model.js'
import ModLogModel from './mod-log.model.js'
import PermitLicence from './permit-licence.model.js'
import RegionModel from './region.model.js'
import ReturnLogModel from './return-log.model.js'
import ReturnVersionModel from './return-version.model.js'
import ReviewLicenceModel from './review-licence.model.js'
import WorkflowModel from './workflow.model.js'

export default class LicenceModel extends BaseModel {
  static get tableName() {
    return 'licences'
  }

  static get relationMappings() {
    return {
      billLicences: {
        relation: Model.HasManyRelation,
        modelClass: BillLicenceModel,
        join: {
          from: 'licences.id',
          to: 'billLicences.licenceId'
        }
      },
      chargeVersions: {
        relation: Model.HasManyRelation,
        modelClass: ChargeVersionModel,
        join: {
          from: 'licences.id',
          to: 'chargeVersions.licenceId'
        }
      },
      licenceAgreements: {
        relation: Model.HasManyRelation,
        modelClass: LicenceAgreementModel,
        join: {
          from: 'licences.licenceRef',
          to: 'licenceAgreements.licenceRef'
        }
      },
      licenceDocument: {
        relation: Model.BelongsToOneRelation,
        modelClass: LicenceDocumentModel,
        join: {
          from: 'licences.licenceRef',
          to: 'licenceDocuments.licenceRef'
        }
      },
      licenceDocumentHeader: {
        relation: Model.BelongsToOneRelation,
        modelClass: LicenceDocumentHeaderModel,
        join: {
          from: 'licences.licenceRef',
          to: 'licenceDocumentHeaders.licenceRef'
        }
      },
      licenceGaugingStations: {
        relation: Model.HasManyRelation,
        modelClass: LicenceGaugingStationModel,
        join: {
          from: 'licences.id',
          to: 'licenceGaugingStations.licenceId'
        }
      },
      licenceSupplementaryYears: {
        relation: Model.HasManyRelation,
        modelClass: LicenceSupplementaryYearModel,
        join: {
          from: 'licences.id',
          to: 'licenceSupplementaryYears.licenceId'
        }
      },
      licenceVersions: {
        relation: Model.HasManyRelation,
        modelClass: LicenceVersionModel,
        join: {
          from: 'licences.id',
          to: 'licenceVersions.licenceId'
        }
      },
      modLogs: {
        relation: Model.HasManyRelation,
        modelClass: ModLogModel,
        join: {
          from: 'licences.id',
          to: 'modLogs.licenceId'
        }
      },
      permitLicence: {
        relation: Model.HasOneRelation,
        modelClass: PermitLicence,
        join: {
          from: 'licences.licenceRef',
          to: 'permitLicences.licenceRef'
        }
      },
      region: {
        relation: Model.BelongsToOneRelation,
        modelClass: RegionModel,
        join: {
          from: 'licences.regionId',
          to: 'regions.id'
        }
      },
      returnLogs: {
        relation: Model.HasManyRelation,
        modelClass: ReturnLogModel,
        join: {
          from: 'licences.licenceRef',
          to: 'returnLogs.licenceRef'
        }
      },
      returnVersions: {
        relation: Model.HasManyRelation,
        modelClass: ReturnVersionModel,
        join: {
          from: 'licences.id',
          to: 'returnVersions.licenceId'
        }
      },
      reviewLicences: {
        relation: Model.HasManyRelation,
        modelClass: ReviewLicenceModel,
        join: {
          from: 'licences.id',
          to: 'reviewLicences.licenceId'
        }
      },
      workflows: {
        relation: Model.HasManyRelation,
        modelClass: WorkflowModel,
        join: {
          from: 'licences.id',
          to: 'workflows.licenceId'
        }
      }
    }
  }

  /**
   * Modifiers allow us to reuse logic in queries, eg. select the licence and everything to get the licence holder:
   *
   * ```javascript
   * return LicenceModel.query()
   *   .findById(licenceId)
   *   .modify('licenceHolder')
   * ```
   *
   * See {@link https://vincit.github.io/objection.js/recipes/modifiers.html | Modifiers} for more details
   *
   * @returns {object}
   */
  static get modifiers() {
    return {
      // currentVersion modifier fetches only the current licence version record for this licence
      currentVersion(query) {
        query.withGraphFetched('licenceVersions').modifyGraph('licenceVersions', (builder) => {
          builder.select(['id', 'startDate', 'status']).where('status', 'current').orderBy('startDate', 'desc').limit(1)
        })
      },
      // licenceHolder modifier fetches all the joined records needed to identify the licence holder
      licenceHolder(query) {
        query
          .withGraphFetched('licenceDocument')
          .modifyGraph('licenceDocument', (builder) => {
            builder.select(['id'])
          })
          .withGraphFetched('licenceDocument.licenceDocumentRoles')
          .modifyGraph('licenceDocument.licenceDocumentRoles', (builder) => {
            builder
              .select(['licenceDocumentRoles.id'])
              .innerJoinRelated('licenceRole')
              .where('licenceRole.name', 'licenceHolder')
              .orderBy('licenceDocumentRoles.startDate', 'desc')
          })
          .withGraphFetched('licenceDocument.licenceDocumentRoles.company')
          .modifyGraph('licenceDocument.licenceDocumentRoles.company', (builder) => {
            builder.select(['id', 'name', 'type'])
          })
          .withGraphFetched('licenceDocument.licenceDocumentRoles.contact')
          .modifyGraph('licenceDocument.licenceDocumentRoles.contact', (builder) => {
            builder.select([
              'id',
              'contactType',
              'dataSource',
              'department',
              'firstName',
              'initials',
              'lastName',
              'middleInitials',
              'salutation',
              'suffix'
            ])
          })
      },
      // When an external user registers themselves as the 'primary user' for a licence (see $primaryUser()) they
      // can choose to set a custom name for the licence. If set this is visible on the view licence page above the
      // licence reference.
      //
      // The value itself is stored in `crm.document_header` not `water.licences` which is why we have to pull the
      // related record.
      licenceName(query) {
        query.withGraphFetched('licenceDocumentHeader').modifyGraph('licenceDocumentHeader', (builder) => {
          builder.select(['id', 'licenceName'])
        })
      },
      // An external user with an account can register a licence via the external UI. The legacy service will generate a
      // letter with a code which gets sent to the licence's address. Once they receive it they can enter the code in
      // the UI and they then become the 'primary user' for it.
      //
      // When they do this the legacy service creates
      //
      // - creates a `crm.entity` record with the user's email
      // - updates the user's `idm.users` record with the entity ID (see `external_id)
      // - creates a `crm.entity_role` record with a role of 'primary_user' linked to both the entity, and the company
      // entity linked to the licence
      // - the `crm.entity_role` is linked to the `crm.document_header` for the licence
      //
      // We know, this is mad! It explains why even the previous team were trying to move away from this and had created
      // `crm_v2`. Unfortunately, this never got sorted so it remains the only means to get from a licence to the user
      // record which holds the ID of the primary user.
      primaryUser(query) {
        query
          .withGraphFetched('licenceDocumentHeader')
          .modifyGraph('licenceDocumentHeader', (builder) => {
            builder.select(['id'])
          })
          .withGraphFetched('licenceDocumentHeader.licenceEntityRole')
          .modifyGraph('licenceDocumentHeader.licenceEntityRole', (builder) => {
            builder.select(['id']).where('role', 'primary_user')
          })
          .withGraphFetched('licenceDocumentHeader.licenceEntityRole.licenceEntity')
          .modifyGraph('licenceDocumentHeader.licenceEntityRole.licenceEntity', (builder) => {
            builder.select(['id'])
          })
          .withGraphFetched('licenceDocumentHeader.licenceEntityRole.licenceEntity.user')
          .modifyGraph('licenceDocumentHeader.licenceEntityRole.licenceEntity.user', (builder) => {
            builder.select(['id', 'username'])
          })
      }
    }
  }

  /**
   * Of the licence versions against the licence instance, return the first 'current'
   *
   * > We recommend adding the `currentVersion` modifier to your query if you only care about the current licence
   * version for the licence
   *
   * Minor changes to a licence will result in a new version of the licence being created in NALD. Purposes, points and
   * agreements are then linked to the licence version purpose.
   *
   * It can be assumed that every licence has at least one licence version and that there will only ever be one with a
   * status of 'current'. However, at times we have encountered licences without a licence version hence we cater for
   * that in the function.
   *
   * @returns {module:LicenceVersion|null} `null` if this instance's `licenceVersions` has not been populated or there
   * are none (we've found a couple of examples!). Else a `LicenceVersionModel` that is the 'current' version for this
   * licence
   */
  $currentVersion() {
    if (!this.licenceVersions || this.licenceVersions.length === 0) {
      return null
    }

    return this.licenceVersions.find((licenceVersion) => {
      return licenceVersion.status === 'current'
    })
  }

  /**
   * Determine the 'end' date for the licence
   *
   * A licence can 'end' for 3 reasons:
   *
   * - because it is _revoked_
   * - because it is _lapsed_
   * - because it is _expired_
   *
   * The previous delivery team chose to encode these as 3 separate date fields on the licence record. So, if a field is
   * populated it means the licence 'ends' for that reason on that day.
   *
   * More than one of these fields may be populated. For example, a licence was due to expire on 2023-08-10 but was then
   * revoked on 2022-04-27. So, to determine the reason you need to select the _earliest_ date.
   *
   * But are examples where 2 of the fields might be populated with the same date (and 1 licence where all 3 have the
   * same date!) If more than one date field is populated and they hold the earliest date value then we select based on
   * priority; _revoked_ -> _lapsed_ -> _expired_.
   *
   * @returns `null` if no 'end' dates are set else an object containing the date, priority and reason for either the
   * earliest or highest priority end date
   */
  $ends() {
    const endDates = [
      { date: this.revokedDate, priority: 1, reason: 'revoked' },
      { date: this.lapsedDate, priority: 2, reason: 'lapsed' },
      { date: this.expiredDate, priority: 3, reason: 'expired' }
    ]

    const filteredDates = endDates.filter((endDate) => {
      return endDate.date
    })

    if (filteredDates.length === 0) {
      return null
    }

    // NOTE: For date comparisons you cannot use !== with just the date values. Using < or > will coerce the values into
    // numbers for comparison. But equality operators are checking that the two operands are referring to the same
    // Object. So, where we have matching dates and expect !== to return 'false' we get 'true' instead
    // Thanks to https://stackoverflow.com/a/493018/6117745 for explaining the problem and providing the solution
    filteredDates.sort((firstDate, secondDate) => {
      if (firstDate.date.getTime() !== secondDate.date.getTime()) {
        if (firstDate.date.getTime() < secondDate.date.getTime()) {
          return -1
        }

        return 1
      }

      if (firstDate.priority < secondDate.priority) {
        return -1
      }

      return 1
    })

    return filteredDates[0]
  }

  /**
   * Determine the name of the licence holder for the licence
   *
   * > We recommend adding the `licenceHolder` modifier to your query to ensure the joined records are available to
   * > determine this
   *
   * Every licence has a licence holder. They may be a company or a person (held as a 'contact' record). This
   * information is stored in 'licence document roles' and because the licence holder can change, there may be more
   * than one record.
   *
   * To get to the 'licence document roles' we have to go via the linked 'licence document' and ensure we sort by their
   * start date so that we have the 'current' licence holder. Thankfully, the `licenceHolder` query modifier deals
   * with this for us.
   *
   * Every licence is always linked to a 'company' record. But if they are also linked to a 'contact' it takes
   * precedence when determining the licence holder name.
   *
   * @returns {(string|null)} `null` if this instance does not have the additional properties needed to determine the
   * licence holder else the licence holder's name
   */
  $licenceHolder() {
    // Extract the company and contact from the last licenceDocumentRole created. It is assumed that the
    // `licenceHolder` modifier has been used to get the additional records needed for this. It also ensures in the case
    // that there is more than one that they are ordered by their start date (DESC)
    const latestLicenceDocumentRole = this?.licenceDocument?.licenceDocumentRoles[0]

    if (!latestLicenceDocumentRole) {
      return null
    }

    const { company, contact } = latestLicenceDocumentRole

    if (contact) {
      return contact.$name()
    }

    return company.name
  }

  /**
   * Determine the licence name for the licence
   *
   * > We recommend adding the `licenceName` modifier to your query to ensure the joined records are available to
   * > determine this
   *
   * When an external user registers themselves as the 'primary user' for a licence (see {@link $primaryUser}) they can
   * choose to set a custom name for the licence.
   *
   * If set this is visible on the view licence page above the licence reference.
   *
   * So, you will only see a licence name if the licence is registered to a user and they have chosen to set a name.
   *
   * @returns {(string|null)} the licence name set by the primary user for the licence if the licence has one and the
   * additional properties needed to to determine it have been set, else `null`
   */
  $licenceName() {
    const licenceName = this?.licenceDocumentHeader?.licenceName

    return licenceName || null
  }

  /**
   * Determine who the primary user for the licence is
   *
   * > We recommend adding the `primaryUser` modifier to your query to ensure the joined records are available to
   * > determine this
   *
   * An external user with an account can register a licence via the external UI. The legacy service will generate a
   * letter with a code which gets sent to the licence's address. Once they receive it they can enter the code in the UI
   * and they then become the 'primary user' for it.
   *
   * Within the UI this what determines whether you see the "Registered to" link in the view licence page's top section.
   *
   * @returns {(module:UserModel|null)} the primary user if the licence has one and the additional properties needed to
   * to determine it have been set, else `null`
   */
  $primaryUser() {
    const primaryUser = this?.licenceDocumentHeader?.licenceEntityRole?.licenceEntity?.user

    return primaryUser || null
  }
}
