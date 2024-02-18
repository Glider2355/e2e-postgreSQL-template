# Node.jsの公式イメージをベースにする
FROM node:20

# 必要なパッケージをインストール
RUN apt-get update && apt-get install -y postgresql-client && rm -rf /var/lib/apt/lists/*

# gaugeインストール
RUN curl -Ssl https://downloads.gauge.org/stable | sh

# 作業ディレクトリを設定
WORKDIR /app

# package.jsonとpackage-lock.jsonをコピー
COPY package*.json ./

# プロジェクトの依存関係をインストール
RUN npm cache clean --force
RUN npm install -g npm
RUN npm install

# Playwrightのブラウザをインストール
RUN npx playwright install

# プロジェクトのソースコードをコピー
COPY . .

# entrypoint.shに実行権限を付与し、コピー
COPY entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh

ENTRYPOINT ["/app/entrypoint.sh"]
CMD ["specs"]
