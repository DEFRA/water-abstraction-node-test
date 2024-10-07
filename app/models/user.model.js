/**
 * Model for users (idm.users)
 * @module UserModel
 */

import Bcrypt from 'bcryptjs'
import { Model } from 'objection'

import BaseModel from './base.model.js'

import ChargeVersionNoteModel from './charge-version-note.model.js'
import GroupModel from './group.model.js'
import LicenceEntityModel from './licence-entity.model.js'
import ReturnVersionModel from './return-version.model.js'
import RoleModel from './role.model.js'
import UserGroupModel from './user-group.model.js'
import UserRoleModel from './user-role.model.js'

export default class UserModel extends BaseModel {
  static get tableName () {
    return 'users'
  }

  static get relationMappings () {
    return {
      chargeVersionNotes: {
        relation: Model.HasManyRelation,
        modelClass: ChargeVersionNoteModel,
        join: {
          from: 'users.id',
          to: 'chargeVersionNotes.userId'
        }
      },
      groups: {
        relation: Model.ManyToManyRelation,
        modelClass: GroupModel,
        join: {
          from: 'users.id',
          through: {
            from: 'userGroups.userId',
            to: 'userGroups.groupId'
          },
          to: 'groups.id'
        }
      },
      licenceEntity: {
        relation: Model.HasOneRelation,
        modelClass: LicenceEntityModel,
        join: {
          from: 'users.licenceEntityId',
          to: 'licenceEntities.id'
        }
      },
      returnVersions: {
        relation: Model.HasManyRelation,
        modelClass: ReturnVersionModel,
        join: {
          from: 'users.id',
          to: 'returnVersions.createdBy'
        }
      },
      roles: {
        relation: Model.ManyToManyRelation,
        modelClass: RoleModel,
        join: {
          from: 'users.id',
          through: {
            from: 'userRoles.userId',
            to: 'userRoles.roleId'
          },
          to: 'roles.id'
        }
      },
      userGroups: {
        relation: Model.HasManyRelation,
        modelClass: UserGroupModel,
        join: {
          from: 'users.id',
          to: 'userGroups.userId'
        }
      },
      userRoles: {
        relation: Model.HasManyRelation,
        modelClass: UserRoleModel,
        join: {
          from: 'users.id',
          to: 'userRoles.userId'
        }
      }
    }
  }

  static generateHashedPassword (password) {
    // 10 is the number of salt rounds to perform to generate the salt. The legacy code uses
    // const salt = bcrypt.genSaltSync(10) to pre-generate the salt before passing it to hashSync(). But this is
    // intended for operations where you need to hash a large number of values. If you just pass in a number bcrypt will
    // autogenerate the salt for you.
    // https://github.com/kelektiv/node.bcrypt.js#usage
    return Bcrypt.hashSync(password, 10)
  }
}
