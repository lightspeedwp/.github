---
file_type: "instructions"
title: "JavaScript & React for WordPress"
description: "Modern JavaScript and React development standards for WordPress Gutenberg blocks and applications"
version: "2.0"
last_updated: "2025-11-27"
author: "LightSpeedWP Team"
maintainer: "LightSpeedWP Team"
applyTo: "**/*.{js,jsx,ts,tsx}"
domain: "wp-core"
stability: "stable"
license: "GPL-3.0"
tags: ["javascript", "react", "gutenberg", "blocks", "wordpress"]
references:
  - path: "coding-standards.instructions.md"
    description: "General coding standards"
  - path: "inline-docs/inline-jsdoc.instructions.md"
    description: "JSDoc inline documentation"
---

# JavaScript & React for WordPress

All JavaScript for WordPress should follow modern ES6+ patterns, use the `@wordpress/*` packages, and adhere to JSDoc documentation standards.

## Setup & Tooling

### Build Tools

Use `@wordpress/scripts` for zero-config builds:

```json
{
  "devDependencies": {
    "@wordpress/scripts": "^latest"
  },
  "scripts": {
    "build": "wp-scripts build",
    "start": "wp-scripts start",
    "lint:js": "wp-scripts lint-js",
    "lint:pkg-json": "wp-scripts lint-pkg-json"
  }
}
```

### WordPress Packages

```bash
# Core packages
npm install @wordpress/data @wordpress/components @wordpress/i18n

# Block editor
npm install @wordpress/blocks @wordpress/block-editor

# REST API
npm install @wordpress/api-fetch

# Utilities
npm install @wordpress/element @wordpress/compose
```

## ES6+ Standards

### Imports & Exports

```javascript
// Named imports
import { RichText, InspectorControls } from '@wordpress/block-editor';
import { Button, Panel, PanelBody } from '@wordpress/components';

// Default imports
import './style.scss';

// Re-exports
export { MyComponent };
export { default as Icon } from './icon';

// Destructuring
const { name, email } = user;
const { color = 'blue', size = 'medium' } = props;
```

### Functions & Arrow Functions

```javascript
// Arrow functions for callbacks
const items = data.map( ( item ) => ( {
    ...item,
    processed: true,
} ) );

// Regular functions for complex logic
function calculateTotal( items ) {
    let total = 0;
    for ( const item of items ) {
        total += item.price * item.quantity;
    }
    return total;
}

// Async/await
async function fetchProducts() {
    try {
        const response = await fetch( '/api/products' );
        return await response.json();
    } catch ( error ) {
        console.error( 'Failed to fetch products', error );
        return [];
    }
}
```

### Constants & Template Literals

```javascript
// Constants
const DEFAULT_LIMIT = 10;
const STATUS_ACTIVE = 'active';
const API_URL = 'https://api.example.com';

// Template literals
const message = `Hello ${ name }, you have ${ count } items`;
const query = `
    SELECT * FROM products
    WHERE category = '${ category }'
    LIMIT ${ limit }
`;
```

### Destructuring

```javascript
// Object destructuring
const { title, author, date } = post;
const { color = 'blue', size = 'medium' } = options;

// Array destructuring
const [ first, second, ...rest ] = items;
const [ , , third ] = array;

// Nested destructuring
const { user: { name, email } } = data;

// In function parameters
function saveProduct( { id, title, price } ) {
    // Use id, title, price directly
}
```

## React Patterns

### Functional Components

```jsx
/**
 * Product Card Component
 *
 * @param {Object} props - Component props
 * @param {number} props.productId - Product ID
 * @param {string} props.title - Product title
 * @param {number} props.price - Product price
 * @returns {JSX.Element} Product card element
 */
function ProductCard( { productId, title, price } ) {
    return (
        <article className="product-card">
            <h3>{ title }</h3>
            <p className="price">${ price.toFixed( 2 ) }</p>
            <button>Add to Cart</button>
        </article>
    );
}

export default ProductCard;
```

### Hooks

```jsx
import { useState, useEffect, useCallback } from '@wordpress/element';

function ProductList() {
    const [ products, setProducts ] = useState( [] );
    const [ loading, setLoading ] = useState( true );
    const [ error, setError ] = useState( null );

    // Fetch on mount
    useEffect( () => {
        fetchProducts()
            .then( ( data ) => {
                setProducts( data );
                setLoading( false );
            } )
            .catch( ( err ) => {
                setError( err.message );
                setLoading( false );
            } );
    }, [] );

    // Memoized callback
    const handleDelete = useCallback( ( id ) => {
        setProducts( products.filter( ( p ) => p.id !== id ) );
    }, [ products ] );

    if ( loading ) return <p>Loading...</p>;
    if ( error ) return <p>Error: { error }</p>;

    return (
        <ul>
            { products.map( ( product ) => (
                <li key={ product.id }>
                    { product.title }
                    <button onClick={ () => handleDelete( product.id ) }>
                        Delete
                    </button>
                </li>
            ) ) }
        </ul>
    );
}
```

