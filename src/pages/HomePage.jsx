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
  const { data: rooms, isLoading: roomsLoading } = useRooms()
  const { data: facilities, isLoading: facilitiesLoading } = useFacilities()
  const { data: testimonials, isLoading: testimonialsLoading } = useTestimonials()
  const { data: settings } = useSettings()

  return (
    <div>
      <Navbar />
      <HeroSection settings={settings} />
      <RoomSection rooms={rooms} isLoading={roomsLoading} />
      <FacilitySection facilities={facilities} isLoading={facilitiesLoading} />
      <TestimonialSection testimonials={testimonials} isLoading={testimonialsLoading} />
      <ContactSection settings={settings} />
    </div>
  )
}