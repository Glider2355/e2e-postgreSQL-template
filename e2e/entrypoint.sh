#!/bin/bash

export PGPASSWORD=$DB_PASS
chmod 777 backup

# データベースのバックアップ（出力を抑制）
pg_dump -h $DB_HOST -U $DB_USER -d $DB_DATABASE > backup/db_backup.sql 2> /dev/null

# すべてのテーブルをTRUNCATEする（出力を抑制）
psql -h $DB_HOST -U $DB_USER -d $DB_DATABASE -c "
SELECT
    'TRUNCATE TABLE ' || ARRAY_TO_STRING(ARRAY_AGG(relname), ',') || ';' AS query
FROM
    pg_stat_user_tables;
" > /dev/null 2>&1

# Gaugeテストの実行
if [ -z "${TEST_FILE}" ]; then
  echo "Running all tests."
  gauge run specs
else
  echo "Running specified test file: ${TEST_FILE}"
  gauge run "${TEST_FILE}"
fi

# すべてのテーブルを削除する（出力を抑制）
psql -h $DB_HOST -U $DB_USER -d $DB_DATABASE -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;" > /dev/null 2>&1

# バックアップからのデータベース復元（出力を抑制）
psql -h $DB_HOST -U $DB_USER -d $DB_DATABASE < backup/db_backup.sql > /dev/null 2>&1
