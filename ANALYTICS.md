# Shared GA4 consent and measurement

Prepared on 17 October 2026; not deployed by preparing these files.

All three institutional pages use the same content-addressed ES module generated from the AWS AI Research analytics source. GA4 destination remains `G-0B661FMB74`, property `557110567`, web stream `15951707490`. This replaces the previous regional opt-out default with the global optional opt-in policy requested by the owner.

The module renders consent copy in English, Portuguese or Spanish. Accept/decline controls are available together and a permanent privacy-preference button reopens them. Choices are versioned, expire after 180 days and are shared with `/ai-research/` through same-origin storage. Google is not loaded before consent or after a prior refusal. The necessary preference exchange uses `/ai-research/api/v1/analytics/consent`; deploy the compatible AWS API before these entries.

The tag uses explicit canonical pageviews, sanitized referring origins and controlled external campaign labels. Existing `content_group=en|pt|es` remains; `site_area=institutional` separates this content from research. Contact clicks use `contact_click`, not a claimed confirmed lead; no contact addresses are sent to Google. Outbound domains and a 90% scroll signal use controlled events. Ads and Google Signals are disabled. Private preview hostnames do not load the Google library.

Before publishing, apply the reviewed GA4 settings, including disabling overlapping enhanced measurement, and register the event dimensions/metrics. Preserve a snapshot of existing GA4 settings. Definitions, tests, the four-page Looker blueprint and future BigQuery SQL live with the AWS implementation in `docs/analytics.md` and `analytics/`. Looker Studio cloud creation is pending because the service returned a browser timeout; no BigQuery export or billing is enabled.

Regenerate using Node 22.23.3 in the AWS checkout:

```sh
npm run build:analytics:institutional
node --import tsx scripts/prepare-institutional-analytics.ts /absolute/path/to/this/checkout
```

The generator updates only `index.html`, `pt/index.html`, `es/index.html` and the new JS asset. It never publishes. The JS filename contains its SHA-256 prefix; do not overwrite immutable asset contents under an old name. The final asset bytes and all three real HTML pages were exercised through a local same-origin proxy with the production research build.

Review and authorize production publication separately, as required by this project's instructions. Upload the new asset with JavaScript content type and immutable cache; publish the three HTML entries with their existing short-cache metadata, then invalidate those entries. Do not run the full-bucket `--delete` deploy against an incomplete directory. No DNS, IAM, CloudFront behavior, links or sitemap changes are required.
