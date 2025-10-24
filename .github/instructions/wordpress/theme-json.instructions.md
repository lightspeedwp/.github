---
applyTo: "**/theme.json"
description: "Theme.json configuration standards for WordPress block themes - design systems, tokens, and global styles"
license: "GPL-3.0-or-later"
---

# Theme.json Configuration Guidelines

## Structure & Organization

### Version and Core Settings
```json
{
    "$schema": "https://schemas.wp.org/trunk/theme.json",
    "version": 3,
    "title": "Theme Name",
    "description": "A brief description of the theme's design approach",
    "settings": {
        "appearanceTools": true,
        "useRootPaddingAwareAlignments": true,
        "layout": {
            "contentSize": "620px",
            "wideSize": "1200px"
        }
    }
}
```

### Typography System
```json
{
    "settings": {
        "typography": {
            "dropCap": false,
            "fluid": true,
            "fontStyle": true,
            "fontWeight": true,
            "letterSpacing": true,
            "lineHeight": true,
            "textDecoration": true,
            "textTransform": true,
            "writingMode": false,
            "fontFamilies": [
                {
                    "fontFamily": "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen-Sans, Ubuntu, Cantarell, 'Helvetica Neue', sans-serif",
                    "name": "System Font",
                    "slug": "system"
                },
                {
                    "fontFamily": "Georgia, serif",
                    "name": "Serif",
                    "slug": "serif"
                },
                {
                    "fontFamily": "'Courier New', Courier, monospace",
                    "name": "Monospace",
                    "slug": "monospace"
                }
            ],
            "fontSizes": [
                {
                    "name": "Small",
                    "size": "0.875rem",
                    "slug": "small",
                    "fluid": {
                        "min": "0.875rem",
                        "max": "1rem"
                    }
                },
                {
                    "name": "Medium",
                    "size": "1rem",
                    "slug": "medium",
                    "fluid": false
                },
                {
                    "name": "Large",
                    "size": "1.25rem",
                    "slug": "large",
                    "fluid": {
                        "min": "1.125rem",
                        "max": "1.5rem"
                    }
                },
                {
                    "name": "Extra Large",
                    "size": "2rem",
                    "slug": "x-large",
                    "fluid": {
                        "min": "1.75rem",
                        "max": "2.5rem"
                    }
                },
                {
                    "name": "Huge",
                    "size": "3rem",
                    "slug": "xx-large",
                    "fluid": {
                        "min": "2.25rem",
                        "max": "4rem"
                    }
                }
            ]
        }
    }
}
```

### Color System
```json
{
    "settings": {
        "color": {
            "custom": false,
            "customDuotone": false,
            "customGradient": false,
            "defaultDuotones": false,
            "defaultGradients": false,
            "defaultPalette": false,
            "duotone": [
                {
                    "colors": ["#000000", "#ffffff"],
                    "name": "Black and White",
                    "slug": "black-and-white"
                }
            ],
            "gradients": [
                {
                    "gradient": "linear-gradient(135deg, var(--wp--preset--color--primary) 0%, var(--wp--preset--color--secondary) 100%)",
                    "name": "Primary to Secondary",
                    "slug": "primary-to-secondary"
                }
            ],
            "palette": [
                {
                    "name": "Base",
                    "slug": "base",
                    "color": "#ffffff"
                },
                {
                    "name": "Contrast",
                    "slug": "contrast",
                    "color": "#000000"
                },
                {
                    "name": "Primary",
                    "slug": "primary", 
                    "color": "#007cba"
                },
                {
                    "name": "Secondary",
                    "slug": "secondary",
                    "color": "#006ba1"
                },
                {
                    "name": "Tertiary",
                    "slug": "tertiary",
                    "color": "#f0f0f0"
                }
            ]
        }
    }
}
```

