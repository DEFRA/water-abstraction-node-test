const viewName = 'licence_version_purpose_condition_types'

export function up(knex) {
  return knex.schema.createView(viewName, (view) => {
    view.as(
      knex('licence_version_purpose_condition_types')
        .withSchema('water')
        .select([
          'licence_version_purpose_condition_type_id AS id',
          'code',
          'subcode',
          'description',
          'subcode_description',
          'display_title',
          'date_created AS created_at',
          'date_updated AS updated_at'
        ])
    )
  })
}

export function down(knex) {
  return knex.schema.dropViewIfExists(viewName)
}
