// ══════════════════════════════════════════════════════════════
// LEXIDY SALES HUB — MOCK DATA
// ══════════════════════════════════════════════════════════════
//
// This file contains all data for the Sales Hub.
// Once Kevin's backend is ready, this data will be fetched
// from his API endpoints via dataService.js — this file
// will no longer be needed and can be removed.
//
// ── DATA STRUCTURE ───────────────────────────────────────────
// COUNTRIES: Array of country objects, each with visas[]
// Each visa has: id, label, active, packages, features, addons, notes, timeline
// ELIG_DEFS: Map of visaId → function(answers) → array of questions
//
// ── HOW TO EDIT ──────────────────────────────────────────────
// Use the Admin Panel in the app UI (recommended) — changes
// persist to localStorage until Kevin's API is connected.
// Or edit this file directly and restart the dev server.
//
// ══════════════════════════════════════════════════════════════

// ── COUNTRIES & VISAS ─────────────────────────────────────────
export const COUNTRIES = [
  // ─────────────────────────────────────────────────────────────
  // SPAIN
  // ─────────────────────────────────────────────────────────────
  {
    id: 'es', flag: '🇪🇸', name: 'Spain',
    visas: [
      {
        id: 'es-dnv-freelancer', label: 'Digital Nomad Visa — Freelancer', active: true,
        department: 'Immigration',
        packages: {
          bronze: { price: 1650, familyMember: 950, child: null, label: 'Bronze' },
          silver: { price: 2050, familyMember: 950, child: null, label: 'Silver' },
          gold:   { price: 2300, familyMember: 950, child: null, label: 'Gold' },
          platinum: { price: 3900, familyMember: 1800, child: 1000, label: 'Platinum' }
        },
        features: {
          bronze: ['List of Documents to Gather','Review of Documentation','Application Forms Preparation','Digital Submission / Consulate Appointment'],
          silver: ['List of Documents to Gather','Review of Documentation','Application Forms Preparation','Digital Submission / Consulate Appointment','Residency Fee*','Town Hall Registration','Foreigner Identity Card'],
          gold:   ['List of Documents to Gather','Review of Documentation','Application Forms Preparation','Digital Submission / Consulate Appointment','Residency Fee*','Town Hall Registration','Foreigner Identity Card','Digital Certificate','SS Registration','Tax Registration'],
          platinum: ['All Gold services','Translations included (every applicant)','Power of Attorney','Opening Bank Account','Lease Agreement Drafting/Review','First Renewal included for every member']
        },
        addons: [
          { id: 'house-hunt-purchase', name: 'House Hunt — Major Cities', desc: 'Barcelona, Madrid & Malaga', price: 1300 },
          { id: 'house-hunt-rental',   name: 'House Hunt — Rest of Spain', desc: 'All other regions', price: 1560 },
          { id: 'fbi-criminal',        name: 'FBI / Criminal Record', desc: 'Document retrieval service', price: 200 },
          { id: 'apostille',           name: 'Apostille / Legalisation', desc: '€180 per document', price: 180 },
          { id: 'translations',        name: 'Translations', desc: '€200 per order', price: 200 },
          { id: 'school',              name: 'School Consultancy', desc: 'Adults €500 / Kids €250', price: 500 }
        ],
        notes: '*Only included when submitting from Spain. Visa fees not included. Health insurance ~€50–100/month per person.',
        timeline: '4–6 months total'
      },
      {
        id: 'es-dnv-employee', label: 'Digital Nomad Visa — Employee', active: true,
        department: 'Immigration',
        packages: {
          bronze: { price: 900, familyMember: 600, child: null, label: 'Bronze', familyNote: '€600 1st FM / €350 additional' },
          silver: { price: 2050, familyMember: 950, child: null, label: 'Silver', familyNote: '€950 1st FM / €650 additional' },
          gold:   { price: 2300, familyMember: 950, child: null, label: 'Gold', familyNote: '€950 1st FM / €650 additional' },
          platinum: { price: 3900, familyMember: 1800, child: 1000, label: 'Platinum' }
        },
        features: {
          bronze: ['List of Documents to Gather','Review of Documentation','Application Forms Preparation','Digital Submission / Consulate Appointment'],
          silver: ['List of Documents to Gather','Review of Documentation','Application Forms Preparation','Digital Submission / Consulate Appointment','Residency Fee*','Town Hall Registration','Foreigner Identity Card'],
          gold:   ['List of Documents to Gather','Review of Documentation','Application Forms Preparation','Digital Submission / Consulate Appointment','Residency Fee*','Town Hall Registration','Foreigner Identity Card','Digital Certificate','SS Registration','Tax Registration'],
          platinum: ['All Gold services','Translations included (every applicant)','Power of Attorney','Opening Bank Account','Lease Agreement Drafting/Review','15% Discount on 1st Tax Return','First Renewal included for every member']
        },
        addons: [
          { id: 'house-hunt-purchase', name: 'House Hunt — Major Cities', desc: 'Barcelona, Madrid & Malaga', price: 1300 },
          { id: 'house-hunt-rental',   name: 'House Hunt — Rest of Spain', desc: 'All other regions', price: 1560 },
          { id: 'fbi-criminal',        name: 'FBI / Criminal Record', desc: 'Document retrieval service', price: 200 },
          { id: 'apostille',           name: 'Apostille / Legalisation', desc: '€180 per document', price: 180 },
          { id: 'translations',        name: 'Translations', desc: '€200 per order', price: 200 },
          { id: 'beckham',             name: 'Beckham Law Application', desc: 'Special tax regime', price: 600 },
          { id: 'school',              name: 'School Consultancy', desc: 'Adults €500 / Kids €250', price: 500 }
        ],
        notes: '*Only included when submitting from Spain. Visa fees not included. Health insurance ~€50–100/month per person.',
        timeline: '4–6 months total'
      },
      {
        id: 'es-nlv', label: 'Non-Lucrative Visa', active: true,
        department: 'Immigration',
        packages: {
          bronze: { price: 1100, familyMember: 650, child: null, label: 'Bronze', familyNote: '€650 1st FM / €350 additional' },
          silver: { price: 1400, familyMember: 950, child: null, label: 'Silver', familyNote: '€950 1st FM / €450 additional' },
          gold:   { price: 1700, familyMember: 1150, child: null, label: 'Gold', familyNote: '€1,150 1st FM / €650 additional' },
          platinum: { price: 3400, familyMember: 1250, child: 650, label: 'Platinum' }
        },
        features: {
          bronze: ['List of Documents to Gather','Review of Documentation','Application Forms Preparation','Communication with Public Bodies'],
          silver: ['List of Documents to Gather','Review of Documentation','Application Forms Preparation','Communication with Public Bodies','Town Hall Registration','Assistance with obtaining the TIE'],
          gold:   ['List of Documents to Gather','Review of Documentation','Application Forms Preparation','Communication with Public Bodies','Town Hall Registration','Assistance with obtaining the TIE','Digital Submission'],
          platinum: ['All Gold services','Translations included','Power of Attorney','Opening Bank Account','Tax Consultation','Tax Registration','First Renewal included for every member']
        },
        addons: [
          { id: 'house-hunt-purchase', name: 'House Hunt — Major Cities', desc: 'Barcelona, Madrid & Malaga', price: 1300 },
          { id: 'house-hunt-rental',   name: 'House Hunt — Rest of Spain', desc: 'All other regions', price: 1560 },
          { id: 'apostille',           name: 'Apostille / Legalisation', desc: '€180 per document', price: 180 },
          { id: 'translations',        name: 'Translations', desc: '€200 per order', price: 200 },
          { id: 'tax-consultation',    name: 'Tax Consultation', desc: '€250 + 21% VAT', price: 250 },
          { id: 'school',              name: 'School Consultancy', desc: 'Adults €500 / Kids €250', price: 500 }
        ],
        notes: '*Health insurance ~€50–100/month per person. Visa fees not included.',
        timeline: '3–5 months total'
      },
      {
        id: 'es-hqp', label: 'Highly Qualified Professionals', active: true,
        department: 'Immigration',
        packages: {
          bronze: { price: 1650, familyMember: 550, child: null, label: 'Bronze' },
          silver: { price: 1950, familyMember: 850, child: null, label: 'Silver' },
          gold:   { price: 2780, familyMember: 1000, child: null, label: 'Gold' },
          platinum: null
        },
        features: {
          bronze: ['List of Documents to Gather','Review of Documentation','Application Forms Preparation','Digital Submission of the Application','Assistance with Visa Application (if applicable)'],
          silver: ['All Bronze services','Residency Administrative Fee','Town Hall Registration','TIE','Translations included','Request for Beckham Law'],
          gold:   ['All Silver services','Labour Consultation (1hr)','Full documentation review'],
          platinum: []
        },
        addons: [
          { id: 'house-hunt-purchase', name: 'House Hunt — Major Cities', desc: 'Barcelona, Madrid & Malaga', price: 1300 },
          { id: 'apostille',           name: 'Apostille / Legalisation', desc: '€150–200 per document', price: 175 },
          { id: 'translations',        name: 'Translations', desc: '€30–40 per page', price: 35 },
          { id: 'tax-consultation',    name: 'Tax Consultation', desc: '€300 + 21% VAT', price: 300 }
        ],
        notes: 'Legalisations/Apostille approx. €150–200/document. Translations approx. €30–40/page.',
        timeline: '3–4 months total'
      },
      {
        id: 'es-citizenship', label: 'Citizenship by Residence', active: true,
        department: 'Immigration',
        packages: {
          bronze: { price: 400, familyMember: null, child: null, label: 'Bronze', priceNote: '+IVA' },
          silver: { price: 750, familyMember: null, child: null, label: 'Silver', priceNote: '+IVA' },
          gold:   { price: 1150, familyMember: null, child: null, label: 'Gold', priceNote: '+IVA' },
          platinum: null
        },
        features: {
          bronze: ['Basic documentation guidance'],
          silver: ['Documentation review','Forms preparation'],
          gold:   ['Full documentation review','Forms preparation','Submission support','Communication with authorities']
        },
        addons: [
          { id: 'apostille',           name: 'Apostille / Legalisation', desc: '€180 per document', price: 180 },
          { id: 'translations',        name: 'Translations', desc: '€200 per order', price: 200 },
          { id: 'tax-consultation',    name: 'Tax Consultation', desc: '€300 + 21% VAT', price: 300 }
        ],
        notes: 'Notary fees not included in case of Oath in front of a Notary Public. Prices + IVA.',
        timeline: '6–12 months total'
      }
    ]
  },

  // ─────────────────────────────────────────────────────────────
  // PORTUGAL
  // ─────────────────────────────────────────────────────────────
  {
    id: 'pt', flag: '🇵🇹', name: 'Portugal',
    visas: [
      {
        id: 'pt-dnv', label: 'Digital Nomad Visa', active: true,
        department: 'Immigration',
        packages: {
          bronze: { price: 800, familyMember: null, child: null, label: 'Bronze' },
          silver: { price: 1850, familyMember: null, child: null, label: 'Silver' },
          gold:   { price: 2400, familyMember: null, child: null, label: 'Gold' },
          platinum: null
        },
        features: {
          bronze: ['Preparation of documents list & POA','NIF & Tax Representation*','Visa application documents list'],
          silver: ['All Bronze services','Opening Portuguese Bank Account','Review of documents & forms','Consulate appointment communication','Follow up until Visa attainment'],
          gold:   ['All Silver services','Residence Permit documents','AIMA appointment communication','Follow up until Residence Permit','Accompaniment at AIMA**','Tax Residency Registration***','NISS Registration***']
        },
        addons: [
          { id: 'house-hunting', name: 'House Hunting', desc: 'Quote on request', price: 0 },
          { id: 'apostille',     name: 'Apostille / Legalisation', desc: '€180 per document', price: 180 },
          { id: 'translations',  name: 'Translations', desc: '€190 per order', price: 190 },
          { id: 'docs-retrieval',name: 'Documents Retrieval (ACRO, FBI)', desc: '€200 per document', price: 200 },
          { id: 'school',        name: 'School Consultancy', desc: 'Adults €500 / Kids €250', price: 500 }
        ],
        notes: '*Tax representation for 1 year; additional charges if extended. **Extra charges for appointments outside Lisbon/Porto. ***For main applicant only.',
        timeline: '4–6 months total'
      },
      {
        id: 'pt-dnv-family', label: 'Digital Nomad Visa + Family', active: true,
        department: 'Immigration',
        packages: {
          bronze: { price: 800, familyMember: 600, child: null, label: 'Bronze' },
          silver: { price: 1850, familyMember: 1000, child: null, label: 'Silver' },
          gold:   { price: 2400, familyMember: 1300, child: null, label: 'Gold' },
          platinum: null
        },
        features: {
          bronze: ['Preparation of documents list & POA','NIF & Tax Representation*','Visa application documents list'],
          silver: ['All Bronze services','Opening Portuguese Bank Account','Review of documents & forms','Consulate appointment communication','Follow up until Visa attainment'],
          gold:   ['All Silver services','Residence Permit documents','AIMA appointment & follow up','Accompaniment at AIMA**','Tax Residency Registration***','NISS Registration***']
        },
        addons: [
          { id: 'house-hunting', name: 'House Hunting', desc: 'Quote on request', price: 0 },
          { id: 'apostille',     name: 'Apostille / Legalisation', desc: '€180 per document', price: 180 },
          { id: 'translations',  name: 'Translations', desc: '€190 per order', price: 190 },
          { id: 'docs-retrieval',name: 'Documents Retrieval', desc: '€200 per document', price: 200 },
          { id: 'school',        name: 'School Consultancy', desc: 'Adults €500 / Kids €250', price: 500 }
        ],
        notes: '*Tax representation 1 year. **Extra charges outside Lisbon/Porto. ***Main applicant only. Family member fees apply additionally.',
        timeline: '4–6 months total'
      },
      {
        id: 'pt-dnv-platinum-employee', label: 'Digital Nomad Visa — Platinum (Employee)', active: true,
        department: 'Immigration',
        packages: {
          bronze: null,
          silver: null,
          gold:   null,
          platinum: { price: 3800, familyMember: 1700, child: null, label: 'Platinum' }
        },
        features: {
          platinum: ['Preparation of documents list & POA','NIF & Tax Representation*','Visa application & Consulate appointment','Follow up until Visa','Residence Permit application','AIMA accompaniment','Opening Portuguese Bank Account','Registration as Tax Resident***','NISS for main applicant','Rental property sourcing & viewings','Lease negotiation support','Utility setup','Tax Consultation','15% Discount on 1st tax return','1st Renewal included for every member','10% lifetime discount on all Lexidy services']
        },
        addons: [
          { id: 'house-hunting', name: 'House Hunting', desc: 'Custom quote on request', price: 0 },
          { id: 'apostille',     name: 'Apostille / Legalisation', desc: '€180 per document', price: 180 },
          { id: 'translations',  name: 'Translations', desc: '€190 per order', price: 190 },
          { id: 'school',        name: 'School Consultancy', desc: 'Adults €500 / Kids €250', price: 500 }
        ],
        notes: 'All-inclusive end-to-end service. 10% lifetime discount on all Lexidy services.',
        timeline: '4–6 months total'
      },
      {
        id: 'pt-d7-family', label: 'D7 Passive Income Visa + Family', active: true,
        department: 'Immigration',
        packages: {
          bronze: { price: 1400, familyMember: 800, child: null, label: 'Bronze' },
          silver: { price: 1800, familyMember: 1000, child: null, label: 'Silver' },
          gold:   { price: 2300, familyMember: 1300, child: null, label: 'Gold' },
          platinum: null
        },
        features: {
          bronze: ['Preparation of documents list & POA','NIF & Tax Representation*','Visa application documents'],
          silver: ['All Bronze services','Opening Portuguese Bank Account','Review of documents & forms','Consulate appointment & follow up','Visa follow up'],
          gold:   ['All Silver services','Residence Permit application','AIMA appointment & follow up','Accompaniment at AIMA**','Tax Consultation']
        },
        addons: [
          { id: 'house-hunting', name: 'House Hunting', desc: 'Quote on request', price: 0 },
          { id: 'apostille',     name: 'Apostille / Legalisation', desc: '€180 per document', price: 180 },
          { id: 'translations',  name: 'Translations', desc: '€190 per order', price: 190 },
          { id: 'school',        name: 'School Consultancy', desc: 'Adults €500 / Kids €250', price: 500 }
        ],
        notes: '*Tax representation 1 year. **Extra charges outside Lisbon/Porto.',
        timeline: '4–6 months total'
      },
      {
        id: 'pt-d7-platinum-no-relocation', label: 'D7 Passive Income — Platinum (without relocation)', active: true,
        department: 'Immigration',
        packages: {
          bronze: null, silver: null, gold: null,
          platinum: { price: 4200, familyMember: 1700, child: null, label: 'Platinum' }
        },
        features: {
          platinum: ['Preparation of documents list & POA','NIF & Tax Representation*','Visa application & Consulate appointment','Opening Portuguese Bank Account','Residence Permit application','AIMA accompaniment','Lease Agreement Drafting/Review','Tax Consultation','Registration as Tax Resident***','1st Renewal included for every member','15% Discount on 1st tax return','10% lifetime discount on all Lexidy services']
        },
        addons: [
          { id: 'house-hunting', name: 'House Hunting', desc: 'Custom quote on request', price: 0 },
          { id: 'apostille',     name: 'Apostille / Legalisation', desc: '€180 per document', price: 180 }
        ],
        notes: 'All-inclusive end-to-end. Without relocation support package.',
        timeline: '4–6 months total'
      },
      {
        id: 'pt-d7-platinum-relocation', label: 'D7 Passive Income — Platinum (with relocation)', active: true,
        department: 'Immigration',
        packages: {
          bronze: null, silver: null, gold: null,
          platinum: { price: 3100, familyMember: 1700, child: null, label: 'Platinum' }
        },
        features: {
          platinum: ['Preparation of documents list & POA','NIF & Tax Representation*','Visa application & Consulate appointment','Opening Portuguese Bank Account','Residence Permit application','AIMA accompaniment','Rental property sourcing & viewings','Lease negotiation support','Utility setup & move-in coordination','Tax Consultation','Registration as Tax Resident***','1st Renewal included for every member','15% Discount on 1st tax return','10% lifetime discount on all Lexidy services']
        },
        addons: [
          { id: 'apostille',    name: 'Apostille / Legalisation', desc: '€180 per document', price: 180 },
          { id: 'school',       name: 'School Consultancy', desc: 'Adults €500 / Kids €250', price: 500 }
        ],
        notes: 'All-inclusive including full relocation support package.',
        timeline: '4–6 months total'
      },
      {
        id: 'pt-d1', label: 'D1 Work / Manager Visa', active: true,
        department: 'Immigration',
        packages: {
          bronze: { price: 800, familyMember: 400, child: null, label: 'Bronze' },
          silver: { price: 1900, familyMember: 1300, child: null, label: 'Silver' },
          gold:   { price: 3200, familyMember: null, child: null, label: 'Gold', priceNote: 'Full package' },
          platinum: null
        },
        features: {
          bronze: ['Preparation of documents list & POA','NIF & Tax Representation*','NISS registration***'],
          silver: ['Review of documents & forms','Consulate appointment & communication','Follow up until Visa','Residence Permit preparation','AIMA appointment & communication','Follow up until Residence Card'],
          gold:   ['All Silver services','Tax Residency Registration','Tax Consultation','Additional services included']
        },
        addons: [
          { id: 'aima-accomp',  name: 'Accompaniment at AIMA', desc: '€300 per session', price: 300 },
          { id: 'doc-collect',  name: 'Collect Documents at AIMA', desc: '€400', price: 400 },
          { id: 'license',      name: "Driver's Licence Exchange", desc: '€450', price: 450 }
        ],
        notes: '*Extra appointment €100 additional fee. ***Not applicable to family members. All fees subject to VAT@23%.',
        timeline: '4–6 months total'
      }
    ]
  },

  // ─────────────────────────────────────────────────────────────
  // GREECE
  // ─────────────────────────────────────────────────────────────
  {
    id: 'gr', flag: '🇬🇷', name: 'Greece',
    visas: [
      {
        id: 'gr-dnv-freelancer', label: 'Digital Nomad Visa — Freelancer', active: true,
        department: 'Immigration',
        packages: {
          bronze: { price: 1900, familyMember: 500, child: null, label: 'Bronze' },
          silver: { price: 2100, familyMember: 500, child: null, label: 'Silver' },
          gold:   { price: 2400, familyMember: 800, child: null, label: 'Gold' },
          platinum: { price: 3200, familyMember: 1000, child: null, label: 'Platinum' }
        },
        features: {
          bronze: ['Documents list preparation','Documentation review','Application forms preparation','Greek Consulate appointment','Digital submission at Ministry of Immigration','Application tracking','Fingerprints appointment'],
          silver: ['All Bronze services','Collection of residence card if necessary'],
          gold:   ['All Silver services','All translations included (English to Greek)'],
          platinum: ['All Gold services','Lease Agreement Draft/Review','1st Renewal included for every member*','10% lifetime discount on all Lexidy services']
        },
        addons: [
          { id: 'house-hunt-purchase', name: 'House Hunt Purchase', desc: 'Property search service', price: 0 },
          { id: 'house-hunt-rental',   name: 'House Hunt Rental', desc: 'Rental search service', price: 0 },
          { id: 'fbi-criminal',        name: 'FBI / Criminal Record', desc: 'Document retrieval', price: 0 },
          { id: 'apostille',           name: 'Apostille', desc: '€150–200 per document', price: 175 },
          { id: 'translations',        name: 'Translations', desc: 'English to Greek', price: 0 },
          { id: 'car-import',          name: 'Car Import', desc: 'Vehicle importation support', price: 0 }
        ],
        notes: 'Public Fee: €1,000 main applicant / €150 spouse. Medical Insurance: ~€140/person/year. Apostille: ~€150–200/document. VAT 24% applies.',
        timeline: '2–3 months total'
      },
      {
        id: 'gr-dnv-employee', label: 'Digital Nomad Visa — Employee', active: true,
        department: 'Immigration',
        packages: {
          bronze: { price: 1900, familyMember: 500, child: null, label: 'Bronze' },
          silver: { price: 2100, familyMember: 500, child: null, label: 'Silver' },
          gold:   { price: 2400, familyMember: 800, child: null, label: 'Gold' },
          platinum: { price: 3200, familyMember: 1000, child: null, label: 'Platinum' }
        },
        features: {
          bronze: ['Documents list preparation','Documentation review','Application forms preparation','Greek Consulate appointment','Digital submission at Ministry','Application tracking','Fingerprints appointment'],
          silver: ['All Bronze services','Collection of residence card if necessary'],
          gold:   ['All Silver services','All translations included (English to Greek)'],
          platinum: ['All Gold services','Lease Agreement Draft/Review','1st Renewal included for every member*','10% lifetime discount on all Lexidy services']
        },
        addons: [
          { id: 'house-hunt-purchase', name: 'House Hunt Purchase', desc: 'Property search service', price: 0 },
          { id: 'house-hunt-rental',   name: 'House Hunt Rental', desc: 'Rental search service', price: 0 },
          { id: 'apostille',           name: 'Apostille', desc: '€150–200 per document', price: 175 },
          { id: 'translations',        name: 'Translations', desc: 'English to Greek', price: 0 },
          { id: 'car-import',          name: 'Car Import', desc: 'Vehicle importation support', price: 0 }
        ],
        notes: 'Public Fee: €1,000 main applicant / €150 spouse. Medical Insurance: ~€140/person/year.',
        timeline: '2–3 months total'
      },
      {
        id: 'gr-dnv-freelancer-family', label: 'Digital Nomad Visa — Freelancer + Family', active: true,
        department: 'Immigration',
        packages: {
          bronze: { price: 1900, familyMember: 500, child: 350, label: 'Bronze', familyNote: '€500 1st FM / €350 additional' },
          silver: { price: 2100, familyMember: 500, child: 350, label: 'Silver', familyNote: '€500 1st FM / €350 additional' },
          gold:   { price: 2400, familyMember: 800, child: 500, label: 'Gold', familyNote: '€800 1st FM / €500 additional' },
          platinum: { price: 3200, familyMember: 1000, child: null, label: 'Platinum' }
        },
        features: {
          bronze: ['Documents list','Documentation review','Application forms','Consulate appointment','Digital submission','Tracking','Fingerprints'],
          silver: ['All Bronze services','Collection of residence card'],
          gold:   ['All Silver services','Translations included'],
          platinum: ['All Gold services','Lease Agreement Draft/Review','1st Renewal included','10% lifetime discount']
        },
        addons: [
          { id: 'apostille',     name: 'Apostille', desc: '€150–200 per document', price: 175 },
          { id: 'translations',  name: 'Translations', desc: 'English to Greek', price: 0 },
          { id: 'car-import',    name: 'Car Import', desc: 'Vehicle importation', price: 0 }
        ],
        notes: 'Public Fee: €1,000 main applicant / €150 spouse. Medical Insurance: ~€140/person/year.',
        timeline: '2–3 months total'
      },
      {
        id: 'gr-dnv-employee-family', label: 'Digital Nomad Visa — Employee + Family', active: true,
        department: 'Immigration',
        packages: {
          bronze: { price: 1900, familyMember: 500, child: 350, label: 'Bronze', familyNote: '€500 1st FM / €350 additional' },
          silver: { price: 2100, familyMember: 500, child: 350, label: 'Silver', familyNote: '€500 1st FM / €350 additional' },
          gold:   { price: 2400, familyMember: 800, child: 500, label: 'Gold', familyNote: '€800 1st FM / €500 additional' },
          platinum: { price: 3200, familyMember: 1000, child: null, label: 'Platinum' }
        },
        features: {
          bronze: ['Documents list','Documentation review','Application forms','Consulate appointment','Digital submission','Tracking','Fingerprints'],
          silver: ['All Bronze services','Collection of residence card'],
          gold:   ['All Silver services','Translations included'],
          platinum: ['All Gold services','Lease Agreement Draft/Review','1st Renewal included','10% lifetime discount']
        },
        addons: [
          { id: 'apostille',    name: 'Apostille', desc: '€150–200 per document', price: 175 },
          { id: 'translations', name: 'Translations', desc: 'English to Greek', price: 0 }
        ],
        notes: 'Public Fee: €1,000 main applicant / €150 spouse. Medical Insurance: ~€140/person/year.',
        timeline: '2–3 months total'
      },
      {
        id: 'gr-fip-family', label: 'Financially Independent Permit (FIP)', active: true,
        department: 'Immigration',
        packages: {
          bronze: { price: 1800, familyMember: 500, child: 350, label: 'Bronze', familyNote: '€500 1st FM / €350 additional' },
          silver: { price: 2300, familyMember: 500, child: 350, label: 'Silver', familyNote: '€500 1st FM / €350 additional' },
          gold:   { price: 2500, familyMember: 800, child: 500, label: 'Gold', familyNote: '€800 1st FM / €500 additional' },
          platinum: { price: 3300, familyMember: 1000, child: null, label: 'Platinum' }
        },
        features: {
          bronze: ['Documents list','Documentation review','Application forms','Consulate appointment','Digital submission','Tracking','Fingerprints'],
          silver: ['All Bronze services','Collection of residence card'],
          gold:   ['All Silver services','All translations included'],
          platinum: ['All Gold services','Lease Agreement Draft/Review','1st Renewal included','10% lifetime discount']
        },
        addons: [
          { id: 'greek-tax-number', name: 'Greek Tax Number (AFM)', desc: '€500 + VAT 24%', price: 500 },
          { id: 'bank-account',     name: 'Greek Bank Account', desc: '€500 + VAT 24%', price: 500 },
          { id: 'apostille',        name: 'Apostille', desc: '€150–200 per document', price: 175 }
        ],
        notes: 'Government Fee: €1,000 main applicant / €150 spouse. Health insurance: ~€200/year/person.',
        timeline: '3–4 months total'
      },
      {
        id: 'gr-citizenship', label: 'Citizenship by Descent', active: true,
        department: 'Immigration',
        packages: {
          bronze: null,
          silver: { price: 2000, familyMember: null, child: null, label: 'Silver', priceNote: 'per adult applicant' },
          gold:   { price: 2500, familyMember: null, child: null, label: 'Gold', priceNote: 'per adult applicant' },
          platinum: null
        },
        features: {
          silver: ['Documents list','Documentation review','Application forms preparation','Submission of application'],
          gold:   ['All Silver services','Expedited processing','Priority communication','Full case management']
        },
        addons: [
          { id: 'initial-assessment', name: 'Initial Assessment', desc: '€800 cost of assessment', price: 800 },
          { id: 'apostille',          name: 'Apostille', desc: '€150–200 per document', price: 175 },
          { id: 'translations',       name: 'Translations', desc: 'Languages other than English charged separately', price: 0 }
        ],
        notes: 'Initial assessment cost: €800. Translations from languages other than English charged extra. Admin fees and courier costs not included.',
        timeline: '6–12 months total'
      }
    ]
  },

  // ─────────────────────────────────────────────────────────────
  // FRANCE
  // ─────────────────────────────────────────────────────────────
  {
    id: 'fr', flag: '🇫🇷', name: 'France',
    visas: [
      {
        id: 'fr-visitor', label: 'Visitor Visa', active: true,
        department: 'Immigration',
        packages: {
          bronze: { price: 1800, familyMember: 1200, child: null, label: 'Bronze' },
          silver: { price: 2400, familyMember: 1600, child: null, label: 'Silver' },
          gold:   { price: 3100, familyMember: 2350, child: null, label: 'Gold' },
          platinum: { price: 4650, familyMember: 3100, child: 700, label: 'Platinum' }
        },
        features: {
          bronze: ['List of Documents to Gather','Review of Documentation','Application Forms Preparation'],
          silver: ['All Bronze services','Residency Fee Payment','Visa Validation'],
          gold:   ['All Silver services','Full case management','Priority support'],
          platinum: ['All Gold services','Tax Consultation (30 min)','15% Discount on 1st Tax Return Filing','1st Renewal included for every member','French Social Security Registration','10% lifetime discount on all Lexidy services']
        },
        addons: [
          { id: 'house-hunt-paris',   name: 'House Hunting — Paris', desc: '€1,750', price: 1750 },
          { id: 'apostille',          name: 'Apostille / Legalisation', desc: '€180 per document', price: 180 },
          { id: 'translations',       name: 'Translations', desc: '€390 per order', price: 390 },
          { id: 'docs-retrieval',     name: 'Documents Retrieval', desc: '€200 per document', price: 200 }
        ],
        notes: 'Consulate Visa Fee: €99/applicant (paid at appointment). Health insurance variable. Continental France only. Note: Additional $258 fee for US citizens (Platinum).',
        timeline: '2–3 months total'
      },
      {
        id: 'fr-visitor-family', label: 'Visitor Visa — Families', active: true,
        department: 'Immigration',
        packages: {
          bronze: { price: 1800, familyMember: 1200, child: 700, label: 'Bronze', familyNote: '€1,200 1st FM / €700 additional' },
          silver: { price: 2400, familyMember: 1600, child: 700, label: 'Silver', familyNote: '€1,600 1st FM / €700 additional' },
          gold:   { price: 3100, familyMember: 2350, child: 700, label: 'Gold', familyNote: '€2,350 1st FM / €700 additional' },
          platinum: { price: 4650, familyMember: 3100, child: 700, label: 'Platinum' }
        },
        features: {
          bronze: ['List of Documents to Gather','Review of Documentation','Application Forms Preparation'],
          silver: ['All Bronze services','Residency Fee Payment','Visa Validation'],
          gold:   ['All Silver services','Full case management'],
          platinum: ['All Gold services','Tax Consultation','15% Discount on 1st Tax Return','1st Renewal included','French Social Security Registration','10% lifetime discount']
        },
        addons: [
          { id: 'house-hunt-paris', name: 'House Hunting — Paris', desc: '€1,750', price: 1750 },
          { id: 'apostille',        name: 'Apostille / Legalisation', desc: '€180 per document', price: 180 },
          { id: 'translations',     name: 'Translations', desc: '€390 per order', price: 390 }
        ],
        notes: 'Consulate Visa Fee: €99/applicant. Continental France only.',
        timeline: '2–3 months total'
      },
      {
        id: 'fr-entrepreneur', label: 'Entrepreneur Visa', active: true,
        department: 'Immigration',
        packages: {
          bronze: { price: 3580, familyMember: 1200, child: null, label: 'Bronze' },
          silver: { price: 3970, familyMember: 1200, child: null, label: 'Silver' },
          gold:   { price: 4950, familyMember: 1600, child: null, label: 'Gold' },
          platinum: { price: 6400, familyMember: 2350, child: 700, label: 'Platinum' }
        },
        features: {
          bronze: ['List of Documents','Documentation Review','Application Forms Preparation'],
          silver: ['All Bronze services','Residency Fee Payment','Visa Validation'],
          gold:   ['All Silver services','Company Registration support'],
          platinum: ['All Gold services','Tax Consultation for business (45 min)','Company Registration (excl. legal fees)','15% Discount on 1st Tax Return','1st Renewal included','10% lifetime discount']
        },
        addons: [
          { id: 'house-hunt-paris', name: 'House Hunting — Paris', desc: '€1,750', price: 1750 },
          { id: 'apostille',        name: 'Apostille / Legalisation', desc: '€180 per document', price: 180 },
          { id: 'translations',     name: 'Translations', desc: '€390 per order', price: 390 }
        ],
        notes: 'Consulate Visa Fee: €99/applicant. Company registration fees: €400–600. Continental France only.',
        timeline: '3–4 months total'
      },
      {
        id: 'fr-entrepreneur-family', label: 'Entrepreneur Visa — Families', active: true,
        department: 'Immigration',
        packages: {
          bronze: { price: 3580, familyMember: 1200, child: 700, label: 'Bronze', familyNote: '€1,200 1st FM / €700 additional' },
          silver: { price: 3970, familyMember: 1200, child: 700, label: 'Silver', familyNote: '€1,200 1st FM / €700 additional' },
          gold:   { price: 4950, familyMember: 1600, child: 700, label: 'Gold', familyNote: '€1,600 1st FM / €700 additional' },
          platinum: { price: 6400, familyMember: 2350, child: 700, label: 'Platinum' }
        },
        features: {
          bronze: ['List of Documents','Documentation Review','Application Forms'],
          silver: ['All Bronze services','Residency Fee Payment','Visa Validation'],
          gold:   ['All Silver services','Company Registration support'],
          platinum: ['All Gold services','Tax Consultation','Company Registration','15% Discount on 1st Tax Return','1st Renewal included','10% lifetime discount']
        },
        addons: [
          { id: 'house-hunt-paris', name: 'House Hunting — Paris', desc: '€1,750', price: 1750 },
          { id: 'apostille',        name: 'Apostille / Legalisation', desc: '€180 per document', price: 180 }
        ],
        notes: 'Consulate Fee: €99/applicant. Company registration fees: €400–600. Continental France only.',
        timeline: '3–4 months total'
      },
      {
        id: 'fr-talent-passport', label: 'Talent Passport — Company Owner', active: true,
        department: 'Immigration',
        packages: {
          bronze: { price: 3980, familyMember: 1000, child: null, label: 'Bronze' },
          silver: { price: 4200, familyMember: 1000, child: null, label: 'Silver' },
          gold:   { price: 5250, familyMember: 1400, child: null, label: 'Gold' },
          platinum: { price: 6400, familyMember: 1200, child: 700, label: 'Platinum' }
        },
        features: {
          bronze: ['List of Documents','Documentation Review','Application Forms Preparation'],
          silver: ['All Bronze services','Residency Fee Payment','Visa Validation'],
          gold:   ['All Silver services','Company Formation & Registration'],
          platinum: ['All Gold services','Tax Consultation for business structure','Company Registration & Formation (excl. legal fees)','15% Discount on 1st Tax Return','1st Renewal included','10% lifetime discount']
        },
        addons: [
          { id: 'house-hunt-paris', name: 'House Hunting — Paris', desc: '€1,750', price: 1750 },
          { id: 'apostille',        name: 'Apostille / Legalisation', desc: '€180 per document', price: 180 },
          { id: 'translations',     name: 'Translations', desc: '€390 per order', price: 390 }
        ],
        notes: 'Consulate Visa Fee: €99/applicant. Company registration: €1,300 for companies / €500 for freelancers after discount. Continental France only.',
        timeline: '3–4 months total'
      },
      {
        id: 'fr-talent-passport-family', label: 'Talent Passport — Company Owner + Families', active: true,
        department: 'Immigration',
        packages: {
          bronze: { price: 3980, familyMember: 1000, child: 700, label: 'Bronze', familyNote: '€1,000 1st FM / €700 additional' },
          silver: { price: 4200, familyMember: 1000, child: 700, label: 'Silver', familyNote: '€1,000 1st FM / €700 additional' },
          gold:   { price: 5250, familyMember: 1400, child: 700, label: 'Gold', familyNote: '€1,400 1st FM / €700 additional' },
          platinum: { price: 6400, familyMember: 1200, child: 700, label: 'Platinum' }
        },
        features: {
          bronze: ['List of Documents','Documentation Review','Application Forms'],
          silver: ['All Bronze services','Residency Fee Payment','Visa Validation'],
          gold:   ['All Silver services','Company Formation'],
          platinum: ['All Gold services','Tax Consultation','Company Registration','15% Discount on 1st Tax Return','1st Renewal included','10% lifetime discount']
        },
        addons: [
          { id: 'house-hunt-paris', name: 'House Hunting — Paris', desc: '€1,750', price: 1750 },
          { id: 'apostille',        name: 'Apostille / Legalisation', desc: '€180 per document', price: 180 }
        ],
        notes: 'Continental France only. Consulate fee €99/applicant.',
        timeline: '3–4 months total'
      },
      {
        id: 'fr-citizenship', label: 'Citizenship — Full Package (CNF + Passport)', active: true,
        department: 'Immigration',
        packages: {
          bronze: { price: 4500, familyMember: 2250, child: null, label: 'Package', priceNote: 'Flat fee' },
          silver: null, gold: null, platinum: null
        },
        features: {
          bronze: ['Certificat de Nationalité Française (CNF)','Documents list & review','Request from French Administration','Application Forms Preparation','Submission of application','French Passport Application','Consulate appointment booking','Updated Documents Request','Passport Application Forms','Consulate liaison']
        },
        addons: [
          { id: 'apostille',    name: 'Apostille / Legalisation', desc: '€180 per document', price: 180 },
          { id: 'translations', name: 'Translations', desc: '€390 per order', price: 390 }
        ],
        notes: 'Continental France only. Flexible payment options available.',
        timeline: '6–12 months total'
      }
    ]
  },

  // ─────────────────────────────────────────────────────────────
  // ITALY
  // ─────────────────────────────────────────────────────────────
  {
    id: 'it', flag: '🇮🇹', name: 'Italy',
    visas: [
      {
        id: 'it-erv', label: 'Elective Residence Visa (ERV)', active: true,
        department: 'Immigration',
        packages: {
          bronze: { price: 2000, familyMember: 1000, child: 500, label: 'Bronze', priceNote: '+ VAT 22%' },
          silver: { price: 3500, familyMember: 1500, child: 750, label: 'Silver', priceNote: '+ VAT 22%' },
          gold:   { price: 4000, familyMember: 1900, child: 900, label: 'Gold', priceNote: '+ VAT 22%' },
          platinum: { price: 5400, familyMember: 2000, child: 1000, label: 'Platinum', priceNote: '+ VAT 22%' }
        },
        features: {
          bronze: ['Documents list','Italian Tax ID (Codice Fiscale) Application*','Application Forms Preparation','Visa Application Instructions & Support'],
          silver: ['All Bronze services','Health Insurance Purchase Support','Residence Permit Application Support'],
          gold:   ['All Silver services','Town Hall Registration','Italian Identity Card Application Support'],
          platinum: ['All Gold services','Simplified Tax Liability Overview*','National Health System Registration (optional)*','1st Renewal included for every member*','10% lifetime discount on all Lexidy services']
        },
        addons: [
          { id: 'fbi-criminal',   name: 'FBI / Criminal Record', desc: 'Document retrieval', price: 0 },
          { id: 'translations',   name: 'Translations', desc: '~€550 main applicant', price: 550 },
          { id: 'apostille',      name: 'Apostille', desc: '€150–200 per document', price: 175 },
          { id: 'school',         name: 'School Consultancy', desc: 'Contact for pricing', price: 0 },
          { id: 'car-import',     name: 'Car Import', desc: 'Vehicle importation', price: 0 }
        ],
        notes: 'All fees NET of VAT (22%). Visa Fee: ~€116/applicant. Residence Permit: ~€146.50/applicant. Health Insurance: ~€410/applicant/year.',
        timeline: '3–4 months total'
      },
      {
        id: 'it-dnv-single', label: 'Digital Nomad Visa — Single', active: true,
        department: 'Immigration',
        packages: {
          bronze: { price: 1000, familyMember: null, child: null, label: 'Bronze', priceNote: '+ VAT 22%' },
          silver: { price: 1500, familyMember: null, child: null, label: 'Silver', priceNote: '+ VAT 22%' },
          gold:   { price: 2500, familyMember: null, child: null, label: 'Gold', priceNote: '+ VAT 22%' },
          platinum: { price: 5000, familyMember: null, child: null, label: 'Platinum', priceNote: '+ VAT 22%' }
        },
        features: {
          bronze: ['Documents list','Review of Documentation','Application Forms Preparation','Visa Application Instructions'],
          silver: ['All Bronze services','Health Insurance Purchase Support','Personal Italian Tax ID (Codice Fiscale)*'],
          gold:   ['All Silver services','Residence Permit Application Support','Town Hall Registration'],
          platinum: ['All Gold services','Social Security Registration*','Certified E-mail Set-Up*','VAT Registration*','National Health System Registration (optional)*','1st Renewal included*','10% lifetime discount']
        },
        addons: [
          { id: 'lease-review',   name: 'Review/Draft Lease Agreement', desc: '€500 + VAT', price: 500 },
          { id: 'tax-advisory',   name: 'Tax Regime Advisory Call', desc: '€250 + VAT', price: 250 },
          { id: 'renewal',        name: 'Renewal of Residence Permit', desc: '€1,000 + VAT', price: 1000 }
        ],
        notes: 'All fees NET of VAT (22%). Visa Fee: ~€116/applicant. Health Insurance: ~€500/year. Apostille: ~€100–200/document.',
        timeline: '2–3 months total'
      },
      {
        id: 'it-dnv-family', label: 'Digital Nomad Visa — Family', active: true,
        department: 'Immigration',
        packages: {
          bronze: { price: 1000, familyMember: null, child: null, label: 'Bronze', priceNote: '+ VAT 22% (MA only)' },
          silver: { price: 1500, familyMember: null, child: null, label: 'Silver', priceNote: '+ VAT 22% (MA only)' },
          gold:   { price: 2500, familyMember: 1550, child: 900, label: 'Gold', priceNote: '+ VAT 22%' },
          platinum: { price: 5000, familyMember: 1800, child: 1000, label: 'Platinum', priceNote: '+ VAT 22%' }
        },
        features: {
          bronze: ['Documents list','Documentation review','Application forms','Visa instructions (MA only)'],
          silver: ['All Bronze services','Health Insurance Support','Italian Tax ID (MA only)'],
          gold:   ['All Silver services','Residence Permit Application','Town Hall Registration','Family members fully included'],
          platinum: ['All Gold services','Social Security Registration*','Certified E-mail Set-Up*','VAT Registration*','NHS Registration (optional)*','1st Renewal included*','10% lifetime discount']
        },
        addons: [
          { id: 'lease-review', name: 'Review/Draft Lease Agreement', desc: '€500 + VAT', price: 500 },
          { id: 'tax-advisory', name: 'Tax Regime Advisory Call', desc: '€250 + VAT', price: 250 },
          { id: 'renewal',      name: 'Renewal of Residence Permit', desc: '€1,000 + VAT', price: 1000 }
        ],
        notes: 'All fees NET of VAT (22%). Bronze and Silver are MA-only packages. Gold and Platinum include family members.',
        timeline: '2–3 months total'
      },
      {
        id: 'it-rwv-single', label: 'Remote Worker Visa — Single', active: true,
        department: 'Immigration',
        packages: {
          bronze: { price: 1000, familyMember: null, child: null, label: 'Bronze', priceNote: '+ VAT 22%' },
          silver: { price: 1500, familyMember: null, child: null, label: 'Silver', priceNote: '+ VAT 22%' },
          gold:   { price: 2500, familyMember: null, child: null, label: 'Gold', priceNote: '+ VAT 22%' },
          platinum: null
        },
        features: {
          bronze: ['Documents list','Documentation review','Application forms','Visa instructions'],
          silver: ['All Bronze services','Health Insurance Support','Italian Tax ID*'],
          gold:   ['All Silver services','Residence Permit Application Support','Town Hall Registration']
        },
        addons: [
          { id: 'lease-review', name: 'Review/Draft Lease Agreement', desc: '€500 + VAT', price: 500 },
          { id: 'renewal',      name: 'Renewal of Residence Permit', desc: '€1,000 + VAT', price: 1000 },
          { id: 'doc-value',    name: 'Declaration of Value Support', desc: '€500 + VAT', price: 500 }
        ],
        notes: 'All fees NET of VAT (22%). Visa Fee: ~€116/applicant. Health Insurance: ~€500/year.',
        timeline: '2–3 months total'
      },
      {
        id: 'it-rwv-family', label: 'Remote Worker Visa — Family', active: true,
        department: 'Immigration',
        packages: {
          bronze: { price: 1000, familyMember: 900, child: 700, label: 'Bronze', priceNote: '+ VAT 22%' },
          silver: { price: 1500, familyMember: 950, child: 750, label: 'Silver', priceNote: '+ VAT 22%' },
          gold:   { price: 2500, familyMember: 1550, child: 900, label: 'Gold', priceNote: '+ VAT 22%' },
          platinum: null
        },
        features: {
          bronze: ['Documents list','Documentation review','Application forms','Visa instructions'],
          silver: ['All Bronze services','Health Insurance Support','Italian Tax ID*'],
          gold:   ['All Silver services','Residence Permit Application','Town Hall Registration','Full family included']
        },
        addons: [
          { id: 'lease-review', name: 'Review/Draft Lease Agreement', desc: '€500 + VAT', price: 500 },
          { id: 'renewal',      name: 'Renewal of Residence Permit', desc: '€1,000 + VAT', price: 1000 }
        ],
        notes: 'All fees NET of VAT (22%). Family members fully included in all packages.',
        timeline: '2–3 months total'
      },
      {
        id: 'it-investor', label: 'Investor Visa', active: true,
        department: 'Immigration',
        packages: {
          bronze: { price: 7500, familyMember: null, child: null, label: 'Bronze', priceNote: '+ VAT 22% (MA only)' },
          silver: { price: 10500, familyMember: 2000, child: null, label: 'Silver', priceNote: '+ VAT 22%' },
          gold:   { price: 12000, familyMember: 2000, child: null, label: 'Gold', priceNote: '+ VAT 22%' },
          platinum: null
        },
        features: {
          bronze: ['Documents list & requirements','Government Authorization application*','Visa Application & Booking Support*','Italian Tax ID Request*'],
          silver: ['All Bronze services','Residence Registration at Town Hall','Certified Email Set-Up','Digital Signature Set-Up Support*','Advice on Investment Options'],
          gold:   ['All Silver services','Bank Account Set-Up Support','Residence Permit Application Support (remote)']
        },
        addons: [
          { id: 'school',        name: 'School Consultancy', desc: 'Contact for pricing', price: 0 },
          { id: 'car-import',    name: 'Car Import', desc: 'Vehicle importation', price: 0 },
          { id: 'translations',  name: 'Translations', desc: '~€550 main applicant', price: 550 }
        ],
        notes: 'All fees NET of VAT (22%). Visa Fee: €116/applicant. Residence Permit: ~€130/applicant. Health Insurance: ~€400/year.',
        timeline: '4–6 months total'
      },
      {
        id: 'it-family-eu', label: 'Family Member of EU Citizens', active: true,
        department: 'Immigration',
        packages: {
          bronze: { price: 900, familyMember: 1200, child: null, label: 'Bronze', priceNote: '€900 EU National + VAT 22%' },
          silver: { price: 1200, familyMember: 1800, child: null, label: 'Silver', priceNote: '+ VAT 22%' },
          gold:   { price: 1500, familyMember: 2300, child: null, label: 'Gold', priceNote: '+ VAT 22%' },
          platinum: null
        },
        features: {
          bronze: ['Documents list & requirements','Review of Documents','Italian Tax ID*','Support with Declaration of Presence','Support with Declaration of Hospitality'],
          silver: ['All Bronze services','Residence Registration at Town Hall*','Residence Permit Application Support*'],
          gold:   ['All Silver services','Italian Identity Card Request','Enrolment with Italian NHS','Health Insurance Purchase Support','Translating Necessary Documents','Review/Draft Lease Agreements']
        },
        addons: [
          { id: 'apostille',   name: 'Apostille', desc: '€150–200 per document', price: 175 },
          { id: 'school',      name: 'School Consultancy', desc: 'Contact for pricing', price: 0 }
        ],
        notes: 'All fees NET of VAT (22%). Residence Permit Fee: ~€65/applicant. Health Insurance: from €400/year. Minor children charged at 40% of adult family member fee.',
        timeline: '2–3 months total'
      }
    ]
  },

  // ─────────────────────────────────────────────────────────────
  // MEXICO — Content coming soon
  // ─────────────────────────────────────────────────────────────
  {
    id: 'mx', flag: '🇲🇽', name: 'Mexico',
    visas: [
      { id: 'mx-temporary',  label: 'Temporary Residency Visa', active: false },
      { id: 'mx-retirement', label: 'Retirement Visa',          active: false },
      { id: 'mx-investor',   label: 'Investor Visa',            active: false },
      { id: 'mx-work',       label: 'Work Permit',              active: false }
    ]
  }
];

