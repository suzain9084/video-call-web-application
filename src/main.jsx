import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { SocketProvider } from './context/socketContext.jsx'
import App from './App.jsx'
import { UserEmailContextProvider } from './context/myemail_context.jsx'

createRoot(document.getElementById('root')).render(

  <StrictMode>
    <UserEmailContextProvider>
        <SocketProvider>
          <App />
        </SocketProvider>
    </UserEmailContextProvider>
  </StrictMode>

)
