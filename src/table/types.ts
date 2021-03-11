import { Loader } from './loader';

export interface StructureProps {
  enable: boolean;
  field: string;
  titleLanguage: string;
}

export interface FilterProps {
  dataFilter: { FilterComponent: React.ReactElement }[];
}

export interface TableProps extends WrapperProps {
  prefix?: string;
  loader: Loader<any, Record<string, unknown>>;
  structure: StructureProps[];
  onRefresh?: () => void;
  Wrapper?: React.FC<WrapperProps>;
}

export interface WrapperProps {
  titleWrapper?: string | React.ReactElement;
  toolbarWrapper?: React.ReactElement;
}

export interface HeaderProps {
  structure: StructureProps[];
}

export interface BodyProps {
  data: unknown;
  structure: StructureProps[];
  loader: Loader<any, Record<string, unknown>>;
}
