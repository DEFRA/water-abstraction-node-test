import { timestampForPostgres } from '../../app/lib/general.lib.js'
import { data as secondaryPurposes } from './data/secondary-purposes.js'
import SecondaryPurposeModel from '../../app/models/secondary-purpose.model.js'

export async function seed() {
  for (const purpose of secondaryPurposes) {
    await _upsert(purpose)
  }
}

async function _upsert(secondaryPurpose) {
  return SecondaryPurposeModel.query()
    .insert({ ...secondaryPurpose, updatedAt: timestampForPostgres() })
    .onConflict('legacyId')
    .merge(['description', 'updatedAt'])
}
