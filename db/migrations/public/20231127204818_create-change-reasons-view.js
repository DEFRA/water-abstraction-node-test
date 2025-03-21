const viewName = 'change_reasons'

export function up(knex) {
  return knex.schema.createView(viewName, (view) => {
    view.as(
      knex('change_reasons')
        .withSchema('water')
        .select([
          'change_reason_id AS id',
          'description',
          'triggers_minimum_charge',
          'type',
          'is_enabled_for_new_charge_versions AS enabled_for_new_charge_versions',
          'date_created AS created_at',
          'date_updated AS updated_at'
        ])
    )
  })
}

export function down(knex) {
  return knex.schema.dropViewIfExists(viewName)
}
