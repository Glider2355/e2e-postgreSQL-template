#!/bin/sh

# .envファイルからコメントを除外して環境変数を読み込む
export $(grep -v '^#' /.env | xargs)

# 秘密鍵のファイルパス
KEY_PATH="/etc/nginx/ticket-keys/ticket.key"

# 秘密鍵が存在しない、または更新が必要な場合
if [ ! -f "$KEY_PATH" ]; then
    echo "秘密鍵が存在しません。新規作成します。"
else
    echo "秘密鍵が存在します。新しいキーで更新します。"
fi

# 新しい秘密鍵を生成
openssl rand -out $KEY_PATH 80

# cronをバックグラウンドで実行
cron -f &

# /etc/nginx/conf.d/default.conf.template から /etc/nginx/conf.d/default.conf を生成
envsubst '$$DOMAIN $$BACKEND_CONTAINER_NAME $$BACKEND_PORT $$FRONTEND_CONTAINER_NAME $$FRONTEND_PORT $$KEYCLOAK_CONTAINER_NAME $$KEYCLOAK_PORT $$REALM_NAME $$CLIENT_ID $$KEYCLOAK_REDIRECT_URI' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf

# Nginxをフォアグラウンドで実行
nginx -g 'daemon off;'
