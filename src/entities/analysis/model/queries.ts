import { useQuery } from '@tanstack/react-query';
import { fetchAnalyses, fetchAnalysisById, type AnalysisFilters } from '../../../shared/lib/api';
import { queryKeys } from '../../../shared/lib/queryKeys';

export const useAnalyses = (filters: AnalysisFilters = {}) =>
  useQuery({
    queryKey: [...queryKeys.analyses, filters],
    queryFn: () => fetchAnalyses(filters),
  });

export const useAnalysisById = (id: string) =>
  useQuery({
    queryKey: queryKeys.analysis(id),
    queryFn: () => fetchAnalysisById(id),
  });