// ── ELIGIBILITY QUESTION FUNCTIONS ───────────────────────────
// Each function receives the current answers object and returns
// an array of question objects to render.
// Question shape: { id, label, type, required, options?, threshold?, hint?, disqualifyIf?, disqualifyMsg?, reviewIf?, reviewMsg? }

function spainDNV(ans) {
  const empType = ans.employment_type;
  const fam = parseInt(ans.family_count) || 0;
  const minIncome = 2650 + (fam > 0 ? 995 : 0) + (fam > 1 ? (fam - 1) * 335 : 0);

  const steps = [
    { id: 'citizenship',       label: 'Citizenship',                                           type: 'select',   required: true, options: NATIONALITIES },
    { id: 'family_count',      label: 'Family members joining the application',                 type: 'number',   hint: 'Enter 0 if applying alone' },
    { id: 'criminal_record',   label: 'Does the applicant have criminal records?',              type: 'yesno',    disqualifyIf: 'Yes', disqualifyMsg: 'A clean criminal record is required for the Digital Nomad Visa.' },
    { id: 'residing_spain',    label: 'Is the applicant currently residing in Spain?',          type: 'yesno' },
    { id: 'employment_type',   label: 'Employment type',                                        type: 'select',   required: true,
      options: ['Select...', 'Business Owner (owns >50% shares)', 'Employee (foreign company)', 'Self-Employed / Freelancer'] },
  ];

  if (empType === 'Business Owner (owns >50% shares)') {
    steps.push({ id: 'company_1yr',      label: 'Has the company been active for at least 1 year?',                        type: 'yesno', disqualifyIf: 'No', disqualifyMsg: 'The company must be at least 1 year old.' });
    steps.push({ id: 'owner_3mo',        label: 'Has the applicant been the owner for at least 3 months?',                 type: 'yesno', reviewIf: 'No', reviewMsg: 'Must wait until 3 months of ownership before applying.' });
    steps.push({ id: 'service_contract', label: 'Does the company have at least one service contract with a 1yr+ company?', type: 'yesno', disqualifyIf: 'No', disqualifyMsg: 'At least one service contract with an established company is required.' });
  }

  if (empType === 'Employee (foreign company)') {
    steps.push({ id: 'employer_permits', label: 'Will the employer allow relocation to Spain and cooperate with the process?', type: 'yesno', disqualifyIf: 'No', disqualifyMsg: 'Employer cooperation is mandatory for the DNV Employee route.' });
    steps.push({ id: 'company_1yr_emp',  label: 'Has the employing company been active for at least 1 year?',                 type: 'yesno', disqualifyIf: 'No', disqualifyMsg: 'The employing company must have at least 1 year of activity.' });
    steps.push({ id: 'employed_3mo',     label: 'Has the applicant been employed there for at least 3 months?',               type: 'yesno', reviewIf: 'No', reviewMsg: 'Must reach 3 months of employment before submitting.' });
    steps.push({ id: 'company_country',  label: 'Where is the employing company based?',                                      type: 'select',
      options: ['Select...', 'EU Country', 'United States', 'United Kingdom', 'Canada', 'Australia', 'Latin America', 'Other'] });
    if (ans.company_country === 'United States') {
      steps.push({ id: 'us_note', label: '⚠ US employer note', type: 'info', hint: 'US Social Security cannot issue Certificates of Coverage for remote workers. Recommend switching to Self-Employed route.' });
    }
  }

  if (empType === 'Self-Employed / Freelancer') {
    steps.push({ id: 'service_agreements', label: 'Does the applicant have formal service agreements with clients/companies?', type: 'yesno', disqualifyIf: 'No', disqualifyMsg: 'Formal service agreements are required to prove freelancing activity.' });
    steps.push({ id: 'client_1yr',         label: 'Have the contracting companies been active for at least 1 year?',          type: 'yesno', disqualifyIf: 'No', disqualifyMsg: 'Contracting companies must be at least 1 year old.' });
    steps.push({ id: 'contract_3mo',       label: 'Has the applicant been working with these clients for at least 3 months?', type: 'yesno', reviewIf: 'No', reviewMsg: 'Should wait until 3 months of documented activity.' });
  }

  if (empType && empType !== 'Select...') {
    steps.push({ id: 'monthly_income', label: `Monthly income (€/month) — minimum required: €${minIncome.toLocaleString()}`, type: 'currency', threshold: minIncome, disqualifyBelow: true, disqualifyMsg: `Income below minimum threshold of €${minIncome.toLocaleString()}/month.` });
    steps.push({ id: 'can_prove',      label: 'Can the applicant provide payslips, invoices, or bank statements?',            type: 'yesno', disqualifyIf: 'No', disqualifyMsg: 'Proof of income is mandatory.' });
  }

  return steps;
}

