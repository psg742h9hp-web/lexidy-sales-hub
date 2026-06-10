// ══════════════════════════════════════════════════════════════
// LEXIDY SALES HUB — DECLARATIVE ELIGIBILITY DEFINITIONS
// ══════════════════════════════════════════════════════════════
//
// Converted 1:1 from the frontend's mockData.js eligibility
// functions into declarative data. Loaded into Postgres by
// seed.js; served by routes/eligibility.js via the engine in
// lib/eligibilityEngine.js.
//
// After seeding, the DATABASE is the source of truth — this file
// is only the initial seed. Edits happen in the admin panel.
//
// Grammar reference: see lib/eligibilityEngine.js header.
//
// ══════════════════════════════════════════════════════════════

import { NATIONALITIES } from './nationalities.js'

const RESIDENCY_OPTIONS = ['Select...', 'EU Country', 'United States', 'United Kingdom', 'Canada', 'Australia', 'Latin America', 'Other']

// ── SPAIN — DIGITAL NOMAD VISA ────────────────────────────────

const BO_ES = 'Business Owner (owns >50% shares)'
const EMP_ES = 'Employee (foreign company)'
const SE_ES = 'Self-Employed / Freelancer'

const spainDNV = [
  { id: 'citizenship', label: 'Citizenship', type: 'select', required: true, options: NATIONALITIES },
  { id: 'family_count', label: 'Family members joining the application', type: 'number', hint: 'Enter 0 if applying alone' },
  { id: 'criminal_record', label: 'Does the applicant have criminal records?', type: 'yesno',
    disqualifyIf: 'Yes', disqualifyMsg: 'A clean criminal record is required for the Digital Nomad Visa.' },
  { id: 'residing_spain', label: 'Is the applicant currently residing in Spain?', type: 'yesno' },
  { id: 'employment_type', label: 'Employment type', type: 'select', required: true,
    options: ['Select...', BO_ES, EMP_ES, SE_ES] },

  // Business Owner branch
  { id: 'company_1yr', label: 'Has the company been active for at least 1 year?', type: 'yesno',
    showIf: { employment_type: BO_ES },
    disqualifyIf: 'No', disqualifyMsg: 'The company must be at least 1 year old.' },
  { id: 'owner_3mo', label: 'Has the applicant been the owner for at least 3 months?', type: 'yesno',
    showIf: { employment_type: BO_ES },
    reviewIf: 'No', reviewMsg: 'Must wait until 3 months of ownership before applying.' },
  { id: 'service_contract', label: 'Does the company have at least one service contract with a 1yr+ company?', type: 'yesno',
    showIf: { employment_type: BO_ES },
    disqualifyIf: 'No', disqualifyMsg: 'At least one service contract with an established company is required.' },

  // Employee branch
  { id: 'employer_permits', label: 'Will the employer allow relocation to Spain and cooperate with the process?', type: 'yesno',
    showIf: { employment_type: EMP_ES },
    disqualifyIf: 'No', disqualifyMsg: 'Employer cooperation is mandatory for the DNV Employee route.' },
  { id: 'company_1yr_emp', label: 'Has the employing company been active for at least 1 year?', type: 'yesno',
    showIf: { employment_type: EMP_ES },
    disqualifyIf: 'No', disqualifyMsg: 'The employing company must have at least 1 year of activity.' },
  { id: 'employed_3mo', label: 'Has the applicant been employed there for at least 3 months?', type: 'yesno',
    showIf: { employment_type: EMP_ES },
    reviewIf: 'No', reviewMsg: 'Must reach 3 months of employment before submitting.' },
  { id: 'company_country', label: 'Where is the employing company based?', type: 'select',
    showIf: { employment_type: EMP_ES }, options: RESIDENCY_OPTIONS },
  { id: 'us_note', label: '⚠ US employer note', type: 'info',
    showIf: { employment_type: EMP_ES, company_country: 'United States' },
    hint: 'US Social Security cannot issue Certificates of Coverage for remote workers. Recommend switching to Self-Employed route.' },

  // Freelancer branch
  { id: 'service_agreements', label: 'Does the applicant have formal service agreements with clients/companies?', type: 'yesno',
    showIf: { employment_type: SE_ES },
    disqualifyIf: 'No', disqualifyMsg: 'Formal service agreements are required to prove freelancing activity.' },
  { id: 'client_1yr', label: 'Have the contracting companies been active for at least 1 year?', type: 'yesno',
    showIf: { employment_type: SE_ES },
    disqualifyIf: 'No', disqualifyMsg: 'Contracting companies must be at least 1 year old.' },
  { id: 'contract_3mo', label: 'Has the applicant been working with these clients for at least 3 months?', type: 'yesno',
    showIf: { employment_type: SE_ES },
    reviewIf: 'No', reviewMsg: 'Should wait until 3 months of documented activity.' },

  // Common tail (any employment type selected)
  { id: 'monthly_income', label: 'Monthly income (€/month) — minimum required: €{threshold}', type: 'currency',
    showIf: { employment_type: { answered: true } },
    thresholdRule: { type: 'familyTiered', base: 2650, firstFamily: 995, perAdditional: 335, familyField: 'family_count' },
    disqualifyBelow: true, disqualifyMsg: 'Income below minimum threshold of €{threshold}/month.' },
  { id: 'can_prove', label: 'Can the applicant provide payslips, invoices, or bank statements?', type: 'yesno',
    showIf: { employment_type: { answered: true } },
    disqualifyIf: 'No', disqualifyMsg: 'Proof of income is mandatory.' },
]

