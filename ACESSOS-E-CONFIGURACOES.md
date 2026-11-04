# Acessos e configurações, headlinelatam.com

Guia operacional para retomar o trabalho sem redescobrir acessos. Consulte antes de investigar qualquer sistema e atualize depois de descobertas relevantes, sempre com data e evidência.

Última revisão: **2026-10-17**, integração autorizada da prévia pública AI Research em /ai-research/ (seção 7). As consultas de acesso de 2026-10-14 e o histórico abaixo permanecem datados; o conteúdo institucional não foi publicado nesta integração.

**Legenda de evidência**

| Marca | Significado |
|---|---|
| ✅ Leitura | Consulta de leitura feita com sucesso na data indicada |
| ✍️ Edição | Permissão de escrita comprovada (papel de proprietário/administrador visto, ou escrita registrada em log) |
| 🚀 Publicação | Publicação em produção comprovada por log ou artefato com data |
| ❔ Não comprovado | Não testado, ou a consulta de permissão falhou sem provar ausência |
| ⛔ Negado | Operação explicitamente negada pelo serviço |
| 🗣️ Informado | Veio do Romero ou de conversa anterior, não reverificado hoje |

> Este guia descreve acessos, **não autoriza** mudanças em produção. Deploy, DNS, CloudFront, GA4 e Search Console só mudam com pedido explícito do Romero na conversa.

---

## 1. Visão geral

Site estático (HTML puro, sem build) que funciona como anexo latino-americano de headline.com. Três idiomas: `/` (en, x-default), `/pt/` (pt-BR), `/es/` (es-419, hreflang `es`).

```
visitante → Route 53 (ALIAS) → CloudFront E4NSQMSB8LK1Y → S3 headlinelatam.com (privado, OAC)
                                  ├ viewer-request:  headlinelatam-edge-request  (www→apex, URLs limpas)
                                  └ viewer-response: headlinelatam-edge-response (noindex no *.cloudfront.net)
```

Não há CMS, blog, Tag Manager, anúncios, banco de dados nem CI/CD. O deploy é manual por `./deploy.sh`.

Documentos irmãos (detalhes, não duplicados aqui):

- [AWS_SETUP.md](AWS_SETUP.md): infra AWS passo a passo, custos, comandos das CloudFront Functions.
- [SEO.md](SEO.md): auditoria de SEO de 2026-10-04, palavras-chave, plano de ação.
- [infra/](infra/): fontes das CloudFront Functions, bucket policy e lote de DNS.

---

## 2. Mapa de acessos

| Necessidade | Caminho preferido | Alternativa | Recurso |
|---|---|---|---|
| Código | `git` + `gh` CLI (conta `romerorodrigues77`) | github.com | `romerorodrigues77/headlinelatam.com`, branch `main` |
| Deploy | `./deploy.sh` (AWS CLI, profile `romero`) | Console S3 + CloudFront | Bucket `headlinelatam.com`, distribuição `E4NSQMSB8LK1Y` |
| Hospedagem / CDN | AWS CLI, profile `romero` | Console AWS | Conta `160184161667`, `us-east-1` |
| DNS | AWS CLI `route53` | Console Route 53 | Zona `Z0269845L2AK7KOYU2TT` |
| Registro do domínio | Navegador (GoDaddy) | — | `headlinelatam.com` na GoDaddy |
| Analytics | Claude in Chrome (Chrome do Romero, logado em `romero.rodrigues@gmail.com`) | — | GA4 conta `410481438`, propriedade `557110567`, `G-0B661FMB74` |
| Search Console | Claude in Chrome | — | Propriedade de Domínio `sc-domain:headlinelatam.com` |
| Formulário de pitch | Externo, da Headline global | — | `https://forms.headline.com/intros-and-ideas` |
| E-mail de contato | Externo (Google Workspace da Headline) | — | `all-brasil@headline.com` |

---

## 3. Sistemas em detalhe

