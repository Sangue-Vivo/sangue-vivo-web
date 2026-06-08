import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useAuthStore } from './stores/authStore'

import ScrollToTop from './components/ScrollToTop'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import Onboarding from './pages/Onboarding'
import Dashboard from './pages/Dashboard'
import Causes from './pages/Causes'
import CauseDetail from './pages/CauseDetail'
import Profile from './pages/Profile'
import DonationHistory from './pages/DonationHistory'
import Education from './pages/Education'
import Settings from './pages/Settings'
import BloodCenterMap from './pages/BloodCenterMap'
import PrivacyPolicy from './pages/PrivacyPolicy'
import TermsOfUse from './pages/TermsOfUse'

import AdminLayout from './components/admin/AdminLayout'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminUsers from './pages/admin/AdminUsers'
import AdminCauses from './pages/admin/AdminCauses'
import AdminDonations from './pages/admin/AdminDonations'
import AdminNotifications from './pages/admin/AdminNotifications'
import AdminSettings from './pages/admin/AdminSettings'

import Sidebar from './components/layout/Sidebar'
import Header from './components/layout/Header'
import BottomNav from './components/layout/BottomNav'
import SupportWidget from './components/support/SupportWidget'
import CookieConsent from './components/ui/CookieConsent'

function ProtectedRoute() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  if (!isAuthenticated) return <Navigate to="/login" replace />
  return (
    <div className="min-h-screen bg-[#F5F5F4]">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div>
        <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <main className="p-4 pb-24 lg:p-6 lg:pb-6">
          <Outlet />
        </main>
      </div>
      <BottomNav />
      <SupportWidget />
    </div>
  )
}

function AdminRoute() {
  const user = useAuthStore((s) => s.user)
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (user?.role !== 'admin') return <Navigate to="/dashboard" replace />
  return <AdminLayout />
}

function AuthOnlyRoute() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  if (isAuthenticated) return <Navigate to="/dashboard" replace />
  return <Outlet />
}

export default function App() {
  const checkAuth = useAuthStore((s) => s.checkAuth)

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  return (
    <BrowserRouter>
      <ScrollToTop />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            borderRadius: '12px',
          },
        }}
      />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsOfUse />} />

        <Route element={<AuthOnlyRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route path="/onboarding" element={<Onboarding />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/causes" element={<Causes />} />
          <Route path="/causes/:id" element={<CauseDetail />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/donations" element={<DonationHistory />} />
          <Route path="/education" element={<Education />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/blood-centers" element={<BloodCenterMap />} />
        </Route>

        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/causes" element={<AdminCauses />} />
          <Route path="/admin/donations" element={<AdminDonations />} />

          <Route path="/admin/notifications" element={<AdminNotifications />} />
          <Route path="/admin/settings" element={<AdminSettings />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <CookieConsent />
    </BrowserRouter>
  )
}
