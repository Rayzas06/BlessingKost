import { useState, useEffect, useCallback } from 'react'
import { Phone, ChevronLeft, ChevronRight } from 'lucide-react'
import IgLogo from '../../assets/IgLogo.jpg'
import img1 from '../../assets/Tampak_Samping.jpeg'
import img2 from '../../assets/Teras_pada_lantai_3.jpeg'
import img3 from '../../assets/Jemuran.jpeg'
import img4 from '../../assets/Parkiran.jpeg'

const SLIDES = [
  { src: img1, caption: 'Gedung 3 Lantai yang Baru & Bersih' },
  { src: img2, caption: 'Teras Lantai 3 dengan View Kota' },
  { src: img3, caption: 'Area Jemuran Bersama' },
  { src: img4, caption: 'Parkiran Motor yang Aman' },
]

export default function HeroSection({ settings = {} }) {
  const [current, setCurrent] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  const waNumber = settings.whatsapp_1 || '6281376584100'
  const igUrl = settings.instagram_url || 'https://instagram.com/blessingkost_medan'
  const promoText = settings.promo_text || '1 Tahun Free 1 Bulan'
  const promoActive = settings.promo_active !== 'false'
  const address = settings.address || 'Jl. Bunga Kenanga No. 9B, Medan Selayang'
  const waLink = `https://wa.me/${waNumber}?text=Halo%2C%20saya%20ingin%20bertanya%20tentang%20kamar%20di%20Blessing%20Kost`

  const goTo = useCallback((index) => {
    if (isAnimating) return
    setIsAnimating(true)
    setCurrent((index + SLIDES.length) % SLIDES.length)
    setTimeout(() => setIsAnimating(false), 500)
  }, [isAnimating])

  const prev = () => goTo(current - 1)
  const next = () => goTo(current + 1)

  // Auto-slide setiap 5 detik
  useEffect(() => {
    const timer = setInterval(() => goTo(current + 1), 5000)
    return () => clearInterval(timer)
  }, [current, goTo])

  // Swipe support
  const [touchStart, setTouchStart] = useState(null)
  const handleTouchStart = (e) => setTouchStart(e.touches[0].clientX)
  const handleTouchEnd = (e) => {
    if (!touchStart) return
    const diff = touchStart - e.changedTouches[0].clientX
    if (Math.abs(diff) > 50) diff > 0 ? next() : prev()
    setTouchStart(null)
  }

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Background Slides */}
      {SLIDES.map((slide, i) => (
        <div
          key={i}
          className="absolute inset-0 transition-opacity duration-700"
          style={{ opacity: i === current ? 1 : 0 }}
        >
          <img
            src={slide.src}
            alt={slide.caption}
            className="w-full h-full object-cover"
          />
          {/* Overlay gelap supaya teks terbaca */}
          <div className="absolute inset-0" style={{background: 'linear-gradient(to bottom, rgba(27,42,74,0.75) 0%, rgba(27,42,74,0.55) 50%, rgba(27,42,74,0.85) 100%)'}} />
        </div>
      ))}

      {/* Konten Tengah */}
      <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
        {/* Promo Badge */}
        {promoActive && (
          <div className="inline-flex items-center gap-2 bg-[#C9973A] text-white px-5 py-2 rounded-full text-sm font-semibold mb-6 shadow-lg">
            🎉 Promo Spesial: {promoText}
          </div>
        )}

        {/* Heading */}
        <h1
          className="text-5xl md:text-7xl font-bold text-white mb-4 drop-shadow-lg"
          style={{fontFamily: 'Plus Jakarta Sans, sans-serif'}}
        >
          Blessing <span className="font-bold text-[#C9973A]">Kost</span>
        </h1>

        <a href="https://maps.google.com/?q=Jl.+Bunga+Kenanga+No.+9B,+Medan+Selayang"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1 text-white/80 text-lg mb-1 transition-all duration-200 hover:text-[#C9973A] hover:underline hover:underline-offset-4 cursor-pointer"
      >
        📍 {address}</a>
        <p className="text-white/60 text-sm mb-3">Dekat Universitas Sumatera Utara (USU)</p>

        {/* Caption slide */}
        <p className="text-[#C9973A] text-sm font-medium mb-10 h-5 transition-all duration-300">
          {SLIDES[current].caption}
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mt-2">
          
          <a // <--- Tag <a WhatsApp berhasil dikembalikan
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl font-semibold text-base transition-all duration-300 w-full sm:w-auto shadow-xl hover:shadow-green-500/30 hover:scale-105"
            style={{background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)', color: 'white', minWidth: '210px'}}
          >
            <div className="bg-white/20 rounded-lg p-1">
              <Phone size={16} />
            </div>
            Hubungi via WhatsApp
          </a>
          
          <a // <--- Tag <a Instagram berhasil dikembalikan
            href={igUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl font-semibold text-base transition-all duration-300 w-full sm:w-auto hover:scale-105"
            style={{background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(12px)', border: '1.5px solid rgba(255,255,255,0.25)', color: 'white', minWidth: '210px'}}
          >
            <div className="bg-white/20 rounded-lg p-1 flex items-center">
              <img src={IgLogo} alt="Instagram" className="w-4 h-4 rounded-sm object-cover" />
            </div>
            Lihat Instagram
          </a>
        </div>
      </div>

      {/* Tombol Prev / Next */}
      <button
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/40 text-white p-3 rounded-full backdrop-blur-sm transition"
      >
        <ChevronLeft size={24} />
      </button>
      <button
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/40 text-white p-3 rounded-full backdrop-blur-sm transition"
      >
        <ChevronRight size={24} />
      </button>

      {/* Dot Indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className="rounded-full transition-all duration-300"
            style={{
              width: i === current ? '24px' : '8px',
              height: '8px',
              background: i === current ? '#C9973A' : 'rgba(255,255,255,0.5)',
            }}
          />
        ))}
      </div>
    </section>
  )
}