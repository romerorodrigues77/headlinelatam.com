# SEO, headlinelatam.com

Auditoria de 2 de outubro de 2026. Escopo: a home (página única), infraestrutura AWS, medição e indexação. Sem ferramenta de SEO conectada (Ahrefs/Semrush), então volume e dificuldade abaixo são estimativas qualitativas a partir do SERP e da imprensa.

## Resumo

A base técnica agora está sólida: HTML estático, rápido, com dados estruturados, sitemap, robots, canonical único e CDN com compressão. O maior limite de ranqueamento não é técnico, é de **escopo**: o site é uma página única, em inglês, sobre um público que busca majoritariamente em português. As três alavancas de maior impacto são:

1. **Versão em português**: feita em 4 de outubro de 2026, em `/pt/`, com `hreflang` en/pt-BR/x-default nas duas páginas e no sitemap. Fundadores e os ~12.500 cotistas do Headline XP FIP buscam em PT.
2. **Links de autoridade**: headline.com (página do escritório de São Paulo), romerorodrigues.com, LinkedIn, Substack, Uncapped e as empresas do portfólio. Domínio novo sem backlinks não ranqueia nem para a marca.
3. **Páginas próprias para o que só existe aqui**: o fundo Headline XP (informação para cotistas e imprensa) e "como captar com a Headline" (pitch, FAQ).

Diagnóstico geral: **fundação forte, conteúdo raso para buscas não-marca.**

## O que já foi feito

**Versão em português (4 de outubro de 2026):** `/pt/` é a home traduzida, com o mesmo layout, título e descrição próprios em PT, `og:locale` pt_BR, seletor EN/PT no menu e `hreflang` recíproco. Toda edição de texto agora precisa ser feita em todas as versões.

**Versão em espanhol (4 de outubro de 2026):** `/es/`, em espanhol latino-americano neutro (vocabulário pan-regional: "inversionistas", "portafolio"; tratamento por "tú"; valores em milhões, "US$ 1.000 M"). `lang="es-419"` na página e `hreflang="es"` (o Google não aceita o código regional 419), `og:locale` es_LA. As três páginas (`index.html`, `pt/index.html`, `es/index.html`) se referenciam por `hreflang`, inclusive no sitemap, com x-default no inglês.

| Item | Antes | Agora |
|---|---|---|
| `<title>` | "Headline Latam" (14 caracteres, sem palavra-chave) | "Headline Latam \| Venture Capital in Brazil and Latin America" (60) |
| Meta description | Descritiva, sem "venture capital"/"Seed to Series B" | 149 caracteres, com estágio, região e CTA |
| Favicon | Só data-URI SVG (Google não exibe no resultado) | `/favicon.ico`, `/favicon.svg`, `apple-touch-icon`, manifest |
| Open Graph / Twitter | Sem site_name, dimensões, alt, twitter:* | Completo |
| Dados estruturados | Organization simples, `sameAs` apontando para o pai | `@graph` com Organization (logo 512px, endereço, área, `parentOrganization`, 6 `employee` com LinkedIn), WebSite e WebPage |
| Links quebrados | 6 cards do portfólio com `href="#"` abrindo a própria página em nova aba | Viraram cards sem link |
| robots.txt / sitemap.xml | Não existiam | Criados; sitemap com imagem OG |
| llms.txt | Não existia | Resumo factual para motores de resposta (ChatGPT, Perplexity) |
| 404 | S3 devolvia XML 403 | `404.html` com status 404 real e `noindex` |
| Domínio canônico | Nada impedia www, `index.html` e `*.cloudfront.net` duplicados | CloudFront Function: www → apex (301), `/index.html` → `/` (301); `X-Robots-Tag: noindex` no host cloudfront.net |
| Conteúdo duplicado via S3 | Bucket público acessível direto | Bucket privado, só o CloudFront lê (OAC) |
| Compressão | Desligada (53,7 KB de HTML cru) | Brotli/gzip ligados |
| HTTP | HTTP/2 | HTTP/2 + HTTP/3 |
| Segurança | Sem cabeçalhos | HSTS, nosniff, X-Frame-Options, Referrer-Policy |
| Cache | robots/sitemap herdariam 1 ano | HTML, XML, TXT e manifest com 5 min |
| Analytics | Nenhum | GA4 `G-0B661FMB74` com Consent Mode v2 e banner de cookies |
| Conversões | Nenhuma | Evento `generate_lead` em todo clique de e-mail (deck, imprensa, equipe), com seção de origem |

