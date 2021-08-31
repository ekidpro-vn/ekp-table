import clsx from 'clsx';
import queryString from 'query-string';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { getFilter } from '../hooks/use-filter';
import { parsedSort } from '../hooks/use-sort';
import { add, remove } from '../store/loader-inventory';
import { TableStyle } from '../styles/table.style';
import { ErrorPage } from './error';
import { FilterTable } from './filter';
import { PaginationUI } from './pagination';
import { TableBody } from './table-body';
import { TableHeader } from './table-header';
import { TableLoading } from './table-loading';
import { FilterProps, Pagination, TableProps } from './types';

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
  const [loading, setLoading] = useState<boolean>(false);
  const location = useLocation();

  // const wrapTableRef = useRef<HTMLDivElement>(null);
  // const tableRef = useRef<HTMLTableElement>(null);
  // const [showScrollX, setShowScrollX] = useState<boolean>(false);

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

  // useEffect(() => {
  //   if (wrapTableRef && wrapTableRef.current && tableRef && tableRef.current) {
  //     const tableWidth = tableRef.current.clientWidth;
  //     const wrapTableWidth = wrapTableRef.current.clientWidth;
  //     setShowScrollX(tableWidth > wrapTableWidth);
  //   }
  // }, []);

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
      {((data === null && err === null) || loading) && <TableLoading />}
      <div
        // ref={wrapTableRef}
        className={clsx({
          'relative wrap-table overflow-x-scroll': true,
          // 'overflow-x-scroll': !!(data && data.data && data.data.length > 0 && showScrollX),
        })}
      >
        <table
          className="w-full table-auto mb-4"
          // ref={tableRef}
        >
          <thead>
            <TableHeader columns={columns} prefix={prefix} />
          </thead>
          <tbody
            className={clsx({
              'w-full': true,
              'bg-gray-200': !!(data?.data && data?.data.length > 0),
            })}
          >
            <TableBody data={data?.data} columns={columns} render={render} />
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
