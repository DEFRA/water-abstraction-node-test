import { timestampForPostgres } from '../../app/lib/general.lib.js'
import { data as purposes } from './data/purposes.js'
import PurposeModel from '../../app/models/purpose.model.js'

export async function seed () {
  for (const purpose of purposes) {
    await _upsert(purpose)
  }
}

async function _upsert (purpose) {
  return PurposeModel.query()
    .insert({ ...purpose, updatedAt: timestampForPostgres() })
    .onConflict('legacyId')
    .merge(['description', 'lossFactor', 'twoPartTariff', 'updatedAt'])
}
