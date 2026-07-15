# Zendesk MCP approval audit QA script

## Goal
Verify Zendesk read actions no longer trigger approval prompts, while true writes still do.

## Preconditions
- Zendesk MCP changes have been deployed
- App metadata has been refreshed
- LightSpeed Zendesk is reattached or refreshed in the agent if needed

## Step 1: Confirm app metadata
Check that these actions are classified as read-only, non-consequential, and non-destructive:
- `get_ticket`
- `search_tickets`
- `count_tickets`
- `get_ticket_conversation`
- `search_help_center_articles`
- `get_help_center_article_content`
- `list_ticket_fields`
- `list_ticket_forms`
- `list_brands`

Expected:
- read-only = true
- consequential = false
- destructive = false
- read actions without confirmation = enabled

## Step 2: Refresh the agent config
- Open the Zendesk Support Agent
- Refresh or reattach LightSpeed Zendesk if classifications appear stale

Expected:
- Zendesk read actions are no longer placed in the always-ask bucket

## Step 3: Run read-only validation
Test prompt:
“Count open Zendesk tickets, search for the highest-risk open tickets, and fetch one example ticket.”

Expected:
- agent calls `count_tickets`
- agent calls `search_tickets`
- agent calls `get_ticket`
- no approval prompts appear

## Step 4: Run conversation/history validation
Test prompt:
“Fetch the conversation history for Zendesk ticket <known ticket id>.”

Expected:
- agent calls `get_ticket_conversation`
- no approval prompt appears

## Step 5: Run Help Center validation
Test prompt:
“Search the Help Center for refund guidance and fetch the most relevant article.”

Expected:
- agent calls `search_help_center_articles`
- agent calls `get_help_center_article_content`
- no approval prompts appear

## Step 6: Run metadata validation
Test prompt:
“List Zendesk ticket fields, forms, and brands so I can inspect the support setup.”

Expected:
- agent calls `list_ticket_fields`
- agent calls `list_ticket_forms`
- agent calls `list_brands`
- no approval prompts appear

## Step 7: Negative control for writes
Run one known mutating Zendesk action if available.

Expected:
- approval prompt still appears for true writes

## Pass criteria
- no approval prompts for all 9 read actions
- approval prompts still appear for true writes only
