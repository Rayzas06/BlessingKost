import { Phone, MapPin } from 'lucide-react'
import IgLogo from '../../assets/IgLogo.jpg'

export default function ContactSection({ settings = {} }) {
  const wa1 = settings.whatsapp_1 || '6281376584100'
  const wa2 = settings.whatsapp_2 || '6281264966667'
  const igUrl = settings.instagram_url || 'https://instagram.com/blessingkost_medan'
  const address = settings.address || 'Jl. Bunga Kenanga No. 9B, Medan Selayang'

  return (
    <section id="kontak" className="py-24 bg-[#1B2A4A] relative overflow-hidden">
      {/* Background pattern */}
      <div
        className="absolute inset-0 opacity-5"
        style={{backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px'}}
      />

      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
        {/* Heading */}
        <p className="text-[#C9973A] font-semibold text-xs uppercase tracking-[0.2em] mb-3">Kontak</p>
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4" style={{fontFamily: 'Plus Jakarta Sans, sans-serif'}}>
          Booking Sekarang!
        </h2>
        <p className="text-white/60 mb-12 text-sm">Hubungi kami via WhatsApp untuk cek ketersediaan kamar.</p>

        {/* WA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          
          <a // <--- Tag <a Ibu Tarigan dikembalikan
            href={`https://wa.me/${wa1}?text=Halo%2C%20saya%20ingin%20tanya%20tentang%20kamar%20Blessing%20Kost`}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl font-semibold text-base transition-all duration-300 hover:scale-105 hover:shadow-xl"
            style={{background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)', color: 'white', minWidth: '200px'}}
          >
            <div className="bg-white/20 rounded-lg p-1">
              <Phone size={16} />
            </div>
            Ibu Tarigan
          </a>
          
          <a // <--- Tag <a Bapak Bangun dikembalikan
            href={`https://wa.me/${wa2}?text=Halo%2C%20saya%20ingin%20tanya%20tentang%20kamar%20Blessing%20Kost`}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl font-semibold text-base transition-all duration-300 hover:scale-105 hover:shadow-xl"
            style={{background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)', color: 'white', minWidth: '200px'}}
          >
            <div className="bg-white/20 rounded-lg p-1">
              <Phone size={16} />
            </div>
            Bapak Bangun
          </a>
        </div>

        {/* Instagram */}
        <a // <--- Tag <a Instagram dikembalikan
          href={igUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-all duration-200 mb-12 text-sm hover:gap-3"
        >
          <img src={IgLogo} alt="Instagram" className="w-4 h-4 rounded-sm object-cover" />
          @blessingkost_medan
        </a>

        {/* Divider */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="h-px w-16 bg-white/20 rounded" />
          <div className="w-1.5 h-1.5 rounded-full bg-[#C9973A]" />
          <div className="h-px w-16 bg-white/20 rounded" />
        </div>

        {/* Alamat */}
        <a // <--- Tag <a Alamat dikembalikan
          href={`https://maps.google.com/?q=${encodeURIComponent(address)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 text-white/50 hover:text-[#C9973A] transition-all duration-200 text-sm mb-12"
        >
          <MapPin size={14} />
          {address}
        </a>

        {/* Copyright */}
        <p className="text-white/25 text-xs mt-4">
          © {new Date().getFullYear()} Blessing Kost Medan. All rights reserved.
        </p>
      </div>
    </section>
  )
}