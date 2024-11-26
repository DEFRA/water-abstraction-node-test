import { timestampForPostgres } from '../../app/lib/general.lib.js'
import { data as primaryPurposes } from './data/primary-purposes.js'
import PrimaryPurposeModel from '../../app/models/primary-purpose.model.js'

export async function seed() {
  for (const purpose of primaryPurposes) {
    await _upsert(purpose)
  }
}

async function _upsert(primaryPurpose) {
  return PrimaryPurposeModel.query()
    .insert({ ...primaryPurpose, updatedAt: timestampForPostgres() })
    .onConflict('legacyId')
    .merge(['description', 'updatedAt'])
}
