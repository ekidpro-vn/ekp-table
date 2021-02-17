import React from 'react';

export interface Pagination<T> {
  data: T[];
  pagination: {
    currentPage: number;
    perPage: number;
    totalItems: number;
    totalPages: number;
  };
}

export interface DataPagination {
  currentPage: number;
  perPage: number;
  totalItems: number;
  totalPages: number;
}

export interface FetchProps<Filter> {
  url: string;
  page: number;
  size: number;
  filter: Filter;
}

export interface Loader<Result, Filter> {
  url?: string;
  fetch: (input: FetchProps<Filter>) => Promise<Pagination<Result>>;
  render: (data: Result, field: keyof Result) => React.ReactElement;
}
