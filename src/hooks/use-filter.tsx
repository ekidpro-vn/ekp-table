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

  return filter;
}

function useUpdateFilterOnHooks(prefix = '', filterKey?: string) {
  const history = useHistory();
  const { search } = useLocation();

  const setFilter = useCallback(
    (params: string | string[] | Record<string, string | string[] | undefined> | undefined) => {
      let parsed = queryString.parse(search);

      // Clear all filter
      if (typeof params === 'undefined') {
        if (typeof filterKey !== 'undefined') {
          // delete 1 field
          const key = prefix === '' ? filterKey : `${prefix}_${filterKey}`;
          parsed[key] = undefined;
        } else {
          // delete all
          parsed = {};
        }

        history.push({
          pathname: window.location.pathname,
          search: queryString.stringify(parsed),
        });

        return;
      }

      // update 1 field values
      if (typeof params === 'string' || Array.isArray(params)) {
        if (typeof filterKey === 'undefined') {
          console.warn(`You can't set value for filter without specific a key. Do nothing to prevent crash`);
          return;
        }

        const key = prefix === '' ? filterKey : `${prefix}_${filterKey}`;
        parsed[key] = params;

        history.push({
          pathname: window.location.pathname,
          search: queryString.stringify(parsed),
        });

        return;
      }

      // update for object
      for (const [key, value] of Object.entries(params)) {
        const urlQueryName = prefix !== '' ? `${prefix}_${key}` : key;

        if (typeof value === 'undefined') {
          // clear key
          parsed[urlQueryName] = undefined;
          continue;
        }

        // we clear all previous filter to add new filter
        // we already think about append data to current search
        // but it seem a bad solution with a lot of state on append/replace
        // maybe we can do it in the future with below code
        parsed[urlQueryName] = value;

        // const tmp = parsed[urlQueryName];
        // if (typeof tmp === 'undefined' || tmp === null) {
        //   parsed[urlQueryName] = value;
        //   continue;
        // }

        // const arrValue = Array.isArray(value) ? value : [value];

        // // if we have an array, we will append to it
        // if (Array.isArray(tmp)) {
        //   parsed[urlQueryName] = [...tmp, ...arrValue];
        //   continue;
        // }

        // // change param to array
        // parsed[urlQueryName] = [tmp, ...arrValue];
      }

      history.push({
        pathname: window.location.pathname,
        search: queryString.stringify(parsed),
      });
    },
    [history, prefix, filterKey, search]
  );

  return setFilter;
}

export const useTableFilter = (
  prefix = '',
  key?: string
): [ReturnType<typeof useGetFilterOnHooks>, ReturnType<typeof useUpdateFilterOnHooks>] => {
  const getValue = useGetFilterOnHooks(prefix, key);
  const setValue = useUpdateFilterOnHooks(prefix, key);
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
