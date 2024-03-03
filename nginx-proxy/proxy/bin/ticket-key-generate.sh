#!/bin/sh

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

# Nginxをリロードして新しいキーを適用
nginx -s reload
