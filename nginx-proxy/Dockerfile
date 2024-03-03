# 基本イメージ
FROM nginx:latest

# cronのインストールとタイムゾーン設定
RUN apt-get update && apt-get install -y cron openssl gettext-base\
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/* \
    && ln -snf /usr/share/zoneinfo/Asia/Tokyo /etc/localtime \
    && echo Asia/Tokyo > /etc/timezone

# .envファイルをコンテナにコピー
COPY .env /

# cronジョブの設定
COPY ./proxy/crontab /crontab
COPY ./proxy/bin /bin
RUN chmod +x /bin/*

# default.conf.template をコンテナにコピー
COPY ./proxy/etc/nginx/conf.d/default.conf.template /etc/nginx/conf.d/default.conf.template

# コンテナ立ち上げ時に秘密鍵を生成、更新する
ENTRYPOINT [ "./bin/entrypoint.sh" ]
