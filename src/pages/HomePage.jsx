import Navbar from '../components/public/Navbar'
import HeroSection from '../components/public/HeroSection'
import RoomSection from '../components/public/RoomSection'
import FacilitySection from '../components/public/FacilitySection'
import TestimonialSection from '../components/public/TestimonialSection'
import ContactSection from '../components/public/ContactSection'

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