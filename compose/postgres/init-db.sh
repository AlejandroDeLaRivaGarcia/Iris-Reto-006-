#!/bin/bash
set -e

psql -v ON_ERROR_STOP=1 --username "midas" --dbname "postgresql" <<-EOSQL
    CREATE DATABASE evolution;
    GRANT ALL PRIVILEGES ON DATABASE evolution TO midas;
EOSQL
