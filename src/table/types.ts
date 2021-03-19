import { Loader } from './loader';

export interface StructureProps {
  enable: boolean;
  field: string;
  titleLanguage: string;
}

export interface FilterProps {
  dataFilter: { FilterComponent: React.ReactElement }[];
}

export interface TableProps {
  prefix?: string;
  loader: Loader<any, Record<string, unknown>>;
  structure: StructureProps[];
  Wrapper?: React.FC<Record<string, unknown>>;
}

export interface HeaderProps {
  structure: StructureProps[];
}

export interface BodyProps {
  data: unknown;
  structure: StructureProps[];
  loader: Loader<any, Record<string, unknown>>;
}
