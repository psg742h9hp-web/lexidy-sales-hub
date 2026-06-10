# Lexidy Sales Hub — HubSpot Embed

Puts a **"Sales Hub" tab** on every contact record (middle pane, next to
Overview / Activities). The tab shows a launch card; clicking **Open Sales Hub**
opens the full advisor tool in a large modal with the contact pre-loaded.

> Why a modal and not inline? HubSpot does not allow embedding external
> iframes inline in record pages — UI extensions only support
> `openIframeModal()`. The modal is full-width (1500×900) so it behaves
> like a full-screen app.

## Requirements

- HubSpot **Sales Hub Enterprise** (UI extensions for private apps) — Lexidy has this
- HubSpot CLI: `npm install -g @hubspot/cli`
- A Super Admin to authorize the CLI

## Deploy (Kevin)

```bash
# 1. Authenticate the CLI against the Lexidy portal
hs init          # first time only
hs auth

# 2. Set the deployed frontend URL
#    Edit src/app/extensions/SalesHubCard.jsx → SALES_HUB_URL

# 3. Upload from this folder (hubspot-app/)
cd hubspot-app
hs project upload

# 4. Add the tab to the contact record layout
#    HubSpot → Settings → Objects → Contacts → Record customization
#    → Default view → add tab "Sales Hub" → Add cards → Apps
#    → select "Sales Hub" → Save and exit
```

## How contact context flows

1. Advisor opens a contact → "Sales Hub" tab → **Open Sales Hub**
2. The card opens `SALES_HUB_URL/?contactId={id}&email=…&name=…`
3. The React app reads those params on mount (already implemented in `App.jsx`)
4. In live mode it then calls `GET /api/contacts/:contactId` for full details
5. Eligibility results / pricing decisions POST back → backend writes a
   note on this same contact's timeline

## Local dev

`hs project dev` gives hot reload inside the record page with a
"Developing locally" badge.
