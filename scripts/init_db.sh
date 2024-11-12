#!/bin/bash
set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
	CREATE USER water_user SUPERUSER CREATEDB PASSWORD 'password';
	CREATE DATABASE wabs;
  CREATE DATABASE wabs_test;
  CREATE DATABASE wabs_node_test;
  CREATE DATABASE wabs_system_test;
  CREATE DATABASE charging_module;
	GRANT ALL PRIVILEGES ON DATABASE wabs TO water_user;
  GRANT ALL PRIVILEGES ON DATABASE wabs_test TO water_user;
  GRANT ALL PRIVILEGES ON DATABASE wabs_node_test TO water_user;
  GRANT ALL PRIVILEGES ON DATABASE wabs_system_test TO water_user;
  GRANT ALL PRIVILEGES ON DATABASE charging_module TO water_user;
EOSQL

PGPASSWORD=password psql -v ON_ERROR_STOP=1 --username "water_user" --dbname "wabs" <<-EOSQL
	CREATE EXTENSION "pgcrypto";
  CREATE SCHEMA IF NOT EXISTS "idm";
  CREATE SCHEMA IF NOT EXISTS "crm";
  CREATE SCHEMA IF NOT EXISTS "crm_v2";
  CREATE SCHEMA IF NOT EXISTS "import";
  CREATE SCHEMA IF NOT EXISTS "permit";
  CREATE SCHEMA IF NOT EXISTS "returns";
  CREATE SCHEMA IF NOT EXISTS "water";
  CREATE SCHEMA IF NOT EXISTS "water_import";
EOSQL
