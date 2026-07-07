import Navbar from '../components/public/Navbar'
import HeroSection from '../components/public/HeroSection'
import RoomSection from '../components/public/RoomSection'
import FacilitySection from '../components/public/FacilitySection'
import TestimonialSection from '../components/public/TestimonialSection'
import ContactSection from '../components/public/ContactSection'
import { useRooms } from '../hooks/useRooms'
import { useFacilities } from '../hooks/useFacilities'
import { useTestimonials } from '../hooks/useTestimonials'
import { useSettings } from '../hooks/useSettings'

export default function HomePage() {
  return (
    <div>
      <Navbar />
      <HeroSection />
      <RoomSection />
      <FacilitySection />
      <TestimonialSection />
      <ContactSection />
    </div>
  )
}