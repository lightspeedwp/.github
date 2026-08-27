---
file_type: documentation
version: "1.0.0"
title: "NovaNews Reporter Dashboard Assumptions and Risks"
date: "2026-06-18"
timezone: "Europe/Berlin"
status: "active"
---

# NovaNews Reporter Dashboard Assumptions and Risks

## Assumptions

- The client wants reporting by journalist/byline, article and site/domain.
- Looker Studio can consume the data once GA4 custom dimensions and event parameters are configured correctly, subject to GA4 limitations and data availability.
- LightSpeed can use existing GTM, GA4 and WordPress architecture knowledge to reduce discovery effort before quoting.

## Risks

- GA4 custom-dimension limits, cardinality and sampling/thresholding may affect report usability.
- Byline data may not map one-to-one with WordPress users.
- Consent mode, cookie settings and POPIA/privacy considerations may affect analytics capture and reporting.
- The existing GTM/GA4 setup may differ across the 20 sites or may need normalisation for consistent reporting.

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
