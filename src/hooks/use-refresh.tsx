import { useCallback } from 'react';
import { get } from '../store/loader-inventory';

export const useRefresh = (prefix?: string): (() => void) => {
  if (prefix === '') {
    console.warn(`Please provide the specific prefix for table`);
  }

  return useCallback(() => {
    const fetcher = get(prefix);

    if (fetcher.length > 0) {
      fetcher.forEach((f) => f());
    }
  }, [prefix]);
};
