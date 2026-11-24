# Acessos e configurações, headlinelatam.com

Guia operacional para retomar o trabalho sem redescobrir acessos. Consulte antes de investigar qualquer sistema e atualize depois de descobertas relevantes, sempre com data e evidência.

Última revisão: **2026-11-23**, consolidação do `main` após o dia de sessões concorrentes (pendências 8 e 9, histórico). Última revisão: **2026-10-17**, integração autorizada da prévia pública AI Research em /ai-research/ (seção 7). As consultas de acesso de 2026-10-14 e o histórico abaixo permanecem datados; o conteúdo institucional não foi publicado nesta integração.

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
- ⚠️ **Módulo de consentimento preparado, não publicado; fora do `main` desde `cc263da`** (✅ 2026-11-23): o PR `romerorodrigues77/headlinelatam.com#1` (branch `codex/ga4-consent`, mesclado em `cf686fc`) troca o `gtag.js` inline por `<script type="module" src="/assets/analytics/headline-analytics-v2-9d34e3e4503a.js">` nas três páginas e remove `setConsent`/`generate_lead`. Esteve no ar só entre 19:03 e 19:07 de 2026-11-23, por um deploy indevido da sessão "Headline Prime" (`git archive` de `main` sem o patch reverso); revertido às 19:07 com cópia filtrada e `assets/analytics/` apagada do bucket. **Não está no ar** (✅ 2026-11-23 19:08: `curl` em /, /pt/, /es/ com 0 `headline-analytics-v2` e `gtag('config'` inline; `aws s3 ls` sem `assets/analytics/`; ver pendência 8 e histórico). `ANALYTICS.md` exige, antes de publicar, a API `/ai-research/api/v1/analytics/consent` compatível, ajustes no GA4 e autorização separada; a publicação prevista é `publish-analytics.sh --apply`, não o `deploy.sh`. Como o `deploy.sh` sincroniza a pasta de trabalho (`SOURCE_DIR` padrão `.`), que desde o rebase de 2026-11-23 já contém essas páginas, **o próximo `./deploy.sh` leva o módulo junto**, sem essas condições. **Desde `cc263da` (2026-11-23, sessão de orquestração) a troca não está mais no `main`:** as três páginas voltaram ao gtag inline e `assets/analytics/` saiu do repositório; a versão revisada fica só no branch `codex/ga4-consent` e em `cf686fc`. Qualquer menção acima a "está em `main`" vale até esse commit.
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
- **Fontes:** Manrope e Fraunces servidas do próprio site (`/assets/fonts/*.woff2`, `font-display: swap`, sem Google Fonts) (✅ `curl` do HTML público, 2026-11-23).
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
| PageSpeed Insights | API anônima (`googleapis.com/pagespeedonline/v5`, sem chave) devolveu `Quota exceeded` em 2026-11-23; `pagespeed.web.dev` aberto no Claude in Chrome funciona (no navegador embutido, aba oculta, a análise não conclui). Lighthouse não está instalado localmente. |
| MCP `google_analytics` do app | ⛔ 401 em 2026-11-23: a sessão do conector não é a conta dona da propriedade. GA4 continua pelo Claude in Chrome. |
| MCP `search_performance` / CLI Control Tower | Não carregados nesta máquina em 2026-11-23 (pasta `Romero Control Tower` ausente em `~/Library/Application Support`). |

---

## 5. Pendências e riscos

