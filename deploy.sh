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
    --exclude "*.md"

# HTML com cache curto, para atualizações chegarem ao navegador
aws s3 cp index.html "s3://$S3_BUCKET/index.html" \
    --profile "$AWS_PROFILE" \
    --content-type "text/html; charset=utf-8" \
    --cache-control "max-age=300,public"

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
echo -e "   → https://d3a3ppc5bujjy3.cloudfront.net (temporário)"
echo -e "   → https://headlinelatam.com (após validar DNS)"