### 3.1 GitHub

- **Repositório:** https://github.com/romerorodrigues77/headlinelatam.com (público), `main` é a única branch e o default.
- **Acesso:** ✅ Leitura e ✍️ Edição (2026-10-14): `gh auth status` logado como `romerorodrigues77` (keyring); `gh api repos/romerorodrigues77/headlinelatam.com` retornou `admin/push: true`. Último push em 2026-10-09.
- **Sem GitHub Actions** (não existe `.github/`). Push no GitHub **não** publica o site.
- **Retomar:**
  ```bash
  git -C ~/Documents/Github/headlinelatam.com pull
  gh api repos/romerorodrigues77/headlinelatam.com --jq .permissions
  ```

### 3.2 AWS (S3, CloudFront, ACM, Route 53)

- **Conta:** `160184161667`. **Profile local:** `romero` (região `us-east-1`), usuário IAM `romeroheadline`. Credenciais ficam em `~/.aws/` (não copiar para cá).
- **Atenção, conta compartilhada:** a mesma conta tem recursos de outros projetos (zona `staging.getuncapped.co`, papel `uncapped-staging-github-deploy`, CloudFront Function `watchthewatch-preview-spa`). Não mexer neles; filtrar sempre pelos IDs abaixo. O profile `uncapped-prod` no `~/.aws/config` é de outro projeto.
- **Dica de shell:** no zsh, `P="--profile romero"; aws ... $P` falha (a variável não é dividida). Use `export AWS_PROFILE=romero` ou escreva `--profile romero`.

| Recurso | Identificador | Estado em 2026-10-14 |
|---|---|---|
| Bucket S3 | `headlinelatam.com` (us-east-1) | ✅ Block Public Access 4×True; objetos de 2026-10-09 |
| Origin Access Control | `EWDL38QSVWQ5` | ✅ ligado à origem `headlinelatam.com.s3.amazonaws.com` |
| CloudFront | `E4NSQMSB8LK1Y`, `d3a3ppc5bujjy3.cloudfront.net` | ✅ Deployed, aliases apex + www, `PriceClass_100`, logging desligado |
| Functions | `headlinelatam-edge-request`, `headlinelatam-edge-response` | ✅ LIVE desde 2026-10-02 |
| Certificado ACM | `arn:aws:acm:us-east-1:160184161667:certificate/abc66ab0-1868-400c-82f6-9bcecbd2a7c1` | ✅ ISSUED, válido até 2027-04-17, renovação ELIGIBLE |
| Zona Route 53 | `Z0269845L2AK7KOYU2TT` | ✅ 10 registros (ver 3.3) |

**Permissões**

| Operação | Status | Evidência |
|---|---|---|
| Ler S3, CloudFront, ACM, Route 53, CloudTrail | ✅ Leitura | Consultas de 2026-10-14 |
| Upload/remoção no S3 + invalidação (deploy) | 🚀 Publicação | CloudTrail: `CreateInvalidation` por `romeroheadline` em `E4NSQMSB8LK1Y`, 2026-10-09 18:44 UTC; objetos no S3 com a mesma data |
| Alterar DNS | ✍️ Edição | CloudTrail: `ChangeResourceRecordSets` por `romeroheadline` em 2026-10-02 e 2026-10-04 |
| Alterar distribuição, Functions, bucket policy | ✍️ Edição | CloudTrail: `UpdateDistribution`, `PublishFunction`, `PutBucketPolicy` por `romeroheadline` em 2026-10-02 |
| Introspecção IAM (`list-attached-user-policies`, `list-groups-for-user`, `simulate-principal-policy`) | ⛔ Negado | `AccessDenied` em 2026-10-14. Não indica falta de escrita; só que o usuário não lê o próprio IAM. Não repetir. |

O histórico de eventos do CloudTrail cobre só 90 dias; a evidência acima vale como "funcionou na data", não como garantia permanente.

