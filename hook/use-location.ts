// hook/use-location.ts
import { useQuery } from "@tanstack/react-query";
import useSettingsStore from "@/global-store/settings";
import { locationService } from "@/services/location";
import { Country, Province, District, Ward } from "@/types/location";
import { Paginate } from "@/types/global";

/**
 * Hook lấy danh sách countries
 */
export const useCountries = (params?: { search?: string; active?: boolean }) => {

  const language = useSettingsStore((state) => state.selectedLanguage);
  
  const { data, isLoading, error, refetch } = useQuery<Paginate<Country>>({
    queryKey: ['countries', params || language?.locale],
    queryFn: () => locationService.getCountries({
      lang: language?.locale,
      ...params,
    }),
    staleTime: 24 * 60 * 60 * 1000,
  });
  
  return {
    countries: data?.data || [], // Lấy data từ wrapper
    meta: data?.meta,
    isLoading,
    error,
    refetch,
  };
};

/**
 * Hook lấy danh sách provinces theo country_id
 */
export const useProvinces = (countryId?: number, params?: { search?: string; active?: boolean }) => {
  const language = useSettingsStore((state) => state.selectedLanguage);
  
  const { data, isLoading, error, refetch } = useQuery<Paginate<Province>>({
    queryKey: ['provinces', countryId, params, language?.locale],
    queryFn: () => locationService.getProvinces(countryId!, {
      lang: language?.locale,
      ...params,
    }),
    enabled: !!countryId,
    staleTime: 24 * 60 * 60 * 1000,
  });
  
  return {
    provinces: data?.data || [], // Lấy data từ wrapper
    meta: data?.meta,
    isLoading,
    error,
    refetch,
  };
};

/**
 * Hook lấy danh sách districts theo province_id
 */
export const useDistricts = (provinceId?: number, params?: { search?: string; active?: boolean }) => {

  const language = useSettingsStore((state) => state.selectedLanguage);
  
  const { data, isLoading, error, refetch } = useQuery<Paginate<District>>({
    queryKey: ['districts', provinceId, params, language?.locale],
    queryFn: () => locationService.getDistricts(provinceId!, {
      lang: language?.locale,
      ...params,
    }),
    enabled: !!provinceId,
    staleTime: 24 * 60 * 60 * 1000,
  });
  
  return {
    districts: data?.data || [], // Lấy data từ wrapper
    meta: data?.meta,
    isLoading,
    error,
    refetch,
  };
};

/**
 * Hook lấy danh sách wards theo district_id
 */
export const useWards = (districtId?: number, params?: { search?: string; active?: boolean }) => {
 
  const language = useSettingsStore((state) => state.selectedLanguage);
  
  const { data, isLoading, error, refetch } = useQuery<Paginate<Ward>>({
    queryKey: ['wards', districtId, params, language?.locale],
    queryFn: () => locationService.getWards(districtId!, {
      lang: language?.locale,
      ...params,
    }),
    enabled: !!districtId,
    staleTime: 24 * 60 * 60 * 1000,
  });
  
  return {
    wards: data?.data || [], // Lấy data từ wrapper
    meta: data?.meta,
    isLoading,
    error,
    refetch,
  };
};