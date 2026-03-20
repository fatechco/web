// hook/use-properties.ts
import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { useState, useCallback, useEffect, useRef } from 'react';
import { propertyService } from '@/services/property';
import { Property, PropertyFilters } from '@/types/property';
import { useDebounce } from './use-debounce';
import { useSettings } from './use-settings';
import useSettingsStore from '@/global-store/settings';
import useAddressStore from '@/global-store/address';
import { error, success } from '@/components/alert';
import { Paginate } from '@/types/global';

interface UsePropertiesProps {
  initialFilters?: PropertyFilters;
  enabled?: boolean;
  type?: 'public' | 'user' | 'featured' | 'vip' | 'similar';
  propertyId?: number;
}

export const useProperties = ({ 
  initialFilters = {}, 
  enabled = true,
  type = 'public',
  propertyId
}: UsePropertiesProps = {}) => {
  const queryClient = useQueryClient();
  
  const language = useSettingsStore((state) => state.selectedLanguage);
  const currency = useSettingsStore((state) => state.selectedCurrency);
  const country = useAddressStore((state) => state.country);
  
  const [filters, setFilters] = useState<PropertyFilters>({
    page: 1,
    per_page: 10,
    sort_by: 'newest',
    ...initialFilters
  });

  const [searchInput, setSearchInput] = useState(filters.keyword || '');
  const isFirstRender = useRef(true);
  const debouncedSearch = useDebounce(searchInput, 500);

  // Build query params with lang, currency, region
  const buildQueryParams = useCallback(() => {
    const params: Record<string, any> = {
      ...filters,
      lang: language?.locale,
      currency_id: currency?.id
    };

    // Add search if present
    if (debouncedSearch) {
      params.keyword = debouncedSearch;
    }

    return params;
  }, [filters, language, currency, debouncedSearch]);

  // Update filters when debounced search changes
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    setFilters(prev => ({
      ...prev,
      keyword: debouncedSearch || undefined,
      page: 1 // Reset page when searching
    }));
  }, [debouncedSearch]);

  // Main query based on type
  const queryKey = ['properties', type, buildQueryParams()];
  
  const { 
    data, 
    isLoading, 
    isFetching,
    error: queryError,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useQuery<Paginate<Property>>({
    queryKey,
    queryFn: async () => {
      const params = buildQueryParams();
      
      switch (type) {
        case 'user':
          return propertyService.getMyProperties(params);
        case 'featured':
          return propertyService.getFeatured(params);
        case 'vip':
          return propertyService.getVip(params);
        case 'similar':
          if (!propertyId) throw new Error('Property ID required for similar properties');
          return propertyService.getSimilar(propertyId, params);
        default:
          return propertyService.search(params);
      }
    },
    enabled: enabled && (type !== 'similar' || !!propertyId),
    keepPreviousData: true,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Get property by UUID
  const useGetProperty = (uuid: string, options?: { enabled?: boolean }) => {
    return useQuery({
      queryKey: ['property', uuid, locale, currency?.id, country?.region_id],
      queryFn: () => propertyService.getByUuid(uuid, {
        lang: locale,
        currency_id: currency?.id,
        region_id: country?.region_id,
      }),
      enabled: options?.enabled !== false && !!uuid,
    });
  };

  // Get user stats
  const useStats = () => {
    return useQuery({
      queryKey: ['property-stats', locale, currency?.id],
      queryFn: () => propertyService.getMyStats({
        lang: locale,
        currency_id: currency?.id,
      }),
    });
  };

  // Create mutation
  const createMutation = useMutation({
    mutationFn: (data: FormData) => propertyService.create(data),
    onSuccess: () => {
      success('Property created successfully');
      queryClient.invalidateQueries({ queryKey: ['properties', 'user'] });
    },
    onError: (err: Error) => {
      error(err.message);
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: FormData }) => 
      propertyService.update(id, data),
    onSuccess: () => {
      success('Property updated successfully');
      queryClient.invalidateQueries({ queryKey: ['properties', 'user'] });
    },
    onError: (err: Error) => {
      error(err.message);
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (ids: number[]) => propertyService.delete(ids),
    onSuccess: () => {
      success('Properties deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['properties', 'user'] });
    },
    onError: (err: Error) => {
      error(err.message);
    },
  });

  // Toggle featured
  const toggleFeaturedMutation = useMutation({
    mutationFn: (id: number) => propertyService.toggleFeatured(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
    },
  });

  // Toggle VIP
  const toggleVipMutation = useMutation({
    mutationFn: ({ id, days }: { id: number; days?: number }) => 
      propertyService.toggleVip(id, days),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
    },
  });

  // Actions
  const handleSearch = useCallback((search: string) => {
    setSearchInput(search);
  }, []);

  const handleFilterChange = useCallback((newFilters: Partial<PropertyFilters>) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters,
      page: 1 // Reset page when filters change
    }));
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setFilters(prev => ({ ...prev, page }));
  }, []);

  const handleSortChange = useCallback((sort_by: string) => {
    setFilters(prev => ({ ...prev, sort_by, page: 1 }));
  }, []);

  const handlePageSizeChange = useCallback((per_page: number) => {
    setFilters(prev => ({ ...prev, per_page, page: 1 }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({
      page: 1,
      per_page: 10,
      sort_by: 'newest',
    });
    setSearchInput('');
  }, []);

  const refresh = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['properties', type] });
  }, [queryClient, type]);

  return {
    // Data
    properties: data?.data || [],
    paginateInfo: data,
    total: data?.meta?.total || 0,
    currentPage: data?.meta?.current_page || 1,
    lastPage: data?.meta?.last_page || 1,
    perPage: data?.meta?.per_page || 10,
    
    // Loading states
    isLoading,
    isFetching,
    isFetchingNextPage,
    hasNextPage,
    isCreating: createMutation.isLoading,
    isUpdating: updateMutation.isLoading,
    isDeleting: deleteMutation.isLoading,
    
    // Filters state
    filters,
    searchInput,
    
    // Actions
    handleSearch,
    handleFilterChange,
    handlePageChange,
    handleSortChange,
    handlePageSizeChange,
    resetFilters,
    
    // Mutations
    createProperty: createMutation.mutate,
    updateProperty: updateMutation.mutate,
    deleteProperties: deleteMutation.mutate,
    toggleFeatured: toggleFeaturedMutation.mutate,
    toggleVip: toggleVipMutation.mutate,
    
    // Utilities
    refresh,
    refetch,
    fetchNextPage,
    
    // Hooks
    useGetProperty,
    useStats,
    
    // Error
    error: queryError,
  };
};

// Specialized hooks for different use cases
export const usePublicProperties = (filters?: PropertyFilters) => {
  return useProperties({ initialFilters: filters, type: 'public' });
};

export const useUserProperties = (filters?: PropertyFilters) => {
  return useProperties({ initialFilters: filters, type: 'user' });
};

export const useFeaturedProperties = (filters?: PropertyFilters) => {
  return useProperties({ initialFilters: filters, type: 'featured' });
};

export const useVipProperties = (filters?: PropertyFilters) => {
  return useProperties({ initialFilters: filters, type: 'vip' });
};

export const useSimilarProperties = (propertyId: number, filters?: PropertyFilters) => {
  return useProperties({ 
    initialFilters: filters, 
    type: 'similar', 
    propertyId,
    enabled: !!propertyId 
  });
};

// Hook for single property
export const useProperty = (uuid: string) => {
  const { useGetProperty } = useProperties();
  return useGetProperty(uuid);
};