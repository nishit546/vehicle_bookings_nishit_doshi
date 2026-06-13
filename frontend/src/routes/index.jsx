import { Routes, Route } from 'react-router-dom'
import ProtectedRoute from './ProtectedRoute'
import DashboardLayout from '../layouts/DashboardLayout'
import Login from '../pages/auth/Login'
import Register from '../pages/auth/Register'
import Dashboard from '../pages/dashboard/Dashboard'
import Users from '../pages/users/Users'
import Profile from '../pages/profile/Profile'
import Settings from '../pages/settings/Settings'
import Analytics from '../pages/analytics/Analytics'
import Bookings from '../pages/bookings/Bookings'

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="users" element={<Users />} />
        <Route path="profile" element={<Profile />} />
        <Route path="settings" element={<Settings />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="bookings" element={<Bookings />} />
      </Route>
    </Routes>
  )
}
