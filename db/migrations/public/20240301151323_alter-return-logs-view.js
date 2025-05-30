const viewName = 'return_logs'

export function up(knex) {
  return knex.schema.dropViewIfExists(viewName).createView(viewName, (view) => {
    // NOTE: We have commented out unused columns from the source table
    view.as(
      knex('returns').withSchema('returns').select([
        'return_id AS id',
        // 'regime', // always 'water'
        // 'licence_type', // always 'abstraction'
        'licence_ref',
        'start_date',
        'end_date',
        'returns_frequency',
        'status',
        // 'source', // always 'NALD'
        'metadata',
        'received_date',
        'return_requirement as return_reference',
        'due_date',
        'under_query',
        // 'under_query_comment',
        // 'is_test',
        // 'return_cycle_id' // is populated but links to a table that does not appear to be used
        'created_at',
        'updated_at'
      ])
    )
  })
}

export function down(knex) {
  return knex.schema.dropViewIfExists(viewName).createView(viewName, (view) => {
    // NOTE: We have commented out unused columns from the source table
    view.as(
      knex('returns').withSchema('returns').select([
        'return_id AS id',
        // 'regime', // always 'water'
        // 'licence_type', // always 'abstraction'
        'licence_ref',
        'start_date',
        'end_date',
        'returns_frequency',
        'status',
        // 'source', // always 'NALD'
        'metadata',
        'received_date',
        'return_requirement',
        'due_date',
        'under_query',
        // 'under_query_comment',
        // 'is_test',
        // 'return_cycle_id' // is populated but links to a table that does not appear to be used
        'created_at',
        'updated_at'
      ])
    )
  })
}