### Spacing System
```json
{
    "settings": {
        "spacing": {
            "customSpacingSize": false,
            "spacingScale": {
                "operator": "*",
                "increment": 1.5,
                "steps": 7,
                "mediumStep": 1.5,
                "unit": "rem"
            },
            "spacingSizes": [
                {
                    "name": "2X-Small",
                    "size": "0.25rem",
                    "slug": "20"
                },
                {
                    "name": "X-Small", 
                    "size": "0.5rem",
                    "slug": "30"
                },
                {
                    "name": "Small",
                    "size": "0.75rem",
                    "slug": "40"
                },
                {
                    "name": "Medium",
                    "size": "1rem",
                    "slug": "50"
                },
                {
                    "name": "Large",
                    "size": "1.5rem",
                    "slug": "60"
                },
                {
                    "name": "X-Large",
                    "size": "2.25rem",
                    "slug": "70"
                },
                {
                    "name": "2X-Large",
                    "size": "3.375rem", 
                    "slug": "80"
                }
            ],
            "units": ["px", "em", "rem", "vh", "vw", "%"]
        }
    }
}
```

### Custom Properties & CSS Variables
```json
{
    "settings": {
        "custom": {
            "spacing": {
                "baseline": "1rem",
                "gutter": "var(--wp--preset--spacing--50)"
            },
            "typography": {
                "lineHeight": {
                    "tight": "1.1",
                    "normal": "1.5", 
                    "loose": "1.8"
                }
            },
            "effects": {
                "shadow": {
                    "small": "0 1px 3px rgba(0, 0, 0, 0.12)",
                    "medium": "0 4px 6px rgba(0, 0, 0, 0.12)",
                    "large": "0 10px 25px rgba(0, 0, 0, 0.12)"
                },
                "borderRadius": {
                    "small": "0.25rem",
                    "medium": "0.5rem",
                    "large": "1rem"
                }
            }
        }
    }
}
```

## Block-Specific Styling

### Core Block Customization
```json
{
    "styles": {
        "blocks": {
            "core/button": {
                "border": {
                    "radius": "var(--wp--custom--effects--border-radius--medium)"
                },
                "spacing": {
                    "padding": {
                        "top": "var(--wp--preset--spacing--30)",
                        "right": "var(--wp--preset--spacing--50)",
                        "bottom": "var(--wp--preset--spacing--30)",
                        "left": "var(--wp--preset--spacing--50)"
                    }
                },
                "typography": {
                    "fontWeight": "600",
                    "textTransform": "uppercase",
                    "letterSpacing": "0.05em"
                },
                "variations": {
                    "outline": {
                        "border": {
                            "width": "2px",
                            "style": "solid",
                            "color": "var(--wp--preset--color--primary)"
                        },
                        "color": {
                            "text": "var(--wp--preset--color--primary)",
                            "background": "transparent"
                        }
                    }
                }
            },
            "core/heading": {
                "typography": {
                    "fontWeight": "700",
                    "lineHeight": "var(--wp--custom--typography--line-height--tight)"
                },
                "elements": {
                    "link": {
                        "color": {
                            "text": "inherit"
                        },
                        ":hover": {
                            "color": {
                                "text": "var(--wp--preset--color--primary)"
                            }
                        }
                    }
                }
            },
            "core/group": {
                "spacing": {
                    "padding": "var(--wp--preset--spacing--50)"
                }
            },
            "core/columns": {
                "spacing": {
                    "blockGap": "var(--wp--preset--spacing--60)"
                }
            }
        }
    }
}
```

