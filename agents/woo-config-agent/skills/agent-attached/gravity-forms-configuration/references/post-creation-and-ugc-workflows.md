# Post creation and UGC workflows

Use this reference when a Gravity Forms task involves creating WordPress posts, pages, custom post types, community stories, business listings, event submissions, product submissions, or other user-generated content from form submissions.

## Scope

This skill supports configuration planning, audits, and safe MCP/manual action plans for:

- Standard Gravity Forms Post Fields.
- The official Advanced Post Creation Add-On.
- UGC moderation workflows where entries or generated posts require editorial review.
- Media-library handoff from File Upload fields.
- Category/tag/taxonomy mapping reviews.
- Content-submission handoff notes for editors.

Route away to custom plugin development when the requested workflow depends on registering custom post types, registering custom fields, creating taxonomies, or writing hooks that are not already available through approved project code.

## Post Fields versus Advanced Post Creation

Use Post Fields only for simple standard WordPress post creation where the form directly contains post-specific fields such as title, body, category, excerpt, image, tags, or custom field.

Use Advanced Post Creation only when the add-on is installed and active and the workflow needs feed-controlled post creation, custom post types, custom post content built from standard or advanced fields, conditional feed logic, custom-field mapping, taxonomy mapping, media-library insertion, or multiple posts from one submission.

Do not mix Post Fields with Advanced Post Creation on the same APC feed. Advanced Post Creation feeds should be mapped from Standard or Advanced fields, not the Post Fields family.

## Required preflight

Before proposing a post-creation configuration, confirm or request:

1. Gravity Forms version and active licence/add-ons.
2. Whether Advanced Post Creation is installed and active.
3. Target post type already exists.
4. Target custom fields already exist or have an approved implementation owner.
5. Target taxonomies already exist and should accept user-submitted values.
6. Author strategy: logged-in user, fixed editorial user, or entry metadata only.
7. Post status strategy: usually Draft or Pending Review for UGC.
8. Media handling: upload to entry only, copy to Media Library, or set Featured Image.
9. Moderation owner and SLA.
10. Privacy/consent and retention requirements.

## Safe defaults

- Prefer entry-first moderation when editorial workflow is unclear.
- Prefer Pending Review or Draft over Publish for UGC.
- Avoid automatic public publishing from untrusted users.
- Require explicit approval before creating posts, copying files to the Media Library, creating taxonomy terms from submitted values, or enabling post editing.
- Use a fixed editorial author unless logged-in-user ownership is a confirmed requirement.
- Avoid comments/trackbacks unless explicitly required.
- Keep file uploads constrained to necessary media types and sizes.
- Treat featured images and media-library copying as high risk because uploads become WordPress media assets.

## APC feed review checklist

For each Advanced Post Creation feed, review:

- Feed name and active state.
- Target post type.
- Visibility.
- Post status.
- Post date mapping.
- Author setting.
- Title mapping.
- Content mapping and auto-formatting.
- Featured image mapping.
- Add Media setting.
- Custom field mappings.
- Taxonomy mappings.
- Conditional logic.
- Post editing settings.
- Interaction with payment feeds.
- Whether multiple posts may be created from one entry.

## Taxonomy safety

When taxonomy values come from submitted fields:

- Confirm whether new terms may be created.
- Prefer controlled choices over free text.
- Avoid letting public users create arbitrary categories/tags unless editorially approved.
- Flag top-level term creation as a content governance risk.
- Test comma-separated multi-value handling before launch.

## Custom post types and custom fields

Advanced Post Creation can publish to existing custom post types and map existing custom fields, but it does not create or register those structures. If the required post type, taxonomy, or custom field does not exist, route to WordPress configuration or custom development before configuring the Gravity Forms feed.

For ACF image fields or image-ID-style fields, confirm whether `{apc_media}` or equivalent media-library mapping is required and whether the upload must be copied to the Media Library.

## Post editing

Treat front-end post editing as high risk.

Require approval before enabling it and confirm:

- User must be logged in.
- Post Author is configured as Logged In User.
- The edit page embeds the same form correctly.
- Editable fields are limited.
- The form does not have a payment feed where post editing is blocked or inappropriate.
- Editors understand how changes are moderated.

## UGC moderation workflow

For community stories, listings, events, testimonials, or submissions:

1. Receive entry.
2. Notify editorial/moderation owner.
3. Create Draft or Pending Review post only if approved configuration exists.
4. Review content for privacy, legality, claims, image rights, spam, and taxonomy quality.
5. Publish manually unless auto-publishing is explicitly approved.
6. Record handoff notes: source form, feed, owner, post status, media location, moderation state.

## Validation tests

Run tests for:

- Empty required content fields.
- Long title/body values.
- Special characters and HTML-like text.
- Category/tag field values with commas.
- Upload accepted/rejected file types.
- Featured image mapping.
- Draft/Pending Review status.
- Duplicate submission behaviour.
- Feed conditional logic.
- Notification to editorial owner.
- Generated post visibility, author, taxonomy, and media.

## Refusal and route-away patterns

Refuse or route away when asked to:

- Auto-publish public submissions without moderation.
- Let anonymous users create arbitrary public taxonomy terms without approval.
- Register new custom post types, fields, or taxonomies from within Gravity Forms configuration.
- Add custom PHP hooks in the skill workflow.
- Copy all uploads into the Media Library without file type, rights, ownership, and retention review.
