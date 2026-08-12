# Changelog

## 2026-07-04 - Auditor routing correction

- Updated all live audit, WordPress admin inspection and approved Yoast edit handoffs to route to `tour-operator-yoast-auditor`.
- Removed remaining standalone references to the generic auditor skill.
- Renamed the configuration report template path to `templates/tour-operator-yoast-configuration-report.md` to avoid a generic configuration template reference.

## 2026-07-04 - Tour operator fork

- Created a focused `tour-operator-yoast-configuration` package from the broader Yoast configuration source.
- Reworked the router, references, intake, profile, templates, tests and validators around WordPress tour operator website needs.
- Added destination, tour, accommodation, travel-style, itinerary, enquiry, taxonomy, migration, schema and multilingual guidance.
- Removed commerce-specific scope from the package files and validation set.

---

*🧭 Your compass through the documentation landscape*
