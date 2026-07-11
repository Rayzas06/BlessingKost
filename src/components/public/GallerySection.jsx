import { useState } from 'react'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'

export default function GallerySection({ photos, isLoading }) {
  const [lightbox, setLightbox] = useState(null)

  const openLightbox = (index) => setLightbox(index)
  const closeLightbox = () => setLightbox(null)
  const prev = () => setLightbox(i => (i - 1 + photos.length) % photos.length)
  const next = () => setLightbox(i => (i + 1) % photos.length)

  if (isLoading) {
    return (
      <section id="galeri" className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-14">
            <p className="text-[#C9973A] font-semibold text-xs uppercase tracking-[0.2em] mb-3">Galeri</p>
            <h2 className="text-4xl md:text-5xl font-bold text-[#1B2A4A]" style={{fontFamily: 'Plus Jakarta Sans, sans-serif'}}>
              Foto Blessing Kost
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {Array(8).fill(0).map((_, i) => (
              <div key={i} className="aspect-square rounded-2xl bg-gray-100 animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (!photos || photos.length === 0) return null

  return (
    <section id="galeri" className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        {/* Heading */}
        <div className="text-center mb-14">
          <p className="text-[#C9973A] font-semibold text-xs uppercase tracking-[0.2em] mb-3">Galeri</p>
          <h2 className="text-4xl md:text-5xl font-bold text-[#1B2A4A]" style={{fontFamily: 'Plus Jakarta Sans, sans-serif'}}>
            Foto Blessing Kost
          </h2>
          <p className="text-gray-500 mt-4 text-sm">Lihat kondisi kamar dan fasilitas secara langsung.</p>
          <div className="flex items-center justify-center gap-2 mt-5">
            <div className="h-px w-12 bg-[#C9973A]/40 rounded" />
            <div className="w-2 h-2 rounded-full bg-[#C9973A]" />
            <div className="h-px w-12 bg-[#C9973A]/40 rounded" />
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {photos.map((photo, index) => (
            <div
              key={photo.id}
              onClick={() => openLightbox(index)}
              className="relative aspect-square rounded-2xl overflow-hidden cursor-pointer group bg-gray-100"
            >
              <img
                src={photo.public_url}
                alt={photo.caption || 'Foto Blessing Kost'}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-end">
                {photo.caption && (
                  <div className="w-full p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <p className="text-white text-xs font-medium truncate">{photo.caption}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {lightbox !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={closeLightbox}
        >
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 text-white/70 hover:text-white p-2 rounded-xl hover:bg-white/10 transition"
          >
            <X size={24} />
          </button>
          <button
            onClick={e => { e.stopPropagation(); prev() }}
            className="absolute left-4 text-white/70 hover:text-white p-3 rounded-xl hover:bg-white/10 transition"
          >
            <ChevronLeft size={28} />
          </button>
          <button
            onClick={e => { e.stopPropagation(); next() }}
            className="absolute right-4 text-white/70 hover:text-white p-3 rounded-xl hover:bg-white/10 transition"
          >
            <ChevronRight size={28} />
          </button>
          <img
            src={photos[lightbox].public_url}
            alt={photos[lightbox].caption || 'Foto'}
            className="max-h-[85vh] max-w-[90vw] object-contain rounded-2xl shadow-2xl"
            onClick={e => e.stopPropagation()}
          />
          {photos[lightbox].caption && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/60 text-white text-sm px-4 py-2 rounded-xl backdrop-blur-sm">
              {photos[lightbox].caption}
            </div>
          )}
          <div className="absolute bottom-16 left-1/2 -translate-x-1/2 text-white/50 text-xs">
            {lightbox + 1} / {photos.length}
          </div>
        </div>
      )}
    </section>
  )
}