// ── SPAIN NLV ─────────────────────────────────────────────────
function spainNLV(ans) {
  const steps = [
    { id: 'citizenship',     label: 'Citizenship',                                                type: 'select',   required: true, options: NATIONALITIES },
    { id: 'family_count',    label: 'Family members joining the application',                      type: 'number', hint: 'Enter 0 if applying alone' },
    { id: 'criminal_record', label: 'Does the applicant have criminal records?',                   type: 'yesno',  reviewIf: 'Yes', reviewMsg: 'Criminal records require legal review. Ask if they can be expunged.' },
    { id: 'retired',         label: 'Is the applicant retired?',                                   type: 'yesno' },
    { id: 'residency_last2', label: 'Where has the applicant been residing in the last 2 years?',  type: 'select',
      options: ['Select...', 'EU Country', 'United States', 'United Kingdom', 'Canada', 'Australia', 'Latin America', 'Other'] },
  ];

  if (ans.retired === 'Yes') {
    steps.push({ id: 'has_pension',    label: 'Is the applicant currently receiving a pension?',                          type: 'yesno' });
    if (ans.has_pension === 'No') {
      steps.push({ id: 'savings_amount', label: 'Total savings in bank account (€) — minimum €29,000',                   type: 'currency', threshold: 29000, disqualifyBelow: true, disqualifyMsg: 'Minimum €29,000 savings required when no pension is received.' });
    }
  } else {
    steps.push({ id: 'resignation',     label: 'Can the applicant obtain a resignation letter / proof of not working?',   type: 'yesno', disqualifyIf: 'No', disqualifyMsg: 'Proof of not working is mandatory for the Non-Lucrative Visa.' });
    steps.push({ id: 'passive_income',  label: 'Monthly passive income (€/month) — recommended minimum ~€2,400',         type: 'currency', threshold: 2400, reviewBelow: true, reviewMsg: 'Income below recommended threshold. Additional documentation may be required.' });
  }

  steps.push({ id: 'residing_spain', label: 'Is the applicant currently residing in Spain?', type: 'yesno' });

  return steps;
}

