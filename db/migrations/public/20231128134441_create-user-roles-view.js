const viewName = 'user_roles'

export function up(knex) {
  return knex.schema.createView(viewName, (view) => {
    view.as(
      knex('user_roles')
        .withSchema('idm')
        .select([
          'user_roles.user_role_id AS id',
          'user_roles.user_id',
          'user_roles.role_id',
          'user_roles.date_created AS created_at',
          'user_roles.date_updated AS updated_at'
        ])
    )
  })
}

export function down(knex) {
  return knex.schema.dropViewIfExists(viewName)
}
