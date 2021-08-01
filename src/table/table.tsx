import clsx from 'clsx';
import { get } from 'lodash';
import queryString from 'query-string';
import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import useDragScroll from 'use-drag-scroll';
import { LoadingIcon } from '../assets/loading';
import { NoDataIcon } from '../assets/nodata-icon';
import { getFilter } from '../hooks/use-filter';
import { parsedSort, SortValue, useSort } from '../hooks/use-sort';
import { add, remove } from '../store/loader-inventory';
import { TableStyle } from '../styles/table.style';
import { ErrorPage } from './error';
import { FilterTable } from './filter';
import { PaginationUI } from './pagination';
import { BodyProps, ColumnsProps, FilterProps, HeaderProps, Pagination, SortIconProps, TableProps } from './types';

const SortIcon: React.FC<SortIconProps> = (props) => {
  const { field, prefix } = props;
  const [sort] = useSort(prefix, field);

  if (sort === 'asc') {
    return (
      <div className="ml-2 w-4 h-4 cursor-pointer text-blue-500">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
          <path
            fillRule="evenodd"
            d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z"
            clipRule="evenodd"
          />
        </svg>
      </div>
    );
  }
  if (sort === 'desc') {
    return (
      <div className="ml-2 w-4 h-4 cursor-pointer text-blue-500">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
          <path
            fillRule="evenodd"
            d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z"
            clipRule="evenodd"
          />
        </svg>
      </div>
    );
  }
  return (
    <div className="w-5 h-4 ml-2 relative">
      <div className="w-3 h-3 cursor-pointer text-gray-300 absolute top-0 right-0">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
          <path
            fillRule="evenodd"
            d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z"
            clipRule="evenodd"
          />
        </svg>
      </div>
      <div className="w-3 h-3 cursor-pointer text-gray-300 absolute bottom-0 left-0">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
          <path
            fillRule="evenodd"
            d="M14.707 12.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l2.293-2.293a1 1 0 011.414 0z"
            clipRule="evenodd"
          />
        </svg>
      </div>
    </div>
  );
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
  const { columns, render, data } = props;

  if (!data) {
    return <tr className="w-full h-80 relative bg-gray-50" data-testid="empty"></tr>;
  }

  if (!Array.isArray(data) || data.length === 0) {
    return (
      <tr className="w-full h-80 relative" data-testid="empty">
        <td className="w-full flex items-center justify-center fixed top-48 left-0 right-0 mx-auto">
          <div className="flex items-center">
            <NoDataIcon />
            <span className="block ml-10 font-bold text-2xl uppercase text-gray-400">No data</span>
          </div>
        </td>
      </tr>
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
      <div className="absolute left-0 top-44 right-0 mx-auto w-52 text-center flex shadow-md rounded-full items-center justify-center px-4 overflow-hidden bg-white py-2.5">
        <LoadingIcon />
        <span className="ml-3 text-indigo-900 font-semibold">Loading...</span>
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
  const { columns, Wrapper, render } = props;
  const prefix = props.prefix ?? 'default';
  const loader = useRef(props.loader);
  const [data, setData] = useState<Pagination<R> | null>(null);
  const [err, setError] = useState<Error | null>(null);
  const [showScrollX, setShowScrollX] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const location = useLocation();
  const wrapTableRef = useRef<HTMLDivElement>(null);
  const tableRef = useRef<HTMLTableElement>(null);

  useDragScroll({
    sliderRef: wrapTableRef,
  });

  useEffect(() => {
    if (wrapTableRef && wrapTableRef.current && tableRef && tableRef.current) {
      const tableWidth = tableRef.current.clientWidth;
      const wrapTableWidth = wrapTableRef.current.clientWidth;
      setShowScrollX(tableWidth > wrapTableWidth);
    }
  }, []);

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
    <TableStyle
      className={clsx({
        'overflow-hidden relative': true,
        'bg-white': !loading,
      })}
      data-testid="table"
    >
      {((data === null && err === null) || loading) && <MemoizedLoading />}
      <div
        className={clsx({
          'wrap-table': true,
          'overflow-x-scroll': showScrollX,
        })}
        ref={wrapTableRef}
      >
        <table className="w-full table-auto mb-4" ref={tableRef}>
          <thead>
            <MemoizedHeader columns={columns} prefix={prefix} />
          </thead>
          <tbody
            className={clsx({
              'w-full': true,
              'bg-gray-200': !!(data?.data && data?.data.length > 0),
            })}
          >
            <MemoizedBody data={data?.data} columns={columns} render={render} />
          </tbody>
        </table>
      </div>
      <div className="my-8 h-19 sm:h-9 w-full">
        <PaginationUI data={data} prefix={prefix} />
      </div>
    </TableStyle>
  );

  return Wrapper ? <Wrapper children={tmp} /> : tmp;
}
