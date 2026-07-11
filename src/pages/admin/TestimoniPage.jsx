import { useState, useMemo, useRef, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { MessageSquare, CheckCircle, XCircle, Plus, Trash2, X, Search } from 'lucide-react'
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

function StarPicker({ value, onChange }) {
  return (
    <div className="flex gap-1">
      {[1,2,3,4,5].map(i => (
        <button
          key={i}
          type="button"
          onClick={() => onChange(i)}
          className="text-2xl transition hover:scale-110"
          style={{color: i <= value ? '#C9973A' : '#D1D5DB'}}
        >★</button>
      ))}
    </div>
  )
}

// Highlight bagian teks yang cocok dengan query pencarian
function HighlightedText({ text, query }) {
  if (!query.trim()) return <>{text}</>
  const parts = text.split(new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'))
  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === query.toLowerCase()
          ? <mark key={i} className="bg-[#C9973A]/25 text-[#1B2A4A] rounded-sm">{part}</mark>
          : <span key={i}>{part}</span>
      )}
    </>
  )
}

const EMPTY_FORM = { name: '', message: '', rating: 5 }

export default function TestimoniPage() {
  const queryClient = useQueryClient()
  const [toast, setToast] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const [deleteId, setDeleteId] = useState(null)

  // --- state pencarian ---
  const [searchQuery, setSearchQuery] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const searchBoxRef = useRef(null)

  const showToast = (message, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  const { data: testimonials, isLoading } = useQuery({
    queryKey: ['testimonials-admin'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .order('created_at', { ascending: false })
      if (error) throw error
      return data
    }
  })

  const addTestimonial = useMutation({
    mutationFn: async (data) => {
      const { error } = await supabase.from('testimonials').insert([data])
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['testimonials-admin'] })
      queryClient.invalidateQueries({ queryKey: ['testimonials'] })
      setForm(EMPTY_FORM)
      setShowForm(false)
      showToast('Testimoni berhasil ditambahkan!')
    },
    onError: () => showToast('Gagal menambahkan testimoni.', 'error')
  })

  const deleteTestimonial = useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase.from('testimonials').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['testimonials-admin'] })
      queryClient.invalidateQueries({ queryKey: ['testimonials'] })
      setDeleteId(null)
      showToast('Testimoni berhasil dihapus!')
    },
    onError: () => showToast('Gagal menghapus testimoni.', 'error')
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.name.trim() || !form.message.trim()) {
      showToast('Nama dan pesan wajib diisi.', 'error')
      return
    }
    addTestimonial.mutate(form)
  }

  // --- filter list utama berdasarkan searchQuery (nama / isi pesan) ---
  const filteredTestimonials = useMemo(() => {
    if (!testimonials) return []
    const q = searchQuery.trim().toLowerCase()
    if (!q) return testimonials
    return testimonials.filter(t =>
      t.name.toLowerCase().includes(q) || t.message.toLowerCase().includes(q)
    )
  }, [testimonials, searchQuery])

  // --- daftar saran autocomplete (nama unik + cuplikan pesan yang cocok) ---
  const suggestions = useMemo(() => {
    if (!testimonials) return []
    const q = searchQuery.trim().toLowerCase()
    if (!q) return []

    const nameMatches = testimonials
      .filter(t => t.name.toLowerCase().includes(q))
      .map(t => ({ type: 'name', id: `name-${t.id}`, label: t.name, testimonialId: t.id }))

    const messageMatches = testimonials
      .filter(t => t.message.toLowerCase().includes(q))
      .map(t => {
        const idx = t.message.toLowerCase().indexOf(q)
        const start = Math.max(0, idx - 20)
        const snippet = (start > 0 ? '…' : '') + t.message.slice(start, idx + q.length + 30) + (idx + q.length + 30 < t.message.length ? '…' : '')
        return { type: 'message', id: `msg-${t.id}`, label: snippet, testimonialId: t.id, name: t.name }
      })

    const combined = [...nameMatches, ...messageMatches]
    const seen = new Set()
    const unique = combined.filter(s => {
      const key = `${s.type}-${s.testimonialId}`
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })
    return unique.slice(0, 6)
  }, [testimonials, searchQuery])

  const handleSelectSuggestion = (suggestion) => {
    const t = testimonials.find(x => x.id === suggestion.testimonialId)
    setSearchQuery(suggestion.type === 'name' ? t.name : searchQuery)
    setShowSuggestions(false)
  }

  // tutup dropdown saat klik di luar search box
  useEffect(() => {
    function handleClickOutside(e) {
      if (searchBoxRef.current && !searchBoxRef.current.contains(e.target)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <AdminLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-[#1B2A4A]" style={{fontFamily: 'Plus Jakarta Sans, sans-serif'}}>
              Kelola Testimoni
            </h2>
            <p className="text-gray-400 text-sm mt-0.5">Tambah dan hapus ulasan penghuni</p>
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

        {/* Search bar + autocomplete */}
        <div className="relative" ref={searchBoxRef}>
          <div className="relative">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => { setSearchQuery(e.target.value); setShowSuggestions(true) }}
              onFocus={() => searchQuery && setShowSuggestions(true)}
              placeholder="Cari testimoni berdasarkan nama atau isi pesan..."
              className="w-full pl-11 pr-10 py-3 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:border-[#1B2A4A] focus:ring-2 focus:ring-[#1B2A4A]/10"
            />
            {searchQuery && (
              <button
                onClick={() => { setSearchQuery(''); setShowSuggestions(false) }}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute z-20 mt-2 w-full bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
              {suggestions.map(s => (
                <button
                  key={s.id}
                  onClick={() => handleSelectSuggestion(s)}
                  className="w-full text-left px-4 py-3 hover:bg-gray-50 transition flex items-start gap-3 border-b border-gray-50 last:border-b-0"
                >
                  <span
                    className="mt-0.5 text-[10px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded flex-shrink-0"
                    style={{background: s.type === 'name' ? '#1B2A4A15' : '#C9973A15', color: s.type === 'name' ? '#1B2A4A' : '#C9973A'}}
                  >
                    {s.type === 'name' ? 'Nama' : 'Pesan'}
                  </span>
                  <span className="text-sm text-gray-600 min-w-0">
                    {s.type === 'message' && <span className="font-semibold text-[#1B2A4A]">{s.name}: </span>}
                    <HighlightedText text={s.label} query={searchQuery} />
                  </span>
                </button>
              ))}
            </div>
          )}

          {showSuggestions && searchQuery.trim() && suggestions.length === 0 && (
            <div className="absolute z-20 mt-2 w-full bg-white rounded-xl shadow-lg border border-gray-100 px-4 py-3 text-sm text-gray-400">
              Tidak ada testimoni yang cocok.
            </div>
          )}
        </div>

        {/* Daftar Testimoni */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-50 flex items-center gap-2">
            <MessageSquare size={16} className="text-[#1B2A4A]" />
            <h3 className="text-sm font-bold text-[#1B2A4A]" style={{fontFamily: 'Plus Jakarta Sans, sans-serif'}}>
              Daftar Testimoni ({filteredTestimonials.length}{searchQuery.trim() ? ` dari ${testimonials?.length || 0}` : ''})
            </h3>
          </div>

          {isLoading ? (
            <div className="p-8 text-center text-gray-400 text-sm">Memuat data...</div>
          ) : filteredTestimonials.length === 0 ? (
            <div className="p-8 text-center text-gray-400 text-sm">
              {searchQuery.trim() ? 'Tidak ada testimoni yang cocok dengan pencarian.' : 'Belum ada testimoni.'}
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {filteredTestimonials.map(t => (
                <div key={t.id} className="px-6 py-4 flex items-start gap-4 hover:bg-gray-50/50 transition group">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                    style={{background: 'linear-gradient(135deg, #1B2A4A 0%, #2D4A7A 100%)'}}
                  >
                    {t.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-bold text-[#1B2A4A]">
                        <HighlightedText text={t.name} query={searchQuery} />
                      </p>
                      <div className="flex">
                        {[1,2,3,4,5].map(i => (
                          <span key={i} style={{color: i <= t.rating ? '#C9973A' : '#E5E7EB', fontSize: '12px'}}>★</span>
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 leading-relaxed">
                      <HighlightedText text={t.message} query={searchQuery} />
                    </p>
                  </div>

                  {deleteId === t.id ? (
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-xs text-gray-400">Hapus?</span>
                      <button
                        onClick={() => deleteTestimonial.mutate(t.id)}
                        className="text-xs px-3 py-1.5 rounded-lg font-semibold bg-red-500 text-white hover:bg-red-600 transition"
                      >Ya</button>
                      <button
                        onClick={() => setDeleteId(null)}
                        className="text-xs px-3 py-1.5 rounded-lg font-semibold bg-gray-100 text-gray-500 hover:bg-gray-200 transition"
                      >Tidak</button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setDeleteId(t.id)}
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

        {/* Form Tambah */}
        {showForm && (
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#1B2A4A]" style={{fontFamily: 'Plus Jakarta Sans, sans-serif'}}>
                Tambah Testimoni Baru
              </h3>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Nama Penghuni *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => setForm({...form, name: e.target.value})}
                  placeholder="contoh: Andi R."
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#1B2A4A] focus:ring-2 focus:ring-[#1B2A4A]/10"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Pesan / Ulasan *</label>
                <textarea
                  value={form.message}
                  onChange={e => setForm({...form, message: e.target.value})}
                  placeholder="Tulis ulasan penghuni di sini..."
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#1B2A4A] focus:ring-2 focus:ring-[#1B2A4A]/10 resize-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Rating</label>
                <StarPicker value={form.rating} onChange={v => setForm({...form, rating: v})} />
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  disabled={addTestimonial.isPending}
                  className="px-6 py-3 rounded-xl text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
                  style={{background: 'linear-gradient(135deg, #1B2A4A 0%, #2D4A7A 100%)'}}
                >
                  {addTestimonial.isPending ? 'Menyimpan...' : 'Simpan Testimoni'}
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
      </div>

      {toast && <Toast message={toast.message} type={toast.type} />}
    </AdminLayout>
  )
}