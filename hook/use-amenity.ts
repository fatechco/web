// hook/use-amenity.ts
import { useQuery } from "@tanstack/react-query";

import useSettingsStore from "@/global-store/settings";
import { amenityService } from "@/services/amenity";
import { Amenity, AmenityFilters } from "@/types/amenity";
import { Paginate, DefaultResponse } from "@/types/global";

/**
 * Hook get list amenities (read-only)
 */
export const useAmenities = (filters?: AmenityFilters) => {
  const language = useSettingsStore((state) => state.selectedLanguage);
  
  const { data, isLoading, error, refetch } = useQuery<Paginate<Amenity>>({
    queryKey: ['amenities', filters, language?.locale],
    queryFn: () => amenityService.getAll({
      lang: language?.locale,
      ...filters,
    }),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
  
  return {
    amenities: data?.data || [],
    meta: data?.meta,
    isLoading,
    error,
    refetch,
  };
};

/**
 * Hook lấy chi tiết amenity
 */
export const useAmenity = (id: number) => {
  const { locale } = useLanguage();
  const language = useSettingsStore((state) => state.selectedLanguage);
  
  const { data, isLoading, error } = useQuery<DefaultResponse<Amenity>>({
    queryKey: ['amenity', id, locale || language?.locale],
    queryFn: () => amenityService.getById(id, {
      lang: locale || language?.locale,
    }),
    enabled: !!id,
  });
  
  return {
    amenity: data?.data,
    isLoading,
    error,
  };
};


/**
 * Hook lấy amenities phổ biến (most used)
 */
export const usePopularAmenities = (limit: number = 12) => {
  const { locale } = useLanguage();
  const language = useSettingsStore((state) => state.selectedLanguage);
  
  const { data, isLoading, error } = useQuery<Amenity[]>({
    queryKey: ['popular-amenities', limit, locale || language?.locale],
    queryFn: () => amenityService.getPopular(limit, {
      lang: locale || language?.locale,
    }),
  });
  
  return {
    amenities: data || [],
    isLoading,
    error,
  };
};


/**
 * Hook get amenities of a property
 */
export const usePropertyAmenities = (propertyId: number) => {
  const { locale } = useLanguage();
  const language = useSettingsStore((state) => state.selectedLanguage);
  
  const { data, isLoading, error, refetch } = useQuery<Amenity[]>({
    queryKey: ['property-amenities', propertyId, locale || language?.locale],
    queryFn: () => amenityService.getByPropertyId(propertyId, {
      lang: locale || language?.locale,
    }),
    enabled: !!propertyId,
  });
  
  return {
    amenities: data || [],
    isLoading,
    error,
    refetch,
  };
};

/**
 * Hook get amenities of a project
 */
export const useProjectAmenities = (projectId: number) => {
  const { locale } = useLanguage();
  const language = useSettingsStore((state) => state.selectedLanguage);
  
  const { data, isLoading, error, refetch } = useQuery<Amenity[]>({
    queryKey: ['project-amenities', projectId, locale || language?.locale],
    queryFn: () => amenityService.getByProjectId(projectId, {
      lang: locale || language?.locale,
    }),
    enabled: !!projectId,
  });
  
  return {
    amenities: data || [],
    isLoading,
    error,
    refetch,
  };
};
