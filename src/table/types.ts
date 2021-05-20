// Table

export interface SortIconProps {
  prefix: string;
  field: string;
}
export interface ColumnsProps {
  field: string;
  title: string | React.ReactElement | React.FC;
  canSort?: boolean;
}

export interface FilterProps {
  gridClassName?: string;
  colClassName?: string;
  ListFilterComponent: { FilterComponent: React.ReactElement | React.FC }[];
}

export interface TableProps<Result> {
  prefix?: string;
  loader: Loader<Result, Record<string | symbol, unknown>>;
  columns: ColumnsProps[];
  Wrapper?: React.FC<Record<string, unknown>>;
  render?: (data: Result, column: ColumnsProps) => React.ReactElement;
}

export interface HeaderProps {
  columns: ColumnsProps[];
  prefix?: string;
}

export interface BodyProps<Result> {
  data: Result[];
  columns: ColumnsProps[];
  render?: (data: Result, column: ColumnsProps) => React.ReactElement;
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
  page: number;
  size: number;
  filter: Filter;
  sort?: Record<string, 'none' | 'asc' | 'desc'>;
}

export interface Loader<Result, Filter> {
  fetch: (input: FetchProps<Filter>) => Promise<Pagination<Result>>;
  cancel?: () => void;
}