// ── PORTUGAL DNV ──────────────────────────────────────────────
function portugalDNV(ans) {
  const empType = ans.employment_type;
  const fam = parseInt(ans.family_count) || 0;
  const minIncome = 3480 + (fam * 435);
  const minSavings = 10440 + (fam * 5220);

  const steps = [
    { id: 'citizenship',     label: 'Citizenship',                                          type: 'select',   required: true, options: NATIONALITIES },
    { id: 'family_count',    label: 'Family members joining the application',                type: 'number', hint: 'Enter 0 if applying alone' },
    { id: 'criminal_record', label: 'Does the applicant have criminal records?',             type: 'yesno',  disqualifyIf: 'Yes', disqualifyMsg: 'Clean criminal record required for the Portuguese Digital Nomad Visa.' },
    { id: 'residing_pt',     label: 'Is the applicant currently residing in Portugal?',      type: 'yesno' },
    { id: 'employment_type', label: 'Employment type',                                       type: 'select', required: true,
      options: ['Select...', 'Business Owner (receives salary from own company)', 'Employee (foreign company)', 'Self-Employed / Freelancer'] },
  ];

  if (empType === 'Business Owner (receives salary from own company)') {
    steps.push({ id: 'salary_from_company', label: 'Does the applicant receive a formal salary from the company?', type: 'yesno', reviewIf: 'No', reviewMsg: 'If income is via dividends/profits only, the D7 Passive Income Visa may be more appropriate.' });
  }

  if (empType === 'Employee (foreign company)') {
    steps.push({ id: 'foreign_employer',  label: 'Is the employment contract with a non-Portuguese foreign company?', type: 'yesno', disqualifyIf: 'No', disqualifyMsg: 'Must be employed by a foreign (non-Portuguese) company.' });
    steps.push({ id: 'employer_permits',  label: 'Will the employer allow relocation to Portugal?',                   type: 'yesno', disqualifyIf: 'No', disqualifyMsg: 'Employer cooperation is required.' });
    steps.push({ id: 'employed_3mo',      label: 'At least 3 months with the current employer?',                     type: 'yesno', reviewIf: 'No', reviewMsg: '3 months recommended — can proceed if threshold met by submission date.' });
  }

  if (empType === 'Self-Employed / Freelancer') {
    steps.push({ id: 'service_agreements', label: 'Does the applicant have formal service agreements with clients?', type: 'yesno', disqualifyIf: 'No', disqualifyMsg: 'Formal service agreements are required.' });
    steps.push({ id: 'contract_3mo',       label: 'Have these agreements been active for at least 3 months?',       type: 'yesno', reviewIf: 'No', reviewMsg: 'Can formalize a service agreement to meet this requirement.' });
  }

  if (empType && empType !== 'Select...') {
    steps.push({ id: 'monthly_income', label: `Monthly income (€/month) — minimum: €${minIncome.toLocaleString()}`,            type: 'currency', threshold: minIncome,  disqualifyBelow: true, disqualifyMsg: `Minimum income of €${minIncome.toLocaleString()}/month required.` });
    steps.push({ id: 'savings_ok',     label: `Does the applicant have savings of at least €${minSavings.toLocaleString()}?`,  type: 'yesno', reviewIf: 'No', reviewMsg: 'Proof of savings is required. Must formalize documentation before proceeding.' });
    steps.push({ id: 'can_prove',      label: 'Can invoices and bank statements proving income be provided?',                   type: 'yesno', disqualifyIf: 'No', disqualifyMsg: 'Invoices and bank statements are mandatory.' });
  }

  return steps;
}

