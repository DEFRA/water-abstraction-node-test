/**
 * Model for roles (idm.roles)
 * @module RoleModel
 */

import { Model } from 'objection'

import BaseModel from './base.model.js'

import GroupRoleModel from './group-role.model.js'
import GroupModel from './group.model.js'
import UserRoleMode from './user-role.model.js'
import UserModel from './user.model.js'

export default class RoleModel extends BaseModel {
  static get tableName() {
    return 'roles'
  }

  static get relationMappings() {
    return {
      groupRoles: {
        relation: Model.HasManyRelation,
        modelClass: GroupRoleModel,
        join: {
          from: 'roles.id',
          to: 'groupRoles.roleId'
        }
      },
      groups: {
        relation: Model.ManyToManyRelation,
        modelClass: GroupModel,
        join: {
          from: 'roles.id',
          through: {
            from: 'groupRoles.roleId',
            to: 'groupRoles.groupId'
          },
          to: 'groups.id'
        }
      },
      userRoles: {
        relation: Model.HasManyRelation,
        modelClass: UserRoleMode,
        join: {
          from: 'roles.id',
          to: 'userRoles.roleId'
        }
      },
      users: {
        relation: Model.ManyToManyRelation,
        modelClass: UserModel,
        join: {
          from: 'roles.id',
          through: {
            from: 'userRoles.roleId',
            to: 'userRoles.userId'
          },
          to: 'users.id'
        }
      }
    }
  }
}