**Comandos de leitura para retomar**

```bash
export AWS_PROFILE=romero
aws sts get-caller-identity
aws cloudfront get-distribution --id E4NSQMSB8LK1Y --query 'Distribution.{Status:Status,Aliases:DistributionConfig.Aliases.Items}'
aws cloudfront list-invalidations --distribution-id E4NSQMSB8LK1Y --max-items 3
aws s3 ls s3://headlinelatam.com/
aws route53 list-resource-record-sets --hosted-zone-id Z0269845L2AK7KOYU2TT --output table
aws acm describe-certificate --certificate-arn arn:aws:acm:us-east-1:160184161667:certificate/abc66ab0-1868-400c-82f6-9bcecbd2a7c1 --query 'Certificate.{S:Status,NotAfter:NotAfter}'
aws cloudtrail lookup-events --region us-east-1 --lookup-attributes AttributeKey=EventName,AttributeValue=CreateInvalidation --max-results 5 --query 'Events[].[EventTime,Username]' --output text
```

**Deploy (escrita em produção, só com pedido explícito)**

```bash
./deploy.sh
```

Sincroniza com `--delete`, exclui `.git`, `.claude`, `infra/`, `*.md` e `*.sh` (por isso este guia e o `AGENTS.md` nunca vão para o S3), dá cache de 1 ano aos assets e 5 minutos às páginas e arquivos de rastreamento, e invalida `/*`. Página nova em subpasta precisa de uma linha `short_cache` no script.

### 3.3 DNS e domínio

- **Registrador:** GoDaddy. Expira em **2027-10-02** (✅ `whois`, 2026-10-14). Acesso ao painel da GoDaddy: ❔ não comprovado; só é necessário para renovação ou troca de nameservers.
- **Nameservers** (✅ `dig` no `.com`, 2026-10-14): `ns-127.awsdns-15.com`, `ns-560.awsdns-06.net`, `ns-1067.awsdns-05.org`, `ns-1707.awsdns-21.co.uk`. O painel de DNS da GoDaddy não vale mais.
- **Registros na zona** (✅ 2026-10-14):

  | Nome | Tipo | Valor |
  |---|---|---|
  | apex e `www` | A / AAAA ALIAS | `d3a3ppc5bujjy3.cloudfront.net` |
  | apex | TXT | `"v=spf1 -all"` **e** `"google-site-verification=pd3bHuQf…"` (mesmo registro) |
  | `_dmarc` | TXT | `v=DMARC1; p=reject; adkim=s; aspf=s` |
  | `_d52f43aa…` e `_4c66ce79….www` | CNAME | validação ACM (não apagar, sustentam a renovação) |

- Sem MX: o domínio não recebe nem envia e-mail.
- ⚠️ **[infra/route53-records.json](infra/route53-records.json) está defasado:** o TXT do apex lá tem só o SPF. Reaplicar o lote como está **apaga a verificação do Search Console**. Antes de reaplicar, inclua o valor `google-site-verification` no mesmo `ResourceRecords` (ver pendências).

### 3.4 Google Analytics 4

- **Conta** "Headline Latam" `410481438`, **propriedade** `557110567`, **ID de medição** `G-0B661FMB74`, fuso São Paulo, BRL.
- **Dono:** `romero.rodrigues@gmail.com` (conta Google pessoal, não a `@headline.com`).
- **Acesso:** ✅ Leitura e ✍️ Edição (2026-10-14): Admin → Gerenciamento de acesso à conta, pelo Claude in Chrome, mostra 1 usuário, `romero.rodrigues@gmail.com`, papel **Administrador**.
- **Implementação no site:** `gtag.js` direto no `<head>` das três páginas (sem Tag Manager). Consent Mode v2 com banner de cookies: `analytics_storage` negado por padrão no EEE/Reino Unido/Suíça, concedido no resto; anúncios sempre negados. `content_group` = en/pt/es. Evento `generate_lead` (marcado como evento principal, 🗣️ conversa de 2026-10-04).
- **Vínculo com Search Console:** 🗣️ feito em 2026-10-04 com a propriedade de Domínio.
- **Caminho:** Claude in Chrome → `https://analytics.google.com/analytics/web/#/a410481438p557110567/...`. A página de administração não tem texto extraível; use screenshot.
- **Não serve:** o conector Windsor.ai desta sessão só enxerga propriedades de outros projetos (Qipu, MEI Grátis) (✅ 2026-10-14). Não há API/CLI configurada para esta propriedade.

