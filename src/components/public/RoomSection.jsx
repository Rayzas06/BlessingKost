import RoomCard from './RoomCard'

const STATIC_ROOMS = [
  { id: 1, name: 'Type A', description: 'Kamar Kosong / Bersih', price_monthly: 750000, price_3months: 2100000, is_popular: false, status: 'kosong' },
  { id: 2, name: 'Type B', description: 'Semi-Furnished', price_monthly: 900000, price_3months: 2550000, is_popular: false, status: 'kosong' },
  { id: 3, name: 'Type C', description: 'Full AC / Lapang', price_monthly: 1050000, price_3months: 2900000, is_popular: true, status: 'kosong' },
  { id: 4, name: 'Type D', description: 'Full Furnished + AC', price_monthly: 1250000, price_3months: 3600000, is_popular: false, status: 'kosong' },
]

export default function RoomSection({ rooms }) {
  const data = rooms || STATIC_ROOMS

  return (
    <section id="tipe-kamar" className="py-20 bg-[#FAF7F2]">
      <div className="max-w-6xl mx-auto px-4">
        {/* Heading */}
        <div className="text-center mb-12">
          <p className="text-[#C9973A] font-semibold text-sm uppercase tracking-widest mb-2">Pilihan Kamar</p>
          <h2 className="text-4xl font-bold text-[#1B2A4A]" style={{fontFamily:'Plus Jakarta Sans, sans-serif'}}>
            Temukan Kamar yang Tepat
          </h2>
          <p className="text-gray-500 mt-3 max-w-md mx-auto">
            Tersedia 4 tipe kamar sesuai kebutuhan dan budget kamu.
          </p>
        </div>

        {/* Grid Kamar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {data.map(room => (
            <RoomCard key={room.id} room={room} />
          ))}
        </div>
      </div>
    </section>
  )
}