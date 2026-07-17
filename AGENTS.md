# Elastly docs

Public documentation for Elastly, built on [Mintlify](https://mintlify.com). Pages are MDX with YAML
frontmatter; site config lives in `docs.json`.

This repo is **public**. The product monorepo is private. Never paste internal schema, tenant data,
credentials, or unreleased roadmap into a page.

## What Elastly is

Pricing intelligence: per-line, explainable prices that learn from real sales outcomes. Elastly
connects to the system a customer already runs on (NetSuite, Shopify, BigCommerce, WooCommerce),
builds a price from a base margin plus visible adjustments, clamps it to the customer's guardrails,
and queues it for review. It is additive margin stacking, not elasticity modelling.

Elastly is a generic, multi-tenant platform. Docs describe the platform and how a tenant configures
it. Never document a capability as if it were built for one customer.

## Terminology

- **Workspace**, not "project" or "account"
- **Guardrails** are the limits a price cannot cross; **strategies** shape a price inside them.
  A strategy can tighten a guardrail, never loosen one
- **Recommendation**, not "suggestion"
- **Write-back** (hyphenated) is Elastly pushing an approved price back to the source system
- **Connector** is the integration; **provider** is the system it talks to
- **Canonical** data is the provider-neutral shape everything downstream reads
- Say **API key**, not "token", in customer-facing copy

## Voice

Anything a customer reads must sound like a person wrote it.

- **No em dashes.** Use a comma, a period, parentheses, or a colon. Rewrite the sentence if it leans
  on one
- **No AI slop.** Banned: "not just X but Y", "it's not X, it's Y", "whether you're X or Y",
  "seamless", "effortless", "robust", "powerful", "leverage", "unlock", "elevate", "supercharge",
  forced rule-of-three, and a closing sentence that restates what was just said
- Short concrete sentences, real nouns, active voice, second person. Say the thing once
- Sentence case for headings. Bold for UI elements. Code formatting for files, commands, paths
- Read it aloud. If you would not say it to a customer's face, do not ship it

## The OpenAPI spec

`openapi.json` is a **copy**. The source of truth is `packages/api-contract/openapi.json` in the
private monorepo, which also generates the published SDKs.

- Never hand-edit `openapi.json` here. Fix the contract in the monorepo, then sync
- Sync with `./scripts/sync-openapi.sh /path/to/elastly` (defaults to `~/Sites/elastly`)
- Endpoint pages live in `api/endpoints/*.mdx` and carry `openapi: "METHOD /path"` frontmatter.
  Mintlify generates the parameters, schemas, and playground from the spec, so do not restate them
  in prose

## Playground safety

The spec has one server, `https://app.elastly.io`. It is production. There is no sandbox server.

Endpoints that only read are `playground: "interactive"`. **Every endpoint that writes is
`playground: "simple"`** so a docs page can never mutate live data. This is deliberate, not an
oversight:

- `writebacks/claim` leases real tasks; a stray call starves a running connector until the lease
  expires
- `ingest/.../commit` drains into canonical data
- `ingest/batches` and `.../records` stage real records
- `writebacks/ack` closes out live work

If a sandbox server is ever added to the spec, these can be reconsidered. Until then, adding a new
writing endpoint means adding it as `simple`.

## Components

Mintlify's component sandbox is not React-with-npm. Custom components must be self-contained:

- **No npm imports.** No `lucide-react`, no `@elastly/ui`
- **No cross-snippet imports**, no default exports (named only), no `React.lazy`
- Hooks (`useState`, `useEffect`, …) are pre-injected, no import needed

Prefer Mintlify built-ins (`Card`, `Steps`, `Note`, `Warning`, `Tabs`, `Accordion`, `Frame`) over a
custom component. Only build custom when the component carries real explanatory value.

## Checks

Validate `docs.json` before pushing. Pushing to `main` deploys.
