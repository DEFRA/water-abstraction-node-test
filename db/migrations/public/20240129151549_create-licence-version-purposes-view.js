const viewName = 'licence_version_purposes'

export function up(knex) {
  return knex.schema.createView(viewName, (view) => {
    // NOTE: We have commented out unused columns from the source table
    view.as(
      knex('licence_version_purposes').withSchema('water').select([
        'licence_version_purpose_id AS id',
        'licence_version_id',
        'purpose_primary_id',
        'purpose_secondary_id',
        'purpose_use_id AS purpose_id',
        'abstraction_period_start_day',
        'abstraction_period_start_month',
        'abstraction_period_end_day',
        'abstraction_period_end_month',
        'time_limited_start_date',
        'time_limited_end_date',
        'notes',
        'annual_quantity',
        'external_id',
        // 'is_test ',
        'date_created AS created_at',
        'date_updated AS updated_at'
      ])
    )
  })
}

export function down(knex) {
  return knex.schema.dropViewIfExists(viewName)
}
