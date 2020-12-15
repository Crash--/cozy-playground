/* global cozy */
import React from 'react'
import ReactDOM from 'react-dom'
import { Route } from 'react-router'
import { createStore, combineReducers } from 'redux'
import { Provider } from 'react-redux'
import CozyClient from 'cozy-client'
import App from '../../components/common/App'
import client from '../../components/common/client'
import 'cozy-ui/transpiled/react/stylesheet.css'
import 'cozy-ui/dist/cozy-ui.min.css'
// import Comp from 'cozy-procedures'
import injectProcedureRoutes from 'cozy-procedures/dist'
import {
  PageLayout,
  PageFooter,
  PageContent
} from 'cozy-ui/transpiled/react/Page'

const padded = Component => {
  const Wrapped = ({ children }) => (
    <Component>
      <div className="u-m-1">{children}</div>
    </Component>
  )
  Wrapped.displayName = `padded(${Component.displayName || Component.name})`
  return Wrapped
}
const PROCEDURE_OPTIONS = {
  root: '/',
  components: {
    PageLayout,
    PageFooter: padded(PageFooter),
    PageContent: padded(PageContent)
  }
}

const reducer = combineReducers({
  cozy: client.reducer()
})

const store = createStore(reducer)

const OtherRouteComponent = () => {
  return <div>yo</div>
}
const root = document.querySelector('[role=application]')
const data = root.dataset

const protocol = window.location ? window.location.protocol : 'https:'
const cozyUrl = `${protocol}//${data.cozyDomain}`

const cozyClient = new CozyClient({
  uri: cozyUrl,
  token: data.cozyToken,
  appMetadata: {
    slug: 'cozy-procedure',
    version: '0.1'
  },
  schema: {
    apps: {
      doctype: 'io.cozy.apps'
    },
    contacts: {
      doctype: 'io.cozy.contacts'
    },
    files: {
      doctype: 'io.cozy.files',
      relationships: {
        contents: {
          type: 'io.cozy.files:has-many',
          doctype: 'io.cozy.files'
        }
      }
    },
    konnectors: {
      doctype: 'io.cozy.konnectors'
    },
    administrativeProcedures: {
      doctype: 'io.cozy.procedures.administratives'
    },
    // TODO: test without the schema?
    jobs: {
      doctype: 'io.cozy.jobs'
    }
  }
})

cozy.bar.init({
  appName: data.cozyAppName,
  appEditor: data.cozyAppEditor,
  cozyClient: cozyClient,
  iconPath: data.cozyIconPath,
  lang: data.cozyLocale,
  replaceTitleOnMobile: false
})

ReactDOM.render(
  <Provider store={store}>
    <App client={cozyClient} existingStore={store}>
      <div>toto</div>
      <Route path="/whatever" component={OtherRouteComponent} />
      {injectProcedureRoutes(PROCEDURE_OPTIONS)}
    </App>
  </Provider>,
  document.querySelector('[role=application]')
)
