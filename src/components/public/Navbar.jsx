import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { Home } from 'lucide-react'

const navLinks = [
  { label: 'Kamar', href: '#tipe-kamar' },
  { label: 'Galeri', href: '#galeri' },
  { label: 'Fasilitas', href: '#fasilitas' },
  { label: 'Testimoni', href: '#testimoni' },
  { label: 'Kontak', href: '#kontak' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#1B2A4A] shadow-lg">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2 group transition">
          {/* Ikon Rumah Minimalis berwarna Emas */}
          <Home size={22} className="text-[#C9973A] group-hover:scale-105 transition-transform" />
  
          <span 
            className="text-white text-xl tracking-wide font-light" 
            style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
          >
            Blessing <span className="font-bold text-[#C9973A]">Kost</span>
          </span>
      </a>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map(link => (
            <a // <--- Tag <a ini sebelumnya hilang
              key={link.href}
              href={link.href}
              className="text-white/80 hover:text-white text-sm font-medium transition"
            >
              {link.label}
            </a>
          ))}
          
          <a // <--- Tag <a ini juga sebelumnya hilang
            href="#kontak"
            className="bg-[#C9973A] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-yellow-600 transition"
          >
            Hubungi Kami
          </a>
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden text-white"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden bg-[#1B2A4A] border-t border-white/10 px-4 pb-4 flex flex-col gap-3">
          {navLinks.map(link => (
            <a // <--- Tag <a ini juga sebelumnya hilang
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="text-white/80 hover:text-white text-sm font-medium py-2 transition"
            >
              {link.label}
            </a>
          ))}
          
          <a // <--- Tag <a ini juga sebelumnya hilang
            href="#kontak"
            className="bg-[#C9973A] text-white px-4 py-2 rounded-lg text-sm font-semibold text-center"
          >
            Hubungi Kami
          </a>
        </div>
      )}
    </nav>
  )
}