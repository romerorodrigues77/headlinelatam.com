# AWS Setup - headlinelatam.com

## ✅ O que foi criado

### 1. **S3 Bucket**
- **Nome:** `headlinelatam.com`
- **Region:** `us-east-1`
- **Configuração:** Website estático com index.html como documento padrão
- **Acesso:** Público (via CloudFront)

### 2. **CloudFront Distribution**
- **ID:** `E4NSQMSB8LK1Y`
- **Domain:** `d3a3ppc5bujjy3.cloudfront.net`
- **Status:** InProgress (ficará pronto em ~15-20 minutos)
- **Cache Policy:** Otimizada para conteúdo estático

### 3. **SSL Certificate (ACM)**
- **ARN:** `arn:aws:acm:us-east-1:160184161667:certificate/abc66ab0-1868-400c-82f6-9bcecbd2a7c1`
- **Domínios:** 
  - `headlinelatam.com`
  - `www.headlinelatam.com`
- **Status:** ⏳ **PENDING_VALIDATION** (precisa validar via DNS)

---

## 📋 Próximas etapas

### 1. **Validar o Certificado SSL na GoDaddy** (IMPORTANTE!)

O certificado precisa ser validado via DNS antes de ser usado. AWS vai enviar um email com os registros DNS necessários, ou você pode fazer manualmente:

1. Acesse a [Console ACM](https://console.aws.amazon.com/acm/home?region=us-east-1)
2. Clique no certificado `abc66ab0-1868-400c-82f6-9bcecbd2a7c1`
3. Copie os **registros DNS** (CNAME values)
4. Vá para a GoDaddy
5. Adicione os registros DNS ao domínio `headlinelatam.com`

Isso pode levar de alguns minutos até 24 horas para validar.

### 2. **Apontar DNS para CloudFront (Depois de validar o certificado)**

Após o certificado ser validado, adicione este registro na GoDaddy:

```
Type:  CNAME
Name:  headlinelatam.com
Value: d3a3ppc5bujjy3.cloudfront.net
TTL:   3600
```

Para `www`, crie outro CNAME:

```
Type:  CNAME
Name:  www.headlinelatam.com
Value: d3a3ppc5bujjy3.cloudfront.net
TTL:   3600
```

> **Nota:** Na GoDaddy, você pode precisar remover o `@ (root)` existente se houver conflito com o CNAME.

### 3. **Deploy do Site**

Para fazer upload de arquivos para o S3, use:

```bash
# Upload de um arquivo
aws s3 cp index.html s3://headlinelatam.com/ --profile romero

# Upload recursivo de pasta
aws s3 sync ./dist s3://headlinelatam.com/ --profile romero --delete
```

### 4. **Habilitar o Domínio Customizado no CloudFront**

Assim que o certificado for validado, execute:

```bash
# Comando para adicionar domínio customizado e certificado ao CloudFront
# (Já está pronto, só falta validar o certificado)
```

---

## 📊 Resumo dos Custos

- **S3:** ~$0.023/GB de armazenamento + transferência de dados
- **CloudFront:** ~$0.085/GB de dados transferidos (primeiros 10TB/mês)
- **ACM Certificate:** GRÁTIS
- **Estimado para pequeno site:** ~$5-15/mês

---

## 🔗 Links Úteis

- [AWS Console - S3](https://s3.console.aws.amazon.com/s3/buckets/headlinelatam.com?region=us-east-1)
- [AWS Console - CloudFront](https://console.aws.amazon.com/cloudfront/v3/home?region=us-east-1#/distributions/E4NSQMSB8LK1Y)
- [AWS Console - ACM Certificates](https://console.aws.amazon.com/acm/home?region=us-east-1)

---

## ⚙️ Configuração do Git

Para fazer deploy automático via GitHub Actions, você pode criar um workflow que:
1. Faz build do site
2. Faz sync para S3
3. Invalida cache do CloudFront

Exemplo:
```yaml
- name: Deploy to S3
  run: aws s3 sync ./dist s3://headlinelatam.com/ --delete --profile romero
```

