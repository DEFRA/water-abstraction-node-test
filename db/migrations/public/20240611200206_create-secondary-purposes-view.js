const viewName = 'secondary_purposes'

export function up (knex) {
  return knex
    .schema
    .createView(viewName, (view) => {
      // NOTE: We have commented out unused columns from the source table
      view.as(knex('purposes_secondary').withSchema('water').select([
        'purpose_secondary_id AS id',
        'legacy_id',
        'description',
        // 'is_test',
        'date_created AS created_at',
        'date_updated AS updated_at'
      ]))
    })
}

export function down (knex) {
  return knex
    .schema
    .dropViewIfExists(viewName)
}