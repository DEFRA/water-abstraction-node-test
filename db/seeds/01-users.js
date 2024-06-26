import bcrypt from 'bcryptjs'

import { generateUUID } from '../../app/lib/general.lib.js'

import DatabaseConfig from '../../config/database.config.js'

const seedUsers = [
  {
    userName: 'admin-internal@wrls.gov.uk',
    application: 'water_admin',
    group: 'super'
  },
  {
    userName: 'super.user@wrls.gov.uk',
    application: 'water_admin',
    group: 'super'
  },
  {
    userName: 'environment.officer@wrls.gov.uk',
    application: 'water_admin',
    group: 'environment_officer'
  },
  {
    userName: 'waster.industry.regulatory.services@wrls.gov.uk',
    application: 'water_admin',
    group: 'wirs'
  },
  {
    userName: 'billing.data@wrls.gov.uk',
    application: 'water_admin',
    group: 'billing_and_data'
  },
  {
    userName: 'permitting.support.centre@wrls.gov.uk',
    application: 'water_admin',
    group: 'psc'
  },
  {
    userName: 'external@example.co.uk',
    application: 'water_vml'
  },
  {
    userName: 'jon.lee@example.co.uk',
    application: 'water_vml'
  },
  {
    userName: 'rachel.stevens@example.co.uk',
    application: 'water_vml'
  }
]

export async function seed (knex) {
  await _insertUsersWhereNotExists(knex)

  await _updateSeedUsersWithUserIdAndGroupId(knex)

  await _insertUserGroupsWhereNotExists(knex)
}

function _generateHashedPassword () {
  // 10 is the number of salt rounds to perform to generate the salt. The legacy code uses
  // const salt = bcrypt.genSaltSync(10) to pre-generate the salt before passing it to hashSync(). But this is
  // intended for operations where you need to hash a large number of values. If you just pass in a number bcrypt will
  // autogenerate the salt for you.
  // https://github.com/kelektiv/node.bcrypt.js#usage
  return bcrypt.hashSync(DatabaseConfig.defaultUserPassword, 10)
}

async function _groups (knex) {
  return knex('idm.groups')
    .select('groupId', 'group')
}

async function _insertUsersWhereNotExists (knex) {
  const password = _generateHashedPassword()

  for (const seedUser of seedUsers) {
    const existingUser = await knex('idm.users')
      .first('userId')
      .where('userName', seedUser.userName)
      .andWhere('application', seedUser.application)

    if (!existingUser) {
      await knex('idm.users')
        .insert({
          userName: seedUser.userName,
          application: seedUser.application,
          password,
          userData: '{ "source": "Seeded" }',
          resetRequired: 0,
          badLogins: 0
        })
    }
  }
}

async function _insertUserGroupsWhereNotExists (knex) {
  const seedUsersWithGroups = seedUsers.filter((seedData) => seedData.group)

  for (const seedUser of seedUsersWithGroups) {
    const existingUserGroup = await knex('idm.userGroups')
      .select('userGroupId')
      .where('userId', seedUser.userId)
      .andWhere('groupId', seedUser.groupId)

    if (!existingUserGroup) {
      await knex('idm.userGroups')
        .insert({
          userGroupId: generateUUID(),
          userId: seedUser.userId,
          groupId: seedUser.groupId
        })
    }
  }
}

async function _updateSeedUsersWithUserIdAndGroupId (knex) {
  const users = await _users(knex)
  const groups = await _groups(knex)

  seedUsers.forEach((seedUser) => {
    const user = users.find(({ userName }) => userName === seedUser.userName)
    seedUser.userId = user.userId

    if (seedUser.group) {
      const userGroup = groups.find(({ group }) => group === seedUser.group)
      seedUser.groupId = userGroup.groupId
    }
  })
}

async function _users (knex) {
  return knex('idm.users')
    .select('userId', 'userName')
    .whereJsonPath('userData', '$.source', '=', 'Seeded')
}
