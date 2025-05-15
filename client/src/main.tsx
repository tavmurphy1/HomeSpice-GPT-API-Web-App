
/*
Adapted from:
"Building a React App with Firebase Authentication Using AuthContext"
by Yogesh Mule
https://medium.com/%40yogeshmulecraft/building-a-react-app-with-firebase-authentication-using-authcontext-c749886678b2
*/

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

import { AuthProvider } from './context/AuthContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* AuthProvider wraps entire app to track userstate*/}
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>,
)
