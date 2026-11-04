# AGENTS.md, headlinelatam.com

Site estático (HTML puro, em/pt/es) da Headline Latam, anexo de headline.com. S3 + CloudFront, DNS no Route 53, GA4 e Search Console.

## Antes de investigar acessos

1. Leia [ACESSOS-E-CONFIGURACOES.md](ACESSOS-E-CONFIGURACOES.md): sistemas, IDs, permissões comprovadas, comandos de leitura e pendências.
2. Não repita tentativas que o guia marca como negadas (ex.: introspecção IAM) sem motivo para achar que o acesso mudou.
3. Depois de uma descoberta relevante (acesso novo, bloqueio, ID, mudança de infra), atualize o guia com **data e evidência** e uma linha no histórico.

## Caminhos preferidos

- Código: `git` + `gh` (conta `romerorodrigues77`), repo `romerorodrigues77/headlinelatam.com`.
- AWS: CLI com `--profile romero` (no zsh, prefira `export AWS_PROFILE=romero`). A conta é compartilhada com outros projetos: filtre pelos IDs do guia.
- GA4 e Search Console: Claude in Chrome (sessão `romero.rodrigues@gmail.com`). O Windsor.ai não tem esta propriedade.
- Detalhes de infra: [AWS_SETUP.md](AWS_SETUP.md). SEO: [SEO.md](SEO.md).

## Regras

- Produção (deploy, DNS, CloudFront, GA4, GSC) só muda com pedido explícito na conversa. Ter acesso registrado no guia não é autorização.
- Não reaplique `infra/route53-records.json` sem antes incluir o TXT `google-site-verification` (ver guia, 3.3).
- Toda mudança de texto vale para `index.html`, `pt/index.html` e `es/index.html`.
- Arquivos em `/assets` são servidos com `immutable` (cache de 1 ano, sem revalidar). Ao alterar uma imagem ou fonte, salve com nome novo (ex.: `logo-v2.webp`) e atualize as referências nas três páginas; sobrescrever o mesmo nome deixa visitantes com a versão antiga por até um ano.
- Nunca grave senhas, chaves, tokens, cookies ou URLs temporárias nestes arquivos. Registre só como usar a autenticação já configurada.
- No guia, separe fato verificado (com data), informação dada pelo Romero e hipótese.
