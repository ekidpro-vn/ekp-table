import queryString from 'query-string';
import { useCallback } from 'react';
import { useHistory } from 'react-router-dom';

export const useFilter = (prefix: string): ((params: Record<string, string | undefined>) => void) => {
  const history = useHistory();

  return useCallback(
    (params: Record<string, string | undefined>) => {
      const parsed = queryString.parse(window.location.search);

      for (const [key, value] of Object.entries(params)) {
        parsed[`${prefix}_${key}`] = value || null;
      }

      history.push({
        pathname: window.location.pathname,
        search: queryString.stringify(parsed),
      });
    },
    [history, prefix]
  );
};
