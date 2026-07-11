import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { BedDouble, CheckCircle, XCircle, Plus, Minus } from 'lucide-react'
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

export default function KamarPage() {
  const queryClient = useQueryClient()
  const [toast, setToast] = useState(null)
  const [editingId, setEditingId] = useState(null)
  const [editForm, setEditForm] = useState({})

  const showToast = (message, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  const { data: rooms, isLoading } = useQuery({
    queryKey: ['rooms-admin'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('room_types')
        .select('*')
        .order('sort_order')
      if (error) throw error
      return data
    }
  })

  const updateRoom = useMutation({
    mutationFn: async ({ id, updates }) => {
      // Hitung status otomatis
      const occupied = updates.occupied_rooms ?? 0
      const total = updates.total_rooms ?? 0
      const status = occupied >= total ? 'penuh' : 'kosong'

      const { error } = await supabase
        .from('room_types')
        .update({ ...updates, status, updated_at: new Date().toISOString() })
        .eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rooms-admin'] })
      queryClient.invalidateQueries({ queryKey: ['rooms'] })
      setEditingId(null)
      showToast('Data kamar berhasil diperbarui!')
    },
    onError: () => showToast('Gagal memperbarui data.', 'error')
  })

  const handleOccupiedChange = (room, delta) => {
    const newOccupied = Math.min(
      Math.max(0, (room.occupied_rooms || 0) + delta),
      room.total_rooms || 0
    )
    updateRoom.mutate({
      id: room.id,
      updates: {
        occupied_rooms: newOccupied,
        total_rooms: room.total_rooms,
      }
    })
  }

  const handleEditStart = (room) => {
    setEditingId(room.id)
    setEditForm({
      name: room.name,
      description: room.description,
      price_monthly: room.price_monthly,
      price_3months: room.price_3months,
      total_rooms: room.total_rooms,
      occupied_rooms: room.occupied_rooms,
      is_popular: room.is_popular,
    })
  }

  const handleEditSave = (id) => {
    const occupied = Number(editForm.occupied_rooms)
    const total = Number(editForm.total_rooms)
    updateRoom.mutate({
      id,
      updates: {
        ...editForm,
        occupied_rooms: Math.min(occupied, total),
        total_rooms: total,
      }
    })
  }

  const formatRupiah = (num) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num)

  return (
    <AdminLayout>
      <div className="max-w-5xl mx-auto space-y-6">

        {/* Header */}
        <div>
          <h2 className="text-xl font-bold text-[#1B2A4A]" style={{fontFamily: 'Plus Jakarta Sans, sans-serif'}}>
            Kelola Kamar
          </h2>
          <p className="text-gray-400 text-sm mt-0.5">Update jumlah kamar terisi per tipe</p>
        </div>

        {/* Cards per tipe */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Array(4).fill(0).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-sm animate-pulse h-40" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {rooms?.map(room => {
              const occupied = room.occupied_rooms || 0
              const total = room.total_rooms || 0
              const available = total - occupied
              const pct = total > 0 ? (occupied / total) * 100 : 0
              const isFull = occupied >= total

              return (
                <div
                  key={room.id}
                  className="bg-white rounded-2xl shadow-sm overflow-hidden border-2 transition-all duration-200"
                  style={{borderColor: isFull ? '#FECACA' : '#BBF7D0'}}
                >
                  {/* Card Header */}
                  <div
                    className="px-5 py-3 flex items-center justify-between"
                    style={{background: isFull ? '#FEF2F2' : '#F0FDF4'}}
                  >
                    <div className="flex items-center gap-2">
                      <BedDouble size={16} style={{color: isFull ? '#DC2626' : '#16A34A'}} />
                      <span className="font-bold text-sm" style={{color: isFull ? '#DC2626' : '#16A34A', fontFamily: 'Plus Jakarta Sans, sans-serif'}}>
                        {room.name}
                      </span>
                      {room.is_popular && (
                        <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-[#FFFBEB] text-[#C9973A]">
                          ⭐ Populer
                        </span>
                      )}
                    </div>
                    <span
                      className="text-xs font-bold px-3 py-1 rounded-full"
                      style={{
                        background: isFull ? '#DC2626' : '#16A34A',
                        color: 'white'
                      }}
                    >
                      {isFull ? 'PENUH' : 'TERSEDIA'}
                    </span>
                  </div>

                  <div className="p-5">
                    <p className="text-xs text-gray-400 mb-4">{room.description} • {formatRupiah(room.price_monthly)}/bln</p>

                    {/* Progress bar */}
                    <div className="mb-4">
                      <div className="flex justify-between text-xs mb-1.5">
                        <span className="text-gray-500">Kamar terisi</span>
                        <span className="font-bold" style={{color: isFull ? '#DC2626' : '#1B2A4A'}}>
                          {occupied} / {total}
                        </span>
                      </div>
                      <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
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
                      <p className="text-xs text-gray-400 mt-1.5">
                        {available > 0 ? `${available} kamar tersedia` : 'Semua kamar penuh'}
                      </p>
                    </div>

                    {/* Tombol +/- kamar terisi */}
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500 font-medium">Kamar terisi:</span>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleOccupiedChange(room, -1)}
                          disabled={occupied <= 0 || updateRoom.isPending}
                          className="w-8 h-8 rounded-xl flex items-center justify-center transition hover:scale-110 disabled:opacity-30 disabled:cursor-not-allowed"
                          style={{background: '#F1F5F9'}}
                        >
                          <Minus size={14} className="text-gray-600" />
                        </button>
                        <span className="text-lg font-bold text-[#1B2A4A] w-8 text-center" style={{fontFamily: 'Plus Jakarta Sans, sans-serif'}}>
                          {occupied}
                        </span>
                        <button
                          onClick={() => handleOccupiedChange(room, +1)}
                          disabled={occupied >= total || updateRoom.isPending}
                          className="w-8 h-8 rounded-xl flex items-center justify-center transition hover:scale-110 disabled:opacity-30 disabled:cursor-not-allowed"
                          style={{background: 'linear-gradient(135deg, #1B2A4A 0%, #2D4A7A 100%)'}}
                        >
                          <Plus size={14} className="text-white" />
                        </button>
                      </div>
                    </div>

                    {/* Edit detail */}
                    {editingId === room.id ? (
                      <div className="mt-4 pt-4 border-t border-gray-100 space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">Nama Tipe</label>
                            <input
                              type="text"
                              value={editForm.name}
                              onChange={e => setEditForm({...editForm, name: e.target.value})}
                              className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#1B2A4A]"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">Total Kamar</label>
                            <input
                              type="number"
                              value={editForm.total_rooms}
                              onChange={e => setEditForm({...editForm, total_rooms: Number(e.target.value)})}
                              className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#1B2A4A]"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">Harga/Bulan</label>
                            <input
                              type="number"
                              value={editForm.price_monthly}
                              onChange={e => setEditForm({...editForm, price_monthly: Number(e.target.value)})}
                              className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#1B2A4A]"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">Harga 3 Bulan</label>
                            <input
                              type="number"
                              value={editForm.price_3months}
                              onChange={e => setEditForm({...editForm, price_3months: Number(e.target.value)})}
                              className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#1B2A4A]"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1">Deskripsi</label>
                          <input
                            type="text"
                            value={editForm.description}
                            onChange={e => setEditForm({...editForm, description: e.target.value})}
                            className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#1B2A4A]"
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={editForm.is_popular}
                              onChange={e => setEditForm({...editForm, is_popular: e.target.checked})}
                              className="sr-only peer"
                            />
                            <div className="w-10 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#C9973A]"></div>
                            <span className="ml-2 text-xs text-gray-600">Tandai Populer</span>
                          </label>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditSave(room.id)}
                            disabled={updateRoom.isPending}
                            className="px-4 py-2 rounded-xl text-xs font-semibold text-white disabled:opacity-60"
                            style={{background: 'linear-gradient(135deg, #1B2A4A 0%, #2D4A7A 100%)'}}
                          >
                            {updateRoom.isPending ? 'Menyimpan...' : 'Simpan'}
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-500 bg-gray-100 hover:bg-gray-200"
                          >
                            Batal
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleEditStart(room)}
                        className="mt-4 w-full py-2 rounded-xl text-xs font-semibold text-gray-500 bg-gray-50 hover:bg-gray-100 transition"
                      >
                        Edit Detail Kamar
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {toast && <Toast message={toast.message} type={toast.type} />}
    </AdminLayout>
  )
}