// ── PORTUGAL D7 ───────────────────────────────────────────────
function portugalD7(ans) {
  const fam = parseInt(ans.family_count) || 0;
  const minIncome  = 870  + (fam * 435);
  const minSavings = 10440 + (fam * 5220);

  return [
    { id: 'citizenship',        label: 'Citizenship',                                                                       type: 'select',   required: true, options: NATIONALITIES },
    { id: 'family_count',       label: 'Family members joining the application',                                             type: 'number',   hint: 'Enter 0 if applying alone' },
    { id: 'criminal_record',    label: 'Does the applicant have criminal records?',                                          type: 'yesno',    disqualifyIf: 'Yes', disqualifyMsg: 'Clean criminal record required.' },
    { id: 'has_passive_income', label: 'Does the applicant have passive income? (pensions, dividends, rents, etc.)',         type: 'yesno',    disqualifyIf: 'No', disqualifyMsg: 'Passive income is a CORE requirement of the D7 Visa. Active employment income does not qualify. Consider the Digital Nomad Visa instead.' },
    { id: 'passive_income_amt', label: `Monthly passive income (€/month) — minimum: €${minIncome.toLocaleString()}`,        type: 'currency', threshold: minIncome, disqualifyBelow: true, disqualifyMsg: `Minimum passive income of €${minIncome.toLocaleString()}/month required.` },
    { id: 'income_documents',   label: 'Can supporting documents for this passive income be provided?',                      type: 'yesno',    disqualifyIf: 'No', disqualifyMsg: 'Documentation is mandatory (bank statements, rental contracts, pension statements, dividend statements).' },
    { id: 'savings_ok',         label: `Does the applicant have savings of at least €${minSavings.toLocaleString()}?`,      type: 'yesno',    disqualifyIf: 'No', disqualifyMsg: `Savings of at least €${minSavings.toLocaleString()} are required.` },
    { id: 'pt_bank_account',    label: 'Is the applicant willing to open a Portuguese bank account? (Lexidy can assist)',   type: 'yesno',    reviewIf: 'No', reviewMsg: 'A Portuguese bank account is required. Lexidy can assist with opening one.' },
    { id: 'residing_pt',        label: 'Is the applicant currently residing in Portugal?',                                  type: 'yesno' },
  ];
}

