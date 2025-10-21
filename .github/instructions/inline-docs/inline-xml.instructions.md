# INLINE-XML.md

LightSpeedWP **XML** documentation standards.

## Principles
- Use XML comments `<!-- ... -->` sparingly to explain **why**, not what.
- Validate against the appropriate schema (e.g. Android, RSS, etc.).
- Keep attribute order consistent and meaningful.

## Example
```xml
<!-- RSS feed for latest tours -->
<rss version="2.0">
  <channel>
    <title>LightSpeed Tours</title>
    <item>
      <title>Kruger Park Safari</title>
    </item>
  </channel>
</rss>
```
