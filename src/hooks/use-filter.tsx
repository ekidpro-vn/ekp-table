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

export const getFilter = (prefix: string, parsed: queryString.ParsedQuery<string>): Record<string, unknown> => {
  let pf = prefix ?? '';
  if (prefix && /^[-a-zA-Z_]+$/g.test(prefix) === false) {
    pf = '';
  }
  const filter: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(parsed)) {
    if (!key.startsWith(pf)) {
      continue;
    }
    const filterKey = key.replace(`${pf}_`, '');
    if (['page', 'size', 'sort'].includes(filterKey)) {
      continue;
    }
    filter[filterKey] = value;
  }
  return filter;
};
