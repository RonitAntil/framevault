import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Work from './pages/Work'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import About from './pages/About'
import Contact from './pages/Contact'
import Terms from './pages/Terms'
import NotFound from './pages/NotFound'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/work/:slug" element={<Work />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  )
}

export default App