### 3.5 Google Search Console

- **Propriedades:** Domínio `sc-domain:headlinelatam.com` (use esta) e prefixo `https://headlinelatam.com/` (🗣️ verificada pelo GA; não remover a tag gtag).
- **Acesso:** ✅ Leitura e ✍️ Edição (2026-10-14): Usuários e permissões mostra `romero.rodrigues@gmail.com` como **Proprietário, Confirmado**, único usuário.
- **Verificação:** TXT `google-site-verification` no apex do Route 53 (ver 3.3).
- **Estado em 2026-10-14:** sitemap `https://headlinelatam.com/sitemap.xml` enviado em 2026-10-04, última leitura 2026-10-13, Processado, **3 páginas**. Indexação: **3 indexadas**; 3 não indexadas por "Página com redirecionamento" (variantes www/http/`index.html`, esperado).
- **Caminho:** Claude in Chrome →
  - `https://search.google.com/search-console?resource_id=sc-domain%3Aheadlinelatam.com`
  - páginas úteis: `/sitemaps`, `/index`, `/performance/search-analytics`, `/users` com o mesmo `resource_id`.
- **Truque conhecido** (🗣️ 2026-10-04): os campos React do GSC ignoram texto digitado; funciona definir o valor pelo setter nativo do input e disparar `keydown` Enter.

### 3.6 Integrações externas (não administradas por este projeto)

- **Pitch:** botão leva a `https://forms.headline.com/intros-and-ideas` (formulário global da Headline; região "Latin America"). Não temos acesso ao formulário nem às respostas.
- **Contato:** `all-brasil@headline.com`; cards da equipe com e-mails `@headline.com` e LinkedIn.
- **Fontes:** Google Fonts (Manrope + Fraunces), carregamento assíncrono.
- **Links de saída:** headline.com, romerorodrigues.com (repo `romerorodrigues77/romerorodrigues.com`, fonte da lista de portfólio), getuncapped.co.

### 3.7 Verificação pública (sem credencial)

```bash
dig NS headlinelatam.com @a.gtld-servers.net +noall +authority
dig +short TXT headlinelatam.com
curl -sI https://headlinelatam.com/            # 200, cache-control max-age=300
curl -sI https://www.headlinelatam.com/        # 301 → https://headlinelatam.com/
curl -sI https://d3a3ppc5bujjy3.cloudfront.net/ | grep -i x-robots   # noindex, nofollow
```

Resultado em 2026-10-14: todos conforme o esperado; `/pt/` também 200.

---

## 4. Ferramentas e onde não perder tempo

| Ferramenta | Situação |
|---|---|
| AWS CLI 2 (`--profile romero`) | Funciona. Caminho principal para infra. |
| `gh` CLI | Funciona, conta `romerorodrigues77`. |
| Claude in Chrome | Caminho para GA4 e Search Console (sessão Google `romero.rodrigues@gmail.com` já aberta). Abrir aba nova e fechar ao terminar. |
| Navegador embutido do app | ❔ Não testado para GA/GSC; é isolado do Chrome, então não deve ter a sessão Google. Útil para conferir o site público. |
| Windsor.ai | Não tem a propriedade GA4 nem o GSC deste site. |
| Searchlight (MCP da Headline) | Útil para roster do escritório de São Paulo e dados de empresas do portfólio. |
| IAM introspecção | Negado; não repetir. |
| Ahrefs/Semrush | Não conectados (o SEO.md usa estimativas qualitativas). |

