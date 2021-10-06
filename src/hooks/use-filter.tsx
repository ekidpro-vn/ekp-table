import queryString from 'query-string';
import { useCallback } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { getParsed } from '../utils/helper';

export function useFilterParams(prefix = ''): Record<string, string[]> {
  const location = useLocation();
  const currentSearch = queryString.parse(location.search);
  const filter: Record<string, string[]> = {};

  for (const [key, value] of Object.entries(currentSearch)) {
    if (!key.startsWith(prefix)) {
      continue;
    }

    const filterKey = prefix === '' ? key : key.replace(`${prefix}_`, '');

    if (['page', 'size', 'sort'].includes(key)) {
      continue;
    }

    const valueInArray = Array.isArray(value) ? value : [value];

    if (typeof filter[filterKey] === 'undefined') {
      filter[filterKey] = valueInArray;
    } else {
      filter[filterKey] = [...filter[filterKey], ...valueInArray];
    }
  }

  // if (key) {
  //   return filter[key] as T extends string ? StringOrArray : Record<string, StringOrArray>;
  // }

  return filter;
}

function useUpdateFilterOnHooks(prefix = '', filterKey: string) {
  const history = useHistory();
  const { search } = useLocation();

  const setFilter = useCallback(
    (params: string[] | undefined) => {
      const parsed = queryString.parse(search);
      // Clear all filter
      if (typeof params === 'undefined') {
        const key = prefix === '' ? filterKey : `${prefix}_${filterKey}`;
        parsed[key] = undefined;

        history.push({
          pathname: window.location.pathname,
          search: queryString.stringify(getParsed(parsed)),
        });

        return;
      }

      const key = [prefix, filterKey].filter((o) => o !== '').join('_');
      const keyPage = [prefix, 'page'].filter((o) => o !== '').join('_');

      parsed[key] = params;
      parsed[keyPage] = '1';

      history.push({
        pathname: window.location.pathname,
        search: queryString.stringify(getParsed(parsed)),
      });
    },
    [history, prefix, filterKey, search]
  );

  return setFilter;
}

export const useTableFilter = (
  prefix = '',
  key: string
): [string[] | undefined, ReturnType<typeof useUpdateFilterOnHooks>] => {
  const total = useFilterParams(prefix);
  const setValue = useUpdateFilterOnHooks(prefix, key);
  const current = total[key];

  if (typeof current === 'undefined') {
    return [undefined, setValue];
  }

  return [current, setValue];
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
        search: queryString.stringify(getParsed(parsed)),
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
