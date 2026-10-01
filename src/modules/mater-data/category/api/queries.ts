import { useQuery } from '@tanstack/react-query';
import { getCategories, getCategoryById } from './resolver';
import type { GetCategoriesParams, CategoryListItem, Category } from '../types';
import type { ApiList } from '../../../../shared/types';

export function useCategoryListQuery(params: GetCategoriesParams) {
  return useQuery<ApiList<CategoryListItem>>({
    queryKey: ['categories', params],
    queryFn: () => getCategories({ ...params, page: (params.page ?? 1) - 1 }),
    placeholderData: (prev) => prev,
  });
}

export function useCategoryDetailQuery(id?: string) {
  return useQuery<Category>({
    queryKey: ['category', id],
    queryFn: () => getCategoryById(id!),
    enabled: !!id,
  });
}
