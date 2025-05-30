import { timestampForPostgres } from '../../app/lib/general.lib.js'
import { data as licenceRoles } from './data/licence-roles.js'
import LicenceRoleModel from '../../app/models/licence-role.model.js'

export async function seed() {
  for (const licenceRole of licenceRoles) {
    const exists = await _exists(licenceRole)

    if (exists) {
      await _update(licenceRole)
    } else {
      await _insert(licenceRole)
    }
  }
}

async function _exists(licenceRole) {
  const { label, name } = licenceRole

  const result = await LicenceRoleModel.query()
    .select('id')
    .where('name', name)
    .andWhere('label', label)
    .limit(1)
    .first()

  return !!result
}

async function _insert(licenceRole) {
  return LicenceRoleModel.query().insert(licenceRole)
}

async function _update(licenceRole) {
  const { label, name } = licenceRole

  return LicenceRoleModel.query()
    .patch({ label, name, updatedAt: timestampForPostgres() })
    .where('name', name)
    .andWhere('label', label)
}
