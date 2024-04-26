/**
 * Config values used to connect to PostgreSQL
 * @module DatabaseConfig
 */

// We import dotenv directly in each config file to support unit tests that depend on this subset of config.
// Importing dotenv in multiple places has no effect on the app when running for real.
import dotenv from 'dotenv'

dotenv.config()

const DatabaseConfig = {
  host: process.env.POSTGRES_HOST,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  port: process.env.POSTGRES_PORT,
  database: process.env.POSTGRES_DB,
  testDatabase: process.env.POSTGRES_DB_TEST,
  // Only used when seeding our dev/test user records
  defaultUserPassword: process.env.DEFAULT_USER_PASSWORD
}

export default DatabaseConfig
