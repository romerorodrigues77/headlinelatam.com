# AWS Setup - headlinelatam.com

Site estático (HTML puro) servido por **S3 + CloudFront**, com DNS no **Route 53**. O domínio continua registrado na **GoDaddy**, só os nameservers apontam para a AWS.

Conta AWS `160184161667`, profile local `romero`.

```
visitante → Route 53 (ALIAS) → CloudFront E4NSQMSB8LK1Y → S3 headlinelatam.com (privado, via OAC)
```

---

## 🧱 Recursos

### 1. **S3 Bucket**
- **Nome:** `headlinelatam.com` (`us-east-1`)
- **Acesso:** privado (Block Public Access ligado). Só a CloudFront lê, via Origin Access Control `EWDL38QSVWQ5`.
- **Bucket policy:** [infra/s3-bucket-policy.json](infra/s3-bucket-policy.json)

### 2. **CloudFront Distribution**
- **ID:** `E4NSQMSB8LK1Y`
- **Domínio padrão:** `d3a3ppc5bujjy3.cloudfront.net` (preview, recebe `x-robots-tag: noindex`)
- **Aliases:** `headlinelatam.com`, `www.headlinelatam.com`
- **HTTP → HTTPS:** redirect automático
- **Default root object:** `index.html`
- **Erros 403/404:** servem `/404.html` com status 404
- **CloudFront Functions:**
  - `headlinelatam-edge-request` (viewer-request) → [infra/edge-request.js](infra/edge-request.js): `www` e outros hosts redirecionam (301) para `https://headlinelatam.com`, `/index.html` vira `/`, e URLs de diretório servem o `index.html`.
  - `headlinelatam-edge-response` (viewer-response) → [infra/edge-response.js](infra/edge-response.js): `noindex` no host `*.cloudfront.net`.

### 3. **Certificado SSL (ACM)**
- **ARN:** `arn:aws:acm:us-east-1:160184161667:certificate/abc66ab0-1868-400c-82f6-9bcecbd2a7c1`
- **Domínios:** `headlinelatam.com`, `www.headlinelatam.com`
- **Status:** ✅ ISSUED, validado por DNS. A renovação é automática enquanto os CNAMEs de validação existirem no Route 53.
- **TLS mínimo:** `TLSv1.2_2021`, SNI

### 4. **DNS (Route 53)**
- **Hosted zone:** `Z0269845L2AK7KOYU2TT`
- **Nameservers** (configurados na GoDaddy em 2026-10-02):
  ```
  ns-127.awsdns-15.com
  ns-560.awsdns-06.net
  ns-1707.awsdns-21.co.uk
  ns-1067.awsdns-05.org
  ```
- **Registros:**

  | Nome | Tipo | Valor |
  |---|---|---|
  | `headlinelatam.com` | A / AAAA (ALIAS) | `d3a3ppc5bujjy3.cloudfront.net` |
  | `www.headlinelatam.com` | A / AAAA (ALIAS) | `d3a3ppc5bujjy3.cloudfront.net` |
  | `_d52f43aa…headlinelatam.com` | CNAME | validação ACM |
  | `_4c66ce79…www.headlinelatam.com` | CNAME | validação ACM |
  | `headlinelatam.com` | TXT | `v=spf1 -all` |
  | `_dmarc.headlinelatam.com` | TXT | `v=DMARC1; p=reject; adkim=s; aspf=s` |

- O domínio **não tem e-mail** (nenhum MX). O SPF `-all` e o DMARC `p=reject` impedem que alguém envie e-mail se passando por `@headlinelatam.com`.
- O painel de DNS da GoDaddy **não vale mais**: qualquer mudança de DNS é feita no Route 53. Na GoDaddy fica só o registro e a renovação do domínio.
- A fonte dos registros é [infra/route53-records.json](infra/route53-records.json). Como é tudo `UPSERT`, dá para reaplicar sem risco:
  ```bash
  aws route53 change-resource-record-sets --hosted-zone-id Z0269845L2AK7KOYU2TT --change-batch file://infra/route53-records.json --profile romero
  ```
  ⚠️ Um TXT no domínio raiz substitui o anterior. Se precisar adicionar outro (por exemplo, `google-site-verification`), coloque os dois valores no mesmo registro.

---

## 🚀 Deploy

```bash
./deploy.sh
```

O script ([deploy.sh](deploy.sh)):
1. Sincroniza a pasta com o S3 (`--delete`), ignorando `.git`, `.claude`, `infra/`, `*.md` e `*.sh`.
2. Assets com cache de 1 ano. `index.html`, `404.html`, `sitemap.xml`, `robots.txt`, `llms.txt` e `site.webmanifest` com cache de 5 minutos.
3. Invalida `/*` na CloudFront.

Para mudar as CloudFront Functions, edite o arquivo em `infra/` e publique:

```bash
aws cloudfront describe-function --name headlinelatam-edge-request --profile romero   # pega o ETag
aws cloudfront update-function --name headlinelatam-edge-request --if-match <ETAG> \
  --function-config 'Comment=headlinelatam.com viewer-request,Runtime=cloudfront-js-2.0' --function-code fileb://infra/edge-request.js --profile romero
aws cloudfront publish-function --name headlinelatam-edge-request --if-match <NOVO_ETAG> --profile romero
```

---

## 🔍 Verificação

```bash
# Delegação no registro do .com
dig NS headlinelatam.com @a.gtld-servers.net +noall +authority

# Resposta direto do Route 53 (sem cache)
dig headlinelatam.com @ns-127.awsdns-15.com

# Site
curl -sI https://headlinelatam.com/
curl -sI https://www.headlinelatam.com/   # 301 → https://headlinelatam.com/
```

Limpar o cache de DNS do Mac:

```bash
sudo dscacheutil -flushcache; sudo killall -HUP mDNSResponder
```

---

## 📊 Custos

- **S3:** ~$0.023/GB armazenado
- **CloudFront:** ~$0.085/GB transferido (os primeiros 1 TB/mês ficam no free tier)
- **Route 53:** $0.50/mês por hosted zone + ~$0.40 por milhão de consultas (consultas ALIAS para CloudFront são grátis)
- **ACM:** grátis
- **Estimado para um site pequeno:** ~$1-5/mês

---

## 🔗 Links

- [S3](https://s3.console.aws.amazon.com/s3/buckets/headlinelatam.com?region=us-east-1)
- [CloudFront](https://console.aws.amazon.com/cloudfront/v4/home#/distributions/E4NSQMSB8LK1Y)
- [ACM](https://console.aws.amazon.com/acm/home?region=us-east-1)
- [Route 53](https://console.aws.amazon.com/route53/v2/hostedzones#ListRecordSets/Z0269845L2AK7KOYU2TT)
