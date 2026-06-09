// ══════════════════════════════════════════════════════════════
// LEXIDY SALES HUB — APP STATE HOOK
// ══════════════════════════════════════════════════════════════
//
// Central state for the entire app.
// All pages read from and write to this shared state.
//
// ══════════════════════════════════════════════════════════════

import { useState, useCallback } from 'react'

export const PAGES = {
  HUB:          'hub',
  ELIGIBILITY:  'eligibility',
  RESULTS:      'results',
  REROUTE:      'reroute',
  SALES_SCRIPT: 'sales-script',
  PRICING:      'pricing',
  ADMIN:        'admin',
}

const INITIAL_STATE = {
  // Contact (from URL params or HubSpot)
  contactId:    'TEST_CONTACT',
  contactEmail: null,
  contactName:  null,

  // Navigation
  currentPage:  PAGES.HUB,
  breadcrumb:   [],

  // Selected visa
  countryId:    null,
  countryName:  null,
  countryFlag:  null,
  visaId:       null,
  visaLabel:    null,
  visaData:     null,

  // Eligibility
  eligResult:   null,  // 'pass' | 'review' | 'fail'
  eligMessage:  '',
  testAnswers:  [],

  // Cart
  cartPkg:       null,
  cartPkgLabel:  null,
  cartMain:      null,
  cartFamily:    null,
  cartChild:     null,
  cartMembers:   0,
  cartChildren:  0,
  cartAddons:    [],
  cartRegistered:false,
  cartRegTime:   null,

  // Session (all submissions in one advisor session)
  allAnswers:   [],
}

export function useAppState() {
  const [state, setState] = useState(INITIAL_STATE)

  const setPage = useCallback((page) => {
    setState(s => ({ ...s, currentPage: page }))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  const setBreadcrumb = useCallback((crumbs) => {
    setState(s => ({ ...s, breadcrumb: crumbs }))
  }, [])

  const setContact = useCallback((contact) => {
    setState(s => ({
      ...s,
      contactId:    contact.id || s.contactId,
      contactName:  contact.firstName
                    ? `${contact.firstName} ${contact.lastName || ''}`.trim()
                    : s.contactName,
      contactEmail: contact.email || s.contactEmail,
    }))
  }, [])

  const selectVisa = useCallback((country, visa) => {
    setState(s => ({
      ...s,
      countryId:    country.id,
      countryName:  country.name,
      countryFlag:  country.flag,
      visaId:       visa.id,
      visaLabel:    visa.label,
      visaData:     visa,
      eligResult:   null,
      eligMessage:  '',
      testAnswers:  [],
      // Reset cart
      cartPkg:       null,
      cartPkgLabel:  null,
      cartMain:      null,
      cartFamily:    null,
      cartChild:     null,
      cartMembers:   0,
      cartChildren:  0,
      cartAddons:    [],
      cartRegistered:false,
    }))
  }, [])

  const setEligResult = useCallback((result, message, answers) => {
    setState(s => ({
      ...s,
      eligResult:  result,
      eligMessage: message || '',
      testAnswers: answers || [],
      allAnswers:  [
        ...s.allAnswers,
        { type: 'ELIGIBILITY_TEST', result, answers, timestamp: new Date().toISOString() }
      ],
    }))
  }, [])

  const selectPackage = useCallback((pkg, label, mainPrice, familyPrice, childPrice) => {
    setState(s => ({
      ...s,
      cartPkg:       pkg,
      cartPkgLabel:  label,
      cartMain:      mainPrice,
      cartFamily:    familyPrice,
      cartChild:     childPrice,
      cartRegistered:false,
    }))
  }, [])

  const toggleAddon = useCallback((addon) => {
    setState(s => {
      const exists = s.cartAddons.find(a => a.id === addon.id)
      return {
        ...s,
        cartAddons: exists
          ? s.cartAddons.filter(a => a.id !== addon.id)
          : [...s.cartAddons, addon],
        cartRegistered: false,
      }
    })
  }, [])

  const updateCartMembers = useCallback((members, children) => {
    setState(s => ({
      ...s,
      cartMembers:  Math.max(0, parseInt(members) || 0),
      cartChildren: Math.max(0, parseInt(children) || 0),
    }))
  }, [])

  const registerAnswer = useCallback((payload) => {
    setState(s => ({
      ...s,
      cartRegistered: true,
      cartRegTime:    new Date().toISOString(),
      allAnswers: [
        ...s.allAnswers,
        { type: 'PRICING_DECISION', ...payload, timestamp: new Date().toISOString() }
      ],
    }))
  }, [])

  const reset = useCallback(() => {
    setState(prev => ({
      ...INITIAL_STATE,
      contactId:    prev.contactId,
      contactName:  prev.contactName,
      contactEmail: prev.contactEmail,
    }))
  }, [])

  // Compute cart total
  const cartTotal = (() => {
    if (!state.cartMain) return 0
    const mainVal  = parseFloat(String(state.cartMain).replace(/[€,]/g, '')) || 0
    const famVal   = parseFloat(String(state.cartFamily).replace(/[€,]/g, '')) || 0
    const childVal = parseFloat(String(state.cartChild).replace(/[€,]/g, '')) || 0
    const addonsTotal = state.cartAddons.reduce((sum, a) => sum + (a.price || 0), 0)
    return mainVal + (famVal * state.cartMembers) + (childVal * state.cartChildren) + addonsTotal
  })()

  return {
    state,
    cartTotal,
    setPage,
    setBreadcrumb,
    setContact,
    selectVisa,
    setEligResult,
    selectPackage,
    toggleAddon,
    updateCartMembers,
    registerAnswer,
    reset,
  }
}
