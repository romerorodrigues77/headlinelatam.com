# SEO, headlinelatam.com

Revisão de 4 de outubro de 2026, com o site em três idiomas. Substitui a auditoria de 2 de outubro. Sem ferramenta de SEO conectada (Ahrefs/Semrush), então volume e dificuldade são estimativas qualitativas.

## Resumo

O site está tecnicamente redondo nas três versões: hreflang recíproco, canonicals próprios, sitemap com alternates, dados estruturados, HTTPS, CDN com Brotli e 100 em SEO e Práticas no PageSpeed. A home em inglês já está indexada; `/pt/` e `/es/` foram enviadas para a fila prioritária de rastreamento hoje.

O limite agora é **autoridade e profundidade**, não técnica:

1. **Backlinks.** Domínio de 2 dias, sem links. Prioridade: headline.com (página de São Paulo), romerorodrigues.com, LinkedIn da Headline, Substack, Uncapped e sites do portfólio.
2. **Uma página por intenção.** Hoje são três cópias da mesma home. As buscas não-marca com chance real pedem páginas próprias: Headline XP FIP (cotistas), "como captar" (fundadores), notícias do portfólio.
3. **Esperar e medir.** Indexação de PT/ES leva de dias a algumas semanas; os relatórios do Search Console começam a encher em ~48 h.

## Estado por versão

| | `/` (en) | `/pt/` (pt-BR) | `/es/` (es) |
|---|---|---|---|
| `<html lang>` | en | pt-BR | es-419 |
| hreflang | en, pt-BR, es, x-default | idem | idem |
| Canonical | `/` | `/pt/` | `/es/` |
| `og:locale` | en_US (+pt_BR, es_LA) | pt_BR (+en_US, es_LA) | es_LA (+en_US, pt_BR) |
| Imagem de compartilhamento | `og.png` | `og-pt.png` (nova) | `og-es.png` (nova) |
| `content_group` no GA4 | en | pt | es |
| Google | Indexada | Fila prioritária (4/out) | Fila prioritária (4/out) |

Decisões de idioma: espanhol latino-americano neutro ("inversionistas", "portafolio", "tú", valores em milhões). `hreflang="es"` porque o Google não aceita o código regional `419`. x-default no inglês. Sem redirecionamento automático por idioma do navegador (o Google recomenda deixar a escolha com o visitante; há seletor no menu).

## O que mudou nesta revisão

| Item | Antes | Agora |
|---|---|---|
| Imagem OG em PT/ES | Texto em inglês em links compartilhados | `og-pt.png` e `og-es.png` no mesmo layout; também no sitemap e no JSON-LD |
| Espanhol | Só "venture capital" | "capital de riesgo" na description e no texto de abertura (termo com mais busca em espanhol) |
| Contraste | Cinza `#797979` sobre o fundo: 3,9:1 (reprova WCAG AA) | `#6b6b6b`: 4,8:1 |
| Links da equipe | 6 "LinkedIn" e 6 "E-mail" com o mesmo texto e destinos diferentes | `aria-label` por pessoa, no idioma da página |
| Fontes | CSS do Google Fonts bloqueava a renderização (~1,9 s estimado no 4G lento) | Carregamento assíncrono (`preload` + `onload`), com `noscript` |
| GA4 | Sem segmentação por idioma | `content_group` en/pt/es (relatório "Grupo de conteúdo", sem dimensão personalizada) |
| Search Console | Domínio não verificado; sitemap lido antes de PT/ES | Domínio verificado por TXT; sitemap reenviado; indexação solicitada para `/`, `/pt/`, `/es/` |
| GA × Search Console | Não vinculados | Vinculados (propriedade de Domínio), coleção "Search Console" publicada no GA |
| `generate_lead` | Evento comum | Evento principal (conversão) |

## Search Console

- **Propriedades:** Domínio `headlinelatam.com` (verificada por TXT no Route 53, cobre www/http/subdomínios) e prefixo `https://headlinelatam.com/` (verificada pelo GA; não remova a tag gtag). Use a de Domínio no dia a dia.
- **TXT de verificação:** no apex da zona `Z0269845L2AK7KOYU2TT`, no mesmo registro do SPF `v=spf1 -all`. Não apague; é ele que mantém a verificação.
- **Sitemap:** `https://headlinelatam.com/sitemap.xml`, 3 URLs, cada uma com 4 alternates `xhtml:link` e imagem. Reenviado em 4/out; a última leitura (4/out, antes das versões novas) achou 1 página e a próxima deve achar 3.
- **Indexação:** `/` indexada, HTTPS válido. `/pt/` e `/es/` "O Google não reconhece o URL" até o rastreamento; indexação solicitada. O relatório "Páginas" ainda está em processamento (propriedade nova).
- **Segmentação internacional:** o relatório antigo foi descontinuado pelo Google; o hreflang é o sinal. Conferir em ~1 semana se `/pt/` e `/es/` aparecem com canonical próprio (Inspeção de URL → "URL canônico selecionado pelo Google").

## Google Analytics 4