### Element Styling
```json
{
    "styles": {
        "elements": {
            "link": {
                "color": {
                    "text": "var(--wp--preset--color--primary)"
                },
                "typography": {
                    "textDecoration": "underline"
                },
                ":hover": {
                    "color": {
                        "text": "var(--wp--preset--color--secondary)"
                    },
                    "typography": {
                        "textDecoration": "none"
                    }
                },
                ":focus": {
                    "outline": {
                        "width": "2px",
                        "style": "solid",
                        "color": "var(--wp--preset--color--primary)",
                        "offset": "2px"
                    }
                }
            },
            "button": {
                "border": {
                    "radius": "var(--wp--custom--effects--border-radius--medium)"
                },
                "color": {
                    "background": "var(--wp--preset--color--primary)",
                    "text": "var(--wp--preset--color--base)"
                },
                ":hover": {
                    "color": {
                        "background": "var(--wp--preset--color--secondary)"
                    }
                },
                ":focus": {
                    "outline": {
                        "width": "2px",
                        "style": "solid",
                        "color": "var(--wp--preset--color--contrast)",
                        "offset": "2px"
                    }
                }
            },
            "h1": {
                "typography": {
                    "fontSize": "var(--wp--preset--font-size--xx-large)",
                    "lineHeight": "var(--wp--custom--typography--line-height--tight)"
                }
            },
            "h2": {
                "typography": {
                    "fontSize": "var(--wp--preset--font-size--x-large)"
                }
            },
            "h3": {
                "typography": {
                    "fontSize": "var(--wp--preset--font-size--large)"
                }
            },
            "h4": {
                "typography": {
                    "fontSize": "var(--wp--preset--font-size--medium)"
                }
            },
            "h5": {
                "typography": {
                    "fontSize": "var(--wp--preset--font-size--small)"
                }
            },
            "h6": {
                "typography": {
                    "fontSize": "var(--wp--preset--font-size--small)",
                    "fontWeight": "600"
                }
            }
        }
    }
}
```

## Advanced Features

### Style Variations
```json
{
    "styles": [
        {
            "name": "default",
            "label": "Default",
            "isDefault": true
        },
        {
            "name": "dark",
            "label": "Dark",
            "styles": {
                "color": {
                    "background": "var(--wp--preset--color--contrast)",
                    "text": "var(--wp--preset--color--base)"
                },
                "blocks": {
                    "core/button": {
                        "color": {
                            "background": "var(--wp--preset--color--base)",
                            "text": "var(--wp--preset--color--contrast)"
                        }
                    }
                }
            }
        }
    ]
}
```

### Template Part Areas
```json
{
    "templateParts": [
        {
            "name": "header",
            "title": "Header",
            "area": "header"
        },
        {
            "name": "footer", 
            "title": "Footer",
            "area": "footer"
        },
        {
            "name": "sidebar",
            "title": "Sidebar",
            "area": "uncategorized"
        }
    ]
}
```

### Custom Templates
```json
{
    "customTemplates": [
        {
            "name": "page-landing",
            "title": "Landing Page",
            "postTypes": ["page"]
        },
        {
            "name": "single-portfolio",
            "title": "Portfolio Item",
            "postTypes": ["portfolio"]
        }
    ]
}
```

## Best Practices

### Design Token Hierarchy
1. **Base tokens**: Core values (colors, spacing units)
2. **Semantic tokens**: Purpose-based (primary, secondary, error)
3. **Component tokens**: Block-specific values
4. **Context tokens**: Page or section-specific overrides

### Performance Considerations
- Use CSS custom properties for runtime theme switching
- Minimize the number of font families and weights
- Leverage fluid typography for responsive design
- Use semantic color names rather than descriptive ones
- Keep gradients and duotones to essential variations only

### Accessibility Standards
- Ensure minimum 4.5:1 contrast ratio for normal text
- Ensure minimum 3:1 contrast ratio for large text
- Provide sufficient spacing for touch targets (44px minimum)
- Use semantic color names that convey meaning
- Test with high contrast and reduced motion preferences

### Maintainability
- Use consistent naming conventions for slugs
- Document color usage and design decisions
- Group related settings logically
- Use CSS custom properties for complex calculations
- Validate theme.json syntax regularly

### Migration & Compatibility  
- Use appropriate version number (2 or 3)
- Test with multiple WordPress versions
- Provide fallbacks for unsupported features
- Document breaking changes in updates
- Consider child theme compatibility

Always validate your theme.json file against the WordPress schema and test thoroughly across different devices, browsers, and accessibility tools.