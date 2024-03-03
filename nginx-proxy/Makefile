# 自己署名証明書を生成するためのMakefile
DOMAIN ?= $(shell grep DOMAIN .env | cut -d '=' -f2)
CERT_DIR ?= ./proxy/etc/letsencrypt/live/$(DOMAIN)
KEY_FILE := ${CERT_DIR}/privkey.pem
CERT_FILE := ${CERT_DIR}/fullchain.pem

.PHONY: certs clean

certs: $(KEY_FILE) $(CERT_FILE)

$(KEY_FILE) $(CERT_FILE):
	@echo "$(DOMAIN)で自己署名証明書を作成します"
	mkdir -p $(CERT_DIR)
	openssl req -x509 -nodes -days 99999 -newkey rsa:2048 \
		-keyout $(KEY_FILE) -out $(CERT_FILE) \
		-subj "/C=JP/ST=東京都/L=渋谷区/O=dev/CN=$(DOMAIN)"
	@echo "$(CERT_DIR)に自己署名証明書を作成しました"

clean:
	@echo "自己署名証明書を削除します"
	rm -f $(KEY_FILE) $(CERT_FILE)
	@echo "削除しました"