// ── GREECE FIP ────────────────────────────────────────────────
function greeceFIP(ans) {
  const hasSpouse    = ans.has_spouse === 'Yes';
  const childCount   = parseInt(ans.child_count) || 0;
  const spouseBonus  = hasSpouse ? 0.20 : 0;
  const childBonus   = childCount * 0.15;
  const minIncome    = Math.ceil(2000  * (1 + spouseBonus + childBonus));
  const minSavings   = Math.ceil(48000 * (1 + spouseBonus + childBonus));
  const incomeType   = ans.income_type;

  const steps = [
    { id: 'citizenship',         label: 'Citizenship',                                                                               type: 'text',   required: true },
    { id: 'criminal_record_20y', label: 'Clean criminal record for the last 20 years?',                                              type: 'yesno',  disqualifyIf: 'No', disqualifyMsg: 'A clean criminal record for the last 20 years is required.' },
    { id: 'has_spouse',          label: 'Will a spouse or official civil partner be joining?',                                        type: 'yesno',  hint: 'Long-term relationships without official documentation are NOT recognized.' },
    { id: 'child_count',         label: 'Number of children (under 18) joining the application',                                     type: 'number', min: 0, max: 15 },
    { id: 'income_type',         label: 'How will financial independence be proven?',                                                 type: 'select',
      options: ['Select...', 'Monthly passive income (pension, dividends, rent, etc.)', 'Savings / bank deposits', 'Combination of both'] },
  ];

  if (incomeType && incomeType !== 'Select...') {
    if (incomeType !== 'Savings / bank deposits') {
      steps.push({ id: 'monthly_income', label: `Monthly passive income (€/month, net after taxes) — minimum: €${minIncome.toLocaleString()}`, type: 'currency', threshold: minIncome, disqualifyBelow: incomeType === 'Monthly passive income (pension, dividends, rent, etc.)', reviewBelow: incomeType === 'Combination of both', disqualifyMsg: `Minimum €${minIncome.toLocaleString()}/month required.`, reviewMsg: 'Combined income+savings may qualify — escalate to legal team.' });
    }
    if (incomeType !== 'Monthly passive income (pension, dividends, rent, etc.)') {
      steps.push({ id: 'savings_amount', label: `Total savings (€) — minimum: €${minSavings.toLocaleString()}`, type: 'currency', threshold: minSavings, disqualifyBelow: incomeType === 'Savings / bank deposits', reviewBelow: incomeType === 'Combination of both', disqualifyMsg: `Minimum savings of €${minSavings.toLocaleString()} required.`, reviewMsg: 'Combined savings+income may qualify — escalate to legal team.' });
    }
  }

  steps.push({ id: 'atm_access',        label: 'Can the applicant withdraw funds from their foreign bank account in Greece (via ATM)?', type: 'yesno', disqualifyIf: 'No', disqualifyMsg: 'Must be able to access foreign funds in Greece. Crypto/cash not acceptable.' });
  steps.push({ id: 'bank_statements',   label: 'Can the applicant provide 6 months of bank statements (as sole beneficiary owner)?',  type: 'yesno', disqualifyIf: 'No', disqualifyMsg: '6 months of bank statements are mandatory.' });
  if (hasSpouse || childCount > 0) {
    steps.push({ id: 'family_docs',     label: 'Are all family relationships officially documented with apostilled marriage/birth certificates?', type: 'yesno', reviewIf: 'No', reviewMsg: 'All family bonds must be officially documented. Long-term relationships without legal recognition do not qualify.' });
  }
  steps.push({ id: 'residency_plan',   label: 'Is the applicant planning to reside in Greece for at least 6 months per year?',       type: 'yesno', reviewIf: 'No', reviewMsg: 'Minimum 6 months/year residency required for permit renewal.' });
  steps.push({ id: 'other_permit',     label: 'Is the applicant currently holding another residence permit?',                         type: 'yesno', hint: 'Informational — may affect processing timelines.' });

  return steps;
}

