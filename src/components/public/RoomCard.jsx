import { MessageCircle } from 'lucide-react'

export default function RoomCard({ room }) {
  const {
    name = '',
    description = '',
    price_monthly = 0,
    price_3months = 0,
    is_popular = false,
    status = 'kosong',
  } = room

  const waNumber = '6281376584100'
  const waMessage = encodeURIComponent(`Halo, saya tertarik dengan ${name} (${description}) di Blessing Kost. Apakah masih tersedia?`)
  const waLink = `https://wa.me/${waNumber}?text=${waMessage}`

  const formatRupiah = (num) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num)

  return (
    <div className={`bg-white rounded-xl shadow-md hover:shadow-lg transition overflow-hidden border-2 ${is_popular ? 'border-[#C9973A]' : 'border-transparent'}`}>
      {/* Popular Banner */}
      {is_popular && (
        <div className="bg-[#C9973A] text-white text-xs font-bold text-center py-1.5 tracking-widest uppercase">
          ⭐ Paling Populer
        </div>
      )}

      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-3 gap-2">
          <div className="flex-1 min-w-0">
            <h3
              className="text-xl font-bold text-[#1B2A4A]"
              style={{fontFamily: 'Plus Jakarta Sans, sans-serif'}}
            >
              {name}
            </h3>
            <p className="text-gray-500 text-sm mt-0.5 leading-snug">{description}</p>
          </div>
          {/* Status Badge */}
          <span
            className={`text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap flex-shrink-0 mt-1
              ${status === 'kosong'
                ? 'bg-green-100 text-green-700'
                : 'bg-red-100 text-red-700'
              }`}
          >
            {status === 'kosong' ? '● Kosong' : '● Penuh'}
          </span>
        </div>

        {/* Harga */}
        <div className="mb-5">
          <div
            className="text-3xl font-bold text-[#1B2A4A]"
            style={{fontFamily: 'Plus Jakarta Sans, sans-serif'}}
          >
            {formatRupiah(price_monthly)}
            <span className="text-base font-normal text-gray-400">/bln</span>
          </div>
          <div className="text-sm text-gray-500 mt-1">
            Paket 3 bulan:{' '}
            <span className="font-semibold text-[#2D4A7A]">
              {formatRupiah(price_3months)}
            </span>
          </div>
        </div>

        {/* CTA */}
        <a // <--- Tag <a pembuka yang hilang berhasil diselamatkan kembali di sini
          href={waLink}
          target="_blank"
          rel="noopener noreferrer"
          className={`flex items-center justify-center gap-2 w-full py-3 rounded-xl font-semibold text-sm transition
            ${status === 'kosong'
              ? 'bg-[#1B2A4A] hover:bg-[#2D4A7A] text-white'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed pointer-events-none'
            }`}
        >
          <MessageCircle size={16} />
          {status === 'kosong' ? 'Tanya via WhatsApp' : 'Kamar Penuh'}
        </a>
      </div>
    </div>
  )
}