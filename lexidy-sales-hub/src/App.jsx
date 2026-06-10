import { useEffect } from 'react'
import { useAppState, PAGES } from './hooks/useAppState.js'
import { fetchContact } from './services/dataService.js'
import Topbar from './components/Topbar.jsx'
import LoginGate from './components/LoginGate.jsx'
import HubPage from './pages/HubPage.jsx'
import EligibilityPage from './pages/EligibilityPage.jsx'
import ResultsPage from './pages/ResultsPage.jsx'
import ReroutePage from './pages/ReroutePage.jsx'
import SalesScriptPage from './pages/SalesScriptPage.jsx'
import PricingPage from './pages/PricingPage.jsx'
import AdminPage from './pages/AdminPage.jsx'

export default function App() {
  const appState = useAppState()
  const { state, setContact, setPage, setBreadcrumb } = appState

  // Parse URL params on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const contactId = params.get('contactId') || 'TEST_CONTACT'
    const email     = params.get('email') || null
    const name      = params.get('name') || null

    if (name || email) {
      setContact({ id: contactId, email, firstName: name })
    }

    // Fetch full contact from HubSpot (via Kevin's API when ready)
    if (contactId && contactId !== 'TEST_CONTACT') {
      fetchContact(contactId).then(contact => {
        if (contact) setContact(contact)
      })
    }
  }, [])

  const pageProps = { ...appState }

  return (
    <LoginGate>
    <div style={{ minHeight: '100vh', background: 'var(--cream)' }}>
      <Topbar
        state={state}
        onLogoClick={() => { setPage(PAGES.HUB); setBreadcrumb([]) }}
      />

      <div style={{ paddingTop: 'var(--topbar-h)' }}>
        {state.currentPage === PAGES.HUB          && <HubPage          {...pageProps} />}
        {state.currentPage === PAGES.ELIGIBILITY   && <EligibilityPage  {...pageProps} />}
        {state.currentPage === PAGES.RESULTS       && <ResultsPage      {...pageProps} />}
        {state.currentPage === PAGES.REROUTE       && <ReroutePage      {...pageProps} />}
        {state.currentPage === PAGES.SALES_SCRIPT  && <SalesScriptPage  {...pageProps} />}
        {state.currentPage === PAGES.PRICING       && <PricingPage      {...pageProps} />}
        {state.currentPage === PAGES.ADMIN         && <AdminPage        {...pageProps} />}
      </div>
    </div>
    </LoginGate>
  )
}
