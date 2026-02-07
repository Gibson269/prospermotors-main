import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Car } from '@/types/car';

export const useCars = (options?: {
  featured?: boolean;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  transmission?: string;
  fuelType?: string;
  year?: number;
  limit?: number;
}) => {
  const query = useQuery({
    queryKey: [
      'cars',
      options?.featured,
      options?.brand,
      options?.minPrice,
      options?.maxPrice,
      options?.transmission,
      options?.fuelType,
      options?.year,
      options?.limit,
    ],
    queryFn: async () => {
      console.log('Fetching cars with options:', options);
      let query = supabase
        .from('cars')
        .select('*')
        .order('created_at', { ascending: false });

      if (options?.featured) {
        query = query.eq('is_featured', true);
      }

      if (options?.brand) {
        query = query.eq('brand', options.brand);
      }

      if (options?.minPrice) {
        query = query.gte('price', options.minPrice);
      }

      if (options?.maxPrice) {
        query = query.lte('price', options.maxPrice);
      }

      if (options?.transmission) {
        query = query.eq('transmission', options.transmission);
      }

      if (options?.fuelType) {
        query = query.eq('fuel_type', options.fuelType);
      }

      if (options?.year) {
        query = query.eq('year', options.year);
      }

      if (options?.limit) {
        query = query.limit(options.limit);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching cars:', error);
        throw error;
      }
      
      console.log('Successfully fetched cars:', data);
      return data as Car[];
    },
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  // Real-time subscription for automatic data refresh
  useEffect(() => {
    const channel = supabase
      .channel('cars_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'cars' },
        () => {
          query.refetch();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [query]);

  return query;
};

export const useCar = (id: string) => {
  return useQuery({
    queryKey: ['car', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cars')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;
      return data as Car | null;
    },
    enabled: !!id,
  });
};

export const useCarBrands = () => {
  return useQuery({
    queryKey: ['car-brands'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cars')
        .select('brand')
        .order('brand');

      if (error) throw error;
      
      const brands = [...new Set(data.map(car => car.brand))];
      return brands;
    },
  });
};
