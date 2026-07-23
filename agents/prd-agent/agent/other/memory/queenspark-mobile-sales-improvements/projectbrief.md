---
version: "1.1.0"
title: "Queenspark Ecommerce Rebuild And Mobile Sales Improvements Project Brief"
date: "2026-07-01"
timezone: "Europe/Berlin"
status: "draft"
---
# Queenspark Ecommerce Rebuild And Mobile Sales Improvements Project Brief

## Summary

Queenspark is a LightSpeed client with a live ecommerce website at <https://queenspark.com/>. The active opportunity is now an RFP response for a modern ecommerce platform, with mobile conversion improvements folded into a broader rebuild and integration proposal.

The RFP asks vendors to propose design, build, integration, hosting where applicable, support and maintenance for a modern ecommerce platform. It specifically includes Microsoft Dynamics 365 Finance and Operations integration, real-time store-level stock visibility, Click & Collect, multi-store fulfilment, improved customer journey, AI-ready search/product discovery, security/POPIA controls, SLA commitments, implementation planning and detailed commercial pricing.

Queenspark has asked LightSpeed to submit the final proposal on 2026-07-01 after the original 2026-06-30 deadline passed. Queenspark has stated that additional clarification from LightSpeed at this stage could be considered an unfair advantage over other bidders because LightSpeed has extensive prior knowledge of the current site.

## Confirmed Sources

- Live site: <https://queenspark.com/>
- RFP: `Queenspark_RFP_E-Commerce_June 2026.pdf`
- Theme repo: `lightspeedwp/QueensparkTheme`
- Product/navigation sync repo: `lightspeedwp/QueensPark-Nav-Sync`
- Mobile improvements source: `Queenspark - Mobile Improvements - June 2026`
- Discovery questions / rebuild communication source: `Queenspark - Rebuild Emails Communication`
- Meeting notes: `Queenspark Estimate Meeting - 2026/06/23 11:56 SAST - Notes by Gemini`
- Product sync PRD/source: `Queenspark Discovery to PRD`

## Confirmed Repo Context

- `QueensparkTheme` is a private WordPress theme repo using `main` as default branch.
- `style.css` identifies it as the Queenspark website theme and notes it is based on Underscores.
- `package.json` indicates a Gulp/Bulma/Sass frontend toolchain.
- `QueensPark-Nav-Sync` is a private repo using `main` as default branch.
- The Nav Sync README describes WooCommerce product variation, price, stock, image and tariff-code-related sync behaviour.

## Initial Scope Hypothesis

The proposal should be positioned as a phased ecommerce rebuild rather than an isolated mobile optimisation. The strongest route is likely:

- Phase 1: WordPress/WooCommerce block theme rebuild, UX/UI refresh, mobile conversion improvements, template parity, plugin cleanup, analytics/tracking validation and launch QA.
- Phase 2: Dynamics 365 F&O product/order/stock integration discovery and API implementation, including data contract and multi-store fulfilment planning.
- Ongoing: hosting/support/SLA/care plan with explicit assumptions and exclusions.

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
