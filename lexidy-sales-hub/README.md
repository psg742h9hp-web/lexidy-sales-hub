# Lexidy Sales Hub

An internal advisor tool embedded in HubSpot contact records. Guides advisors through eligibility assessment, sales script, and pricing presentation.

> **Advisor-only tool.** Leads never access this directly. Advisors share their screen from the Sales Script page onwards.

---

## Tech Stack

- **React 18** + **Vite**
- **No CSS framework** — custom design system via CSS variables
- **No external UI library** — all components built from scratch

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Install & Run

```bash
# Clone the repo
git clone https://github.com/lexidy/sales-hub.git
cd sales-hub

# Install dependencies
npm install

# Start development server
npm run dev
# → Opens at http://localhost:3000
```

### Build for Production

```bash
npm run build
# → Outputs to /dist
```

---

## Project Structure

```
src/
├── App.jsx                    # Root component, routing between pages
├── main.jsx                   # React entry point
│
├── hooks/
│   └── useAppState.js         # Central state management for the entire app
│
├── services/
│   └── dataService.js         # ⭐ THE KEY FILE — all data fetching lives here
│                              #    Replace mock functions with Kevin's API calls
│
├── data/
│   └── mockData.js            # All countries, visas, pricing, eligibility questions
│                              #    Used until Kevin's backend is ready
│
├── components/
│   ├── Topbar.jsx             # Top navigation bar with breadcrumbs
│   └── UI.jsx                 # Shared UI components (Button, Card, Toast, etc.)
│
├── pages/
│   ├── HubPage.jsx            # Landing — country/visa selection
│   ├── EligibilityPage.jsx    # Eligibility test form
│   ├── ResultsPage.jsx        # Pass/review/fail result display
│   ├── ReroutePage.jsx        # Alternative visa suggestions when not eligible
│   ├── SalesScriptPage.jsx    # 4-quadrant advisor sales guide
│   ├── PricingPage.jsx        # Packages, add-ons, Platinum, and cart
│   └── AdminPage.jsx          # Admin panel for editing Q&A and pricing
│
└── styles/
    └── globals.css            # Design tokens and global styles
```

---

## How It's Embedded in HubSpot

The tool is opened from a HubSpot contact record via a URL with query parameters:

```
https://yourdomain.com/?contactId={hs_contact_id}&email={email}&name={firstname}+{lastname}
```

The app reads these params on load and displays the contact name in the top bar.

---

## Connecting to Kevin's Backend

All API calls are isolated in **`src/services/dataService.js`**.

Search for `// → REPLACE WITH KEVIN'S API` comments in that file. Each one shows:
- The exact HTTP method and endpoint
- The request body shape
- The expected response shape

**Example — replacing the eligibility questions fetch:**

```javascript
// BEFORE (mock):
export async function fetchEligibilityQuestions(visaId, answers = {}) {
  const def = ELIG_DEFS[visaId]
  return def ? def(answers) : []
}

// AFTER (Kevin's API):
export async function fetchEligibilityQuestions(visaId, answers = {}) {
  const res = await fetch(`/api/eligibility-questions/${visaId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${TOKEN}` },
    body: JSON.stringify({ answers }),
  })
  const data = await res.json()
  return data.questions
}
```

See `API_CONTRACT.md` for the full specification Kevin needs to implement.

---

## Admin Panel

The Admin Panel is accessible from the home page (⚙️ button, bottom right).

**Services & Pricing tab:**
- Select any active visa
- Edit packages (Bronze/Silver/Gold/Platinum): prices, family member costs, child costs
- Edit features per tier
- Edit add-ons (name, description, price)
- Edit visa label, timeline, and notes

**Eligibility Tests tab:**
- Select any visa with an eligibility test
- Edit question labels and answer types
- Add/remove/reorder questions
- Set disqualify conditions (if Yes/No) with custom messages
- Set review flag conditions
- Set currency thresholds with auto-disqualify/review logic

**Persistence:**
Changes currently save to `localStorage`. Once Kevin's backend is connected, the Save button will POST to `/api/admin/save` and changes will sync across all advisors in real time.

---

## Environment Variables

For production, set these in your hosting environment:

```
VITE_API_BASE_URL=https://your-backend.lexidy.com
VITE_HUBSPOT_API_KEY=your_hubspot_key      # Only if calling HubSpot directly from frontend
```

Kevin's backend should proxy HubSpot API calls to avoid exposing the key in the browser.

---

## Design System

Colors and tokens are in `src/styles/globals.css`:

| Token | Value | Usage |
|-------|-------|-------|
| `--purple` | `#2c1c4f` | Primary brand color |
| `--orange` | `#e07856` | CTAs, accents, highlights |
| `--cream` | `#f6f2eb` | Page backgrounds |
| `--green` | `#3d9e6e` | Success states |
| `--red` | `#c94343` | Error/fail states |

Fonts: **Bricolage Grotesque** (headings) + **DM Sans** (body)

---

## Delivery Checklist

- [x] React component structure
- [x] All 5 countries' pricing data populated
- [x] 6 eligibility tests with full branching logic
- [x] Admin panel (services + eligibility)
- [x] Mock data layer
- [x] HubSpot submission stubs (console.log in dev)
- [x] dataService.js with full API contract comments
- [ ] Kevin wires up real API endpoints
- [ ] Real HubSpot integration (Kevin's backend)
- [ ] Production deployment to Lexidy servers
