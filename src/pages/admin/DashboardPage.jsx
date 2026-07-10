import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { BedDouble, Images, MessageSquare, CheckCircle, XCircle, ChevronRight, BedSingle, Camera, Star, Phone } from 'lucide-react'
import AdminLayout from '../../components/admin/AdminLayout'
import { supabase } from '../../lib/supabase'

export default function DashboardPage() {
  const [stats, setStats] = useState({ kosong: 0, penuh: 0, foto: 0, testimoni: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      const [rooms, photos, testimonials] = await Promise.all([
        supabase.from('room_types').select('status'),
        supabase.from('gallery_photos').select('id', { count: 'exact' }),
        supabase.from('testimonials').select('id', { count: 'exact' }),
      ])
      setStats({
        kosong: rooms.data?.filter(r => r.status === 'kosong').length || 0,
        penuh: rooms.data?.filter(r => r.status === 'penuh').length || 0,
        foto: photos.count || 0,
        testimoni: testimonials.count || 0,
      })
      setLoading(false)
    }
    fetchStats()
  }, [])

  const STATS = [
    { label: 'Kamar Kosong', value: stats.kosong, icon: CheckCircle, color: '#16A34A', bg: '#F0FDF4', border: '#BBF7D0' },
    { label: 'Kamar Penuh', value: stats.penuh, icon: XCircle, color: '#DC2626', bg: '#FEF2F2', border: '#FECACA' },
    { label: 'Foto Galeri', value: stats.foto, icon: Images, color: '#2D4A7A', bg: '#EFF6FF', border: '#BFDBFE' },
    { label: 'Testimoni', value: stats.testimoni, icon: MessageSquare, color: '#C9973A', bg: '#FFFBEB', border: '#FDE68A' },
  ]

  const QUICK_LINKS = [
    { label: 'Update Status Kamar', desc: 'Tandai kamar kosong atau penuh', href: '/admin/kamar', icon: BedSingle, color: '#1B2A4A' },
    { label: 'Upload Foto Baru', desc: 'Tambah foto kamar ke galeri', href: '/admin/galeri', icon: Camera, color: '#2D4A7A' },
    { label: 'Tambah Testimoni', desc: 'Tambah ulasan penghuni baru', href: '/admin/testimoni', icon: Star, color: '#C9973A' },
    { label: 'Edit Info Kontak', desc: 'Update nomor WA dan promo', href: '/admin/pengaturan', icon: Phone, color: '#16A34A' },
  ]

  return (
    <AdminLayout>
      <div className="max-w-5xl mx-auto space-y-6">

        {/* Welcome Banner */}
        <div
          className="rounded-2xl p-6 text-white relative overflow-hidden"
          style={{background: 'linear-gradient(135deg, #1B2A4A 0%, #2D4A7A 100%)'}}
        >
          <div
            className="absolute inset-0 opacity-10"
            style={{backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '30px 30px'}}
          />
          <div className="relative z-10">
            <h2
              className="text-2xl font-bold text-white mb-1"
              style={{fontFamily: 'Plus Jakarta Sans, sans-serif'}}
            >
              Selamat datang kembali! 👋
            </h2>
            <p className="text-white/60 text-sm">Berikut ringkasan kondisi Blessing Kost saat ini.</p>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {STATS.map(stat => {
            const Icon = stat.icon
            return (
              <div
                key={stat.label}
                className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 border"
                style={{borderColor: stat.border}}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                  style={{background: stat.bg}}
                >
                  <Icon size={20} style={{color: stat.color}} />
                </div>
                {loading
                  ? <div className="h-8 w-10 bg-gray-100 rounded-lg animate-pulse mb-1" />
                  : <p
                      className="text-3xl font-bold mb-0.5"
                      style={{color: stat.color, fontFamily: 'Plus Jakarta Sans, sans-serif'}}
                    >
                      {stat.value}
                    </p>
                }
                <p className="text-gray-400 text-xs font-medium">{stat.label}</p>
              </div>
            )
          })}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-50">
            <h3
              className="text-sm font-bold text-[#1B2A4A]"
              style={{fontFamily: 'Plus Jakarta Sans, sans-serif'}}
            >
              Aksi Cepat
            </h3>
          </div>
          <div className="divide-y divide-gray-50">
            {QUICK_LINKS.map(link => {
              const Icon = link.icon
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  className="flex items-center gap-4 px-6 py-4 hover:bg-[#FAF7F2] transition-colors duration-150 group"
                >
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-200 group-hover:scale-110"
                    style={{background: `${link.color}15`}}
                  >
                    <Icon size={17} style={{color: link.color}} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[#1B2A4A]">{link.label}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{link.desc}</p>
                  </div>
                  <ChevronRight size={16} className="text-gray-300 group-hover:text-[#C9973A] transition-colors duration-200 flex-shrink-0" />
                </Link>
              )
            })}
          </div>
        </div>

      </div>
    </AdminLayout>
  )
}