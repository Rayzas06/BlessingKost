import { Phone, Instagram } from 'lucide-react'

export default function HeroSection({ settings = {} }) {
  const waNumber = settings.whatsapp_1 || '6281376584100'
  const igUrl = settings.instagram_url || 'https://instagram.com/blessingkost_medan'
  const promoText = settings.promo_text || '1 Thn Free 1 Bln'
  const promoActive = settings.promo_active === 'true'
  const address = settings.address || 'Jl. Bunga Kenanga No. 9B, Medan Selayang'

  const waLink = `https://wa.me/${waNumber}?text=Halo%2C%20saya%20ingin%20bertanya%20tentang%20kamar%20di%20Blessing%20Kost`

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center"
      style={{background: 'linear-gradient(135deg, #1B2A4A 0%, #2D4A7A 100%)'}}
    >
      {/* Background overlay pattern */}
      <div className="absolute inset-0 opacity-10"
        style={{backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px'}}
      />

      <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
        {/* Promo Badge */}
        {promoActive && (
          <div className="inline-flex items-center gap-2 bg-[#C9973A] text-white px-5 py-2 rounded-full text-sm font-semibold mb-6 shadow-lg">
            🎉 Promo Spesial: {promoText}
          </div>
        )}

        {/* Heading */}
        <h1
          className="text-5xl md:text-7xl font-bold text-white mb-4"
          style={{fontFamily: 'Plus Jakarta Sans, sans-serif'}}
        >
          Blessing Kost
        </h1>

        <p className="text-white/70 text-lg mb-2">📍 {address}</p>
        <p className="text-white/60 text-sm mb-10">Dekat Universitas Sumatera Utara (USU)</p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          
          <a // <--- Tag <a ini tadi hilang
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-xl font-semibold text-lg transition shadow-lg"
          >
            <Phone size={20} />
            Hubungi via WhatsApp
          </a>
          
          <a // <--- Tag <a ini juga tadi hilang
            href={igUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/30 px-8 py-4 rounded-xl font-semibold text-lg transition"
          >
            <Instagram size={20} />
            Lihat Instagram
          </a>
        </div>

        {/* Scroll hint */}
        <div className="mt-16 text-white/40 text-sm animate-bounce">
          ↓ Scroll untuk lihat kamar
        </div>
      </div>
    </section>
  )
}