// hook/use-properties.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useCallback, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { propertyService } from '@/services/property';
import type { Property, PropertyFilters } from '@/types/property';
import { useDebounce } from './use-debounce';
import useSettingsStore from '@/global-store/settings';
import useAddressStore from '@/global-store/address';
import { error, success } from '@/components/alert';
import type { Paginate, DefaultResponse } from '@/types/global';

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
  const { t } = useTranslation();
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

  const buildQueryParams = useCallback(() => {
    const params: Record<string, any> = {
      ...filters,
      lang: language?.locale,
      currency_id: currency?.id,
      region_id: country?.region_id,
    };

    if (debouncedSearch) {
      params.keyword = debouncedSearch;
    }

    Object.keys(params).forEach(key => {
      if (params[key] === undefined || params[key] === null || params[key] === '') {
        delete params[key];
      }
    });

    return params;
  }, [filters, language, currency, country, debouncedSearch]);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    setFilters(prev => ({
      ...prev,
      keyword: debouncedSearch || undefined,
      page: 1
    }));
  }, [debouncedSearch]);

  const queryKey = ['properties', type, buildQueryParams()];
  
  const { 
    data, 
    isLoading, 
    isFetching,
    error: queryError,
    refetch
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
          if (!propertyId) throw new Error(t('property.similar.required'));
          return propertyService.getSimilar(propertyId, params);
        default:
          return propertyService.search(params);
      }
    },
    enabled: enabled && (type !== 'similar' || !!propertyId),
    keepPreviousData: true,
    staleTime: 5 * 60 * 1000,
  });

  const getProperty = useCallback((uuid: string) => {
    return propertyService.getByUuid(uuid, {
      lang: language?.locale,
      currency_id: currency?.id,
      region_id: country?.region_id,
    });
  }, [language, currency, country]);

  const getStats = useCallback(() => {
    return propertyService.getMyStats({
      lang: language?.locale,
      currency_id: currency?.id,
    });
  }, [language, currency]);

  const handleSearch = useCallback((search: string) => {
    setSearchInput(search);
  }, []);

  const handleFilterChange = useCallback((newFilters: Partial<PropertyFilters>) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters,
      page: 1
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
    properties: data?.data || [],
    paginateInfo: data,
    total: data?.meta?.total || 0,
    currentPage: data?.meta?.current_page || 1,
    lastPage: data?.meta?.last_page || 1,
    perPage: data?.meta?.per_page || 10,
    isLoading,
    isFetching,
    filters,
    searchInput,
    handleSearch,
    handleFilterChange,
    handlePageChange,
    handleSortChange,
    handlePageSizeChange,
    resetFilters,
    refresh,
    refetch,
    getProperty,
    getStats,
    error: queryError,
  };
};

// ============== MUTATION HOOKS ==============

/**
 * Hook tạo mới property
 */
export const useCreateProperty = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const queryClient = useQueryClient();
  
  const mutation = useMutation({
    mutationFn: async (formData: FormData) => {
      return propertyService.create(formData);
    },
    onSuccess: (response) => {
      success(t('property.created.success'));
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      queryClient.invalidateQueries({ queryKey: ['user-properties'] });
      router.push('/dashboard/my-properties');
    },
    onError: (err: any) => {
      const errorMessage = err?.message || t('property.created.error');
      error(errorMessage);
    },
  });
  
  return {
    createProperty: mutation.mutate,
    isCreating: mutation.isLoading,
    error: mutation.error,
  };
};

/**
 * Hook cập nhật property
 */
export const useUpdateProperty = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const queryClient = useQueryClient();
  
  const mutation = useMutation({
    mutationFn: async ({ id, formData }: { id: number; formData: FormData }) => {
      return propertyService.update(id, formData);
    },
    onSuccess: (_, variables) => {
      success(t('property.updated.success'));
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      queryClient.invalidateQueries({ queryKey: ['property', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['user-properties'] });
      router.push('/dashboard/my-properties');
    },
    onError: (err: any) => {
      const errorMessage = err?.message || t('property.updated.error');
      error(errorMessage);
    },
  });
  
  return {
    updateProperty: mutation.mutate,
    isUpdating: mutation.isLoading,
    error: mutation.error,
  };
};

/**
 * Hook xóa property
 */
export const useDeleteProperty = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  
  const mutation = useMutation({
    mutationFn: async (ids: number[]) => {
      return propertyService.delete(ids);
    },

    onSuccess: () => {
      success(t('property.deleted.success'));
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      queryClient.invalidateQueries({ queryKey: ['user-properties'] });
    },
    onError: (err: any) => {
      const errorMessage = err?.message || t('property.deleted.error');
      error(errorMessage);
    },
  });
  
  return {
    deleteProperty: mutation.mutate,
    isDeleting: mutation.isLoading,
    error: mutation.error,
  };
};

/**
 * Hook toggle featured status
 */
export const useToggleFeatured = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  
  const mutation = useMutation({
    mutationFn: async (id: number) => {
      return propertyService.toggleFeatured(id);
    },
    onSuccess: () => {
      success(t('property.featured.toggled'));
      queryClient.invalidateQueries({ queryKey: ['properties'] });
    },
    onError: (err: any) => {
      const errorMessage = err?.message || t('property.featured.error');
      error(errorMessage);
    },
  });
  
  return {
    toggleFeatured: mutation.mutate,
    isToggling: mutation.isLoading,
  };
};

/**
 * Hook toggle VIP status
 */
export const useToggleVip = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  
  const mutation = useMutation({
    mutationFn: async ({ id, days }: { id: number; days?: number }) => {
      return propertyService.toggleVip(id, days);
    },
    onSuccess: () => {
      success(t('property.vip.toggled'));
      queryClient.invalidateQueries({ queryKey: ['properties'] });
    },
    onError: (err: any) => {
      const errorMessage = err?.message || t('property.vip.error');
      error(errorMessage);
    },
  });
  
  return {
    toggleVip: mutation.mutate,
    isToggling: mutation.isLoading,
  };
};

// ============== SPECIALIZED HOOKS ==============

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

// ============== SINGLE PROPERTY HOOK ==============

export const useProperty = (uuid: string) => {
  const language = useSettingsStore((state) => state.selectedLanguage);
  const currency = useSettingsStore((state) => state.selectedCurrency);
  const country = useAddressStore((state) => state.country);
  
  return useQuery<DefaultResponse<Property>>({
    queryKey: ['property', uuid, language?.locale, currency?.id, country?.region_id],
    queryFn: () => propertyService.getByUuid(uuid, {
      lang: language?.locale,
      currency_id: currency?.id,
      region_id: country?.region_id,
    }),
    enabled: !!uuid,
  });
};

/**
 * Hook lấy chi tiết property để edit (bao gồm translations)
 */
export const usePropertyForEdit = (uuid: string) => {
  const language = useSettingsStore((state) => state.language);
  const currency = useSettingsStore((state) => state.currency);
  //const country = useAddressStore((state) => state.country);
  
  return useQuery<DefaultResponse<Property>>({
    queryKey: ['property-edit', uuid, language?.locale, currency?.id],
    queryFn: () => propertyService.getPropertyForEdit(uuid, {
      lang: language?.locale,
      currency_id: currency?.id
    }),
    enabled: !!uuid,
    staleTime: 0, // Don't cache for edit form
  });
};