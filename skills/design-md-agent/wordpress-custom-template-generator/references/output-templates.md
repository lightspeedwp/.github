# Output Templates

## File Path Template

```markdown
## File path
/templates/custom-template-name.html
```

## Template File Template

```html
<!-- wp:template-part {"slug":"header","tagName":"header"} /-->
<!-- wp:main -->
<main>
 <!-- wp:post-content /-->
</main>
<!-- /wp:main -->
<!-- wp:template-part {"slug":"footer","tagName":"footer"} /-->
```

## theme.json Fragment Template

```json
{
  "customTemplates": [
    {
      "name": "custom-template-name",
      "title": "Custom Template Name",
      "postTypes": ["page"]
    }
  ]
}
```

## Notes Template

```markdown
## Assumptions
-

## Validation notes
-
```
