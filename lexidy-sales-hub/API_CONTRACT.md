# Lexidy Sales Hub — API Contract

This document defines the API endpoints Kevin needs to build for the Sales Hub to connect to Lexidy's backend.

> **For Kevin:** The Sales Hub React component is ready. It currently uses mock data. To go live, implement the endpoints below and update `src/services/dataService.js` (each function has a `// → REPLACE WITH KEVIN'S API` comment with the exact spec).

---

## Base URL

```
https://your-backend.lexidy.com/api
```

All endpoints require authentication. Recommended: JWT token in `Authorization: Bearer {token}` header.

---

## Authentication

The Sales Hub runs inside HubSpot, opened by advisors. Authentication should verify that the request comes from a logged-in Lexidy employee.

**Recommended approach:**
1. HubSpot passes a `contactId` and advisor session token via URL params
2. Kevin's backend validates the session token against HubSpot's OAuth
3. Returns a short-lived JWT for subsequent API calls

---

## Endpoints

---

### 1. Fetch Contact

```
GET /api/contacts/:contactId
```

Fetches the lead's info from HubSpot. Kevin's backend proxies the HubSpot API call (keeps API key server-side).

**Response:**
```json
{
  "contact": {
    "id": "12345",
    "firstName": "John",
    "lastName": "Smith",
    "email": "john@example.com"
  }
}
```

**HubSpot call Kevin makes internally:**
```
GET https://api.hubapi.com/crm/v3/objects/contacts/{contactId}?properties=firstname,lastname,email
Authorization: Bearer {HUBSPOT_API_KEY}
```

---

### 2. Fetch Eligibility Questions

```
POST /api/eligibility-questions/:visaId
```

Returns the eligibility questions for a specific visa. This is what makes questions dynamic — when Kevin stores questions in the database, Moni can update them without a code deployment.

**Request body:**
```json
{
  "answers": {
    "employment_type": "Freelancer",
    "monthly_income": "3000"
  }
}
```

**Response:**
```json
{
  "questions": [
    {
      "id": "citizenship",
      "label": "Citizenship",
      "type": "select",
      "required": true,
      "options": ["Afghanistan", "Albania", "..."]
    },
    {
      "id": "monthly_income",
      "label": "Monthly net income",
      "type": "currency",
      "required": true,
      "threshold": 2646,
      "disqualifyBelow": true,
      "disqualifyMsg": "Income does not meet the minimum requirement of €2,646/month"
    },
    {
      "id": "has_criminal_record",
      "label": "Do you have a criminal record?",
      "type": "yesno",
      "required": true,
      "disqualifyIf": "Yes",
      "disqualifyMsg": "Criminal record disqualifies from this visa"
    }
  ]
}
```

**Question types:**

| type | Description |
|------|-------------|
| `text` | Free text input |
| `number` | Numeric input |
| `currency` | Number with € symbol and threshold logic |
| `yesno` | Yes/No radio buttons |
| `select` | Dropdown with options array |
| `info` | Informational text block (no input) |

**Question fields:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | ✓ | Unique identifier |
| `label` | string | ✓ | Question text |
| `type` | string | ✓ | See types above |
| `required` | boolean | ✓ | Whether field must be filled |
| `options` | string[] | For `select` | Dropdown options |
| `hint` | string | | Helper text shown below label |
| `threshold` | number | For `currency` | Minimum value for pass |
| `disqualifyIf` | `'Yes'` \| `'No'` | | Disqualify if answer equals this |
| `disqualifyMsg` | string | | Message shown when disqualified |
| `reviewIf` | `'Yes'` \| `'No'` | | Flag for review if answer equals this |
| `reviewMsg` | string | | Message shown when flagged for review |
| `disqualifyBelow` | boolean | For `currency` | Disqualify if value < threshold |
| `reviewBelow` | boolean | For `currency` | Flag for review if value < threshold |

---

### 3. Submit Eligibility Result

```
POST /api/sessions/eligibility
```

Logs the eligibility test result to HubSpot as a note/engagement on the contact record.

**Request body:**
```json
{
  "contactId": "12345",
  "visaId": "es-dnv-freelancer",
  "visaLabel": "Digital Nomad Visa — Freelancer",
  "country": "Spain",
  "result": "pass",
  "answers": [
    { "question": "Citizenship", "answer": "United States", "stepId": "citizenship" },
    { "question": "Monthly net income", "answer": "5000", "stepId": "monthly_income" }
  ],
  "timestamp": "2026-06-03T10:30:00.000Z"
}
```

**Response:**
```json
{
  "success": true,
  "sessionId": "session_abc123"
}
```

**HubSpot call Kevin makes internally:**
```
POST https://api.hubapi.com/crm/v3/objects/notes
Authorization: Bearer {HUBSPOT_API_KEY}
Body: {
  "properties": {
    "hs_note_body": "ELIGIBILITY TEST — Spain DNV Freelancer\nResult: PASS\n\nAnswers:\n- Citizenship: United States\n- Monthly income: €5,000\n...",
    "hs_timestamp": "2026-06-03T10:30:00.000Z"
  },
  "associations": [
    { "to": { "id": "12345" }, "types": [{ "associationCategory": "HUBSPOT_DEFINED", "associationTypeId": 202 }] }
  ]
}
```

