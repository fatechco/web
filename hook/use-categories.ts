// hook/use-categories.ts
import { useQuery } from "@tanstack/react-query";
import useSettingsStore from "@/global-store/settings";
import { propertyCategoryService } from "@/services/property-category";
import { PropertyCategory } from "@/types/property-category";
import { Paginate, DefaultResponse } from "@/types/global";

/**
 * Hook lấy danh sách categories (flat list)
 */
export const useCategories = () => {
  
  const language = useSettingsStore((state) => state.selectedLanguage);
  
  const { data, isLoading, error, refetch } = useQuery<Paginate<PropertyCategory>>({
    queryKey: ['categories', language?.locale],
    queryFn: () => propertyCategoryService.getAll({
      lang: language?.locale,
       per_page: 999, // get all categories
    }),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
  
  return {
    categories: data?.data || [],
    meta: data?.meta,
    isLoading,
    error,
    refetch,
  };
};

/**
 * Hook lấy danh sách categories dạng tree (có cấu trúc cha-con)
 */
export const useCategoryTree = () => {

  const language = useSettingsStore((state) => state.selectedLanguage);
  
  const { data, isLoading, error, refetch } = useQuery<PropertyCategory[]>({
    queryKey: ['category-tree', language?.locale],
    queryFn: () => propertyCategoryService.getTree({
      lang: language?.locale,
    }),
    staleTime: 10 * 60 * 1000,
  });
  
  return {
    categories: data || [],
    isLoading,
    error,
    refetch,
  };
};

/**
 * Hook lấy chi tiết category theo slug
 */
export const useCategory = (slug: string) => {
 
  const language = useSettingsStore((state) => state.selectedLanguage);
  
  const { data, isLoading, error } = useQuery<DefaultResponse<PropertyCategory>>({
    queryKey: ['category', slug, language?.locale],
    queryFn: () => propertyCategoryService.getBySlug(slug, {
      lang: language?.locale,
    }),
    enabled: !!slug,
  });
  
  return {
    category: data?.data,
    isLoading,
    error,
  };
};

/**
 * Hook lấy chi tiết category theo ID
 */
export const useCategoryById = (id: number) => {
  const { locale } = useLanguage();
  const language = useSettingsStore((state) => state.selectedLanguage);
  
  const { data, isLoading, error } = useQuery<DefaultResponse<PropertyCategory>>({
    queryKey: ['category', id, locale || language?.locale],
    queryFn: () => propertyCategoryService.getById(id, {
      lang: locale || language?.locale,
    }),
    enabled: !!id,
  });
  
  return {
    category: data?.data,
    isLoading,
    error,
  };
};

/**
 * Hook lấy danh sách categories root (không có parent)
 */
export const useRootCategories = () => {
  const { locale } = useLanguage();
  const language = useSettingsStore((state) => state.selectedLanguage);
  
  const { data, isLoading, error } = useQuery<PropertyCategory[]>({
    queryKey: ['root-categories', locale || language?.locale],
    queryFn: () => propertyCategoryService.getRoot({
      lang: locale || language?.locale,
    }),
    staleTime: 10 * 60 * 1000,
  });
  
  return {
    categories: data || [],
    isLoading,
    error,
  };
};

/**
 * Hook lấy danh sách categories có tính năng filter cho dropdown
 */
export const useCategoryOptions = () => {
  const { categories, isLoading } = useCategories({ per_page: 100 });
  
  const options = categories.map(category => ({
    value: category.id,
    label: category.name,
  }));
  
  return {
    options,
    isLoading,
  };
};

/**
 * Hook lấy danh sách categories dạng nested options cho select
 */
export const useNestedCategoryOptions = () => {
  const { categories: tree, isLoading } = useCategoryTree();
  
  const flattenNested = (categories: PropertyCategory[], level: number = 0): any[] => {
    let result: any[] = [];
    
    categories.forEach(category => {
      result.push({
        value: category.id,
        label: '—'.repeat(level) + (level > 0 ? ' ' : '') + category.name,
        original: category,
      });
      
      if (category.children && category.children.length > 0) {
        result = [...result, ...flattenNested(category.children, level + 1)];
      }
    });
    
    return result;
  };
  
  return {
    options: flattenNested(tree),
    isLoading,
  };
};

/**
 * Hook get properties of category
 */
export const useCategoryProperties = (categoryId: number, filters?: any) => {
  const { locale } = useLanguage();
  const currency = useSettingsStore((state) => state.selectedCurrency);
  const language = useSettingsStore((state) => state.selectedLanguage);
  
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['category-properties', categoryId, filters, language?.locale, currency?.id],
    queryFn: () => propertyCategoryService.getProperties(categoryId, {
      lang: language?.locale,
      currency_id: currency?.id,
      ...filters,
    }),
    enabled: !!categoryId,
  });
  
  return {
    properties: data?.data || [],
    meta: data?.meta,
    isLoading,
    error,
    refetch,
  };
};

/**
 * Hook lấy thống kê categories
 */
export const useCategoryStatistics = () => {
  const { locale } = useLanguage();
  const language = useSettingsStore((state) => state.selectedLanguage);
  
  const { data, isLoading, error } = useQuery({
    queryKey: ['category-statistics', locale || language?.locale],
    queryFn: () => propertyCategoryService.getStatistics({
      lang: locale || language?.locale,
    }),
  });
  
  return {
    statistics: data,
    isLoading,
    error,
  };
};

