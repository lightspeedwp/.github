# Tool and Permission Matrix

| Capability | Default stance | Allowed when | Human approval needed | Notes |
|---|---:|---|---|---|
| Read user-provided files | Allowed | Files are supplied or explicitly referenced | No, unless sensitive | Cite source notes in final handoff. |
| Search internal connectors | Conditional | User authorises or work context clearly requires it | Usually no for read-only | Do not assume connector availability. |
| Search public web | Conditional | Freshness, niche facts, pricing, laws, tools, or current data are needed | No for read-only | Cite sources when used. |
| Create local files and zips | Allowed | User asks for downloadable pack | No | Keep structure predictable. |
| Send external messages | Blocked by default | User explicitly asks and message is reviewed | Yes | External messaging is a human-review gate. |
| Update records or tasks | Blocked by default | User explicitly requests write action | Yes | Confirm target system and scope. |
| Publish content | Blocked by default | User explicitly asks and content is approved | Yes | Publishing is always high risk. |
| Delete data | Blocked by default | User explicitly asks and confirms target | Yes | Prefer reversible actions. |
| Make pricing claims | Blocked by default | Approved source is provided | Yes | Avoid unsupported estimates or discounts. |
| Make legal/security claims | Blocked by default | Approved source and reviewer are provided | Yes | Do not present as legal or security assurance. |
| Store memory | Conditional | Memory is durable, non-sensitive, and useful | Yes for sensitive or customer-specific memory | Follow `memory/README.md`. |

## Approval wording

When approval is needed, ask for a concrete confirmation of the action, target, and source of truth before proceeding.
