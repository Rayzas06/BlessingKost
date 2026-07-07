const STATIC_TESTIMONIALS = [
  { id: 1, name: 'Andi R.', message: 'Kamarnya bersih dan nyaman, lokasinya strategis banget dekat USU. Pemiliknya juga ramah dan responsif. Rekomendasikan banget!', rating: 5 },
  { id: 2, name: 'Sari M.', message: 'Harga terjangkau untuk fasilitas yang lengkap. WiFi kencang, air lancar, parkir aman. Betah tinggal di sini.', rating: 5 },
  { id: 3, name: 'Budi S.', message: 'Gedung baru, kamar lapang, AC dingin. Sangat worth it untuk mahasiswa USU. Sudah kost di sini 2 tahun.', rating: 5 },
]

function StarRating({ rating = 5 }) {
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map(i => (
        <span key={i} style={{color: i <= rating ? '#C9973A' : '#D1D5DB', fontSize: '16px'}}>★</span>
      ))}
    </div>
  )
}

export default function TestimonialSection({ testimonials }) {
  const data = testimonials || STATIC_TESTIMONIALS

  return (
    <section id="testimoni" className="py-24 bg-[#FAF7F2]">
      <div className="max-w-6xl mx-auto px-4">
        {/* Heading */}
        <div className="text-center mb-14">
          <p className="text-[#C9973A] font-semibold text-xs uppercase tracking-[0.2em] mb-3">Testimoni</p>
          <h2 className="text-4xl md:text-5xl font-bold text-[#1B2A4A]" style={{fontFamily: 'Plus Jakarta Sans, sans-serif'}}>
            Kata Penghuni Kami
          </h2>
          <p className="text-gray-500 mt-4 text-sm">Lebih dari ratusan mahasiswa sudah tinggal bersama kami.</p>
          <div className="flex items-center justify-center gap-2 mt-5">
            <div className="h-px w-12 bg-[#C9973A]/40 rounded" />
            <div className="w-2 h-2 rounded-full bg-[#C9973A]" />
            <div className="h-px w-12 bg-[#C9973A]/40 rounded" />
          </div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {data.map((t, i) => (
            <div
              key={t.id}
              className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col"
            >
              {/* Quote mark */}
              <div className="text-5xl font-serif leading-none mb-3" style={{color: '#C9973A', opacity: 0.3}}>"</div>

              <p className="text-gray-600 text-sm leading-relaxed flex-1 -mt-4">{t.message}</p>

              <div className="mt-5 pt-5 border-t border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                    style={{background: 'linear-gradient(135deg, #1B2A4A 0%, #2D4A7A 100%)'}}
                  >
                    {t.name.charAt(0)}
                  </div>
                  <span className="font-semibold text-[#1B2A4A] text-sm">{t.name}</span>
                </div>
                <StarRating rating={t.rating} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}