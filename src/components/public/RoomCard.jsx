import { MessageCircle } from 'lucide-react'

export default function RoomCard({ room }) {
  const {
    name = '',
    description = '',
    price_monthly = 0,
    price_3months = 0,
    is_popular = false,
    status = 'kosong',
    total_rooms = 0,
    occupied_rooms = 0,
  } = room

  const available = total_rooms - occupied_rooms
  const waNumber = '6281376584100'
  const waMessage = encodeURIComponent(`Halo, saya tertarik dengan ${name} (${description}) di Blessing Kost. Apakah masih tersedia?`)
  const waLink = `https://wa.me/${waNumber}?text=${waMessage}`

  const formatRupiah = (num) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num)

  return (
    <div className={`relative bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden flex flex-col border-2 ${is_popular ? 'border-[#C9973A]' : 'border-transparent'}`}>
      {/* Popular Banner */}
      <div
        className="h-8 flex items-center justify-center"
        style={{background: is_popular ? 'linear-gradient(135deg, #C9973A 0%, #e6b44d 100%)' : 'transparent'}}
      >
        {is_popular && (
          <span className="text-white text-xs font-bold tracking-widest uppercase">⭐ Paling Populer</span>
        )}
      </div>

      <div className="p-6 flex flex-col flex-1">
        {/* Header */}
        <div className="flex items-start justify-between mb-4 gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-bold text-[#1B2A4A]" style={{fontFamily: 'Plus Jakarta Sans, sans-serif'}}>
              {name}
            </h3>
            <p className="text-gray-500 text-sm mt-0.5 leading-snug">{description}</p>
          </div>
          <span className={`text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap flex-shrink-0 mt-1 ${status === 'kosong' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            ● {status === 'kosong' ? 'Tersedia' : 'Penuh'}
          </span>
        </div>

        {/* Harga */}
        <div className="mb-4 flex-1">
          <div className="flex items-baseline gap-1 flex-wrap">
            <span className="text-3xl font-bold text-[#1B2A4A]" style={{fontFamily: 'Plus Jakarta Sans, sans-serif'}}>
              {formatRupiah(price_monthly)}
            </span>
            <span className="text-base font-normal text-gray-400 whitespace-nowrap">/bln</span>
          </div>
          <div className="text-sm text-gray-500 mt-1 flex items-center gap-1 flex-wrap">
            <span>Paket 3 bulan:</span>
            <span className="font-semibold text-[#2D4A7A] whitespace-nowrap">{formatRupiah(price_3months)}</span>
          </div>
        </div>

        {/* Info ketersediaan */}
        {total_rooms > 0 && (
          <div className="mb-4">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-gray-400">Ketersediaan</span>
              <span className="font-semibold" style={{color: status === 'kosong' ? '#16A34A' : '#DC2626'}}>
                {available} dari {total_rooms} kamar
              </span>
            </div>
            <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${(occupied_rooms / total_rooms) * 100}%`,
                  background: status === 'penuh'
                    ? 'linear-gradient(90deg, #DC2626, #EF4444)'
                    : occupied_rooms / total_rooms > 0.7
                    ? 'linear-gradient(90deg, #F59E0B, #FBBF24)'
                    : 'linear-gradient(90deg, #16A34A, #22C55E)'
                }}
              />
            </div>
          </div>
        )}

        {/* CTA */}
        <a // <--- Tag <a pembuka yang hilang dikembalikan di sini
          href={waLink}
          target="_blank"
          rel="noopener noreferrer"
          className={`flex items-center justify-center gap-2 w-full py-3.5 rounded-xl font-semibold text-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-lg ${status === 'kosong' ? 'text-white' : 'bg-gray-100 text-gray-400 cursor-not-allowed pointer-events-none'}`}
          style={status === 'kosong' ? {background: 'linear-gradient(135deg, #1B2A4A 0%, #2D4A7A 100%)'} : {}}
        >
          <div className="bg-white/20 rounded-lg p-1">
            <MessageCircle size={14} />
          </div>
          {status === 'kosong' ? 'Tanya via WhatsApp' : 'Kamar Penuh'}
        </a>
      </div>
    </div>
  )
}