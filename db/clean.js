import { clean, closeConnection } from '../test/support/database.js'

if (process.env.NODE_ENV !== 'test') {
  console.error('NODE_ENV is not set to test!')
  process.exit(1)
}

// NOTE: We have to close the knex instance after execution to avoid Node process hanging due to open connections
// https://knexjs.org/faq/recipes.html#node-instance-doesn-t-stop-after-using-knex
//
// To do this we have added a function to close the connection in database support
async function run() {
  console.log('Database clean for tests')

  try {
    await clean()
    console.log('Database cleaned')
  } catch (error) {
    console.log(error)
    process.exit(1)
  } finally {
    closeConnection()
    console.log('Database connection closed for cleaning')
  }
}

run()