// ── FRANCE VISITOR VISA ───────────────────────────────────────
function franceVisitor(ans) {
  const status   = ans.employment_status;
  const fam      = parseInt(ans.family_count) || 0;
  const threshold = (status === 'Employee or Self-Employed (remote)') ? 1353 : 1425;
  const monthly   = parseFloat(ans.monthly_funds) || 0;

  const steps = [
    { id: 'citizenship',       label: 'Citizenship',                                                           type: 'text',   required: true },
    { id: 'family_count',      label: 'Family members joining the application',                                 type: 'number', hint: 'Enter 0 if applying alone' },
    { id: 'working_in_france', label: 'Is the applicant planning to work FOR a French employer or French clients?', type: 'yesno', disqualifyIf: 'Yes', disqualifyMsg: 'Working for French employers/clients requires a different work permit, not the Visitor Visa.' },
    { id: 'residing_france',   label: 'Is the applicant currently residing in France?',                        type: 'yesno' },
    { id: 'employment_status', label: 'Employment / income status',                                            type: 'select', required: true,
      options: ['Select...', 'Employee or Self-Employed (remote)', 'Retired', 'Unemployed / Financially independent'] },
  ];

  if (status === 'Employee or Self-Employed (remote)') {
    steps.push({ id: 'company_in_france', label: 'Is the employer/company based in France?', type: 'yesno', disqualifyIf: 'Yes', disqualifyMsg: 'French-based employers require a different work permit.' });
    steps.push({ id: 'works_remotely',    label: 'Will the applicant work fully remotely (no French clients, no French income)?', type: 'yesno', disqualifyIf: 'No', disqualifyMsg: 'Must work remotely without French clients or French-sourced income.' });
  }

  if (status === 'Retired') {
    steps.push({ id: 'pension_cert', label: 'Does the applicant have a pension certificate?', type: 'yesno', reviewIf: 'No', reviewMsg: 'Pension certificate strongly recommended for retired applicants.' });
  }

  if (status && status !== 'Select...') {
    steps.push({ id: 'monthly_funds', label: `Monthly income or financial means (€/month) — minimum: €${threshold.toLocaleString()} per applicant`, type: 'currency', threshold, reviewBelow: true, reviewMsg: 'Below threshold — check if applicant can be sponsored.' });
    if (monthly > 0 && monthly < threshold) {
      steps.push({ id: 'sponsored', label: 'Will the applicant be sponsored by a family member, partner, or other person?', type: 'yesno', disqualifyIf: 'No', disqualifyMsg: 'Does not meet income threshold and has no sponsor. Not eligible at this time.' });
    }
    steps.push({ id: 'health_insurance', label: 'Does the applicant have (or is willing to obtain) health insurance in France?', type: 'yesno', reviewIf: 'No', reviewMsg: 'Health insurance is required for the Visitor Visa application.' });
  }

  return steps;
}

