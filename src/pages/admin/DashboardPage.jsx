import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { BedDouble, Images, MessageSquare, CheckCircle, XCircle, ChevronRight, BedSingle, Camera, Star, Phone } from 'lucide-react'
import AdminLayout from '../../components/admin/AdminLayout'
import { supabase } from '../../lib/supabase'

export default function DashboardPage() {
  const [rooms, setRooms] = useState([])
  const [stats, setStats] = useState({ kosong: 0, penuh: 0, foto: 0, testimoni: 0 })
  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
    const [roomsRes, photosRes, testimonialsRes] = await Promise.all([
      supabase.from('room_types').select('*').order('sort_order'),
      supabase.from('gallery_photos').select('id', { count: 'exact' }),
      supabase.from('testimonials').select('id', { count: 'exact' }),
    ])

    const roomData = roomsRes.data || []
    setRooms(roomData)
    setStats({
      kosong: roomData.filter(r => r.status === 'kosong').length,
      penuh: roomData.filter(r => r.status === 'penuh').length,
      foto: photosRes.count || 0,
      testimoni: testimonialsRes.count || 0,
    })
    setLoading(false)
  }

  useEffect(() => {
    fetchData()

    // Realtime subscription
    const channel = supabase
      .channel('dashboard-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'room_types' }, () => fetchData())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'gallery_photos' }, () => fetchData())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'testimonials' }, () => fetchData())
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [])
  
  const totalKamar = rooms.reduce((acc, r) => acc + (r.total_rooms || 0), 0)
  const totalTersedia = rooms.reduce((acc, r) => acc + Math.max(0, (r.total_rooms || 0) - (r.occupied_rooms || 0)), 0)
  const totalTerisi = rooms.reduce((acc, r) => acc + (r.occupied_rooms || 0), 0)

  const STATS = [
  { label: 'Total Kamar', value: totalKamar, icon: BedDouble, color: '#1B2A4A', bg: '#F1F5F9', border: '#CBD5E1' },
  { label: 'Kamar Tersedia', value: totalTersedia, icon: CheckCircle, color: '#16A34A', bg: '#F0FDF4', border: '#BBF7D0' },
  { label: 'Kamar Terisi', value: totalTerisi, icon: XCircle, color: '#DC2626', bg: '#FEF2F2', border: '#FECACA' },
  { label: 'Foto Galeri', value: stats.foto, icon: Images, color: '#2D4A7A', bg: '#EFF6FF', border: '#BFDBFE' },
  ]
  const QUICK_LINKS = [
    { label: 'Update Status Kamar', desc: 'Tandai kamar kosong atau penuh', href: '/admin/kamar', icon: BedSingle, color: '#1B2A4A' },
    { label: 'Upload Foto Baru', desc: 'Tambah foto kamar ke galeri', href: '/admin/galeri', icon: Camera, color: '#2D4A7A' },
    { label: 'Tambah Testimoni', desc: 'Tambah ulasan penghuni baru', href: '/admin/testimoni', icon: Star, color: '#C9973A' },
    { label: 'Edit Info Kontak', desc: 'Update nomor WA dan promo', href: '/admin/pengaturan', icon: Phone, color: '#16A34A' },
  ]

  const formatRupiah = (num) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num)

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
            <h2 className="text-2xl font-bold text-white mb-1" style={{fontFamily: 'Plus Jakarta Sans, sans-serif'}}>
              Selamat datang kembali! 👋
            </h2>
            <p className="text-white/60 text-sm">Data diperbarui secara realtime.</p>
          </div>
          <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-10 select-none">
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none">
              <path d="M3 9.5L12 3L21 9.5V20C21 20.5523 20.5523 21 20 21H15V15H9V21H4C3.44772 21 3 20.5523 3 20V9.5Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
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
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{background: stat.bg}}>
                  <Icon size={20} style={{color: stat.color}} />
                </div>
                {loading
                  ? <div className="h-8 w-10 bg-gray-100 rounded-lg animate-pulse mb-1" />
                  : <p className="text-3xl font-bold mb-0.5" style={{color: stat.color, fontFamily: 'Plus Jakarta Sans, sans-serif'}}>
                      {stat.value}
                    </p>
                }
                <p className="text-gray-400 text-xs font-medium">{stat.label}</p>
              </div>
            )
          })}
        </div>

        {/* Status Kamar Realtime */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BedDouble size={16} className="text-[#1B2A4A]" />
              <h3 className="text-sm font-bold text-[#1B2A4A]" style={{fontFamily: 'Plus Jakarta Sans, sans-serif'}}>
                Status Kamar
              </h3>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-xs text-gray-400">Live</span>
            </div>
          </div>

          {loading ? (
            <div className="p-6 space-y-3">
              {Array(4).fill(0).map((_, i) => (
                <div key={i} className="h-14 bg-gray-100 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {rooms.map(room => {
                const occupied = room.occupied_rooms || 0
                const total = room.total_rooms || 0
                const available = total - occupied
                const pct = total > 0 ? (occupied / total) * 100 : 0
                const isFull = room.status === 'penuh'

                return (
                  <div key={room.id} className="px-6 py-4 flex items-center gap-4">
                    {/* Icon */}
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{background: isFull ? '#FEF2F2' : '#F0FDF4'}}
                    >
                      <BedDouble size={18} style={{color: isFull ? '#DC2626' : '#16A34A'}} />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-bold text-[#1B2A4A]">{room.name}</p>
                          {room.is_popular && (
                            <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-[#FFFBEB] text-[#C9973A]">⭐ Populer</span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-400">{occupied}/{total} terisi</span>
                          <span
                            className="text-xs font-bold px-2.5 py-1 rounded-full"
                            style={{
                              background: isFull ? '#DC2626' : '#16A34A',
                              color: 'white'
                            }}
                          >
                            {isFull ? 'PENUH' : `${available} TERSEDIA`}
                          </span>
                        </div>
                      </div>

                      {/* Progress */}
                      <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-700"
                          style={{
                            width: `${pct}%`,
                            background: isFull
                              ? 'linear-gradient(90deg, #DC2626, #EF4444)'
                              : pct > 70
                              ? 'linear-gradient(90deg, #F59E0B, #FBBF24)'
                              : 'linear-gradient(90deg, #16A34A, #22C55E)'
                          }}
                        />
                      </div>

                      <div className="flex justify-between mt-1">
                        <p className="text-xs text-gray-400">{room.description}</p>
                        <p className="text-xs text-gray-400">{formatRupiah(room.price_monthly)}/bln</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          <div className="px-6 py-3 border-t border-gray-50 flex justify-end">
            <Link
              to="/admin/kamar"
              className="text-xs text-[#1B2A4A] font-semibold hover:text-[#C9973A] transition flex items-center gap-1"
            >
              Kelola Kamar <ChevronRight size={14} />
            </Link>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-50">
            <h3 className="text-sm font-bold text-[#1B2A4A]" style={{fontFamily: 'Plus Jakarta Sans, sans-serif'}}>
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
                  className="flex items-center gap-4 px-6 py-4 hover:bg-[#FAF7F2] transition-colors group"
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
                  <ChevronRight size={16} className="text-gray-300 group-hover:text-[#C9973A] transition-colors flex-shrink-0" />
                </Link>
              )
            })}
          </div>
        </div>

      </div>
    </AdminLayout>
  )
}