### Google Analytics 4

- Conta **Headline Latam** (410481438), propriedade **headlinelatam.com - GA4** (557110567), fuso São Paulo, BRL, retenção de dados 14 meses.
- Fluxo Web `https://headlinelatam.com`, ID de medição `G-0B661FMB74`, métricas otimizadas ligadas (rolagem, cliques de saída nos logos e notícias, etc.).
- Consent Mode v2: anúncios sempre negados; analytics negado por padrão no EEE/Reino Unido/Suíça (GDPR) e permitido no resto (LGPD com aviso e opção de recusa). O banner guarda a escolha e o rodapé tem "Cookie settings".
- **Pendente (manual, 10 s):** depois do primeiro clique real em um e-mail do site, em Admin → Eventos, marque a estrela de `generate_lead` para virar evento principal.
- Recomendado: em Admin → Vínculos de produtos, vincular o Search Console; adicionar outro admin (ex. conta Headline) em Gerenciamento de acesso.

### Google Search Console

- Propriedade **prefixo de URL** `https://headlinelatam.com/` verificada automaticamente pelo Google Analytics (não remova a tag gtag do `<head>`, ela é o método de verificação).
- `sitemap.xml` enviado em 2 de outubro de 2026. O primeiro status foi "Não foi possível buscar", normal nas horas seguintes à troca de nameservers; o Google tenta de novo sozinho. Se continuar assim depois de 48 h, reenvie.
- Propriedade **Domínio** `headlinelatam.com` criada mas ainda **não verificada**. Ela cobre www, http e subdomínios, e é a melhor prática. Para concluir: Search Console → headlinelatam.com → Verificar → em "Instruções para" escolha **Qualquer provedor de DNS**, copie o `google-site-verification=...` e adicione como TXT no apex da zona Route 53 `Z0269845L2AK7KOYU2TT`.
- Pendente (um clique): Inspeção de URL → `https://headlinelatam.com/` → **Solicitar indexação**.

## Problemas na página

| Página | Problema | Severidade | Correção |
|---|---|---|---|
| / | Domínio novo, zero backlinks | Alta | Links de headline.com, romerorodrigues.com, LinkedIn da Headline, Substack, Uncapped e portfólio |
| / | H1 não cita "Brazil" | Baixa | Opcional: "Early-stage venture capital for Brazil and Latin America, with a global wingspan." |
| / | Seção de notícias só aponta para fora | Média | Resumos próprios por rodada (2 a 3 frases) aumentam texto original indexável |
| / | Fotos da equipe em JPG (25 a 56 KB cada) | Baixa | Converter para WebP (cwebp já instalado) |
| / | Fontes do Google bloqueiam renderização | Baixa | Auto-hospedar Manrope/Fraunces em WebFont com `preload` |

## Palavras-chave

| Palavra-chave | Dificuldade | Oportunidade | Posição atual | Intenção | Conteúdo recomendado |
|---|---|---|---|---|---|
| headline latam / headline brasil | Fácil | Alta | Fora (domínio recém-publicado) | Navegacional | Home (já otimizada) |
| headline xp fip | Fácil | Alta | Fora | Navegacional/informacional | Página `/pt/fundos/headline-xp/` |
| fundo headline xp rentabilidade / cotas | Fácil | Alta | Fora | Informacional (cotistas) | Mesma página, com link para XP Asset |
| romero rodrigues headline | Fácil | Média | Fora (headline.com e imprensa ranqueiam) | Navegacional | Bio + link para romerorodrigues.com |
| como captar investimento com a headline | Fácil | Alta | Fora | Transacional | `/pt/pitch/` com FAQ (FAQPage) |
| venture capital são paulo | Difícil | Média | Fora | Comercial/local | Perfil da Empresa no Google + home PT |
| fundo de venture capital brasil | Difícil | Média | Fora | Comercial | Home PT + páginas de fundo |
| investimento seed brasil / série A brasil | Moderada | Média | Fora | Comercial | `/pt/pitch/` + artigos |
| early stage venture capital latin america | Difícil | Média | Fora | Comercial | Home EN |
| fundo de vc para pessoa física | Moderada | Média | Fora | Informacional | Artigo sobre o modelo Headline XP (revisar com compliance) |
| redpoint eventures | Fácil | Média | Fora | Navegacional (histórico) | Página de história dos fundos |
| cap table grátis | Moderada | Média | Fora | Transacional | Uncapped (já linkado) |
| pismo visa headline | Fácil | Baixa | Fora | Informacional | Case curto em `/pt/` |
| startups headline portfólio brasil | Fácil | Média | Fora | Navegacional | Seção de portfólio na versão PT |

