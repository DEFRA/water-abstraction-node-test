#!/bin/bash

# Helper that deals with initial install of packages and run of DB migrations for an app
#
# Only runs if the node_modules folder is empty for the selected repo. Migration commands need to be passed in because
# they are not consistently named in the package.json files
#
# Params
# $1 name of repo to check if build is needed
# $2 migration command for the main DB
# $3 migration command for the test DB
function initial_build {
  app_dir=/home
  modules_dir=/home/node_modules

  # Check the repo doesn't already exist. If it doesn't run npm ci
  if [[ ! -d $modules_dir ]]; then
    echo "-- Running npm ci for ${1} --"
    cd $app_dir
    npm ci

    # Check to see if migrations should be run
    # [[ -n STRING]] The length of STRING is greater than zero.
    if [[ -n $2 ]]; then
      echo "-- Running npm ${2} for ${1} --"
      npm run $2
      # IMPORTANT! This is here for the tactical-idm. This is due to an error in the migrations.
      # https://github.com/DEFRA/water-abstraction-tactical-idm/blob/develop/migrations/sqls/20190729144004-user-groups-up.sql
      # adds the pgcrypto extension to PostgreSQL. It's needed for its gen_random_uuid() function. But because it
      # doesn't specify a schema, it gets added only to the IDM schema. A later migration was then added.
      # https://github.com/DEFRA/water-abstraction-tactical-idm/blob/develop/migrations/sqls/20190827110406-alter-pgcryto-extension-schema-up.sql
      # to enable it to be used by all schemas by updating its schema to `public`. This is fine when you are just
      # dealing with the IDM service. That is why migrations run fine in its CI. But when you build an environment we
      # have other projects that have to run their migrations first (because some projects skip using HTTP requests and
      # instead just query other services DB's directly!) and those other projects also depend on pgcrypto being
      # installed and in the `public` schema. So, 20190729144004-user-groups-up.sql `CREATE EXTENSION` call gets ignored
      # because the extension does exist. But then the `gen_random_uuid()` calls in the same script fail because the
      # fully qualified name has not been used (`public.gen_random_uuid()`).
      #
      # The end result is we have found if you run the migrations for a second time, it works!
      if [[ $? != 0 ]]; then
        echo "-- Re-running npm ${2} for ${1} --"
        npm run $2
      fi
    fi
    # Check to see if test migrations should be run
    if [[ -n $3 ]]; then
      echo "-- Running npm ${3} for ${1} --"
      npm run $3
    fi
    printf "\n\n"
  fi
}

# Project repos that are the various micro-services that make up the Water Abstraction 'service'
#
# IMPORTANT!
#
# The order the migrations are run matters though please don't ask why :-(
#
# Also, once the migrations have run during the first `docker compose up` it's on users of the environment to maintain
# them. If a repo changes you can visit it within dev and manually run `npm run migrate`. Or use the Migrations VSCode
# task which runs them for all repos and includes test DBs
initial_build water-abstraction-node-test '' migrate:test

cd /home

# Then exec the container's main process (what's set as CMD in the Dockerfile).
exec "$@"