// ── SPAIN — NON-LUCRATIVE VISA ────────────────────────────────

const spainNLV = [
  { id: 'citizenship', label: 'Citizenship', type: 'select', required: true, options: NATIONALITIES },
  { id: 'family_count', label: 'Family members joining the application', type: 'number', hint: 'Enter 0 if applying alone' },
  { id: 'criminal_record', label: 'Does the applicant have criminal records?', type: 'yesno',
    reviewIf: 'Yes', reviewMsg: 'Criminal records require legal review. Ask if they can be expunged.' },
  { id: 'retired', label: 'Is the applicant retired?', type: 'yesno' },
  { id: 'residency_last2', label: 'Where has the applicant been residing in the last 2 years?', type: 'select',
    options: RESIDENCY_OPTIONS },

  // Retired branch
  { id: 'has_pension', label: 'Is the applicant currently receiving a pension?', type: 'yesno',
    showIf: { retired: 'Yes' } },
  { id: 'savings_amount', label: 'Total savings in bank account (€) — minimum €29,000', type: 'currency',
    showIf: { retired: 'Yes', has_pension: 'No' },
    thresholdRule: { type: 'fixed', value: 29000 },
    disqualifyBelow: true, disqualifyMsg: 'Minimum €29,000 savings required when no pension is received.' },

  // Not-retired branch (also shown while unanswered — matches original behavior)
  { id: 'resignation', label: 'Can the applicant obtain a resignation letter / proof of not working?', type: 'yesno',
    showIf: { retired: { not: 'Yes' } },
    disqualifyIf: 'No', disqualifyMsg: 'Proof of not working is mandatory for the Non-Lucrative Visa.' },
  { id: 'passive_income', label: 'Monthly passive income (€/month) — recommended minimum ~€2,400', type: 'currency',
    showIf: { retired: { not: 'Yes' } },
    thresholdRule: { type: 'fixed', value: 2400 },
    reviewBelow: true, reviewMsg: 'Income below recommended threshold. Additional documentation may be required.' },

  { id: 'residing_spain', label: 'Is the applicant currently residing in Spain?', type: 'yesno' },
]

// ── PORTUGAL — DIGITAL NOMAD VISA ─────────────────────────────

const BO_PT = 'Business Owner (receives salary from own company)'
const EMP_PT = 'Employee (foreign company)'
const SE_PT = 'Self-Employed / Freelancer'

const PT_INCOME = { type: 'perFamily', base: 3480, perFamily: 435, familyField: 'family_count' }
const PT_SAVINGS = { type: 'perFamily', base: 10440, perFamily: 5220, familyField: 'family_count' }

