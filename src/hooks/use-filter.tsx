import queryString from 'query-string';
import { useCallback } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

type StringOrArray = string | string[];

function useGetFilterOnHooks(prefix = '', key?: string): Record<string, StringOrArray> | StringOrArray {
  const location = useLocation();
  const currentSearch = queryString.parse(location.search);
  const filter: Record<string, string | string[]> = {};

  for (const [key, value] of Object.entries(currentSearch)) {
    if (!key.startsWith(prefix)) {
      continue;
    }

    const filterKey = prefix === '' ? key : key.replace(`${prefix}_`, '');

    if (['page', 'size', 'sort'].includes(filterKey)) {
      continue;
    }

    filter[filterKey] = value;
  }

  if (key) {
    return filter[key];
  }

  console.log(300, filter);

  return filter;
}

function useUpdateFilterOnHooks(prefix = '') {
  const history = useHistory();

  const setFilter = useCallback(
    (params: Record<string, string | string[] | undefined>) => {
      const parsed = queryString.parse(window.location.search);

      for (const [key, value] of Object.entries(params)) {
        const urlQueryName = prefix !== '' ? `${prefix}_${key}` : key;
        const tmp = parsed[urlQueryName];
        if (typeof tmp === 'undefined' || tmp === null) {
          parsed[urlQueryName] = value || null;
          continue;
        }

        // if we have an array, we will append to it
        if (Array.isArray(tmp)) {
          parsed[urlQueryName] = [...tmp, value];
          continue;
        }

        // change param to array
        parsed[urlQueryName] = [tmp, value];
      }

      history.push({
        pathname: window.location.pathname,
        search: queryString.stringify(parsed),
      });
    },
    [history, prefix]
  );

  return setFilter;
}

export const useTableFilter = (
  prefix = '',
  key?: string
): [ReturnType<typeof useGetFilterOnHooks>, ReturnType<typeof useUpdateFilterOnHooks>] => {
  const getValue = useGetFilterOnHooks(prefix, key);
  const setValue = useUpdateFilterOnHooks(prefix);
  return [getValue, setValue];
};

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

export function getFilter(prefix: string, parsed: queryString.ParsedQuery<string>): Record<string, unknown> {
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
}
