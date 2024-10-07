import { timestampForPostgres } from '../../app/lib/general.lib.js'
import { data as returnCycles } from './data/return-cycles.js'
import ReturnCycleModel from '../../app/models/return-cycle.model.js'

export async function seed () {
  for (const cycle of returnCycles) {
    await _upsert(cycle)
  }
}

async function _upsert (cycle) {
  return ReturnCycleModel.query()
    .insert({ ...cycle, createdAt: timestampForPostgres(), updatedAt: timestampForPostgres() })
}
