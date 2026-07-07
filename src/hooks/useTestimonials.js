import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'

export function useTestimonials() {
  return useQuery({
    queryKey: ['testimonials'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .order('created_at')
      if (error) throw error
      return data
    },
  })
}