import clsx from 'clsx';
import get from 'lodash.get';
import React, { memo } from 'react';
import { NoDataIcon } from '../assets/nodata-icon';
import { BodyProps } from './types';

function Body<R>(props: BodyProps<R>): JSX.Element {
  const { columns, render, data } = props;

  if (!data) {
    return <tr className="w-full h-80 relative bg-gray-50" data-testid="empty"></tr>;
  }

  if (!Array.isArray(data) || data.length === 0) {
    return (
      <tr className="w-full h-80" data-testid="empty">
        <td className="w-full flex items-center justify-center absolute top-48 left-0 right-0 mx-auto">
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
      {data.map((trItem) => {
        return (
          <tr
            key={`tr_${Math.random()}`}
            className="bg-white border-gray-200 text-left py-3 border-t relative group hover:bg-gray-100"
          >
            {columns.map((tdItem) => {
              return (
                <td
                  key={`td_${tdItem.field}_${Math.random()}`}
                  className={clsx({
                    'p-5 z-2 group-hover:bg-gray-100': true,
                    'md:sticky md:left-0 md:top-0 md:bg-white': tdItem.fixed === 'left',
                    'md:sticky md:right-0 md:top-0 md:bg-white': tdItem.fixed === 'right',
                  })}
                >
                  {render ? render(trItem, tdItem) : get(trItem, `${tdItem.field}`)}
                </td>
              );
            })}
          </tr>
        );
      })}
    </>
  );
}

export const TableBody = memo(Body);
