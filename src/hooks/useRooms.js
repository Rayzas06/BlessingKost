import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'

export function useRooms() {
  return useQuery({
    queryKey: ['rooms'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('room_types')
        .select('*')
        .order('sort_order')
      if (error) throw error
      return data
    },
  })
}