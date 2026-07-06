import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import HomePage from './pages/HomePage'
import LoginPage from './pages/admin/LoginPage'
import DashboardPage from './pages/admin/DashboardPage'
import KamarPage from './pages/admin/KamarPage'
import GaleriPage from './pages/admin/GaleriPage'
import FasilitasPage from './pages/admin/FasilitasPage'
import TestimoniPage from './pages/admin/TestimoniPage'
import PengaturanPage from './pages/admin/PengaturanPage'
import ProtectedRoute from './router/ProtectedRoute'

const queryClient = new QueryClient()

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/admin/login" element={<LoginPage />} />
          <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="/admin/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/admin/kamar" element={<ProtectedRoute><KamarPage /></ProtectedRoute>} />
          <Route path="/admin/galeri" element={<ProtectedRoute><GaleriPage /></ProtectedRoute>} />
          <Route path="/admin/fasilitas" element={<ProtectedRoute><FasilitasPage /></ProtectedRoute>} />
          <Route path="/admin/testimoni" element={<ProtectedRoute><TestimoniPage /></ProtectedRoute>} />
          <Route path="/admin/pengaturan" element={<ProtectedRoute><PengaturanPage /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}