---

### 4. Submit Pricing Decision

```
POST /api/sessions/pricing
```

Logs the advisor's pricing selection to HubSpot.

**Request body:**
```json
{
  "contactId": "12345",
  "visaId": "es-dnv-freelancer",
  "visaLabel": "Digital Nomad Visa — Freelancer",
  "country": "Spain",
  "package": "Gold",
  "packagePrice": 2300,
  "familyMembers": 1,
  "children": 0,
  "addons": [
    { "id": "house-hunt-purchase", "name": "House Hunt — Major Cities", "price": 1300 }
  ],
  "totalEstimate": 4550,
  "timestamp": "2026-06-03T10:45:00.000Z"
}
```

**Response:**
```json
{
  "success": true,
  "sessionId": "session_abc123"
}
```

---

### 5. Save Admin Data

```
POST /api/admin/save
```

Saves admin panel changes (questions, pricing) to the database. Called when advisor clicks "Save changes" in the Admin Panel.

**Request body:**
```json
{
  "countries": [
    {
      "id": "es",
      "visas": [
        {
          "id": "es-dnv-freelancer",
          "label": "Digital Nomad Visa — Freelancer",
          "timeline": "4–6 months",
          "notes": "Health insurance required.",
          "packages": {
            "bronze": { "price": 1650, "familyMember": 950, "child": null },
            "silver": { "price": 2050, "familyMember": 950, "child": null },
            "gold":   { "price": 2300, "familyMember": 950, "child": null },
            "platinum": { "price": 3900, "familyMember": 1800, "child": 1000 }
          },
          "features": {
            "bronze": ["Document list", "Review", "Forms"],
            "silver": ["All Bronze", "Residency fee"],
            "gold":   ["All Silver", "Digital certificate"],
            "platinum": ["All Gold", "Translations", "Bank account"]
          },
          "addons": [
            { "id": "house-hunt", "name": "House Hunt", "desc": "Major cities", "price": 1300 }
          ]
        }
      ]
    }
  ],
  "eligOverrides": {
    "es-dnv-freelancer": [
      { "id": "citizenship", "label": "Citizenship", "type": "select", "required": true }
    ]
  }
}
```

**Response:**
```json
{
  "success": true
}
```

---

### 6. Fetch Admin Data (on load)

```
GET /api/admin/data
```

Returns the latest admin-saved data so the app loads with Kevin's database values rather than defaults.

**Response:** Same shape as the POST /api/admin/save request body above.

---

## Database Schema (Suggested)

Kevin can implement this however fits Lexidy's stack. The minimum tables needed:

### `visa_packages`
| Column | Type | Notes |
|--------|------|-------|
| `visa_id` | varchar | e.g. `es-dnv-freelancer` |
| `tier` | varchar | `bronze` \| `silver` \| `gold` \| `platinum` |
| `price` | integer | Base price in euros |
| `family_member_price` | integer | Nullable |
| `child_price` | integer | Nullable |
| `price_note` | varchar | e.g. `+IVA` |
| `features` | jsonb | Array of feature strings |
| `updated_at` | timestamp | |

### `visa_addons`
| Column | Type |
|--------|------|
| `visa_id` | varchar |
| `addon_id` | varchar |
| `name` | varchar |
| `description` | varchar |
| `price` | integer |
| `sort_order` | integer |

### `eligibility_questions`
| Column | Type | Notes |
|--------|------|-------|
| `visa_id` | varchar | |
| `question_id` | varchar | |
| `label` | varchar | |
| `type` | varchar | See question types |
| `required` | boolean | |
| `options` | jsonb | For select type |
| `hint` | varchar | |
| `threshold` | integer | For currency type |
| `disqualify_if` | varchar | `'Yes'` or `'No'` |
| `disqualify_msg` | varchar | |
| `review_if` | varchar | `'Yes'` or `'No'` |
| `review_msg` | varchar | |
| `disqualify_below` | boolean | |
| `review_below` | boolean | |
| `sort_order` | integer | |
| `updated_at` | timestamp | |

### `sessions`
| Column | Type |
|--------|------|
| `session_id` | varchar |
| `contact_id` | varchar |
| `visa_id` | varchar |
| `type` | varchar (`eligibility` \| `pricing`) |
| `result` | jsonb |
| `created_at` | timestamp |

---

## Implementation Order (Recommended)

1. **`GET /api/contacts/:contactId`** — needed on first load
2. **`POST /api/eligibility-questions/:visaId`** — needed for eligibility test
3. **`POST /api/sessions/eligibility`** — needed to log results
4. **`POST /api/sessions/pricing`** — needed to log pricing decisions
5. **`GET /api/admin/data`** + **`POST /api/admin/save`** — needed for admin panel sync

---

## Questions?

Contact Alejandro for any clarifications on the expected behavior or data shapes.