const portugalDNV = [
  { id: 'citizenship', label: 'Citizenship', type: 'select', required: true, options: NATIONALITIES },
  { id: 'family_count', label: 'Family members joining the application', type: 'number', hint: 'Enter 0 if applying alone' },
  { id: 'criminal_record', label: 'Does the applicant have criminal records?', type: 'yesno',
    disqualifyIf: 'Yes', disqualifyMsg: 'Clean criminal record required for the Portuguese Digital Nomad Visa.' },
  { id: 'residing_pt', label: 'Is the applicant currently residing in Portugal?', type: 'yesno' },
  { id: 'employment_type', label: 'Employment type', type: 'select', required: true,
    options: ['Select...', BO_PT, EMP_PT, SE_PT] },

  { id: 'salary_from_company', label: 'Does the applicant receive a formal salary from the company?', type: 'yesno',
    showIf: { employment_type: BO_PT },
    reviewIf: 'No', reviewMsg: 'If income is via dividends/profits only, the D7 Passive Income Visa may be more appropriate.' },

  { id: 'foreign_employer', label: 'Is the employment contract with a non-Portuguese foreign company?', type: 'yesno',
    showIf: { employment_type: EMP_PT },
    disqualifyIf: 'No', disqualifyMsg: 'Must be employed by a foreign (non-Portuguese) company.' },
  { id: 'employer_permits', label: 'Will the employer allow relocation to Portugal?', type: 'yesno',
    showIf: { employment_type: EMP_PT },
    disqualifyIf: 'No', disqualifyMsg: 'Employer cooperation is required.' },
  { id: 'employed_3mo', label: 'At least 3 months with the current employer?', type: 'yesno',
    showIf: { employment_type: EMP_PT },
    reviewIf: 'No', reviewMsg: '3 months recommended — can proceed if threshold met by submission date.' },

  { id: 'service_agreements', label: 'Does the applicant have formal service agreements with clients?', type: 'yesno',
    showIf: { employment_type: SE_PT },
    disqualifyIf: 'No', disqualifyMsg: 'Formal service agreements are required.' },
  { id: 'contract_3mo', label: 'Have these agreements been active for at least 3 months?', type: 'yesno',
    showIf: { employment_type: SE_PT },
    reviewIf: 'No', reviewMsg: 'Can formalize a service agreement to meet this requirement.' },

  { id: 'monthly_income', label: 'Monthly income (€/month) — minimum: €{threshold}', type: 'currency',
    showIf: { employment_type: { answered: true } },
    thresholdRule: PT_INCOME,
    disqualifyBelow: true, disqualifyMsg: 'Minimum income of €{threshold}/month required.' },
  { id: 'savings_ok', label: 'Does the applicant have savings of at least €{threshold}?', type: 'yesno',
    showIf: { employment_type: { answered: true } },
    thresholdRule: PT_SAVINGS,
    reviewIf: 'No', reviewMsg: 'Proof of savings is required. Must formalize documentation before proceeding.' },
  { id: 'can_prove', label: 'Can invoices and bank statements proving income be provided?', type: 'yesno',
    showIf: { employment_type: { answered: true } },
    disqualifyIf: 'No', disqualifyMsg: 'Invoices and bank statements are mandatory.' },
]

// ── PORTUGAL — D7 PASSIVE INCOME VISA ─────────────────────────

const portugalD7 = [
  { id: 'citizenship', label: 'Citizenship', type: 'select', required: true, options: NATIONALITIES },
  { id: 'family_count', label: 'Family members joining the application', type: 'number', hint: 'Enter 0 if applying alone' },
  { id: 'criminal_record', label: 'Does the applicant have criminal records?', type: 'yesno',
    disqualifyIf: 'Yes', disqualifyMsg: 'Clean criminal record required.' },
  { id: 'has_passive_income', label: 'Does the applicant have passive income? (pensions, dividends, rents, etc.)', type: 'yesno',
    disqualifyIf: 'No', disqualifyMsg: 'Passive income is a CORE requirement of the D7 Visa. Active employment income does not qualify. Consider the Digital Nomad Visa instead.' },
  { id: 'passive_income_amt', label: 'Monthly passive income (€/month) — minimum: €{threshold}', type: 'currency',
    thresholdRule: { type: 'perFamily', base: 870, perFamily: 435, familyField: 'family_count' },
    disqualifyBelow: true, disqualifyMsg: 'Minimum passive income of €{threshold}/month required.' },
  { id: 'income_documents', label: 'Can supporting documents for this passive income be provided?', type: 'yesno',
    disqualifyIf: 'No', disqualifyMsg: 'Documentation is mandatory (bank statements, rental contracts, pension statements, dividend statements).' },
  { id: 'savings_ok', label: 'Does the applicant have savings of at least €{threshold}?', type: 'yesno',
    thresholdRule: PT_SAVINGS,
    disqualifyIf: 'No', disqualifyMsg: 'Savings of at least €{threshold} are required.' },
  { id: 'pt_bank_account', label: 'Is the applicant willing to open a Portuguese bank account? (Lexidy can assist)', type: 'yesno',
    reviewIf: 'No', reviewMsg: 'A Portuguese bank account is required. Lexidy can assist with opening one.' },
  { id: 'residing_pt', label: 'Is the applicant currently residing in Portugal?', type: 'yesno' },
]