---

## 5. Pendências e riscos

1. **`infra/route53-records.json` sem o TXT do Search Console** (2026-10-14). Corrigir o arquivo antes de qualquer reaplicação do lote. Mudança só local; aplicar no Route 53 continua exigindo pedido explícito.
2. **Um único dono** em GA4 e Search Console, numa conta Google pessoal. Recomendado adicionar um segundo administrador (por exemplo, uma conta `@headline.com`). Decisão do Romero.
3. **Filtro de tráfego interno no GA4** ainda não confirmado (recomendação do SEO.md de 2026-10-04).
4. **GoDaddy:** acesso não verificado; domínio expira em 2027-10-02. Confirmar renovação automática.
5. **Logs de acesso da CloudFront desligados.** Sem logs, só CloudTrail (90 dias) e GA4.
6. **Sem CI/CD:** o deploy depende das credenciais locais do Romero.
7. Itens de conteúdo e SEO (backlinks, páginas `/pitch/`, Perfil da Empresa no Google): ver [SEO.md](SEO.md).

---

## 6. Histórico de revisões

| Data | O que mudou | Evidência |
|---|---|---|
| 2026-10-02 | Infra AWS, DNS no Route 53, GA4 e GSC criados | Conversas "Headline Latam home page" e "Aceleração de propagação DNS"; CloudTrail |
| 2026-10-04 | Versões `/pt/` e `/es/`, verificação de Domínio no GSC, vínculo GA×GSC | Commits `eefb4cd`, `4a133c6`, `3f17ab0`; CloudTrail `ChangeResourceRecordSets` |
| 2026-10-09 | Pitch pelo formulário da Headline, contato `all-brasil@`; último deploy | Commit `7e58950`; CloudTrail `CreateInvalidation` |
| 2026-10-14 | Este guia criado; acessos reverificados só com leitura; achado o risco do `route53-records.json` | Comandos e telas citados nas seções acima |
| 2026-10-14 | Otimização de carregamento publicada (fontes próprias, GA4 adiado, imagens AVIF/WebP); `deploy.sh` passa a gravar `.woff2`/`.avif` com content-type explícito. Verificado: distribuição usa `PriceClass_100` (sem edges na América do Sul), não alterado | `./deploy.sh` com `CreateInvalidation`; `aws cloudfront get-distribution-config --id E4NSQMSB8LK1Y`; medições em `SEO.md` |
| 2026-10-14 | `PriceClass_100` → `PriceClass_All` a pedido do Romero (única chave alterada na config); São Paulo passa a ser atendido por `GRU1` em vez de `MIA50`. Confirmado que o perfil `romero` tem `cloudfront:UpdateDistribution` | `aws cloudfront update-distribution` (ETag `E1F83G8C2ARO7P`), status `Deployed`; header `x-amz-cf-pop`; medições em `SEO.md` |
| 2026-10-15 | `deploy.sh`: HTML com `s-maxage=31536000,stale-while-revalidate=86400`; `/assets` com `immutable`, regravado a cada deploy. Deploy feito a partir de `git archive HEAD` (cópia limpa), não da pasta de trabalho | Commits `11afa9e`, `9d64587`; `curl -I` e `aws s3api head-object` mostrando os novos `Cache-Control` |
| 2026-10-17 | Prévia pública AI Research integrada em /ai-research/ com autorização de Romero. Dois behaviors/origem dedicada e Lambda@Edge somente para erros S3; conteúdo institucional e DNS principal preservados | CloudFront E4NSQMSB8LK1Y Deployed, ETag E3AEGXETSR30VB; smoke público e hashes HTML; stack headline-ai-research-institutional-edge UPDATE_COMPLETE |

## 7. Integração AI Research — verificada em 2026-10-17

