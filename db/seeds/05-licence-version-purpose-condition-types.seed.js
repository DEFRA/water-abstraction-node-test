import { timestampForPostgres } from '../../app/lib/general.lib.js'
import { data as licenceVersionPurposeConditionTypes } from './data/licence-version-purpose-condition-types.js'
import LicenceVersionPurposeConditionTypeModel from '../../app/models/licence-version-purpose-condition-type.model.js'

export async function seed() {
  for (const licenceVersionPurposeConditionType of licenceVersionPurposeConditionTypes) {
    await _upsert(licenceVersionPurposeConditionType)
  }
}

async function _upsert(licenceVersionPurposeConditionType) {
  return LicenceVersionPurposeConditionTypeModel.query()
    .insert({ ...licenceVersionPurposeConditionType, updatedAt: timestampForPostgres() })
    .onConflict(['code', 'subcode'])
    .merge(['description', 'displayTitle', 'subcodeDescription', 'updatedAt'])
}
