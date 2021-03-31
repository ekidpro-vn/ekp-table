import queryString from 'query-string';
import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import IconArrowDown from '../assets/down-arrow.png';
import { LoadingIcon } from '../assets/loading';
import ImageNoData from '../assets/no-data.png';
import IconArrowUp from '../assets/up-arrow.png';
import { useFilter } from '../hooks/use-filter';
import { add, remove } from '../store/loader-inventory';
import { ErrorPage } from './error';
import { FilterTable } from './filter';
import { PaginationUI } from './pagination';
import { BodyProps, FilterProps, HeaderProps, Pagination, SortIconProps, TableProps } from './types';

const RenderHeader: React.FC<HeaderProps> = (props) => {
  const { columns, sort } = props;
  const prefix = props.prefix ?? 'default';
  const setFilter = useFilter(prefix);

  const upValueSort = sort?.upValue ?? 'ASC';
  const downValueSort = sort?.downValue ?? 'DESC';
  const paramSort = sort?.param ?? 'sort';
  const separatorSort = sort?.seperator ?? '|';
  const location = useLocation();
  const parsed = queryString.parse(location.search);
  const sortingURL = parsed[`${prefix}_${paramSort}`] as string | undefined;
  const [currentField, currentValue] = sortingURL ? sortingURL.split(separatorSort) : [];

  const RenderSortIcon: React.FC<SortIconProps> = (props) => {
    const { field } = props;
    if (field === currentField) {
      if (currentValue === upValueSort) {
        return <img src={IconArrowUp} alt="sort" className="block ml-2 w-3 h-3 cursor-pointer" />;
      }
      if (currentValue === downValueSort) {
        return <img src={IconArrowDown} alt="sort" className="block ml-2 w-3 h-3 cursor-pointer" />;
      }
    }
    return null;
  };

  const MemoSortIcon = memo(RenderSortIcon);

  const onFilterSort = (field: string) => {
    let nextValue = '';
    let nextField = `${field}${separatorSort}`;

    if (currentField === field) {
      if (!currentValue) {
        nextValue = upValueSort;
      }
      if (currentValue === upValueSort) {
        nextValue = downValueSort;
      }
      if (currentValue === downValueSort) {
        nextField = '';
        nextValue = '';
      }
    } else {
      nextValue = upValueSort;
    }

    const objSort: Record<string, string> = {};
    objSort[`${paramSort}`] = `${nextField}${nextValue}` || '';
    setFilter(objSort);
  };

  return (
    <tr className="bg-gray-800 text-left rounded">
      {columns &&
        columns.map((item) => {
          if (!item.enable) {
            return null;
          }
          return (
            <th
              className={`${item.canSort && 'cursor-pointer duration-300 hover:text-blue-500'} bg-gray-50 p-5`}
              key={`title_${item.title}`}
              onClick={item.canSort ? () => onFilterSort(item.field) : undefined}
            >
              <div className="flex items-center">
                <span className="block text-gray-900 font-extrabold">{item.title}</span>
                {item.canSort && <MemoSortIcon field={item.field} />}
              </div>
            </th>
          );
        })}
    </tr>
  );
};

const RenderBody: React.FC<BodyProps> = (props) => {
  const { data, columns, loader } = props;
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
            key={JSON.stringify(index)}
            className="bg-white border-gray-200 text-left py-3"
            style={{ borderTopWidth: 1 }}
          >
            {columns.map((item2) => {
              if (!item2.enable) {
                return null;
              }
              return (
                <td key={JSON.stringify(item2)} className="p-5">
                  {loader.render(item, item2.field) ?? item[`${item2.field}`]}
                </td>
              );
            })}
          </tr>
        );
      })}
    </>
  );
};

const MemoizedHeader = memo(RenderHeader);
const MemoizedBody = memo(RenderBody);

export const Table = memo((props: TableProps) => {
  const { columns, prefix, Wrapper, sort } = props;
  const loader = useRef(props.loader);
  const [data, setData] = useState<Pagination<unknown> | null>(null);
  const [err, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const location = useLocation();

  const getDataFromRemoteServer = useCallback(() => {
    setLoading(true);
    const { url, fetch } = loader.current;
    if (typeof url === 'undefined' || url === null) {
      throw new Error(`Invalid Url`);
    }

    let pf = prefix ?? '';
    if (prefix && /^[-a-zA-Z_]+$/g.test(prefix) === false) {
      pf = '';
    }

    const parsed = queryString.parse(location.search);

    const filter: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(parsed)) {
      if (!key.startsWith(pf)) {
        continue;
      }

      const filterKey = key.replace(`${pf}_`, '');

      if (['page', 'size'].includes(filterKey)) {
        continue;
      }

      filter[filterKey] = value;
    }
    fetch({
      url,
      page: parseInt((parsed[`${pf}_page`] ?? '1') as string, 10),
      size: parseInt((parsed[`${pf}_size`] ?? '10') as string, 10),
      filter,
    })
      .then((result) => {
        setData(result);
        setLoading(false);
      })
      .catch((err: Error) => {
        setError(err);
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

  if ((data === null && err === null) || loading) {
    const tmp = (
      <div className="flex items-center justify-center mt-32 min-h-96 bg-white pt-10 pb-20" data-testid="loading">
        <div className="flex shadow-md rounded-full items-center px-4 overflow-hidden">
          <LoadingIcon />
          <span className="mx-3 text-indigo-900 font-semibold">Loading...</span>
        </div>
      </div>
    );

    return Wrapper ? <Wrapper children={tmp} /> : tmp;
  }

  const tmp = (
    <div className="overflow-hidden" data-testid="table">
      <div className="overflow-x-scroll">
        <table className="w-full table-auto mb-4">
          <thead>
            <MemoizedHeader columns={columns} prefix={prefix} sort={sort} />
          </thead>
          <tbody className="bg-gray-200 w-full">
            <MemoizedBody data={data?.data} columns={columns} loader={loader.current} />
          </tbody>
        </table>
      </div>
      <div className="my-8 h-19 sm:h-9 w-full">
        <PaginationUI data={data} prefix={prefix} />
      </div>
    </div>
  );

  return Wrapper ? <Wrapper children={tmp} /> : tmp;
});

export const Filter: React.FC<FilterProps> = (props) => {
  const { dataFilter } = props;
  return <FilterTable dataFilter={dataFilter} />;
};
