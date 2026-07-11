import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'

export function useGallery() {
  return useQuery({
    queryKey: ['gallery'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('gallery_photos')
        .select('*')
        .order('sort_order')
      if (error) throw error
      return data
    }
  })
}