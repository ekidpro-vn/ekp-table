import React from 'react';

export type ResultType = Record<string, any>;

export interface SortIconProps {
  prefix: string;
  field: string;
}

type FilterComponent = React.ReactElement | React.FC | JSX.Element;

export interface FilterProps {
  gridClassName?: string;
  colClassName?: string;
  FilterComponents: FilterComponent[];
}

export interface HeaderProps {
  columns: ColumnsProps[];
  prefix?: string;
}

// Pagination
export interface DataPagination {
  currentPage: number;
  perPage: number;
  totalItems: number;
  totalPages: number;
}

export interface PageSizeDropdownProps {
  pagination: DataPagination;
  dataPageSize: { value: number; label: string }[];
  onSelectSize: (size: number) => void;
}

export interface PageNumberProps {
  page: number;
  selected?: boolean;
  disable?: boolean;
  special?: 'first' | 'prev' | 'next' | 'last';
  onClick?: (e: React.MouseEvent<HTMLLIElement, MouseEvent>) => void;
}

export interface PaginationUIProps {
  data: Pagination<ResultType> | null;
  prefix: string;
}

// Table

export interface ColumnsProps {
  field: string;
  title: string | React.ReactElement | React.FC;
  canSort?: boolean;
  fixed?: 'left' | 'right';
}

export interface BodyProps<R> {
  data: R[];
  columns: ColumnsProps[];
  render?: (data: R, column: ColumnsProps) => JSX.Element | React.ReactElement;
}

export interface Pagination<R> {
  data: R[];
  pagination: {
    currentPage: number;
    perPage: number;
    totalItems: number;
    totalPages: number;
  };
}

export interface FetchProps<F> {
  page: number;
  size: number;
  filter: F;
  sort?: Record<string, 'none' | 'asc' | 'desc'>;
}

export interface Loader<R, F> {
  fetch: (input: FetchProps<F>) => Promise<Pagination<R>>;
  cancel?: () => void;
}

export interface TableProps<R> {
  prefix?: string;
  loader: Loader<R, Record<string, any>>;
  columns: ColumnsProps[];
  Wrapper?: React.FC<Record<string, unknown>>;
  render?: (data: R, column: ColumnsProps) => JSX.Element | React.ReactElement | null;
}
