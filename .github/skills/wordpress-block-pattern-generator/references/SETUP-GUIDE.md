## Prerequisites & Setup

Before generating patterns, gather the following information from the user:

### Required Information

1. **Supporting Plugin Details**
   - **Prompt**: "What is the name and purpose of your theme's companion plugin (if any)?"
   - **Purpose**: Identify custom post types, taxonomies, and ACF field groups
   - **Examples**: 
     - "ma-plugin provides research articles, case studies, and digital magazines"
     - "No companion plugin - using only WordPress core functionality"
   - **Next Steps**: If plugin exists, request field group details and CPT slugs

2. **Guidelines Directory**
   - **Prompt**: "Do you have a guidelines directory? If so, what's the path?"
   - **Purpose**: Access design tokens, component specs, CSS architecture docs
   - **Default**: Search workspace for common paths:
     - `guidelines/`
     - `docs/guidelines/`
     - `.github/guidelines/`
     - `src/guidelines/`
   - **Fallback**: Request specific information about:
     - Spacing system (WordPress presets or custom scale)
     - Color palette and contrast requirements
     - Typography scale and font families
     - Component naming conventions (BEM, ITCSS, etc.)
     - Breakpoint values for responsive design

3. **Plugin Feature Mapping**
   - **If Plugin Exists**: Request details about:
     - Custom post types and their slugs
     - Custom taxonomies and hierarchies
     - ACF field groups and field names
     - Required meta queries or filters
     - Special display requirements

### Information Gathering Workflow

```
Start Pattern Generation Request
    ↓
1. Ask about companion plugin
    ├─ Yes → Request CPT/taxonomy/ACF details
    └─ No → Note WordPress core-only approach
    ↓
2. Ask about guidelines directory
    ├─ Provided → Read design tokens and specs
    ├─ Search workspace → Check common paths
    └─ Not found → Request manual specification
    ↓
3. Validate available information
    ├─ Spacing presets defined? 
    ├─ Color system documented?
    ├─ Typography scale available?
    └─ Component patterns specified?
    ↓
4. Begin pattern generation with validated context
```

### Example Setup Dialogue

**Agent**: "Before I generate patterns for your theme, I need some context:

1. **Companion Plugin**: Do you have a plugin that provides custom post types or features for this theme? If so, what's its name and what does it provide?

2. **Guidelines Directory**: Do you have a guidelines or design system directory? Common locations I can check:
   - `guidelines/`
   - `docs/guidelines/`
   - `.github/guidelines/`
   
If not, I'll need information about your spacing system, color palette, and component conventions."

**User Response Example**:
"Yes, I have `ma-plugin` that provides Research Articles (CPT: research-article), Case Studies (CPT: case-study), and Digital Magazines (CPT: digital-magazine). Guidelines are in `src/guidelines/` with design tokens and component specs."

**Agent Next Steps**:
- Read guidelines from specified path
- Note CPT slugs for query loop integration
- Check for ACF field groups in plugin
- Proceed with informed pattern generation

