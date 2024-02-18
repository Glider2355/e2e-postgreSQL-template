#!/bin/bash

# 引数チェック
if [ "$#" -ne 1 ]; then
    echo "Usage: $0 <ApiSubDirectoryName>"
    exit 1
fi

# ベースディレクトリパスの設定
BASE_DIR="specs/web/$1"
SPEC_DIR="${BASE_DIR}"
SETUP_DIR="${BASE_DIR}/setup"

# Spec ファイルと CSV ファイルの名前をディレクトリ名から決定
BASE_NAME=$(basename "$BASE_DIR")
SPEC_FILE="${SPEC_DIR}/${BASE_NAME}.spec"

# Spec ディレクトリの作成
if [ ! -d "$SPEC_DIR" ]; then
    mkdir -p "$SPEC_DIR"
    echo "Created directory: $SPEC_DIR"
fi

# Setup ディレクトリの作成
if [ ! -d "$SETUP_DIR" ]; then
    mkdir -p "$SETUP_DIR"
    echo "Created directory: $SETUP_DIR"
fi


# Spec ファイルの作成
if [ ! -f "$SPEC_FILE" ]; then
    cat <<EOF > "$SPEC_FILE"
# ${BASE_NAME}
tags: web

"$SPEC_FILE" のテスト実行準備をする

## シナリオ名

* ステップ1
* ステップ2
EOF
    echo "Created spec file: $SPEC_FILE"
else
    echo "Spec file already exists: $SPEC_FILE"
fi
