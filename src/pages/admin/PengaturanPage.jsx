import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Settings, CheckCircle, XCircle, Save } from 'lucide-react'
import AdminLayout from '../../components/admin/AdminLayout'
import { supabase } from '../../lib/supabase'

function Toast({ message, type }) {
  return (
    <div
      className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-2xl shadow-xl text-white text-sm font-medium"
      style={{background: type === 'success' ? '#16A34A' : '#DC2626'}}
    >
      {type === 'success' ? <CheckCircle size={18} /> : <XCircle size={18} />}
      {message}
    </div>
  )
}

export default function PengaturanPage() {
  const queryClient = useQueryClient()
  const [toast, setToast] = useState(null)
  const [form, setForm] = useState({
    whatsapp_1: '',
    whatsapp_2: '',
    instagram_url: '',
    promo_text: '',
    promo_active: 'true',
    address: '',
  })

  const showToast = (message, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  const { data: settings, isLoading } = useQuery({
    queryKey: ['settings-admin'],
    queryFn: async () => {
      const { data, error } = await supabase.from('site_settings').select('*')
      if (error) throw error
      return data.reduce((acc, item) => { acc[item.key] = item.value; return acc }, {})
    }
  })

  useEffect(() => {
    if (settings) setForm(prev => ({ ...prev, ...settings }))
  }, [settings])

  const saveSetting = useMutation({
    mutationFn: async (formData) => {
      const upserts = Object.entries(formData).map(([key, value]) => ({ key, value }))
      const { error } = await supabase.from('site_settings').upsert(upserts, { onConflict: 'key' })
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings-admin'] })
      queryClient.invalidateQueries({ queryKey: ['settings'] })
      showToast('Pengaturan berhasil disimpan!')
    },
    onError: () => showToast('Gagal menyimpan pengaturan.', 'error')
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    saveSetting.mutate(form)
  }

  const FIELDS = [
    { section: 'Kontak WhatsApp', fields: [
      { key: 'whatsapp_1', label: 'Nomor WA 1 (Ibu Tarigan)', placeholder: '6281376584100', hint: 'Format: 628xxx (tanpa + atau 0 di depan)' },
      { key: 'whatsapp_2', label: 'Nomor WA 2 (Bapak Bangun)', placeholder: '6281264966667', hint: 'Format: 628xxx (tanpa + atau 0 di depan)' },
    ]},
    { section: 'Media Sosial', fields: [
      { key: 'instagram_url', label: 'URL Instagram', placeholder: 'https://instagram.com/blessingkost_medan' },
    ]},
    { section: 'Lokasi', fields: [
      { key: 'address', label: 'Alamat Lengkap', placeholder: 'Jl. Bunga Kenanga No. 9B, Medan Selayang' },
    ]},
    { section: 'Promo', fields: [
      { key: 'promo_text', label: 'Teks Promo', placeholder: '1 Tahun Free 1 Bulan' },
    ]},
  ]

  return (
    <AdminLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h2 className="text-xl font-bold text-[#1B2A4A]" style={{fontFamily: 'Plus Jakarta Sans, sans-serif'}}>
            Pengaturan
          </h2>
          <p className="text-gray-400 text-sm mt-0.5">Update informasi kontak dan promo website</p>
        </div>

        {isLoading ? (
          <div className="bg-white rounded-2xl p-8 text-center text-gray-400 text-sm shadow-sm">Memuat pengaturan...</div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {FIELDS.map(section => (
              <div key={section.section} className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-50 flex items-center gap-2">
                  <Settings size={15} className="text-[#1B2A4A]" />
                  <h3 className="text-sm font-bold text-[#1B2A4A]" style={{fontFamily: 'Plus Jakarta Sans, sans-serif'}}>
                    {section.section}
                  </h3>
                </div>
                <div className="p-6 space-y-4">
                  {section.fields.map(field => (
                    <div key={field.key}>
                      <label className="block text-xs font-medium text-gray-600 mb-1.5">{field.label}</label>
                      <input
                        type="text"
                        value={form[field.key] || ''}
                        onChange={e => setForm({...form, [field.key]: e.target.value})}
                        placeholder={field.placeholder}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#1B2A4A] focus:ring-2 focus:ring-[#1B2A4A]/10 transition"
                      />
                      {field.hint && <p className="text-xs text-gray-400 mt-1">{field.hint}</p>}
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Toggle Promo */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-[#1B2A4A]" style={{fontFamily: 'Plus Jakarta Sans, sans-serif'}}>
                    Tampilkan Badge Promo
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">Aktifkan untuk menampilkan badge promo di hero section</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.promo_active === 'true'}
                    onChange={e => setForm({...form, promo_active: e.target.checked ? 'true' : 'false'})}
                    className="sr-only peer"
                  />
                  <div className="w-12 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-6 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#C9973A]"></div>
                </label>
              </div>
            </div>

            {/* Save Button */}
            <button
              type="submit"
              disabled={saveSetting.isPending}
              className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-semibold text-white transition hover:opacity-90 disabled:opacity-60 shadow-lg"
              style={{background: 'linear-gradient(135deg, #1B2A4A 0%, #2D4A7A 100%)'}}
            >
              <Save size={18} />
              {saveSetting.isPending ? 'Menyimpan...' : 'Simpan Semua Pengaturan'}
            </button>
          </form>
        )}
      </div>
      {toast && <Toast message={toast.message} type={toast.type} />}
    </AdminLayout>
  )
}