# e2eテスト(gauge + playwright)

## 処理の流れ

PostgreSQLを想定したgauge + playwright + typescriptのe2eテスト環境です  
テスト実行は以下の流れで実行されます

- DBバックアップを取る
- 全てのテーブルをtrancateする
- テスト実行
- DBをバックアップを下に復元

## フォルダ構成

- `/backup` : テスト実行前のDBのバックアップを格納
- `/bin` : specファイルのテンプレートを作成するシェルスクリプトを格納
- `/specs` : テストデータ、期待値、specファイルを格納
- `/tests` : 実行するテストのstepを格納

## 環境構築

.envファイルを作成し、以下を設定してください

```env
DB_HOST=[DBのホスト]
DB_DATABASE=[DBの名前]
DB_USER=[DBのユーザー名]
DB_PASS=[DBのパスワード]
DB_PORT=[DBのポート番号]
BACKEND_URL=[テスト対象のAPIのホストURL]

dockerDesktopかつ、localhostの場合は以下を設定する
BACKEND_URL=http://host.docker.internal:[ポート番号]
```

以下を実行してください

```bash
make setup
```

## テスト実行

以下のコマンドで実行してください

```bash
# TEST_FILEを指定しない場合、一括で実行されます
TEST_FILE=specs/api/sample/sample.spec docker-compose up
```

## テスト作成方法

### APIテスト作成方法

以下を実行してspecファイルを作成してください

```bash
# sampleは /specs/api以降のフォルダパス
./bin/create_api_spec.sh sample
```

以下が生成されます

- `/expect` : 期待値をjsonファイルで格納
- `/setup` : テストデータをCSVで格納
  - CSVファイル名はテーブル名とする
  - CSVの１行目はテーブルのカラム名
  - カンマ区切り
- `sample.spec` : テスト内容を記載

### WEBテスト作成方法

```bash
# sampleは /specs/api以降のフォルダパス
./bin/create_web_spec.sh sample
```

以下が生成されます

- `/setup` : テストデータをCSVで格納
  - CSVファイル名はテーブル名とする
  - CSVの１行目はテーブルのカラム名
  - カンマ区切り
- `sample.spec` : テスト内容を記載