- Conta Headline Latam (410481438), propriedade 557110567, `G-0B661FMB74`, fuso São Paulo, BRL, retenção 14 meses.
- **Dados até 3/out:** 58 visualizações, 38 usuários, 46 sessões; 26 `generate_lead` de apenas 2 usuários, quase certamente testes internos.
- **Idioma:** `content_group` = en/pt/es em cada página. Em Relatórios → Engajamento → Páginas e telas, troque a dimensão para "Grupo de conteúdo". Começa a contar a partir do deploy desta revisão.
- **Conversão:** `generate_lead` é evento principal. Os eventos principais `close_convert_lead`, `qualify_lead` e `purchase` foram criados automaticamente pelo objetivo "Gerar leads" e não são disparados pelo site; podem ser ignorados.
- **Search Console no GA:** vinculado; relatórios em Relatórios → Search Console (dados em ~48 h).
- **Recomendado:** filtro de tráfego interno (Admin → Fluxos de dados → Configurar tag → Definir tráfego interno) com o IP do escritório, para os testes do time não inflarem leads; adicionar um segundo administrador.

## PageSpeed (celular, `/pt/`, antes desta revisão)

| Desempenho | Acessibilidade | Práticas | SEO |
|---|---|---|---|
| 90 | 96 | 100 | 100 |

LCP 2,9 s, CLS 0,018, TBT 20 ms. Os dois pontos que tiravam nota (fontes bloqueantes e contraste) foram corrigidos nesta revisão; rodar de novo após o deploy. Restante: imagens (~11 KiB em WebP para as fotos da equipe).

## Palavras-chave por idioma

| Idioma | Palavra-chave | Dificuldade | Oportunidade | Página hoje | Próximo passo |
|---|---|---|---|---|---|
| PT | headline brasil / headline latam | Fácil | Alta | `/pt/` | Backlinks de marca |
| PT | headline xp fip / fundo headline xp | Fácil | Alta | `/pt/` (seção Fundos) | Página `/pt/fundos/headline-xp/` (com compliance XP Asset) |
| PT | como captar investimento com a headline | Fácil | Alta | `/pt/#contact` | `/pt/pitch/` com FAQ |
| PT | venture capital são paulo | Difícil | Média | `/pt/` | Perfil da Empresa no Google |
| PT | fundo de venture capital brasil | Difícil | Média | `/pt/` | Backlinks + páginas de fundo |
| ES | capital de riesgo brasil / venture capital brasil | Moderada | Alta | `/es/` | Backlinks de mídia regional (Contxto, LAVCA) |
| ES | fondos de venture capital américa latina | Difícil | Média | `/es/` | Listas de fundos (LAVCA, Crunchbase) apontando para `/es/` |
| ES | invertir en startups latinoamérica / levantar capital startup | Moderada | Média | `/es/` | `/es/pitch/` com FAQ |
| ES | headline latam | Fácil | Alta | `/es/` | Marca |
| EN | headline latam / headline brazil | Fácil | Alta | `/` | Marca |
| EN | early stage venture capital latin america | Difícil | Média | `/` | Backlinks + conteúdo |
| EN | pismo visa headline | Fácil | Baixa | `/` | Case curto |

## Checklist técnico

| Verificação | Status | Detalhe |
|---|---|---|
| hreflang recíproco e autorreferente | Passa | 3 páginas + sitemap, x-default no inglês |
| Canonical | Passa | Um por página; www, http e `/index.html` redirecionam 301 |
| Sitemap | Passa | 3 URLs com alternates; enviado nas duas propriedades |
| robots.txt | Passa | Tudo liberado, inclusive crawlers de IA |
| Dados estruturados | Passa | Organization, WebSite (3 idiomas), WebPage por idioma |
| HTTPS / HSTS | Passa | ACM, TLS 1.2+ |
| Mobile | Passa | Sem rolagem horizontal; menu hambúrguer abaixo de 1060px |
| Contraste (WCAG AA) | Passa (após deploy) | `#6b6b6b` |
| Fontes | Passa (após deploy) | Assíncronas |
| Imagens OG por idioma | Passa (após deploy) | |
| Imagens da equipe | Aviso | JPG; WebP economizaria pouco |
| Backlinks | Falha | Domínio novo |
| Conteúdo não-marca | Falha | Só a home, em 3 idiomas |

## Plano de ação

**Esta semana**

- Deploy desta revisão e novo PageSpeed. 10 min.
- Pedir os links: página de São Paulo em headline.com, rodapé de romerorodrigues.com, site no LinkedIn da Headline Brazil, Substack e Uncapped. Impacto alto, 1 h.
- Filtro de tráfego interno no GA4. 10 min.
- Perfil da Empresa no Google para o escritório (Av. Chedid Jafet, 75, 28º andar). Impacto médio para buscas locais. 30 min mais verificação.
- Em ~7 dias: conferir na Inspeção de URL se `/pt/` e `/es/` foram indexadas com canonical próprio e se o sitemap mostra 3 páginas.

**Este trimestre**

- `/pt/pitch/` e `/es/pitch/` (e `/pitch/`) com FAQ estruturado: tese, estágio, cheque, processo. Impacto alto.
- Página do Headline XP FIP em PT, com revisão de compliance. Impacto alto para cotistas.
- Notícias do portfólio como páginas próprias, com resumo original em PT/ES e link para a matéria. Impacto médio, contínuo.
- Perfis em diretórios do setor (LAVCA, Crunchbase, Dealroom, ABVCAP) apontando para a versão no idioma certo.

## Manutenção

- Toda mudança de texto precisa ser feita em `index.html`, `pt/index.html` e `es/index.html`.
- Ao criar uma página nova, adicionar as três versões ao `sitemap.xml` com os 4 alternates e o hreflang em cada página.
- `deploy.sh` já dá cache curto para as três páginas, sitemap, robots e llms.txt.
