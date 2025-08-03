import './styles/App.scss'
import SignIn from './pages/SignIn'
import ChatApp from './pages/ChatApp'
import { Route, Routes } from 'react-router-dom'
import RouteProtection from './routeProtection/RouteProtection'
import { AuthProvider } from './Contexts/AuthContext'
import { ChatProvider } from './Contexts/ChatContext'
function App() {
  return (
    <>
      <AuthProvider>
        <ChatProvider>
          <Routes>
            <Route path="/" element={<SignIn />} />
            <Route path="/chat" element={<RouteProtection><ChatApp /></RouteProtection>} />
          </Routes>
        </ChatProvider>
      </AuthProvider>
    </>
  )
}

export default App
