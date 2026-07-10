import { Building2, GraduationCap, Bike, Droplets, Users, Wifi } from 'lucide-react'
import { SkeletonFacility } from '../ui/Skeleton'

const ICON_MAP = {
  'building': Building2,
  'graduation-cap': GraduationCap,
  'bike': Bike,
  'droplet': Droplets,
  'users': Users,
  'wifi': Wifi,
}

const STATIC_FACILITIES = [
  { id: 1, icon_name: 'building', label: 'Gedung Baru' },
  { id: 2, icon_name: 'graduation-cap', label: 'Dekat USU' },
  { id: 3, icon_name: 'bike', label: 'Parkir Motor' },
  { id: 4, icon_name: 'droplet', label: 'Free PAM' },
  { id: 5, icon_name: 'users', label: 'Closet Duduk' },
  { id: 6, icon_name: 'wifi', label: 'Free WiFi' },
]

export default function FacilitySection({ facilities, isLoading }) {
  const data = facilities || STATIC_FACILITIES

  return (
    <section id="fasilitas" className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-14">
          <p className="text-[#C9973A] font-semibold text-xs uppercase tracking-[0.2em] mb-3">Fasilitas</p>
          <h2 className="text-4xl md:text-5xl font-bold text-[#1B2A4A]" style={{fontFamily: 'Plus Jakarta Sans, sans-serif'}}>
            Fasilitas Lengkap
          </h2>
          <p className="text-gray-500 mt-4 text-sm">Semua yang kamu butuhkan sudah tersedia.</p>
          <div className="flex items-center justify-center gap-2 mt-5">
            <div className="h-px w-12 bg-[#C9973A]/40 rounded" />
            <div className="w-2 h-2 rounded-full bg-[#C9973A]" />
            <div className="h-px w-12 bg-[#C9973A]/40 rounded" />
          </div>
        </div>

        <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
          {isLoading
            ? Array(6).fill(0).map((_, i) => <SkeletonFacility key={i} />)
            : data.map(facility => {
                const Icon = ICON_MAP[facility.icon_name] || Building2
                return (
                  <div
                    key={facility.id}
                    className="flex flex-col items-center gap-3 p-5 rounded-2xl hover:shadow-md transition-all duration-300 hover:-translate-y-1 group cursor-default"
                    style={{background: 'transparent'}}
                    onMouseEnter={e => e.currentTarget.style.background = '#FAF7F2'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <div
                      className="w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                      style={{background: 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)'}}
                      onMouseEnter={e => e.currentTarget.style.background = 'linear-gradient(135deg, #1B2A4A 0%, #2D4A7A 100%)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)'}
                    >
                      <Icon size={26} className="text-[#1B2A4A] group-hover:text-white transition-colors duration-300" />
                    </div>
                    <span className="text-sm font-semibold text-gray-700 text-center leading-tight">{facility.label}</span>
                  </div>
                )
              })
          }
        </div>
      </div>
    </section>
  )
}