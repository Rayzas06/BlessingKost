import { useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import {
  LayoutDashboard, BedDouble, Images, Sparkles,
  MessageSquare, Settings, LogOut, Menu, X, Globe
} from 'lucide-react'
import { supabase } from '../../lib/supabase'

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'Kelola Kamar', href: '/admin/kamar', icon: BedDouble },
  { label: 'Kelola Galeri', href: '/admin/galeri', icon: Images },
  { label: 'Kelola Fasilitas', href: '/admin/fasilitas', icon: Sparkles },
  { label: 'Kelola Testimoni', href: '/admin/testimoni', icon: MessageSquare },
  { label: 'Pengaturan', href: '/admin/pengaturan', icon: Settings },
]

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/admin/login')
  }

  const currentPage = NAV_ITEMS.find(n => n.href === location.pathname)

  return (
    <div className="min-h-screen flex" style={{background: '#F1F5F9'}}>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 flex flex-col transition-transform duration-300 md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
        style={{background: 'linear-gradient(180deg, #1B2A4A 0%, #0F1D35 100%)'}}
      >
        {/* Logo */}
        <div className="px-6 py-5 border-b border-white/10">
          <Link to="/" target="_blank" className="flex items-center gap-3 group">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0">
              <path d="M3 9.5L12 3L21 9.5V20C21 20.5523 20.5523 21 20 21H15V15H9V21H4C3.44772 21 3 20.5523 3 20V9.5Z" stroke="#C9973A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <div className="flex flex-col">
              <span
                className="font-bold text-base leading-tight text-white"
                style={{fontFamily: 'Plus Jakarta Sans, sans-serif'}}
              >
                Blessing <span style={{color: '#C9973A'}}>Kost</span>
              </span>
              <span className="text-white/30 text-xs leading-tight">Panel Admin</span>
            </div>
          </Link>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {NAV_ITEMS.map(item => {
            const active = location.pathname === item.href
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => setSidebarOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group"
                style={{
                  background: active ? 'rgba(201,151,58,0.12)' : 'transparent',
                  color: active ? '#C9973A' : 'rgba(255,255,255,0.55)',
                }}
              >
                <Icon
                  size={18}
                  style={{color: active ? '#C9973A' : 'rgba(255,255,255,0.4)'}}
                  className="flex-shrink-0 transition-colors duration-200"
                />
                <span>{item.label}</span>
                {active && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[#C9973A]" />
                )}
              </Link>
            )
          })}
        </nav>

        {/* Bottom */}
        <div className="px-3 py-4 border-t border-white/10 space-y-0.5">
          <Link
            to="/"
            target="_blank"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-white/40 hover:text-white/70 hover:bg-white/5 transition w-full"
          >
            <Globe size={18} className="flex-shrink-0" />
            Lihat Website
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-white/40 hover:text-red-400 hover:bg-red-500/10 transition w-full"
          >
            <LogOut size={18} className="flex-shrink-0" />
            Keluar
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main */}
      <div className="flex-1 md:ml-64 flex flex-col min-h-screen">

        {/* Topbar */}
        <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center gap-4 sticky top-0 z-30 shadow-sm">
          <button
            className="md:hidden text-gray-400 hover:text-gray-600 transition"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-400">Admin</span>
            <span className="text-gray-300">/</span>
            <span className="font-semibold text-[#1B2A4A]" style={{fontFamily: 'Plus Jakarta Sans, sans-serif'}}>
              {currentPage?.label || 'Dashboard'}
            </span>
          </div>

          <div className="ml-auto flex items-center gap-3">
            <Link
              to="/"
              target="_blank"
              className="hidden sm:flex items-center gap-1.5 text-xs text-gray-400 hover:text-[#1B2A4A] transition px-3 py-2 rounded-lg hover:bg-gray-50 border border-gray-100"
            >
              <Globe size={13} />
              Lihat Website
            </Link>
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
              style={{background: 'linear-gradient(135deg, #1B2A4A 0%, #2D4A7A 100%)'}}
            >
              A
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  )
}