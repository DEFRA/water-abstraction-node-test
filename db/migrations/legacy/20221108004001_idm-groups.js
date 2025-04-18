const tableName = 'groups'

export function up(knex) {
  return knex.schema.withSchema('idm').createTable(tableName, (table) => {
    // Primary Key
    table.string('group_id').primary().notNullable()

    // Data
    table.string('application')
    table.string('group').notNullable()
    table.string('description').notNullable()

    // Legacy timestamps
    table.timestamp('date_created', { useTz: false }).notNullable().defaultTo(knex.fn.now())
    table.timestamp('date_updated', { useTz: false }).notNullable().defaultTo(knex.fn.now())

    // Constraints
    table.unique(['application', 'group'], { useConstraint: true })
  })
}

export function down(knex) {
  return knex.schema.withSchema('idm').dropTableIfExists(tableName)
}