1. **`infra/route53-records.json` sem o TXT do Search Console** (2026-10-14). Corrigir o arquivo antes de qualquer reaplicação do lote. Mudança só local; aplicar no Route 53 continua exigindo pedido explícito.
2. **Um único dono** em GA4 e Search Console, numa conta Google pessoal. Recomendado adicionar um segundo administrador (por exemplo, uma conta `@headline.com`). Decisão do Romero.
3. **Filtro de tráfego interno no GA4** ainda não confirmado (recomendação do SEO.md de 2026-10-04).
4. **GoDaddy:** acesso não verificado; domínio expira em 2027-10-02. Confirmar renovação automática.
5. **Logs de acesso da CloudFront desligados.** Sem logs, só CloudTrail (90 dias) e GA4.
6. **Sem CI/CD:** o deploy depende das credenciais locais do Romero.
7. Itens de conteúdo e SEO (backlinks, páginas `/pitch/`, Perfil da Empresa no Google): ver [SEO.md](SEO.md).
9. **Sessões concorrentes na mesma pasta** (2026-11-23): várias sessões do Claude editam este checkout em paralelo, sem worktree. Antes de `git add`, `commit --amend` ou deploy, conferir `git status`/`git diff` e commitar só os próprios hunks; nunca publicar a pasta de trabalho inteira sem revisar o que está nela.
8. ✅ **Resolvido em 2026-11-23 (commit `cc263da`).** Antes disso o `main` continha o módulo GA4 de consentimento não publicado, que esteve no ar por engano entre 19:03 e 19:07 BRT de 2026-11-23 (deploy de `git archive` de `main` sem patch reverso; corrigido às 19:07 com cópia filtrada, ver 3.4 e histórico). Desde o commit: o `main` voltou ao gtag inline nas três páginas e `assets/analytics/` saiu do `main`; a troca revisada segue no branch `codex/ga4-consent` (`d24f972`, worktree `headlinelatam-ga4-worktree`) e em `cf686fc`. Desde então `./deploy.sh` pode publicar um `git archive` do `main` sem patch reverso. Reaplicar só quando a API de consentimento existir, via `publish-analytics.sh --apply` (ver ANALYTICS.md).

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
| 2026-11-24 | **Segunda publicação do dia, sessão "Ordem do portfólio", a pedido do Romero ("Sim, deploy"):** `./deploy.sh` sobre `git archive` do commit `fbc82d5` (= `main` = `origin/main`), em pasta temporária. Leva ao ar o selo da Movidesk sem o prefixo "up to"/"até"/"hasta" ("Acquired by Zenvia · R$ 616 M" e equivalentes), decisão do Romero para o selo caber em duas linhas no celular. Working tree limpo antes do deploy | Commit `fbc82d5`; `deploy.sh` com `✓ Cache invalidado`; invalidação `IF2JFE0NZRHQHYUCBAIF7826Z5` concluída 12:43 UTC (09:43 BRT); `head-object index.html` 12:42:51Z com cache curto; `curl` em /, /pt/, /es/ mostra o selo da Movidesk sem o prefixo |
| 2026-11-24 | **Primeira publicação do dia, sessão "Ordem do portfólio", a pedido do Romero ("Commit e deploy"):** `./deploy.sh` sobre `git archive` do commit `b8a1e88` (= `main` = `origin/main`), em pasta temporária. Leva ao ar o valor das vendas nos selos de RD Station (R$ 1,86 bi, fato relevante da TOTVS por 92% do capital, 2021) e Movidesk (até R$ 616 mi: R$ 296 mi no fechamento mais earn-out estimado em R$ 320 mi, comunicado da Zenvia de 03/05/2022; earn-out renegociado em fev/2026, valor final não divulgado). Ano 2015 da RD Station confirmado pelo Romero. Parte do valor nos três selos com preço (Pismo incluído) usa `&nbsp;` para quebrar só no separador. Única outra sessão nesta pasta estava parada; working tree só com hunks desta sessão | Commit `b8a1e88`; `deploy.sh` com `✓ Cache invalidado`; invalidação `IC55O8H1S13GQK7N1F54EY3N5B` concluída 12:30 UTC (09:30 BRT); `head-object index.html` 12:29:47Z com cache curto; `curl` em /, /pt/, /es/ mostra os dois selos com valor em cada idioma |
| 2026-11-23 | **Oitava publicação do dia, sessão "Ordem do portfólio", a pedido do Romero ("Pode commitar e fazer o deploy"):** `./deploy.sh` sobre `git archive` do commit `cc44220` (= `main` = `origin/main`), em pasta temporária. Leva ao ar a ordem editorial do portfólio nas três páginas (Pismo, Wellhub, Creditas, Olist, Rappi; saídas; ABC…Blips; demais por ano), os cards novos Movidesk (Zenvia, 2019) e RD Station (TOTVS, 2015) com logos `movidesk.webp` e `rd-station.webp` dos sites oficiais, e o fechamento do `co-badge` de Rappi e ViajaNet (ano não fica mais colado ao selo). Regra de ordem registrada no AGENTS.md. Única outra sessão nesta pasta estava parada; working tree só com hunks desta sessão | Commit `cc44220`; `deploy.sh` com `✓ Cache invalidado`; invalidação `I665LO5OFHL20MOQKHSL7QD6BY` concluída 23:01 UTC (20:01 BRT); `head-object index.html` 23:00:55Z com cache curto; `curl` em /, /pt/, /es/ com 46 `co-name`, os 12 primeiros na ordem pedida, e os dois logos novos 200 `image/webp` |
| 2026-11-23 | **Sétima publicação do dia, a pedido do Romero ("Sim, publique"), sessão de orquestração:** `./deploy.sh` sobre `git archive` do commit `21dbc03` (= `main` = `origin/main`), em pasta temporária, sem patch reverso (o módulo GA4 já não está no `main`). Leva ao ar a correção de CLS das fontes (`ea61051`) e os ajustes de desempenho (`2f17fb1`); diff contra o HTML público anterior eram 125 linhas por página, só fontes, `content-visibility` e `decoding`. Invalidação `IBLOAJQ23P35RG5ZYLWOUUOHCL` concluída às 22:34 UTC (19:34 BRT). Bucket sem `assets/analytics/`, `.orig`, `.md` ou `.sh` | `cmp` das três páginas públicas contra a cópia publicada: idênticas; `curl` com 1 `googletagmanager`, 0 `headline-analytics-v2`, 2 `preload`, 50 `decoding="async"`, 2 `content-visibility`; `head-object index.html` 22:33:54Z com cache curto; fontes `immutable`; `aws cloudfront wait invalidation-completed` |
| 2026-11-23 | **Orquestração das sessões do dia** (sessão "Sessões ativas e otimização de desempenho"), a pedido do Romero: as quatro sessões (Logos, Headline Prime, Avenia, Métricas) foram lidas e as duas ativas avisadas; esta sessão passou a ser a única dona do `main` e do próximo deploy. Commits: `cc263da` (reverte no `main` a troca do gtag pelo módulo GA4 e remove `assets/analytics/`; pendência 8 fechada), `2f8d3ff` (guias ACESSOS/AGENTS/CLAUDE, AWS_SETUP, SEO e `.claude/launch.json` passam a ser rastreados; `settings.local.json` ignorado), `2f17fb1` (desempenho: `content-visibility:auto` em `#contact` e `footer`, `decoding="async"` nos 44 logos; conferido no preview a 1350 e 412 px, CLS 0, sem erros). Tudo enviado ao GitHub. **Não publicado:** o `main` difere do site no ar só pela correção de CLS das fontes (`ea61051`) e por `2f17fb1`; o deploy previsto é `git archive HEAD` numa pasta temporária + `./deploy.sh PASTA`, sem patch | `list_sessions`/`list_events` do app; `git log`; `diff` entre `curl https://headlinelatam.com/` e `index.html` (36 linhas, só fontes); preview local |
| 2026-11-23 | Sexta publicação do dia, sessão "Logos do portfólio", a pedido do Romero ("publicar o fundo Headline Prime e a notícia da Avenia"): o fundo já estava no ar desde 19:07; publicada às 19:11 só a notícia Avenia (lista `#newslist` de `ea61051` nas três páginas) e `sitemap.xml` com lastmod 2026-11-23. Cópia montada a partir dos objetos atuais do S3, não de `main`: diff contra o S3 = 3 linhas de `news-item` por página; gtag inline mantido, sem `assets/analytics/`. Sessões ativas avisadas por mensagem antes do deploy | `deploy3.log` sem `fail`; `head-object index.html` conferido igual a 22:07:40Z imediatamente antes do deploy; `curl` em /, /pt/, /es/ com `stablecoins-avenia`, "Headline Prime" e `gtag('config'` inline, sem `headline-analytics-v2` |
| 2026-11-23 | **Quarta e quinta publicações do dia, sessão "Headline Prime".** 19:03: a pedido do Romero (card do fundo Headline Prime I FIP, grade de 4 fundos, lede, JSON-LD, llms.txt, hero com "five funds"), mas feita de `git archive 7049018` sem o patch reverso: publicou por engano o módulo GA4 (`assets/analytics/` no bucket, páginas com `<script type=module>`), a notícia Avenia, os `preload` de fontes e o fallback v1, que o commit `63d4495` tinha absorvido da pasta compartilhada (`git add index.html` sem `-p`). 19:07: correção com cópia montada de `git archive d78f689` + patch reverso `git diff cf686fc 4676db2` + `git diff 63d4495 7049018` (anos Rappi/ViajaNet) + só a edição do Prime + `llms.txt` de `7049018`, sem `assets/analytics/`; o `s3 sync --delete` apagou os dois `.js` do bucket. Estado publicado = estado anterior do ar + Headline Prime. Notícia Avenia e preloads voltaram a não publicados. Pendente no Git: `63d4495` em `main` contém hunks de outras sessões | `deploy-fix.log` sem erros, `delete:` dos dois `.js`; `curl` 19:08 em /, /pt/, /es/: 0 `headline-analytics-v2`, 1 `gtag('config'`, 1 "Headline Prime I FIP", 0 "Avenia capta", 0 `rel="preload"`; `aws s3 ls assets/analytics/` vazio; asset `.js` público responde 404 |
| 2026-11-23 | Logos do portfólio padronizados com romerorodrigues.com (44 WebP em `assets/img/logos/v2/`, CSS 44 px/72%) e publicados a pedido do Romero; logos antigos removidos do bucket. Push feito após rebase sobre o PR #1 (GA4 consent), que estava só no GitHub e não publicado; o deploy do dia saiu do commit `c3017b7`, anterior ao rebase, sem o módulo | Commits `c3017b7` (deploy) e `f81fae3` (push); `./deploy.sh` com `CreateInvalidation`; `curl` em /, /pt/, /es/ com 44 referências `logos/v2` e `aws s3 ls` sem `assets/analytics/` |
| 2026-11-23 | **Deploy feito por outra sessão** (não esta) às 19:03 BRT, da pasta de trabalho inteira: fundo Headline Prime, notícia Avenia, `assets/analytics/` e as três páginas com o módulo GA4 no lugar do gtag inline; `sitemap.xml` com lastmod 2026-11-23. A API de consentimento exigida pelo `ANALYTICS.md` responde: `POST` 200 no site real (`HEAD` 404). Banner opt-in e ausência de `googletagmanager` antes do aceite confirmados no navegador | `aws s3api head-object index.html` LastModified 2026-11-23T22:03:18Z; `aws s3 ls assets/analytics/` com dois .js de 19:03; invalidação CloudFront 22:03:34Z; `curl -I .../analytics/consent` 404 e `POST` 200 visto no painel do navegador |
| 2026-11-23 | Terceira publicação do dia a pedido do Romero: anos de investimento de Rappi (2016) e ViajaNet (2009) nos cards, commit `7049018`. Anos vêm de fontes públicas sobre a Redpoint (Clay/Global Venturing; Exame/PhocusWire), confirmados por Romero no chat; headline.com/portfolio não lista as duas empresas. Cópia de deploy montada a partir do commit no ar `d78f689` mais só essa alteração (módulo GA4 revertido, `assets/analytics/` removida), conferida linha a linha contra o HTML público: só 4 linhas de card por página. O commit `63d4495` da sessão "Headline Prime" (fundo de secundários, notícia Avenia, preloads de fonte) entrou em `main` entre os dois commits e **não foi publicado** | Commit `7049018`; `deploy2.log` sem `fail`; `curl` em /, /pt/, /es/ sem `data-year=""`, sem `headline-analytics-v2` e sem "Headline Prime" |
| 2026-11-23 | Segunda publicação do portfólio a pedido do Romero (logos com altura por área, cards por ano decrescente, Buk sem selo de setor), commit `d78f689`. Deploy feito com `./deploy.sh PASTA` a partir de `git archive HEAD` em pasta temporária, com o módulo GA4 do PR #1 revertido nas três páginas (patch reverso `git diff cf686fc 4676db2`) e `assets/analytics/` removida, para não publicar o módulo sem a API. Primeira tentativa abortou no `s3 sync` por erro de DNS (`AWS_IO_DNS_INVALID_NAME`); como o script usa `set -e`, parou antes dos cabeçalhos curtos e da invalidação, e foi repetida com sucesso. Descoberto que outras sessões do Claude editam esta pasta ao mesmo tempo (notícia Avenia, Headline Prime, métricas): um `commit --amend` engoliu a notícia de outra sessão e foi refeito com `commit-tree`; a notícia ficou no working tree, não publicada | Commit `d78f689`; `deploy.log` sem `fail`; `curl` em /, /pt/, /es/ com 44 `style="height:` e 0 `headline-analytics-v2`; `aws s3 ls` sem `assets/analytics/`; `list_sessions` do app |
| 2026-11-23 | Medição de desempenho e busca, só leitura: Lighthouse 100/100/100/100 em mobile nas três páginas e em desktop em /pt/ e /es/; home desktop 92 (CLS 0,177 por troca de fonte no `<h1>` e nos CTAs). CrUX sem dados (pouco tráfego). GSC 3 meses: 17 cliques, 1,04 mil impressões, posição média 15,9; 52 links externos, todos de romerorodrigues.com. Peso da home: 15 KB de HTML (br) + ~160 KB do gtag; imagens 320/480/640 AVIF/WebP com lazy. Faltam HSTS/CSP; HTTP/3 ativo | `pagespeed.web.dev` no Chrome; GSC Desempenho, Core Web Vitals, Indexação e Links; `curl -w` e `-I` em /, /pt/, /es/ |
| 2026-11-23 | Correção de CLS nas três páginas, commitada e enviada ao GitHub dentro de `ea61051` (commit da notícia Avenia, feito por outra sessão a partir da mesma pasta de trabalho); não publicada no S3: `preload` dos dois woff2; fontes de fallback com métricas (`size-adjust`, `ascent/descent-override`) calibradas no navegador, Georgia em cinco variantes por tamanho (Fraunces muda de largura com o eixo óptico) e Arial/Arial Bold para Manrope; `max-width` em `ch` trocado por `em` porque o `ch` da fonte de fallback mudava a largura das colunas. Hero e cabeçalho sem deslocamento com fonte real vs fallback em 412, 1024, 1280 e 1350 px nas três páginas | Medições por JavaScript no preview local (`localhost:8781`, espelho em scratchpad); `git diff` em `index.html`, `pt/index.html`, `es/index.html` |
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
