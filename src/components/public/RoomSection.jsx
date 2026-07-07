import RoomCard from './RoomCard'

const STATIC_ROOMS = [
  { id: 1, name: 'Type A', description: 'Kamar Kosong / Bersih', price_monthly: 750000, price_3months: 2100000, is_popular: false, status: 'kosong' },
  { id: 2, name: 'Type B', description: 'Semi-Furnished', price_monthly: 900000, price_3months: 2550000, is_popular: false, status: 'kosong' },
  { id: 3, name: 'Type C', description: 'Full AC / Lapang', price_monthly: 1050000, price_3months: 2900000, is_popular: true, status: 'kosong' },
  { id: 4, name: 'Type D', description: 'Full Furnished + AC', price_monthly: 1250000, price_3months: 3600000, is_popular: false, status: 'kosong' },
]

export default function RoomSection({ rooms }) {
  const data = rooms && rooms.length > 0 ? rooms : STATIC_ROOMS

  return (
    <section id="tipe-kamar" className="py-24 bg-[#FAF7F2]">
      <div className="max-w-6xl mx-auto px-4">
        {/* Heading */}
        <div className="text-center mb-14">
          <p className="text-[#C9973A] font-semibold text-xs uppercase tracking-[0.2em] mb-3">Pilihan Kamar</p>
          <h2 className="text-4xl md:text-5xl font-bold text-[#1B2A4A]" style={{fontFamily: 'Plus Jakarta Sans, sans-serif'}}>
            Temukan Kamar yang Tepat
          </h2>
          <p className="text-gray-500 mt-4 max-w-md mx-auto text-sm leading-relaxed">
            Tersedia 4 tipe kamar sesuai kebutuhan dan budget kamu.
          </p>
          {/* Divider aksen */}
          <div className="flex items-center justify-center gap-2 mt-5">
            <div className="h-px w-12 bg-[#C9973A]/40 rounded" />
            <div className="w-2 h-2 rounded-full bg-[#C9973A]" />
            <div className="h-px w-12 bg-[#C9973A]/40 rounded" />
          </div>
        </div>

        {/* Grid Kamar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {data.map(room => (
            <RoomCard key={room.id} room={room} />
          ))}
        </div>

        {/* Note bawah */}
        <p className="text-center text-gray-400 text-xs mt-10">
          *Harga dapat berubah sewaktu-waktu. Hubungi kami untuk info terkini.
        </p>
      </div>
    </section>
  )
}