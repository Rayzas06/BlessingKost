import { useState, useRef } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Images, CheckCircle, XCircle, Upload, Trash2, X } from 'lucide-react'
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

export default function GaleriPage() {
  const queryClient = useQueryClient()
  const [toast, setToast] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [deleteId, setDeleteId] = useState(null)
  const [preview, setPreview] = useState([])
  const [caption, setCaption] = useState('')
  const fileInputRef = useRef(null)

  const showToast = (message, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  const { data: photos, isLoading } = useQuery({
    queryKey: ['gallery-admin'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('gallery_photos')
        .select('*')
        .order('sort_order')
      if (error) throw error
      return data
    }
  })

  const deletePhoto = useMutation({
    mutationFn: async ({ id, storage_path }) => {
      await supabase.storage.from('gallery').remove([storage_path])
      const { error } = await supabase.from('gallery_photos').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gallery-admin'] })
      queryClient.invalidateQueries({ queryKey: ['gallery'] })
      setDeleteId(null)
      showToast('Foto berhasil dihapus!')
    },
    onError: () => showToast('Gagal menghapus foto.', 'error')
  })

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files)
    const valid = files.filter(f => {
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(f.type)) {
        showToast('Format file harus JPG, PNG, atau WebP.', 'error')
        return false
      }
      if (f.size > 2 * 1024 * 1024) {
        showToast(`${f.name} melebihi batas 2MB.`, 'error')
        return false
      }
      return true
    })
    setPreview(valid)
  }

  const handleUpload = async () => {
    if (preview.length === 0) return
    setUploading(true)
    let successCount = 0

    for (const file of preview) {
      const ext = file.name.split('.').pop()
      const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

      const { error: uploadError } = await supabase.storage
        .from('gallery')
        .upload(path, file)

      if (uploadError) { showToast(`Gagal upload ${file.name}.`, 'error'); continue }

      const { data: { publicUrl } } = supabase.storage.from('gallery').getPublicUrl(path)

      await supabase.from('gallery_photos').insert([{
        storage_path: path,
        public_url: publicUrl,
        caption: caption || null,
        sort_order: (photos?.length || 0) + successCount,
      }])

      successCount++
    }

    setUploading(false)
    setPreview([])
    setCaption('')
    if (fileInputRef.current) fileInputRef.current.value = ''
    queryClient.invalidateQueries({ queryKey: ['gallery-admin'] })
    queryClient.invalidateQueries({ queryKey: ['gallery'] })
    showToast(`${successCount} foto berhasil diupload!`)
  }

  return (
    <AdminLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        <div>
          <h2 className="text-xl font-bold text-[#1B2A4A]" style={{fontFamily: 'Plus Jakarta Sans, sans-serif'}}>
            Kelola Galeri
          </h2>
          <p className="text-gray-400 text-sm mt-0.5">Upload dan hapus foto kamar/gedung</p>
        </div>

        {/* Upload Area */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-50 flex items-center gap-2">
            <Upload size={16} className="text-[#1B2A4A]" />
            <h3 className="text-sm font-bold text-[#1B2A4A]" style={{fontFamily: 'Plus Jakarta Sans, sans-serif'}}>
              Upload Foto Baru
            </h3>
          </div>
          <div className="p-6 space-y-4">
            {/* Dropzone */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center cursor-pointer hover:border-[#1B2A4A] hover:bg-[#FAF7F2] transition-all duration-200"
            >
              <Upload size={32} className="mx-auto text-gray-300 mb-3" />
              <p className="text-sm font-medium text-gray-500">Klik untuk pilih foto</p>
              <p className="text-xs text-gray-400 mt-1">JPG, PNG, WebP — maks. 2MB per file</p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                multiple
                onChange={handleFileChange}
                className="hidden"
              />
            </div>

            {/* Preview */}
            {preview.length > 0 && (
              <div>
                <p className="text-xs font-medium text-gray-600 mb-2">{preview.length} foto dipilih:</p>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mb-4">
                  {preview.map((f, i) => (
                    <div key={i} className="relative aspect-square rounded-xl overflow-hidden bg-gray-100">
                      <img
                        src={URL.createObjectURL(f)}
                        alt={f.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
                <div className="mb-4">
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">Caption (opsional)</label>
                  <input
                    type="text"
                    value={caption}
                    onChange={e => setCaption(e.target.value)}
                    placeholder="contoh: Kamar Type C Lantai 2"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#1B2A4A] focus:ring-2 focus:ring-[#1B2A4A]/10"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleUpload}
                    disabled={uploading}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
                    style={{background: 'linear-gradient(135deg, #1B2A4A 0%, #2D4A7A 100%)'}}
                  >
                    <Upload size={16} />
                    {uploading ? 'Mengupload...' : `Upload ${preview.length} Foto`}
                  </button>
                  <button
                    onClick={() => { setPreview([]); if (fileInputRef.current) fileInputRef.current.value = '' }}
                    className="px-6 py-3 rounded-xl text-sm font-semibold text-gray-500 bg-gray-100 hover:bg-gray-200"
                  >
                    Batal
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Grid Foto */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-50 flex items-center gap-2">
            <Images size={16} className="text-[#1B2A4A]" />
            <h3 className="text-sm font-bold text-[#1B2A4A]" style={{fontFamily: 'Plus Jakarta Sans, sans-serif'}}>
              Foto Tersimpan ({photos?.length || 0})
            </h3>
          </div>
          <div className="p-6">
            {isLoading ? (
              <div className="text-center text-gray-400 text-sm py-8">Memuat foto...</div>
            ) : photos?.length === 0 ? (
              <div className="text-center text-gray-400 text-sm py-8">Belum ada foto. Upload foto pertama kamu!</div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {photos?.map(photo => (
                  <div key={photo.id} className="relative group aspect-square rounded-xl overflow-hidden bg-gray-100">
                    <img
                      src={photo.public_url}
                      alt={photo.caption || 'Foto'}
                      className="w-full h-full object-cover transition group-hover:scale-105 duration-300"
                    />
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-200 flex items-center justify-center">
                      {deleteId === photo.id ? (
                        <div className="flex flex-col items-center gap-2 opacity-0 group-hover:opacity-100 transition">
                          <p className="text-white text-xs font-medium">Hapus foto ini?</p>
                          <div className="flex gap-2">
                            <button
                              onClick={() => deletePhoto.mutate({ id: photo.id, storage_path: photo.storage_path })}
                              className="text-xs px-3 py-1.5 rounded-lg font-semibold bg-red-500 text-white hover:bg-red-600"
                            >Ya</button>
                            <button
                              onClick={() => setDeleteId(null)}
                              className="text-xs px-3 py-1.5 rounded-lg font-semibold bg-white text-gray-700"
                            >Tidak</button>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => setDeleteId(photo.id)}
                          className="opacity-0 group-hover:opacity-100 transition p-2 rounded-xl bg-red-500 text-white hover:bg-red-600"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                    {photo.caption && (
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                        <p className="text-white text-xs truncate">{photo.caption}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      {toast && <Toast message={toast.message} type={toast.type} />}
    </AdminLayout>
  )
}