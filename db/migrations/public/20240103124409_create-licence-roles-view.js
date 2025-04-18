const viewName = 'licence_roles'

export function up(knex) {
  return knex.schema.createView(viewName, (view) => {
    view.as(
      knex('roles')
        .withSchema('crm_v2')
        .select(['role_id AS id', 'name', 'label', 'date_created AS created_at', 'date_updated AS updated_at'])
    )
  })
}

export function down(knex) {
  return knex.schema.dropViewIfExists(viewName)
}