// ── ELIGIBILITY STATE ─────────────────────────────────────────
let eligState = {
  steps:     [],
  answers:   {},
  result:    null,
  resultMsg: '',
};

const NATIONALITIES = ['Select...', 'Afghan', 'Albanian', 'Algerian', 'Andorran', 'Angolan', 'Antiguan', 'Argentine', 'Armenian', 'Australian', 'Austrian', 'Azerbaijani', 'Bahamian', 'Bahraini', 'Bangladeshi', 'Barbadian', 'Belarusian', 'Belgian', 'Belizean', 'Beninese', 'Bhutanese', 'Bolivian', 'Bosnian', 'Botswanan', 'Brazilian', 'British', 'Bruneian', 'Bulgarian', 'Burkinabe', 'Burmese', 'Burundian', 'Cambodian', 'Cameroonian', 'Canadian', 'Cape Verdean', 'Central African', 'Chadian', 'Chilean', 'Chinese', 'Colombian', 'Comoran', 'Congolese', 'Costa Rican', 'Croatian', 'Cuban', 'Cypriot', 'Czech', 'Danish', 'Djiboutian', 'Dominican', 'Dutch', 'East Timorese', 'Ecuadorian', 'Egyptian', 'Salvadoran', 'Emirati', 'Equatorial Guinean', 'Eritrean', 'Estonian', 'Ethiopian', 'Fijian', 'Finnish', 'French', 'Gabonese', 'Gambian', 'Georgian', 'German', 'Ghanaian', 'Greek', 'Grenadian', 'Guatemalan', 'Guinean', 'Guinea-Bissauan', 'Guyanese', 'Haitian', 'Honduran', 'Hungarian', 'Icelandic', 'Indian', 'Indonesian', 'Iranian', 'Iraqi', 'Irish', 'Israeli', 'Italian', 'Ivorian', 'Jamaican', 'Japanese', 'Jordanian', 'Kazakh', 'Kenyan', 'Kittitian', 'Kuwaiti', 'Kyrgyzstani', 'Laotian', 'Latvian', 'Lebanese', 'Lesotho', 'Liberian', 'Libyan', 'Liechtensteiner', 'Lithuanian', 'Luxembourg', 'Macedonian', 'Malagasy', 'Malawian', 'Malaysian', 'Maldivian', 'Malian', 'Maltese', 'Marshallese', 'Martiniquais', 'Mauritanian', 'Mauritian', 'Mexican', 'Micronesian', 'Moldovan', 'Monegasque', 'Mongolian', 'Montenegrin', 'Moroccan', 'Mozambican', 'Namibian', 'Nauruan', 'Nepalese', 'Netherlands', 'New Zealander', 'Nicaraguan', 'Nigerian', 'North Korean', 'Norwegian', 'Omani', 'Pakistani', 'Palauan', 'Palestinian', 'Panamanian', 'Papua New Guinean', 'Paraguayan', 'Peruvian', 'Philippine', 'Polish', 'Portuguese', 'Qatari', 'Romanian', 'Russian', 'Rwandan', 'Saint Kittsian', 'Saint Lucian', 'Samoan', 'San Marinese', 'Sao Tomean', 'Saudi', 'Senegalese', 'Serbian', 'Seychellois', 'Sierra Leonean', 'Singaporean', 'Slovak', 'Slovenian', 'Solomon Islander', 'Somali', 'South African', 'South Korean', 'South Sudanese', 'Spanish', 'Sri Lankan', 'Sudanese', 'Surinamese', 'Swazi', 'Swedish', 'Swiss', 'Syrian', 'Tajik', 'Taiwanese', 'Tanzanian', 'Thai', 'Togolese', 'Tongan', 'Trinidadian', 'Tunisian', 'Turkish', 'Turkmenistani', 'Tuvaluan', 'Ugandan', 'Ukrainian', 'Uruguayan', 'Uzbek', 'Vanuatuan', 'Vatican', 'Venezuelan', 'Vietnamese', 'Yemenite', 'Zambian', 'Zimbabwean'];

// ── ELIGIBILITY DEFINITIONS MAP ───────────────────────────────
// Maps visa IDs to their question-generating function.
// Add new visas here when they're ready.
export const ELIG_DEFS = {
  'es-dnv-freelancer': spainDNV,
  'es-dnv-employee':   spainDNV,
  'es-nlv':            spainNLV,
  'pt-dnv':            portugalDNV,
  'pt-dnv-family':     portugalDNV,
  'pt-d7':             portugalD7,
  'pt-d7-family':      portugalD7,
  'gr-fip':            greeceFIP,
  'gr-fip-family':     greeceFIP,
  'fr-visitor':        franceVisitor,
  'fr-visitor-family': franceVisitor,
  'fr-visitor-platinum': franceVisitor,
};