## Lacunas de conteúdo

| Tópico | Por que importa | Formato | Prioridade | Esforço |
|---|---|---|---|---|
| Headline XP FIP | ~12.500 cotistas e imprensa buscam o fundo por nome | Página do fundo (estrutura, gestão, portfólio, contato XP) | Alta | Moderado, **exige revisão de compliance (CVM/XP Asset)** |
| Como captar com a Headline | Fundadores querem tese, estágio, cheque e processo | Página com FAQ e marcação FAQPage | Alta | Rápido |
| Notícias do portfólio | Conteúdo fresco, links de veículos | Uma página por rodada, com resumo próprio | Média | Contínuo |
| História: Redpoint eventures → Headline | Buscas de marca histórica | Página/linha do tempo | Baixa | Rápido |

## Checklist técnico

| Verificação | Status | Detalhe |
|---|---|---|
| HTTPS | Passa | Certificado ACM para apex e www, TLS 1.2+ |
| Canonical único | Passa | apex; www e `/index.html` redirecionam 301 |
| robots.txt | Passa | Tudo liberado, inclusive crawlers de IA |
| sitemap.xml | Passa | Enviado no Search Console |
| Dados estruturados | Passa | Organization, WebSite, WebPage; validar no Rich Results Test após publicar |
| Mobile | Passa | Viewport, layout fluido |
| Compressão | Passa | Brotli |
| Página 404 | Passa | Status 404, `noindex` |
| Duplicação S3/CloudFront | Passa | Bucket privado; preview com `noindex` |
| Imagens | Aviso | Fotos da equipe em JPG |
| Fontes | Aviso | Google Fonts bloqueante |
| hreflang | Passa | `/` (en), `/pt/` (pt-BR) e `/es/` (es), x-default no inglês, nas páginas e no sitemap |
| Backlinks | Falha | Domínio novo |

## Concorrência (sinais qualitativos)

| Dimensão | headlinelatam.com | headline.com | Fundos locais (ex. Bossanova, Canary, Kaszek) | Vencedor |
|---|---|---|---|---|
| Palavras-chave | ~0 (recém-publicado) | Marca global | Marca + termos de VC em PT | Locais |
| Profundidade de conteúdo | 1 página | Portfólio, equipe, artigos | Portfólio, blog, materiais para fundadores | headline.com |
| Frequência de publicação | Nenhuma | Regular | Regular | Concorrentes |
| Backlinks | Nenhum | Altos | Médios/altos | headline.com |
| Técnica | Excelente | Boa | Variável | headlinelatam.com |
| Recursos de SERP | Nenhum | Painel de conhecimento | Painel em alguns | headline.com |

## Plano de ação

**Esta semana**

- Search Console: solicitar indexação da home e verificar a propriedade de Domínio (instruções acima). Impacto alto, 5 minutos.
- Pedir link para headlinelatam.com na página de São Paulo de headline.com e no rodapé de romerorodrigues.com. Impacto alto, 1 hora.
- Atualizar o site no LinkedIn da Headline Brazil, no Substack e no Uncapped. Impacto médio, 30 minutos.
- Criar o Perfil da Empresa no Google para o escritório da Av. Chedid Jafet. Impacto médio para "venture capital são paulo", 30 minutos mais verificação por correio ou vídeo.

**Este trimestre**

- Página do Headline XP FIP. Impacto alto, meio dia mais revisão de compliance.
- `/pt/pitch/` com FAQ estruturado. Impacto médio, 2 horas.
- Uma página por rodada relevante do portfólio, em PT, com resumo próprio e link para a matéria. Impacto médio, contínuo.
- Auto-hospedar fontes e converter fotos para WebP. Impacto baixo, 1 hora.
