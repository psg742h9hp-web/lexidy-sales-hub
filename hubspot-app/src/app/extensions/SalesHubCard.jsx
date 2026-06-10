// ══════════════════════════════════════════════════════════════
// LEXIDY SALES HUB — HUBSPOT UI EXTENSION CARD
// ══════════════════════════════════════════════════════════════
//
// Renders inside the contact record as a "Sales Hub" tab in the
// middle pane (next to Overview / Activities / Intelligence).
//
// HubSpot does not allow inline iframes in the record view, so
// the card shows the contact context + a launch button that opens
// the full Sales Hub in a large iframe modal, passing contactId
// (and email/name for instant header display) as URL params —
// the React app already reads these on mount.
//
// CONFIGURE: set SALES_HUB_URL below to the deployed frontend URL.
//
// ══════════════════════════════════════════════════════════════

import React, { useState, useEffect } from 'react'
import {
  Button,
  Text,
  Flex,
  hubspot,
} from '@hubspot/ui-extensions'

// ⚠️ Set this to the deployed Sales Hub frontend
const SALES_HUB_URL = 'https://sales-hub.lexidy.com'

hubspot.extend(({ context, actions }) => (
  <SalesHubCard context={context} actions={actions} />
))

function SalesHubCard({ context, actions }) {
  const [contact, setContact] = useState({ name: '', email: '' })

  useEffect(() => {
    actions
      .fetchCrmObjectProperties(['firstname', 'lastname', 'email'])
      .then(p => setContact({
        name: [p.firstname, p.lastname].filter(Boolean).join(' '),
        email: p.email || '',
      }))
      .catch(() => { /* card still works without properties */ })
  }, [])

  function openSalesHub() {
    const contactId = context.crm.objectId
    const params = new URLSearchParams({ contactId: String(contactId) })
    if (contact.email) params.set('email', contact.email)
    if (contact.name) params.set('name', contact.name)

    actions.openIframeModal({
      uri: `${SALES_HUB_URL}/?${params.toString()}`,
      height: 900,
      width: 1500,
      title: 'Lexidy Sales Hub',
      flush: true,
    })
  }

  return (
    <Flex direction="column" gap="md">
      <Text format={{ fontWeight: 'bold' }}>
        Guided sales flow for {contact.name || 'this contact'}
      </Text>
      <Text>
        Country & visa selection → eligibility test → results → sales
        script → pricing. Results and pricing decisions are logged back
        to this contact's timeline automatically.
      </Text>
      <Flex direction="row" gap="sm">
        <Button variant="primary" onClick={openSalesHub}>
          🚀 Open Sales Hub
        </Button>
      </Flex>
    </Flex>
  )
}
