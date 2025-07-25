import './styles/App.scss'
import SignIn from './pages/SignIn'
import ChatSystem from './pages/ChatSystem'
import { Route, Routes } from 'react-router-dom'
import RouteProtection from './routeProtection/RouteProtection'
function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/chat" element={<RouteProtection><ChatSystem /></RouteProtection>} />
      </Routes>
    </>
  )
}

export default App
