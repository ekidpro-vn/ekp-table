// Table
export interface ColumnsProps {
  enable: boolean;
  field: string;
  title: string;
}

export interface FilterProps {
  dataFilter: { FilterComponent: React.ReactElement }[];
}

export interface TableProps {
  prefix?: string;
  loader: Loader<any, Record<string, unknown>>;
  columns: ColumnsProps[];
  Wrapper?: React.FC<Record<string, unknown>>;
}

export interface HeaderProps {
  columns: ColumnsProps[];
}

export interface BodyProps {
  data: unknown;
  columns: ColumnsProps[];
  loader: Loader<any, Record<string, unknown>>;
}

// Pagination
export interface PageSizeDropdownProps {
  pagination: DataPagination;
  dataPageSize: { value: number; label: string }[];
  prefix: string;
}

export interface PageNumberProps {
  page: number;
  selected?: boolean;
  disable?: boolean;
  special?: 'first' | 'prev' | 'next' | 'last';
  onClick?: (e: React.MouseEvent<HTMLLIElement, MouseEvent>) => void;
}

export interface PaginationUIProps {
  data: Pagination<unknown> | null;
  prefix: string;
}

// Loader
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
