import clsx from 'clsx';
import { get } from 'lodash';
import queryString from 'query-string';
import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import IconArrowDefault from '../assets/default-arrow.png';
import IconArrowDown from '../assets/down-arrow.png';
import { LoadingIcon } from '../assets/loading';
import ImageNoData from '../assets/no-data.png';
import IconArrowUp from '../assets/up-arrow.png';
import { getFilter } from '../hooks/use-filter';
import { parsedSort, SortValue, useSort } from '../hooks/use-sort';
import { add, remove } from '../store/loader-inventory';
import { ErrorPage } from './error';
import { FilterTable } from './filter';
import { PaginationUI } from './pagination';
import { BodyProps, ColumnsProps, FilterProps, HeaderProps, Pagination, SortIconProps, TableProps } from './types';

const SortIcon: React.FC<SortIconProps> = (props) => {
  const { field, prefix } = props;
  const [sort] = useSort(prefix, field);

  if (sort === 'asc') {
    return <img src={IconArrowUp} alt="asc" className="block ml-2 w-3 h-3 cursor-pointer" />;
  }
  if (sort === 'desc') {
    return <img src={IconArrowDown} alt="asc" className="block ml-2 w-3 h-3 cursor-pointer" />;
  }
  return <img src={IconArrowDefault} alt="desc" className="block ml-2 w-3 h-3 cursor-pointer" />;
};

const RenderThHeader: React.FC<{ prefix: string; item: ColumnsProps }> = (props) => {
  const { item, prefix } = props;
  const [sort, setSort] = useSort(prefix, item.field);

  const onFilterSort = useCallback(() => {
    const arrayValue: SortValue[] = ['asc', 'desc', 'none'];
    const index = arrayValue.indexOf(sort);
    const nextValue = index + 1 === arrayValue.length ? arrayValue[0] : arrayValue[index + 1];
    setSort(nextValue);
  }, [sort, setSort]);

  return (
    <th
      className={clsx({
        'cursor-pointer duration-300 hover:text-blue-500': item.canSort,
        'bg-gray-50 p-5': true,
      })}
      key={`title_${item.title}`}
      onClick={item.canSort ? onFilterSort : undefined}
    >
      <div className="flex items-center">
        <span className="block text-gray-900 font-extrabold">{item.title}</span>
        {item.canSort && <SortIcon field={item.field} prefix={prefix} />}
      </div>
    </th>
  );
};

const RenderHeader: React.FC<HeaderProps> = (props) => {
  const { columns } = props;
  const prefix = props.prefix ?? 'default';

  return (
    <tr className="bg-gray-800 text-left rounded">
      {columns && columns.map((item) => <RenderThHeader key={item.field} item={item} prefix={prefix} />)}
    </tr>
  );
};

function RenderBody<R>(props: BodyProps<R>): JSX.Element {
  const { data, columns, render } = props;
  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <td colSpan={columns.length} className="bg-white w-full" data-testid="empty">
        <img src={ImageNoData} alt="no data" className="block w-80 mx-auto" />
      </td>
    );
  }

  return (
    <>
      {data.map((item, index) => {
        return (
          <tr
            key={`cell_${index}_${Math.random()}`}
            className="bg-white border-gray-200 text-left py-3"
            style={{ borderTopWidth: 1 }}
          >
            {columns.map((item2, index) => {
              return (
                <td key={`column_${item2.field}_${index}`} className="p-5">
                  {render ? render(item, item2) : get(item, `${item2.field}`)}
                </td>
              );
            })}
          </tr>
        );
      })}
    </>
  );
}

const RenderLoading: React.FC = () => {
  return (
    <div
      className="absolute z-50 top-0 left-0 flex items-center justify-center min-h-96 bg-gray-100 bg-opacity-50 w-full h-full pt-10 pb-20"
      data-testid="loading"
    >
      <div className="absolute left-0 top-32 right-0 mx-auto w-52 text-center flex shadow-md rounded-full items-center px-4 overflow-hidden bg-white">
        <LoadingIcon />
        <span className="mx-3 text-indigo-900 font-semibold">Loading...</span>
      </div>
    </div>
  );
};

const MemoizedLoading = memo(RenderLoading);
const MemoizedHeader = memo(RenderHeader);
const MemoizedBody = memo(RenderBody);

export const Filter: React.FC<FilterProps> = (props) => {
  const { ListFilterComponent, colClassName, gridClassName } = props;
  return (
    <FilterTable ListFilterComponent={ListFilterComponent} colClassName={colClassName} gridClassName={gridClassName} />
  );
};

export function Table<R>(props: TableProps<R>): JSX.Element {
  const { columns, prefix, Wrapper, render } = props;
  const loader = useRef(props.loader);
  const [data, setData] = useState<Pagination<R> | null>(null);
  const [err, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const location = useLocation();

  const getDataFromRemoteServer = useCallback(() => {
    setLoading(true);
    const { fetch } = loader.current;

    let pf = prefix ?? '';
    if (prefix && /^[-a-zA-Z_]+$/g.test(prefix) === false) {
      pf = '';
    }

    const parsed = queryString.parse(location.search);
    const objectSort = parsed.sort ? parsedSort(prefix, parsed.sort) : {};
    const objectFilter = getFilter(prefix, parsed);

    // cancel request
    fetch({
      page: parseInt((parsed[`${pf}_page`] ?? '1') as string, 10),
      size: parseInt((parsed[`${pf}_size`] ?? '10') as string, 10),
      filter: objectFilter,
      sort: objectSort,
    })
      .then((result) => {
        setError(null);
        setData(result);
      })
      .catch((err: Error) => {
        setError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [loader, prefix, location]);

  useEffect(() => {
    getDataFromRemoteServer();
  }, [getDataFromRemoteServer]);

  // Add fetcher function to local store
  useEffect(() => {
    add(prefix, getDataFromRemoteServer);

    return () => {
      remove(prefix, getDataFromRemoteServer);
    };
  }, [prefix, getDataFromRemoteServer]);
  if (err !== null) {
    return Wrapper ? <Wrapper children={<ErrorPage />} /> : <ErrorPage />;
  }

  const tmp = (
    <div className="overflow-hidden bg-white relative" data-testid="table">
      {((data === null && err === null) || loading) && <MemoizedLoading />}
      <div className="overflow-x-scroll">
        <table className="w-full table-auto mb-4">
          <thead>
            <MemoizedHeader columns={columns} prefix={prefix} />
          </thead>
          <tbody className="bg-gray-200 w-full">
            <MemoizedBody data={data?.data} columns={columns} render={render} />
          </tbody>
        </table>
      </div>
      <div className="my-8 h-19 sm:h-9 w-full">
        <PaginationUI data={data} prefix={prefix} />
      </div>
    </div>
  );

  return Wrapper ? <Wrapper children={tmp} /> : tmp;
}
