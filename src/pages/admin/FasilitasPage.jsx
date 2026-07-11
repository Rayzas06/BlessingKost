import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Sparkles, CheckCircle, XCircle, Plus, Trash2, X } from 'lucide-react'
import * as Icons from 'lucide-react'
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

const ICON_OPTIONS = [
  'building-2', 'graduation-cap', 'bike', 'droplets', 'users', 'wifi',
  'car', 'shield', 'zap', 'wind', 'tv', 'coffee', 'bath', 'lock',
  'sun', 'camera', 'package', 'star', 'heart', 'home'
]

function IconPreview({ name }) {
  const formatted = name
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join('')
  const Icon = Icons[formatted]
  return Icon ? <Icon size={18} /> : <span className="text-xs">{name}</span>
}

const EMPTY_FORM = { icon_name: 'star', label: '' }

export default function FasilitasPage() {
  const queryClient = useQueryClient()
  const [toast, setToast] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const [deleteId, setDeleteId] = useState(null)

  const showToast = (message, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  const { data: facilities, isLoading } = useQuery({
    queryKey: ['facilities-admin'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('facilities')
        .select('*')
        .order('sort_order')
      if (error) throw error
      return data
    }
  })

  const addFacility = useMutation({
    mutationFn: async (data) => {
      const maxOrder = facilities?.length ? Math.max(...facilities.map(f => f.sort_order)) + 1 : 1
      const { error } = await supabase.from('facilities').insert([{ ...data, sort_order: maxOrder }])
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['facilities-admin'] })
      queryClient.invalidateQueries({ queryKey: ['facilities'] })
      setForm(EMPTY_FORM)
      setShowForm(false)
      showToast('Fasilitas berhasil ditambahkan!')
    },
    onError: () => showToast('Gagal menambahkan fasilitas.', 'error')
  })

  const deleteFacility = useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase.from('facilities').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['facilities-admin'] })
      queryClient.invalidateQueries({ queryKey: ['facilities'] })
      setDeleteId(null)
      showToast('Fasilitas berhasil dihapus!')
    },
    onError: () => showToast('Gagal menghapus fasilitas.', 'error')
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.label.trim()) {
      showToast('Label fasilitas wajib diisi.', 'error')
      return
    }
    addFacility.mutate(form)
  }

  return (
    <AdminLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-[#1B2A4A]" style={{fontFamily: 'Plus Jakarta Sans, sans-serif'}}>
              Kelola Fasilitas
            </h2>
            <p className="text-gray-400 text-sm mt-0.5">Tambah dan hapus fasilitas kost</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition hover:opacity-90"
            style={{background: 'linear-gradient(135deg, #1B2A4A 0%, #2D4A7A 100%)'}}
          >
            <Plus size={16} />
            Tambah
          </button>
        </div>

        {showForm && (
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#1B2A4A]" style={{fontFamily: 'Plus Jakarta Sans, sans-serif'}}>
                Tambah Fasilitas Baru
              </h3>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Label Fasilitas *</label>
                <input
                  type="text"
                  value={form.label}
                  onChange={e => setForm({...form, label: e.target.value})}
                  placeholder="contoh: Free WiFi"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#1B2A4A] focus:ring-2 focus:ring-[#1B2A4A]/10"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-2">Pilih Icon</label>
                <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
                  {ICON_OPTIONS.map(icon => (
                    <button
                      key={icon}
                      type="button"
                      onClick={() => setForm({...form, icon_name: icon})}
                      className="w-10 h-10 rounded-xl flex items-center justify-center transition border-2"
                      style={{
                        background: form.icon_name === icon ? '#1B2A4A' : '#F8FAFC',
                        borderColor: form.icon_name === icon ? '#1B2A4A' : 'transparent',
                        color: form.icon_name === icon ? 'white' : '#6B7280',
                      }}
                      title={icon}
                    >
                      <IconPreview name={icon} />
                    </button>
                  ))}
                </div>
                <p className="text-xs text-gray-400 mt-2">Icon terpilih: <span className="font-medium text-[#1B2A4A]">{form.icon_name}</span></p>
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  disabled={addFacility.isPending}
                  className="px-6 py-3 rounded-xl text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
                  style={{background: 'linear-gradient(135deg, #1B2A4A 0%, #2D4A7A 100%)'}}
                >
                  {addFacility.isPending ? 'Menyimpan...' : 'Simpan Fasilitas'}
                </button>
                <button
                  type="button"
                  onClick={() => { setShowForm(false); setForm(EMPTY_FORM) }}
                  className="px-6 py-3 rounded-xl text-sm font-semibold text-gray-500 bg-gray-100 hover:bg-gray-200"
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-50 flex items-center gap-2">
            <Sparkles size={16} className="text-[#1B2A4A]" />
            <h3 className="text-sm font-bold text-[#1B2A4A]" style={{fontFamily: 'Plus Jakarta Sans, sans-serif'}}>
              Daftar Fasilitas ({facilities?.length || 0})
            </h3>
          </div>
          {isLoading ? (
            <div className="p-8 text-center text-gray-400 text-sm">Memuat data...</div>
          ) : facilities?.length === 0 ? (
            <div className="p-8 text-center text-gray-400 text-sm">Belum ada fasilitas.</div>
          ) : (
            <div className="divide-y divide-gray-50">
              {facilities?.map(f => (
                <div key={f.id} className="px-6 py-4 flex items-center gap-4 hover:bg-gray-50/50 transition group">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{background: 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)'}}>
                    <span className="text-[#1B2A4A]"><IconPreview name={f.icon_name} /></span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-[#1B2A4A]">{f.label}</p>
                    <p className="text-xs text-gray-400">icon: {f.icon_name}</p>
                  </div>
                  {deleteId === f.id ? (
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-xs text-gray-400">Hapus?</span>
                      <button
                        onClick={() => deleteFacility.mutate(f.id)}
                        className="text-xs px-3 py-1.5 rounded-lg font-semibold bg-red-500 text-white hover:bg-red-600 transition"
                      >Ya</button>
                      <button
                        onClick={() => setDeleteId(null)}
                        className="text-xs px-3 py-1.5 rounded-lg font-semibold bg-gray-100 text-gray-500 hover:bg-gray-200 transition"
                      >Tidak</button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setDeleteId(f.id)}
                      className="opacity-0 group-hover:opacity-100 transition p-2 rounded-xl hover:bg-red-50 text-gray-300 hover:text-red-400 flex-shrink-0"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {toast && <Toast message={toast.message} type={toast.type} />}
    </AdminLayout>
  )
}