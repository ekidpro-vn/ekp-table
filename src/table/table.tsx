import queryString from 'query-string';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Code } from 'react-content-loader';
import { useHistory, useLocation } from 'react-router-dom';
import { ErrorPage } from './error';
import { Loader, Pagination } from './loader';
import { PaginationUI } from './pagination';
import { StructureProps } from './types';

export interface TableProps {
  prefix?: string;
  loader: Loader<any, Record<string, unknown>>;
  structure: StructureProps[];
}

const RenderHeader: React.FC<{ structure: StructureProps[] }> = ({ structure }) => {
  return (
    <tr className="bg-gray-800 text-left rounded">
      {structure &&
        structure.map((item: StructureProps, index: number) => {
          return (
            <th className="text-gray-900 bg-gray-50 px-4 py-6 font-extrabold" key={index}>
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
    return <></>;
  }

  return (
    <>
      {data.map((item, index) => {
        return (
          <tr key={index} className="bg-white border-gray-200 text-left py-3" style={{ borderTopWidth: 1 }}>
            {structure.map((item2) => {
              return (
                <td key={JSON.stringify(item2)} className="p-3">
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
const scrollOnMobile: React.CSSProperties = {overflowX: 'scroll'}

export const Table: React.FC<TableProps> = (props) => {
  const { structure, prefix } = props;
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
    return <Code style={{ maxWidth: 300 }} />;
  }

  return (
    <div style={scrollOnMobile}>
      <table className="w-full overflow-auto table-auto">
        <thead>
          <MemoizedHeader structure={structure} />
        </thead>
        <tbody className="bg-gray-200 w-full">
          <MemoizedBody data={data?.data} structure={structure} loader={loader.current} />
        </tbody>
      </table>
      <div className="mt-8 mb-5">
        <PaginationUI data={data} />
      </div>
    </div>
  );
};

export const useFilter = (prefix: string): ((key: string, params: string | undefined) => void) => {
  const history = useHistory();

  return useCallback(
    (key: string, params: string | undefined) => {
      const parsed = queryString.parse(window.location.search);
      const queryKey = `${prefix}_${key}`;

      if (parsed[queryKey] === params) {
        return;
      }

      parsed[queryKey] = params || null;

      history.push({
        pathname: window.location.pathname,
        search: queryString.stringify(parsed),
      });
    },
    [history, prefix]
  );
};
