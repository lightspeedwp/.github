# PHASE 2 BATCH PROMPT: WooCommerce Configuration Agent

**Agent:** woo-config-agent  
**Domain:** ecommerce  
**Focus:** woocommerce  
**Purpose:** Configure and manage WooCommerce store settings, products, and integrations  
**Effort:** 2-4 hours  
**Reference:** PROMPT_2_GENERIC_AGENT_REWRITE.md

---

## PARAMETER MAP

| Parameter | Value |
| --- | --- |
| {AGENT_NAME} | WooCommerce Config Agent |
| {agent-slug} | woo-config |
| {DOMAIN} | ecommerce |
| {FOCUS} | woocommerce |
| {Agent Purpose} | Configure and manage WooCommerce store settings, product management, payment gateway setup, shipping configuration, and checkout optimization |

---

## AGENT SPECIFICATION

```yaml
name: woo-config
title: WooCommerce Configuration Agent
description: >
  Manage WooCommerce store configuration, product setup, payment
  gateways, shipping settings, tax configuration, and checkout
  optimization for e-commerce WordPress sites.

version: '2.0.0'
category: ecommerce
providers: [claude, copilot, openai]

capabilities:
  - store-configuration
  - product-management
  - payment-gateway-setup
  - shipping-configuration
  - tax-management
  - checkout-optimization
  - analytics-setup
  - inventory-management

requirements:
  - WooCommerce 7.0+
  - WordPress 6.0+
  - WC REST API enabled
  - Database access for migrations

constraints:
  - No direct database modifications (use REST API/WC CLI)
  - Respects WooCommerce standards
  - Payment gateway credentials must be externalized
  - Testing in staging before production

security:
  rules:
    - Payment info never exposed in logs
    - API keys stored in environment variables
    - PCI compliance required
    - Customer data protection (GDPR/CCPA)
```

---

## CORE RESPONSIBILITIES

1. Configure WooCommerce core settings (general, products, checkout)
2. Setup payment gateways (Stripe, PayPal, Square, etc.)
3. Configure shipping methods and zones
4. Setup and manage tax rules
5. Optimize checkout experience
6. Configure product categories and attributes
7. Setup analytics and reporting
8. Manage subscriptions and recurring products

---

## KEY TOOLS/CAPABILITIES

**Claude Tools:**
- woo-config-read
- woo-config-validate
- woo-payment-setup
- woo-shipping-config
- woo-tax-management
- woo-product-import

**Copilot Skills:**
- woocommerce-settings
- payment-gateway-integration
- shipping-configuration
- product-management
- checkout-optimization

**OpenAI Functions:**
- configure_woocommerce_setting
- setup_payment_gateway
- configure_shipping
- manage_products
- optimize_checkout

---

## DOMAIN NOTES

**WooCommerce Configuration Focus:**
- Store setup (currency, general, product settings)
- Payment gateways (Stripe, PayPal, Square, custom)
- Shipping zones and methods
- Tax calculation and rules
- Product types (simple, variable, subscription)
- Categories, tags, attributes
- Checkout flow optimization
- Subscription & recurring products
- Analytics & reporting
- Inventory management

---

## EXECUTION PHASES

Follow PROMPT_2_GENERIC_AGENT_REWRITE.md (8 phases):
1. Analyze export
2. Create folder structure
3. Write AGENT.md specification
4. Create core prompt (provider-agnostic)
5. Create provider configs (Claude, Copilot, OpenAI)
6. Define tools/functions per provider
7. Create plugin & documentation
8. Validate & test

---

## ESTIMATED EFFORT: 2-4 hours

---

## SUCCESS CRITERIA

✅ 8 phases completed  
✅ AGENT.md with YAML frontmatter  
✅ Core prompt written  
✅ Provider configs (Claude, Copilot, OpenAI)  
✅ Tool definitions per provider  
✅ Plugin created  
✅ Schema & hook validation passing  
✅ Documentation complete  
✅ PR merged to develop  

---

**Reference PROMPT_2_GENERIC_AGENT_REWRITE.md for detailed step-by-step guidance.**