// ── GREECE — FINANCIALLY INDEPENDENT PERSON ───────────────────

const GR_PASSIVE = 'Monthly passive income (pension, dividends, rent, etc.)'
const GR_SAVINGS = 'Savings / bank deposits'
const GR_COMBO = 'Combination of both'

const GR_FACTORS = [
  { field: 'has_spouse', equals: 'Yes', pct: 0.20 },
  { field: 'child_count', perUnit: true, pct: 0.15 },
]

const greeceFIP = [
  { id: 'citizenship', label: 'Citizenship', type: 'text', required: true },
  { id: 'criminal_record_20y', label: 'Clean criminal record for the last 20 years?', type: 'yesno',
    disqualifyIf: 'No', disqualifyMsg: 'A clean criminal record for the last 20 years is required.' },
  { id: 'has_spouse', label: 'Will a spouse or official civil partner be joining?', type: 'yesno',
    hint: 'Long-term relationships without official documentation are NOT recognized.' },
  { id: 'child_count', label: 'Number of children (under 18) joining the application', type: 'number',
    meta: { min: 0, max: 15 } },
  { id: 'income_type', label: 'How will financial independence be proven?', type: 'select',
    options: ['Select...', GR_PASSIVE, GR_SAVINGS, GR_COMBO] },

  { id: 'monthly_income', label: 'Monthly passive income (€/month, net after taxes) — minimum: €{threshold}', type: 'currency',
    showIf: { all: [{ income_type: { answered: true } }, { income_type: { not: GR_SAVINGS } }] },
    thresholdRule: { type: 'pctMultiplier', base: 2000, round: 'ceil', factors: GR_FACTORS },
    disqualifyBelowIf: { income_type: GR_PASSIVE },
    reviewBelowIf: { income_type: GR_COMBO },
    disqualifyMsg: 'Minimum €{threshold}/month required.',
    reviewMsg: 'Combined income+savings may qualify — escalate to legal team.' },
  { id: 'savings_amount', label: 'Total savings (€) — minimum: €{threshold}', type: 'currency',
    showIf: { all: [{ income_type: { answered: true } }, { income_type: { not: GR_PASSIVE } }] },
    thresholdRule: { type: 'pctMultiplier', base: 48000, round: 'ceil', factors: GR_FACTORS },
    disqualifyBelowIf: { income_type: GR_SAVINGS },
    reviewBelowIf: { income_type: GR_COMBO },
    disqualifyMsg: 'Minimum savings of €{threshold} required.',
    reviewMsg: 'Combined savings+income may qualify — escalate to legal team.' },

  { id: 'atm_access', label: 'Can the applicant withdraw funds from their foreign bank account in Greece (via ATM)?', type: 'yesno',
    disqualifyIf: 'No', disqualifyMsg: 'Must be able to access foreign funds in Greece. Crypto/cash not acceptable.' },
  { id: 'bank_statements', label: 'Can the applicant provide 6 months of bank statements (as sole beneficiary owner)?', type: 'yesno',
    disqualifyIf: 'No', disqualifyMsg: '6 months of bank statements are mandatory.' },
  { id: 'family_docs', label: 'Are all family relationships officially documented with apostilled marriage/birth certificates?', type: 'yesno',
    showIf: { any: [{ has_spouse: 'Yes' }, { child_count: { gt: 0 } }] },
    reviewIf: 'No', reviewMsg: 'All family bonds must be officially documented. Long-term relationships without legal recognition do not qualify.' },
  { id: 'residency_plan', label: 'Is the applicant planning to reside in Greece for at least 6 months per year?', type: 'yesno',
    reviewIf: 'No', reviewMsg: 'Minimum 6 months/year residency required for permit renewal.' },
  { id: 'other_permit', label: 'Is the applicant currently holding another residence permit?', type: 'yesno',
    hint: 'Informational — may affect processing timelines.' },
]