### Context API

```jsx
import { createContext, useContext } from '@wordpress/element';

// Create context
const ThemeContext = createContext( null );

// Provider component
function ThemeProvider( { children } ) {
    const [ theme, setTheme ] = useState( 'light' );

    return (
        <ThemeContext.Provider value={ { theme, setTheme } }>
            { children }
        </ThemeContext.Provider>
    );
}

// Custom hook to use context
function useTheme() {
    const context = useContext( ThemeContext );
    if ( ! context ) {
        throw new Error( 'useTheme must be used within ThemeProvider' );
    }
    return context;
}

// Usage in component
function ThemedComponent() {
    const { theme, setTheme } = useTheme();

    return (
        <div className={ `theme-${ theme }` }>
            <button onClick={ () => setTheme( theme === 'light' ? 'dark' : 'light' ) }>
                Toggle Theme
            </button>
        </div>
    );
}
```

## WordPress Blocks

### Block Registration

```jsx
import { registerBlockType } from '@wordpress/blocks';
import { RichText, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, TextControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import Edit from './edit';
import Save from './save';

registerBlockType( 'my-plugin/product-card', {
    title: __( 'Product Card', 'my-plugin' ),
    description: __( 'Display a featured product', 'my-plugin' ),
    category: 'widgets',
    icon: 'store',
    attributes: {
        productId: {
            type: 'number',
            default: 0,
        },
        title: {
            type: 'string',
            default: '',
        },
        price: {
            type: 'number',
            default: 0,
        },
    },
    edit: Edit,
    save: Save,
    supports: {
        html: false,
        align: [ 'wide', 'full' ],
    },
} );
```

### Block Edit Component

```jsx
export default function Edit( { attributes, setAttributes } ) {
    const { productId, title, price } = attributes;

    return (
        <>
            <InspectorControls>
                <PanelBody title={ __( 'Product Settings', 'my-plugin' ) }>
                    <TextControl
                        label={ __( 'Product Title', 'my-plugin' ) }
                        value={ title }
                        onChange={ ( value ) =>
                            setAttributes( { title: value } )
                        }
                    />
                </PanelBody>
            </InspectorControls>

            <article className="wp-block-product-card">
                <RichText
                    tagName="h3"
                    value={ title }
                    onChange={ ( value ) =>
                        setAttributes( { title: value } )
                    }
                    placeholder={ __( 'Product title…', 'my-plugin' ) }
                />
                <p className="price">${ price.toFixed( 2 ) }</p>
            </article>
        </>
    );
}
```

### Block Save

```jsx
import { RichText } from '@wordpress/block-editor';

export default function Save( { attributes } ) {
    const { title, price } = attributes;

    return (
        <article className="wp-block-product-card">
            <RichText.Content tagName="h3" value={ title } />
            <p className="price">${ price.toFixed( 2 ) }</p>
            <button className="add-to-cart">{ __( 'Add to Cart', 'my-plugin' ) }</button>
        </article>
    );
}
```

## State Management

### WordPress Data Store

```javascript
import { createReduxStore, register } from '@wordpress/data';
import { controls } from '@wordpress/data-controls';

const store = createReduxStore( 'my-plugin/store', {
    reducer( state = { products: [] }, action ) {
        if ( action.type === 'SET_PRODUCTS' ) {
            return {
                ...state,
                products: action.products,
            };
        }
        return state;
    },
    actions: {
        setProducts( products ) {
            return {
                type: 'SET_PRODUCTS',
                products,
            };
        },
        *fetchProducts() {
            const products = yield {
                type: 'RECEIVE_PRODUCTS',
                url: '/wp-json/my-plugin/v1/products',
            };
            yield {
                type: 'SET_PRODUCTS',
                products,
            };
        },
    },
    selectors: {
        getProducts( state ) {
            return state.products;
        },
    },
    controls: {
        RECEIVE_PRODUCTS( action ) {
            return apiFetch( { path: action.url } );
        },
        ...controls,
    },
} );

register( store );
```

### Using the Store

