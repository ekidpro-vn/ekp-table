import queryString from 'query-string';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { LoadingIcon } from '../assets/loading';
import ImageNoData from '../assets/no-data.png';
import { add, remove } from '../store/loader-inventory';
import { ErrorPage } from './error';
import { FilterTable } from './filter';
import { PaginationUI } from './pagination';
import { BodyProps, FilterProps, HeaderProps, Pagination, TableProps } from './types';

const RenderHeader: React.FC<HeaderProps> = (props) => {
  const { columns } = props;
  return (
    <tr className="bg-gray-800 text-left rounded">
      {columns &&
        columns.map((item) => {
          if (!item.enable) {
            return null;
          }
          return (
            <th className="text-gray-900 bg-gray-50 font-extrabold p-5" key={`title_${item.title}`}>
              {item.title}
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

const MemoizedHeader = React.memo(RenderHeader);
const MemoizedBody = React.memo(RenderBody);

export const Table = React.memo((props: TableProps) => {
  const { columns, prefix, Wrapper } = props;
  const loader = useRef(props.loader);
  const [data, setData] = useState<Pagination<unknown> | null>(null);
  const [err, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const getDataFromRemoteServer = useCallback(() => {
    setLoading(true);
    const { url, fetch } = loader.current;
    if (typeof url === 'undefined' || url === null) {
      throw new Error(`Invalid Url`);
    }

    let pf = prefix ?? '';
    if (prefix && /^[a-zA-Z]+$/g.test(prefix) === false) {
      pf = '';
    }

    const parsed = queryString.parse(window.location.search);

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
  }, [loader, prefix]);

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
            <MemoizedHeader columns={columns} />
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
