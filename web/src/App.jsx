import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { AuthProvider } from './contexts/AuthContext'
import { SocketProvider } from './contexts/SocketContext'
import ProtectedRoute from './components/common/ProtectedRoute'

import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Marketplace from './pages/Marketplace'
import GuideProfile from './pages/GuideProfile'
import AgencyProfile from './pages/AgencyProfile'
import CircuitDetail from './pages/CircuitDetail'
import ActivityDetail from './pages/ActivityDetail'
import DashboardTourist from './pages/DashboardTourist'
import DashboardGuide from './pages/DashboardGuide'
import DashboardAgency from './pages/DashboardAgency'
import DashboardAdmin from './pages/DashboardAdmin'
import Profile from './pages/Profile'
import BookNow from './pages/BookNow'
import BookingDetail from './pages/BookingDetail'
import MyBookings from './pages/MyBookings'
import Messages from './pages/Messages'
import Conversation from './pages/Conversation'
import SearchResults from './pages/SearchResults'
import NotFound from './pages/NotFound'

function AnimatedRoutes() {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/marketplace" element={<Marketplace />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/guides/:id" element={<GuideProfile />} />
        <Route path="/agencies/:id" element={<AgencyProfile />} />
        <Route path="/circuits/:id" element={<CircuitDetail />} />
        <Route path="/activities/:id" element={<ActivityDetail />} />
        <Route path="/dashboard" element={<ProtectedRoute roles={['tourist']}><DashboardTourist /></ProtectedRoute>} />
        <Route path="/dashboard/guide" element={<ProtectedRoute roles={['guide']}><DashboardGuide /></ProtectedRoute>} />
        <Route path="/dashboard/agency" element={<ProtectedRoute roles={['agency']}><DashboardAgency /></ProtectedRoute>} />
        <Route path="/dashboard/admin" element={<ProtectedRoute roles={['admin']}><DashboardAdmin /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/bookings" element={<ProtectedRoute><MyBookings /></ProtectedRoute>} />
        <Route path="/bookings/:id" element={<ProtectedRoute><BookingDetail /></ProtectedRoute>} />
        <Route path="/book/:type/:id" element={<ProtectedRoute><BookNow /></ProtectedRoute>} />
        <Route path="/messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
        <Route path="/messages/:id" element={<ProtectedRoute><Conversation /></ProtectedRoute>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <SocketProvider>
          <AnimatedRoutes />
        </SocketProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
