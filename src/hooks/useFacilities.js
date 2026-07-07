import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'

export function useFacilities() {
  return useQuery({
    queryKey: ['facilities'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('facilities')
        .select('*')
        .order('sort_order')
      if (error) throw error
      return data
    },
  })
}