import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Auth0Provider } from '@auth0/auth0-react'

createRoot(document.getElementById('root')).render(
  <Auth0Provider
    domain="dev-b5s5iza7dpmh3f25.us.auth0.com"
    clientId="1Jn3znTann4UQPe2rwo6oMTqzKK95jXO"
    authorizationParams={{
      redirect_uri:"http://localhost:5173/home"
    }}
  >
  <StrictMode>
    <App />
  </StrictMode>
  </Auth0Provider>,
)
