#!/bin/bash

# .envファイルから環境変数を読み込む
source .env

# CSVファイルのディレクトリ
CSV_DIR="/seed"

sleep 10 # 10秒待機

# 各CSVファイルに対して処理を行う
for CSV_FILE in $CSV_DIR/*.csv; do
    TABLE_NAME=$(basename $CSV_FILE .csv)

    # 既存のレコードを削除し、エラーが発生した場合は待機
    echo "テーブル $TABLE_NAME から既存のレコードを削除します。"
    until PGPASSWORD=$DB_PASS psql -h $DB_HOST -U $DB_USER -d $DB_NAME -c "DELETE FROM $TABLE_NAME;" &> /dev/null; do
        echo "DELETE コマンドでエラーが発生しました。再試行中..."
        sleep 5 # 5秒待機
    done
    echo "テーブル $TABLE_NAME からのレコード削除が完了しました。"

    # 新しいデータを挿入し、エラーが発生した場合は待機
    echo "テーブル $TABLE_NAME に新しいデータを挿入します。"
    until PGPASSWORD=$DB_PASS psql -h $DB_HOST -U $DB_USER -d $DB_NAME -c "\COPY $TABLE_NAME FROM '$CSV_FILE' DELIMITER ',' CSV HEADER;" &> /dev/null; do
        echo "\COPY コマンドでエラーが発生しました。再試行中..."
        sleep 5 # 5秒待機
    done
    echo "テーブル $TABLE_NAME へのデータ挿入が完了しました。"

done