🚀 Publicação: https://headlinelatam.com/ai-research/ responde sem Basic Auth, com noindex/no-store. É uma prévia sem divulgação: nenhum link na home nem entrada no sitemap foi adicionado. O endereço é público; o consentimento continua necessário para a pesquisa/PDF. Administração separada em /ai-research/admin-equipe, com senha Cognito, troca obrigatória no primeiro acesso e aprovação no banco (atualizado em 2026-10-17).

A distribuição existente E4NSQMSB8LK1Y preserva a origem S3/default, aliases, certificado, funções institucionais, PriceClass_All e demais opções. Os novos behaviors /ai-research e /ai-research/* usam a origem HeadlineAIResearch (origin-ai-research-preview.headlinelatam.com), HTTPS e segredo de origem privado. API, cookies, query strings e Range são encaminhados sem cache; /ai-research e www têm redirecionamentos canônicos 308 pela função headline-ai-research-request. Esse esquema é adicional ao institucional descrito acima; não é uma pasta copiada para o bucket estático.

O mapeamento global de erros para /404.html foi removido: ele substituiria os erros da API por HTML. O tratamento institucional agora está na função Lambda@Edge arn:aws:lambda:us-east-1:160184161667:function:headline-ai-research-institutional-error:2, associada SOMENTE ao origin-response do comportamento S3. Ela preserva o HTML 404 existente, inclusive cabeçalhos somente leitura exigidos pelo CloudFront. Erros da pesquisa continuam 401/403/404 JSON; não associar essa função aos behaviors da pesquisa.

Evidências: distribuição Deployed, ETag E3AEGXETSR30VB; /, /pt/, /es/ e 404 conferidos byte a byte contra a cópia anterior (GRU1-P1). Smoke público: páginas/assets 200; consentimento e evento de teste; PDF com checksum/206/416; CSRF incorreto 403 e administração anônima 401; HEAD 404 canônico preservado. A aplicação é o release b741434; fonte da Edge no commit 45f6344 do repositório privado romerorodrigues77/headline-AI-research-AWS. Stack Edge UPDATE_COMPLETE. A CloudFront privada d3ijmreuluga3s.cloudfront.net permanece com Basic Auth.

Nenhum deploy de ./deploy.sh, upload para headlinelatam.com ou alteração de DNS principal/GA4/GSC foi feito nesta etapa. Recursos da pesquisa ficam fora do bucket institucional, pois o deploy institucional usa --delete. O histórico de visitantes do Enzo ainda não foi importado.

Manutenção/retorno: consultar ../headline-AI-research-AWS/docs/operations.md e seu guia de acessos. Configurações integrais CloudFront contêm segredo da nova origem: guardar snapshots de forma privada no projeto da pesquisa, nunca neste repositório público. Atualizar só a configuração corrente com ETag e diff restrito; não reaplicar o template CloudFront ou lote DNS antigos. Para retornar, restaurar o snapshot anterior à integração, após revisar mudanças concorrentes; isso não reverte o banco. Não usar a versão Lambda :1 (anterior à correção de cabeçalhos).

IAM: o papel headline-ai-research-institutional-edge foi criado pelo console após confirmação explícita, assumido apenas por Lambda/Edge e limitado aos logs da própria função. O perfil CLI não ganhou novas permissões: iam:GetRole desse papel foi negado ao executar update da stack; para essa stack, usar a sessão administrativa, sem repetir a tentativa negada. Não exportar credenciais administrativas do navegador.

- 2026-10-17 — AI Research: login por senha publicado no release 532d51a, /ai-research/admin-equipe; duas contas convidadas com temporárias individuais e troca obrigatória. Smoke Cognito/consentimento/PDF passou, páginas institucionais idênticas aos snapshots. Sem alteração de CloudFront/DNS/conteúdo institucional nesta etapa. Evidências no guia do repositório headline-AI-research-AWS.
