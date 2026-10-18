#!/usr/bin/env bash
# Narrow release: three institutional entries and one immutable analytics asset. Never bucket sync/delete.
set -euo pipefail
cd "$(dirname "$0")"
analytics_asset=$(python3 - <<'PY'
from pathlib import Path
import hashlib,re
paths=[]
for file in ['index.html','pt/index.html','es/index.html']:
    html=Path(file).read_text()
    match=re.search(r'src="(/assets/analytics/headline-analytics-v2-([a-f0-9]{12})\.js)"',html)
    if not match: raise SystemExit('Missing reviewed analytics asset')
    if hashlib.sha256(Path('.'+match[1]).read_bytes()).hexdigest()[:12] != match[2]: raise SystemExit('Analytics asset checksum mismatch')
    paths.append(match[1].lstrip('/'))
if len(set(paths)) != 1: raise SystemExit('Institutional pages do not use one identical runtime')
print(paths[0])
PY
)
if [[ "${1:-}" != "--apply" ]]; then
  printf 'Prepared only; no AWS requests or writes. After production authorization:\n'
  printf '  upload immutable %s\n  publish index.html, pt/index.html, es/index.html\n  invalidate their public and origin paths\n' "$analytics_asset"
  exit 0
fi
git rev-parse --is-inside-work-tree > /dev/null
[[ -z "$(git status --porcelain)" ]] || { printf 'Commit reviewed changes before publication.\n'; exit 1; }
analytics_account=$(aws sts get-caller-identity --profile romero --query Account --output text)
[[ "$analytics_account" == "160184161667" ]] || { printf 'Unexpected AWS account.\n'; exit 1; }
umask 077
analytics_backup=".local/analytics-backup/$(date -u +%Y%m%dT%H%M%SZ)"
mkdir -p "$analytics_backup/pt" "$analytics_backup/es"
for analytics_page in index.html pt/index.html es/index.html; do
  aws s3 cp "s3://headlinelatam.com/$analytics_page" "$analytics_backup/$analytics_page" --profile romero --only-show-errors
  aws s3api head-object --bucket headlinelatam.com --key "$analytics_page" --profile romero > "$analytics_backup/${analytics_page//\//-}.metadata.json"
done
aws s3 cp "$analytics_asset" "s3://headlinelatam.com/$analytics_asset" --profile romero --only-show-errors --content-type 'text/javascript; charset=utf-8' --cache-control 'public,max-age=31536000,immutable'
for analytics_page in index.html pt/index.html es/index.html; do
  aws s3 cp "$analytics_page" "s3://headlinelatam.com/$analytics_page" --profile romero --only-show-errors --content-type 'text/html; charset=utf-8' --cache-control 'public,max-age=300,s-maxage=31536000,stale-while-revalidate=86400'
done
aws cloudfront create-invalidation --distribution-id E4NSQMSB8LK1Y --profile romero --paths '/' '/index.html' '/pt/' '/pt/index.html' '/es/' '/es/index.html'
printf 'Upload submitted; verify invalidation completion and real browser traffic. Backup: %s\n' "$analytics_backup"