```jsx
import { useSelect, useDispatch } from '@wordpress/data';

function ProductsList() {
    const products = useSelect(
        ( select ) => select( 'my-plugin/store' ).getProducts(),
        []
    );
    const { fetchProducts } = useDispatch( 'my-plugin/store' );

    useEffect( () => {
        fetchProducts();
    }, [ fetchProducts ] );

    return (
        <ul>
            { products.map( ( product ) => (
                <li key={ product.id }>{ product.title }</li>
            ) ) }
        </ul>
    );
}
```

## Testing

### Jest Tests

```javascript
import { render, screen } from '@testing-library/react';
import ProductCard from '../product-card';

describe( 'ProductCard', () => {
    it( 'renders product title', () => {
        render( <ProductCard title="Test Product" price={ 99.99 } /> );
        expect( screen.getByText( 'Test Product' ) ).toBeInTheDocument();
    } );

    it( 'formats price correctly', () => {
        render( <ProductCard title="Product" price={ 99.9 } /> );
        expect( screen.getByText( '$99.90' ) ).toBeInTheDocument();
    } );
} );
```

## Security & Escaping

### Input Handling

```jsx
import { sanitize Text } from 'sanitize-html';

function UserInput( { onSubmit } ) {
    const [ input, setInput ] = useState( '' );

    const handleChange = ( e ) => {
        // Don't sanitize on input, only on submit
        setInput( e.target.value );
    };

    const handleSubmit = ( e ) => {
        e.preventDefault();
        // Sanitize before sending to server
        const clean = sanitizeText( input );
        onSubmit( clean );
    };

    return (
        <form onSubmit={ handleSubmit }>
            <input value={ input } onChange={ handleChange } />
            <button type="submit">Submit</button>
        </form>
    );
}
```

### Output Escaping

```jsx
import DOMPurify from 'dompurify';

// Don't directly use user-generated HTML
function Comment( { text } ) {
    // WRONG
    return <div dangerouslySetInnerHTML={ { __html: text } } />;

    // CORRECT - use DOMPurify or escape
    const clean = DOMPurify.sanitize( text );
    return <div dangerouslySetInnerHTML={ { __html: clean } } />;
}

// Better - use normal React rendering
function Comment( { text } ) {
    // React automatically escapes by default
    return <div>{ text }</div>;
}
```

## Code Style

### Formatting

```javascript
// Use consistent spacing
const obj = {
    name: 'value',
    key: 'another value',
};

// Array formatting
const items = [ 'one', 'two', 'three' ];

// Function formatting
function doSomething( param1, param2 ) {
    if ( param1 ) {
        console.log( param2 );
    }
}
```

### Naming Conventions

```javascript
// Constants in UPPER_SNAKE_CASE
const DEFAULT_LIMIT = 10;
const API_BASE_URL = 'https://api.example.com';

// Functions and variables in camelCase
function calculateTotal( items ) {}
let currentPage = 1;

// Classes in PascalCase
class ProductManager {}
export const React Component = () => {};

// Private methods with underscore prefix (convention)
function _internalHelper() {}
```

## JSDoc Documentation

```javascript
/**
 * Calculate the total price including tax.
 *
 * @param {number} amount - Base amount before tax
 * @param {number} [taxRate=0.15] - Tax rate as decimal (0-1)
 * @returns {number} Total amount including tax
 *
 * @example
 * calculateWithTax(100, 0.15) // Returns 115
 */
function calculateWithTax( amount, taxRate = 0.15 ) {
    return amount * (1 + taxRate);
}

/**
 * Fetch products from the API.
 *
 * @async
 * @param {Object} options - Query options
 * @param {number} [options.page=1] - Page number
 * @param {number} [options.limit=10] - Items per page
 * @returns {Promise<Array>} Promise resolving to array of products
 * @throws {Error} When API request fails
 */
async function fetchProducts( options = {} ) {
    const { page = 1, limit = 10 } = options;
    const response = await fetch(
        `/api/products?page=${ page }&limit=${ limit }`
    );
    if ( ! response.ok ) {
        throw new Error( 'API request failed' );
    }
    return response.json();
}
```

## References

- [WordPress Handbook - JavaScript](https://developer.wordpress.org/block-editor/developers/javascript/)
- [React Documentation](https://react.dev/)
- [WordPress Data Store](https://developer.wordpress.org/block-editor/reference-guides/data/)
- [Gutenberg Components](https://github.com/WordPress/gutenberg/tree/trunk/packages/components)
- [ES6 Features](https://es6-features.org/)
