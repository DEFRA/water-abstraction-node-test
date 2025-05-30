const viewName = 'charge_version_notes'

export function up(knex) {
  return knex.schema.dropViewIfExists(viewName).createView(viewName, (view) => {
    // NOTE: We have commented out unused columns from the source table
    view.as(
      knex('notes').withSchema('water').select([
        'note_id AS id',
        'text AS note',
        // 'type',
        // 'type_id',
        'user_id',
        // 'licence_id',
        'date_created AS created_at',
        'date_updated AS updated_at'
      ])
    )
  })
}

export function down(knex) {
  return knex.schema.dropViewIfExists(viewName)
}
