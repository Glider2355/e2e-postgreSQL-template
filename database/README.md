# PostgreSQL

マイグレーションとデータのシード処理を含んだposgreSQLの環境です

## 処理の流れ

コンテナ起動は以下の流れで行われます

- posgreSQLのDBコンテナを立ち上げる
- `/changelog/sql` にあるSQLファイルをマイグレーションする
  - ファイル名イメージ: v20240101_create_users_table.sql
- 全てのテーブルをtrancateする
- `/seed` にあるCSVファイルをinsertする
  - CSVファイル名はテーブル名

## 環境構築

.envファイルを作成し、以下を設定してください

```env
POSTGRES_VERSION=15.2
CONTAINER_NAME=[DBのホスト]
DB_HOST=[DBのホスト]
DB_NAME=[DBの名前]
DB_USER=[DBのユーザー名]
DB_PASS=[DBのパスワード]
```

liquibase/liquibase.propertiesファイルを作成し、以下を設定してください

```liquibase.properties
url=jdbc:postgresql://[DBのホスト]:5432/[DBの名前]
username=[DBのユーザー名]
password=[DBのパスワード]
changeLogFile=/changelog/master.xml
```

以下を実行してください

```bash
docker compose up -d --build
```
