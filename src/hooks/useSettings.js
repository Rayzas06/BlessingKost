import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'

export function useSettings() {
  return useQuery({
    queryKey: ['settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
      if (error) throw error
      // Ubah array [{key, value}] jadi object {key: value}
      return data.reduce((acc, item) => {
        acc[item.key] = item.value
        return acc
      }, {})
    },
  })
}