// ── FRANCE — VISITOR VISA ─────────────────────────────────────

const FR_REMOTE = 'Employee or Self-Employed (remote)'

const FR_THRESHOLD = { type: 'byAnswer', field: 'employment_status', map: { [FR_REMOTE]: 1353 }, default: 1425 }

const franceVisitor = [
  { id: 'citizenship', label: 'Citizenship', type: 'text', required: true },
  { id: 'family_count', label: 'Family members joining the application', type: 'number', hint: 'Enter 0 if applying alone' },
  { id: 'working_in_france', label: 'Is the applicant planning to work FOR a French employer or French clients?', type: 'yesno',
    disqualifyIf: 'Yes', disqualifyMsg: 'Working for French employers/clients requires a different work permit, not the Visitor Visa.' },
  { id: 'residing_france', label: 'Is the applicant currently residing in France?', type: 'yesno' },
  { id: 'employment_status', label: 'Employment / income status', type: 'select', required: true,
    options: ['Select...', FR_REMOTE, 'Retired', 'Unemployed / Financially independent'] },

  { id: 'company_in_france', label: 'Is the employer/company based in France?', type: 'yesno',
    showIf: { employment_status: FR_REMOTE },
    disqualifyIf: 'Yes', disqualifyMsg: 'French-based employers require a different work permit.' },
  { id: 'works_remotely', label: 'Will the applicant work fully remotely (no French clients, no French income)?', type: 'yesno',
    showIf: { employment_status: FR_REMOTE },
    disqualifyIf: 'No', disqualifyMsg: 'Must work remotely without French clients or French-sourced income.' },

  { id: 'pension_cert', label: 'Does the applicant have a pension certificate?', type: 'yesno',
    showIf: { employment_status: 'Retired' },
    reviewIf: 'No', reviewMsg: 'Pension certificate strongly recommended for retired applicants.' },

  { id: 'monthly_funds', label: 'Monthly income or financial means (€/month) — minimum: €{threshold} per applicant', type: 'currency',
    showIf: { employment_status: { answered: true } },
    thresholdRule: FR_THRESHOLD,
    reviewBelow: true, reviewMsg: 'Below threshold — check if applicant can be sponsored.' },
  { id: 'sponsored', label: 'Will the applicant be sponsored by a family member, partner, or other person?', type: 'yesno',
    showIf: { all: [
      { employment_status: { answered: true } },
      { monthly_funds: { gt: 0 } },
      { monthly_funds: { belowThresholdOf: 'monthly_funds' } },
    ] },
    disqualifyIf: 'No', disqualifyMsg: 'Does not meet income threshold and has no sponsor. Not eligible at this time.' },
  { id: 'health_insurance', label: 'Does the applicant have (or is willing to obtain) health insurance in France?', type: 'yesno',
    showIf: { employment_status: { answered: true } },
    reviewIf: 'No', reviewMsg: 'Health insurance is required for the Visitor Visa application.' },
]

// ── VISA ID → QUESTION SET MAP ────────────────────────────────
// NOTE: This map FIXES three dead aliases that exist in the
// frontend's ELIG_DEFS ('pt-d7', 'gr-fip', 'fr-visitor-platinum'
// don't exist in COUNTRIES) and ADDS the platinum variants that
// were missing eligibility tests entirely.

export const ELIGIBILITY_DEFS = {
  'es-dnv-freelancer': spainDNV,
  'es-dnv-employee': spainDNV,
  'es-nlv': spainNLV,
  'pt-dnv': portugalDNV,
  'pt-dnv-family': portugalDNV,
  'pt-dnv-platinum-employee': portugalDNV,
  'pt-d7-family': portugalD7,
  'pt-d7-platinum-no-relocation': portugalD7,
  'pt-d7-platinum-relocation': portugalD7,
  'gr-fip-family': greeceFIP,
  'fr-visitor': franceVisitor,
  'fr-visitor-family': franceVisitor,
}
