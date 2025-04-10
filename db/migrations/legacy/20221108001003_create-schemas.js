export function up(knex) {
  return knex.raw(`
    CREATE SCHEMA IF NOT EXISTS "crm";
    CREATE SCHEMA IF NOT EXISTS "crm_v2";
    CREATE SCHEMA IF NOT EXISTS "idm";
    CREATE SCHEMA IF NOT EXISTS "permit";
    CREATE SCHEMA IF NOT EXISTS "returns";
    CREATE SCHEMA IF NOT EXISTS "water";
  `)
}

export function down(knex) {
  return knex.raw(`
    DROP SCHEMA IF EXISTS "water";
    DROP SCHEMA IF EXISTS "returns";
    DROP SCHEMA IF EXISTS "permit";
    DROP SCHEMA IF EXISTS "idm";
    DROP SCHEMA IF EXISTS "crm_v2";
    DROP SCHEMA IF EXISTS "crm";
  `)
}
