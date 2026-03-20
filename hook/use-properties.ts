import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { propertyService } from '@/services/property';
import { error, success } from '@/components/alert';
import type { PropertyFilters } from '@/types/property';

export const useProperties = (initialFilters: PropertyFilters = {}) => {
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState<PropertyFilters>({
    page: 1,
    limit: 10,
    ...initialFilters
  });

  // Query get properties with filters
  const { 
    data, 
    isLoading, 
    isFetching,
    error: queryError,
    refetch 
  } = useQuery({
    queryKey: ['properties', filters],
    queryFn: () => propertyService.getMyProperties(filters),
    // keep previous data while fetching new data to prevent empty state
    keepPreviousData: true,
    // Time cache 5 minutes
    staleTime: 5 * 60 * 1000,
  });

  // Mutation xóa property
  const deleteMutation = useMutation({
    mutationFn: (id: number) => propertyService.deleteProperty(id),
    onSuccess: () => {
      success('Property deleted successfully');
      // Invalidate và refetch properties
      queryClient.invalidateQueries({ queryKey: ['properties'] });
    },
    onError: (err: Error) => {
      error(err.message);
    },
  });

  // Mutation update property
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<any> }) =>
      propertyService.updateProperty(id, data),
    onSuccess: () => {
      success('Property updated successfully');
      queryClient.invalidateQueries({ queryKey: ['properties'] });
    },
    onError: (err: Error) => {
      error(err.message);
    },
  });

  const handleSearch = (search: string) => {
    setFilters(prev => ({ ...prev, search, page: 1 }));
  };

  const handleSort = (sortBy: string) => {
    setFilters(prev => ({ ...prev, sortBy, page: 1 }));
  };

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
  };

  return {
    // Data
    properties: data?.data || [],
    totalPages: data?.totalPages || 1,
    currentPage: data?.page || 1,
    total: data?.total || 0,
    
    // Loading states
    isLoading,        // first time loading
    isFetching,       // loading state for any refetch (including pagination, filters change)
    isDeleting: deleteMutation.isLoading,
    isUpdating: updateMutation.isLoading,
    
    // Actions
    handleSearch,
    handleSort,
    handlePageChange,
    deleteProperty: deleteMutation.mutate,
    updateProperty: updateMutation.mutate,
    
    // Utilities
    refetch,
    error: queryError,
  };
};