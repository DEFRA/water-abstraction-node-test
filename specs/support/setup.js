import { clean } from './database.js'

// NOTE: We have to close the knex instance after execution to avoid Node process hanging due to open connections
// https://knexjs.org/faq/recipes.html#node-instance-doesn-t-stop-after-using-knex
//
// To do this we have our DatabaseSupport return 'db' from `clean()`. 'db'' is the knex instance so we can ensure we
// close it in our finally
async function run () {
  let connection

  try {
    connection = await clean()
  } catch (error) {
    process.exit(1)
  } finally {
    if (connection) {
      connection.destroy()
    }
  }
}

run()
