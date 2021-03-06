import queryString from 'query-string';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { LoadingIcon } from '../assets/loading';
import ImageNoData from '../assets/no-data.png';
import { ErrorPage } from './error';
import { Loader, Pagination } from './loader';
import { PaginationUI } from './pagination';
import { StructureProps } from './types';

export interface TableProps {
  prefix?: string;
  loader: Loader<any, Record<string, unknown>>;
  structure: StructureProps[];
  onRefresh?: () => void;
}

const RenderHeader: React.FC<{ structure: StructureProps[] }> = ({ structure }) => {
  return (
    <tr className="bg-gray-800 text-left rounded">
      {structure &&
        structure.map((item) => {
          return (
            <th className="text-gray-900 bg-gray-50 font-extrabold p-5" key={item.titleLanguage}>
              {item.titleLanguage}
            </th>
          );
        })}
    </tr>
  );
};

const RenderBody: React.FC<{
  data: unknown;
  structure: StructureProps[];
  loader: Loader<any, Record<string, unknown>>;
}> = ({ data, structure, loader }) => {
  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <td colSpan={structure.length} className="bg-white w-full">
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
            {structure.map((item2) => {
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

export const Table: React.FC<TableProps> = (props) => {
  const { structure, prefix, onRefresh } = props;
  const location = useLocation<unknown>();
  const loader = useRef(props.loader);
  const [data, setData] = useState<Pagination<unknown> | null>(null);
  const [err, setError] = useState<Error | null>(null);

  useEffect(() => {
    const { url, fetch } = loader.current;
    if (typeof url === 'undefined' || url === null) {
      throw new Error(`Invalid Url`);
    }

    let pf = prefix ?? '';
    if (prefix && /^[a-zA-Z]+$/g.test(prefix) === false) {
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
      })
      .catch((err: Error) => {
        setError(err);
      });
  }, [loader, prefix, location]);

  if (err !== null) {
    return <ErrorPage />;
  }

  if (data === null && err === null) {
    return (
      <div className="flex items-center justify-center mt-40 min-h-96">
        <div className="flex shadow-md rounded-full items-center px-4 overflow-hidden">
          <LoadingIcon />
          <span className="mx-3 text-indigo-900 font-semibold">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="overflow-hidden">
        <div className="overflow-x-scroll">
          <table className="w-full table-auto">
            <thead>
              <MemoizedHeader structure={structure} />
            </thead>
            <tbody className="bg-gray-200 w-full">
              <MemoizedBody data={data?.data} structure={structure} loader={loader.current} />
            </tbody>
          </table>
        </div>
        <div className="my-8 h-20 sm:h-10 w-full">
          <PaginationUI data={data} prefix={prefix} />
        </div>
      </div>
    </div>
  );
};

export const useFilter = (prefix: string): ((params: Record<string, string | undefined>) => void) => {
  const history = useHistory();

  return useCallback(
    (params: Record<string, string | undefined>) => {
      const parsed = queryString.parse(window.location.search);

      for (const [key, value] of Object.entries(params)) {
        parsed[`${prefix}_${key}`] = value || null;
      }

      history.push({
        pathname: window.location.pathname,
        search: queryString.stringify(parsed),
      });
    },
    [history, prefix]
  );
};
