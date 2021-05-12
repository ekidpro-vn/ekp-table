import queryString from 'query-string';
import { useCallback } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

export type SortValue = 'asc' | 'desc' | 'none';

const getSort = (prefix: string, field: string, location: any) => {
  const parsed = queryString.parse(location.search);

  if (!parsed.sort) {
    return 'none';
  }

  let currentValue: SortValue = 'none';

  if (Array.isArray(parsed.sort)) {
    console.warn('Duplicate "sort" param on URL. The sorted value is taken by the first "sort" parameter.');
  }

  const arraySorting = Array.isArray(parsed.sort) ? parsed.sort[0].split(',') : parsed.sort.split(',');
  const elementSorting = arraySorting.find((item) => item.includes(`${prefix}:${field}`)); // prefix1:name+asc || undefined

  if (typeof elementSorting === 'undefined' || elementSorting === null) {
    return currentValue;
  }

  const valueSorting = elementSorting.split('+')[1] ?? '';

  if (!['asc', 'desc', 'none'].includes(valueSorting)) {
    return 'none';
  }
  currentValue = valueSorting as SortValue; // TODO: tìm cách bỏ as

  return currentValue;
};

const setSort = (newValue: SortValue, prefix: string, field: string, history: any, location: any) => {
  const parsed = queryString.parse(location.search);
  const newSort = `${prefix}:${field}+${newValue}`;

  if (!parsed.sort) {
    parsed.sort = newSort;
    history.replace({
      pathname: location.pathname,
      search: queryString.stringify(parsed),
    });
    return;
  }

  if (Array.isArray(parsed.sort)) {
    console.warn('Duplicate "sort" param on URL. The sorted value is taken by the first "sort" parameter.');
  }

  const arraySorting = Array.isArray(parsed.sort) ? parsed.sort[0].split(',') : parsed.sort.split(',');
  const newArraySorting: string[] = [];
  let checkExistField = false;

  for (let i = 0; i < arraySorting.length; i++) {
    if (arraySorting[i].includes(`${prefix}:${field}`)) {
      checkExistField = true;
      newArraySorting.push(newSort);
    } else {
      newArraySorting.push(arraySorting[i]);
    }
  }

  parsed.sort = checkExistField ? newArraySorting.join(',') : `${parsed.sort},${newSort}`;

  history.replace({
    pathname: location.pathname,
    search: queryString.stringify(parsed),
  });
};

export const useSort = (prefix: string, field: string): [value: SortValue, setValue: (newValue: SortValue) => void] => {
  const location = useLocation();
  const tmp = getSort(prefix, field, location);
  const history = useHistory();

  const setSortValue = useCallback((newValue: SortValue) => setSort(newValue, prefix, field, history, location), [
    field,
    history,
    prefix,
    location,
  ]);

  return [tmp, setSortValue];
};

export const parsedSort = (prefix: string, sort: string | string[]): Record<string, SortValue> => {
  if (Array.isArray(sort)) {
    console.warn('Duplicate "sort" param on URL. The sorted value is taken by the first "sort" parameter.');
  }

  let objectSort: Record<string, SortValue> = {};
  const arraySorting = Array.isArray(sort) ? sort[0].split(',') : sort.split(',');

  objectSort = arraySorting.reduce((prev, curr) => {
    const data: Record<string, SortValue> = {}; // prefix:fullname+asc
    const arrayPrefixSort = curr.split(':');

    if (arrayPrefixSort[0] === prefix) {
      const arrayFieldValue = arrayPrefixSort[1].split('+');

      if (!['asc', 'desc', 'none'].includes(arrayFieldValue[1])) {
        console.warn('Invalid "sort" value on URL.');
        data[`${arrayFieldValue[0]}`] = 'none';
      } else {
        data[`${arrayFieldValue[0]}`] = arrayFieldValue[1] as SortValue;
      }
    }
    return { ...prev, ...data };
  }, {});

  return objectSort;
};
