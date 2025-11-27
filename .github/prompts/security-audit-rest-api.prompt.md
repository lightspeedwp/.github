# WordPress REST API Security Audit Prompt

You are a **security-minded auditor** for a WordPress site’s REST API.

Your job: for the following REST API base URL, enumerate all routes and namespaces **visible to a logged-out user** and produce a **risk-focused report plus a CSV of endpoints**.

---

## 🔗 Targets to scan

Scan the following REST API base URLs (adjust path for subdirectory installations):

1. {{site_1_name}} — {{site_1_rest_base_url}} (e.g., /wp-json/ or /blog/wp-json/)
2. {{site_2_name}} — {{site_2_rest_base_url}}
3. {{site_3_name}} — {{site_3_rest_base_url}}

## Normalise targets before scanning: ensure absolute URLs (scheme + host + path), normalise trailing slashes, and avoid duplicate slashes when joining route paths

## ⚙️ Scope & Assumptions

- Test strictly as **anonymous** (no cookies, no Authorization header, no WP nonce).
- Start at each provided REST base URL (e.g., `/wp-json/`, `/blog/wp-json/`) to discover `routes` and `namespaces`, then follow each route’s `schema` link when present.
- Respect HTTP 429/403/401; do **not** attempt authenticated flows or bypasses.
- **Allowlist:** endpoints whose sole purpose is checking if an email exists, commonly named like `email-exists`. Note in findings that it’s allowlisted.
- A **WAF/CDN is present** — enforce a global throttle of ≤1 request/second (no concurrent requests) and reset the timer at the start of each target. Use exponential backoff with jitter on 429, and cap total samples per namespace to avoid rate limits (e.g., ≤3 samples/namespace).

---

## 🧭 What to Collect Per Endpoint (as Anonymous)

For each discovered route:

- **Methods (anon):** list HTTP methods that respond without auth.
- **Args:** from the route schema (types, required), and whether `context=edit` is blocked.
- **Sample (GET only):** If GET is allowed and safe (no mutation), fetch a minimal page (e.g., `?per_page=1&_fields=id,slug,name`) to see example fields. Adjust `_fields` based on schema when available.
- Include `per_page` only when present in `args`.
- Do not sample item routes that require path params (e.g., `/wp/v2/posts/{id}`).
- **Description:** use route `schema.title`/`description`; if missing, infer concisely from path.
- **Security concern?:** Yes/No with reason (see “Risk Model” below).

---

## ⚠️ Risk Model

Flag **Security concern = Yes** if any of the following are visible to anonymous users:

- **User PII:** emails, usernames, first/last names, author slugs equal to login, user meta, IPs.
- **Commerce:** orders, customers, carts, stock levels if sensitive.
- **Content exposure:** drafts, private posts, unlisted media, presigned URLs.
- **System leakage:** nonces, internal IDs, absolute file paths, debug traces.
- **Enumeration vectors:** predictable numeric IDs, `_embed`/`_envelope` leaks.
- **Plugin data:** bookings, form submissions, CRM leads, API keys, webhooks.
- **CORS:** overly permissive `Access-Control-Allow-Origin` with credentials.
- **Rate limiting:** none present on enumeration-prone endpoints (note as “operational” risk).

🟢 **Do not flag `email-exists` endpoints** — record them as **Allowlisted** instead.

---

## 📄 Output (Deliverables)

Produce **both**:

1. A **Markdown report** (single document) with sections per target base URL.
2. A **CSV file** named `rest-endpoints.csv` with one row per endpoint across all targets.

---

### 🧾 Markdown Structure (Repeat Per Target)

For each target, create a section like this:

## 🎯 Target 1: {{site_name}}

- **Base URL:** `<exact base URL>`
- **Scan time:** ISO 8601
- **Namespaces found:** `[ … ]`

**Findings Table**

| Route                        | Methods (anon) | Description           | Example fields (truncated) | Security concern? | Reason                                                       |
| ---------------------------- | -------------- | --------------------- | -------------------------- | ----------------- | ------------------------------------------------------------ |
| /wp/v2/users                 | GET            | List of users         | id, name, slug, link       | **Yes**           | Exposes author slugs (may equal login); username enumeration |
| /wp/v2/posts                 | GET            | Public posts          | id, title, link            | No                | Only published content, no PII                               |
| /some-plugin/v1/email-exists | GET            | Email existence check | exists                     | **Allowlisted**   | Requested allowlist; verify no extra data                    |

**Per-Target Summary**

- **Total endpoints tested (anon):** N
- **Endpoints with concerns:** N
- **Top risks:** bullet list
- **Recommended remediations (prioritized):**
  1. Restrict or remove `/wp/v2/users` for anonymous users.
  2. Limit `_fields` and `_embed` to approved fields.
  3. Tighten CORS policies.
  4. Add rate limiting / WAF rules.
  5. Review plugin namespaces and disable unnecessary public routes.

---

### 📊 CSV Specification

Create `rest-endpoints.csv` with the following headers:

site,namespace,route,methods_anon,description,status_code,sampled,get_params_used,example_fields_truncated,security_concern,reason,notes

**Column notes:**

- `site`: product | insights | help-centre
- `status_code`: HTTP response status (200/401/403/404)
- `sampled`: true/false (whether a GET sample was performed)
- `get_params_used`: query string used for sampling (e.g., `per_page=1&_fields=id,slug`)
- `security_concern`: Yes/No/Allowlisted

---

## 🧪 Method Notes

- Use a **stateless HTTP client** (no cookies).
- Use conservative sampling (`per_page=1`, minimal `_fields`).
- Stop sampling if repeated 429s occur.
- Record `Not public` for 401/403 responses; don’t probe further.
- If schemas exist but responses are empty, use schema for `description` and `args`.

---

## 🧱 Nice-to-Have (Optional)

- Detect hardening (e.g., `/wp/v2/users` removed, oEmbed disabled).
- Note version banners or plugin namespace patterns (e.g., `/wc/v3`, `/contact-form-7/v1`).

---

## ▶️ Begin Task

**Begin now.**  
Produce the **Markdown report first**, then create and return `rest-endpoints.csv` with the specified columns.

---
