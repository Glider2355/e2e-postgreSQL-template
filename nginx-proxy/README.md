# プロキシサーバー

.envを作成して以下を設定する

```
# devまたはprod指定
ENVIRONMENT=dev

# prodの場合は、以下の内容でLet's Encryptを利用する
# devでは、Makefileから自己証明書を作成する
DOMAIN=test.local
EMAIL=youremail@example.com

# バックエンドのコンテナ名とport番号
BACKEND_CONTAINER_NAME=backend
BACKEND_PORT=8000

# フロントエンドのコンテナ名とport番号
FRONTEND_CONTAINER_NAME=app
FRONTEND_PORT=3000

# minioの設定
MINIO_ACCESS_KEY=minio
MINIO_SECRET_KEY=minio123

# newRelicの設定
NEW_RELIC_LICENSE_KEY=123

# keycloakの設定
KEYCLOAK_USER=admin
KEYCLOAK_PASSWORD=password
KEYCLOAK_DB_PASSWORD=password
```

以下のコマンドで自己証明書を作成する

```
make certs
```

localの場合は以下で起動

```
docker compose up -d
```

本番環境の場合は以下で起動

```
docker compose -f dokcer-compose.yaml -f docker-compose.prod.yaml up -d
```

## 自己証明書を登録する
proxy/etc/letsencrypt/liveにあるfullchain.pemをキーチェーンアクセスで「常に信頼」を設定する
etc/hostsにドメインを設定する

## 参考
以下の内容を下に設定しました
https://ssl-config.mozilla.org/#server=nginx&version=1.17.7&config=modern&openssl=1.1.1k&guideline=5.7
