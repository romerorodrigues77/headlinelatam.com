#!/bin/bash

# Deploy script para headlinelatam.com
# Uso: ./deploy.sh [caminho_da_pasta]

set -e

# Configurações
S3_BUCKET="headlinelatam.com"
CLOUDFRONT_ID="E4NSQMSB8LK1Y"
AWS_PROFILE="romero"
SOURCE_DIR="${1:-.}"

# Cores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Iniciando deploy para $S3_BUCKET${NC}"

# Verifica se a pasta existe
if [ ! -d "$SOURCE_DIR" ]; then
    echo -e "${RED}❌ Erro: Pasta '$SOURCE_DIR' não encontrada${NC}"
    exit 1
fi

# Sincroniza com S3
echo -e "${BLUE}📦 Fazendo upload para S3...${NC}"
aws s3 sync "$SOURCE_DIR" "s3://$S3_BUCKET/" \
    --delete \
    --profile "$AWS_PROFILE" \
    --cache-control "max-age=31536000,public" \
    --exclude ".git/*" \
    --exclude ".gitignore" \
    --exclude "node_modules/*" \
    --exclude ".env*" \
    --exclude "*.md" \
    --exclude ".claude/*" \
    --exclude "infra/*" \
    --exclude "*.sh"

# Arquivos que mudam com frequência: cache curto e content-type explícito
short_cache() { # arquivo content-type
    [ -f "$SOURCE_DIR/$1" ] || return 0
    aws s3 cp "$SOURCE_DIR/$1" "s3://$S3_BUCKET/$1" \
        --profile "$AWS_PROFILE" \
        --content-type "$2" \
        --cache-control "max-age=300,public" > /dev/null
}
short_cache index.html "text/html; charset=utf-8"
short_cache 404.html "text/html; charset=utf-8"
short_cache sitemap.xml "application/xml; charset=utf-8"
short_cache robots.txt "text/plain; charset=utf-8"
short_cache llms.txt "text/plain; charset=utf-8"
short_cache site.webmanifest "application/manifest+json"

echo -e "${GREEN}✓ Upload concluído${NC}"

# Invalida cache do CloudFront
echo -e "${BLUE}🔄 Invalidando cache CloudFront...${NC}"
aws cloudfront create-invalidation \
    --distribution-id "$CLOUDFRONT_ID" \
    --paths "/*" \
    --profile "$AWS_PROFILE" > /dev/null

echo -e "${GREEN}✓ Cache invalidado${NC}"

# Status final
echo ""
echo -e "${GREEN}✅ Deploy concluído com sucesso!${NC}"
echo ""
echo -e "📍 Site disponível em:"
echo -e "   → https://headlinelatam.com"
echo -e "   → https://d3a3ppc5bujjy3.cloudfront.net (preview, com noindex)"
