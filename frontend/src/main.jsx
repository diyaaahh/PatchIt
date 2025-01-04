import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Auth0Provider } from '@auth0/auth0-react'
import LiveStream from './flaskpages/cameraPage.jsx'
import Dashboard from './flaskpages/analytics.jsx'
import PotholeDetectionApp from './flaskpages/cameraPage.jsx'

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
    
    {/* <PotholeDetectionApp/> */}
    {/* <Dashboard/> */}
  </StrictMode>
  </Auth0Provider>,
)
