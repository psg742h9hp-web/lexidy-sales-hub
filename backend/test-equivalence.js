// Equivalence test: for each visa + answer scenario, the engine's
// output must match the original mockData.js function output.
import { ELIG_DEFS } from '/home/claude/repo/lexidy-sales-hub/src/data/mockData.js'
import { ELIGIBILITY_DEFS } from './data/eligibilityData.js'
import { buildQuestions } from './lib/eligibilityEngine.js'

const BO_ES = 'Business Owner (owns >50% shares)'
const EMP_ES = 'Employee (foreign company)'
const SE_ES = 'Self-Employed / Freelancer'
const BO_PT = 'Business Owner (receives salary from own company)'
const GR_PASSIVE = 'Monthly passive income (pension, dividends, rent, etc.)'
const FR_REMOTE = 'Employee or Self-Employed (remote)'

const SCENARIOS = {
  'es-dnv-freelancer': [
    {},
    { employment_type: BO_ES, family_count: '0' },
    { employment_type: EMP_ES, family_count: '2', company_country: 'United States' },
    { employment_type: EMP_ES, company_country: 'EU Country' },
    { employment_type: SE_ES, family_count: '3' },
    { employment_type: 'Select...' },
  ],
  'es-nlv': [
    {},
    { retired: 'Yes' },
    { retired: 'Yes', has_pension: 'No' },
    { retired: 'Yes', has_pension: 'Yes' },
    { retired: 'No' },
  ],
  'pt-dnv': [
    {},
    { employment_type: BO_PT, family_count: '1' },
    { employment_type: 'Employee (foreign company)', family_count: '0' },
    { employment_type: 'Self-Employed / Freelancer', family_count: '4' },
  ],
  'pt-d7': [
    {},
    { family_count: '2' },
  ],
  'gr-fip': [
    {},
    { has_spouse: 'Yes', child_count: '2', income_type: GR_PASSIVE },
    { has_spouse: 'No', child_count: '0', income_type: 'Savings / bank deposits' },
    { has_spouse: 'Yes', child_count: '0', income_type: 'Combination of both' },
    { child_count: '3' },
    { income_type: 'Select...' },
  ],
  'fr-visitor': [
    {},
    { employment_status: FR_REMOTE },
    { employment_status: FR_REMOTE, monthly_funds: '1000' },   // below 1353 → sponsored appears
    { employment_status: FR_REMOTE, monthly_funds: '2000' },   // above → no sponsored
    { employment_status: 'Retired', monthly_funds: '1400' },   // below 1425 → sponsored appears
    { employment_status: 'Retired', monthly_funds: '1500' },
    { employment_status: 'Unemployed / Financially independent', monthly_funds: '0' },
  ],
}

// Normalize: keep comparable fields, drop undefined
function norm(q) {
  const out = {}
  for (const k of ['id', 'label', 'type', 'required', 'options', 'hint', 'threshold',
                   'disqualifyIf', 'disqualifyMsg', 'reviewIf', 'reviewMsg',
                   'disqualifyBelow', 'reviewBelow', 'min', 'max']) {
    if (q[k] !== undefined && q[k] !== false) out[k] = q[k]
  }
  // Original sometimes sets required implicitly absent; treat required:true only
  if (out.required !== true) delete out.required
  return out
}

let pass = 0, fail = 0
for (const [visaId, scenarios] of Object.entries(SCENARIOS)) {
  for (const ans of scenarios) {
    const expected = ELIG_DEFS[visaId](ans).map(norm)
    const actual = buildQuestions(ELIGIBILITY_DEFS[visaId], ans).map(norm)
    const e = JSON.stringify(expected)
    const a = JSON.stringify(actual)
    if (e === a) { pass++; continue }
    fail++
    console.log(`\n❌ MISMATCH ${visaId} answers=${JSON.stringify(ans)}`)
    const max = Math.max(expected.length, actual.length)
    for (let i = 0; i < max; i++) {
      const ee = JSON.stringify(expected[i] || null)
      const aa = JSON.stringify(actual[i] || null)
      if (ee !== aa) {
        console.log(`  [${i}] expected: ${ee}`)
        console.log(`  [${i}] actual:   ${aa}`)
      }
    }
  }
}
console.log(`\n${fail === 0 ? '✅' : '❌'} ${pass} scenarios passed, ${fail} failed`)
process.exit(fail === 0 ? 0 : 1)
