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
      {data.map((item, index) => {
        return (
          <tr
            key={`row_${index}_${Math.random()}`}
            className="bg-white border-gray-200 text-left py-3 duration-300 hover:bg-gray-100"
            style={{ borderTopWidth: 1 }}
          >
            {columns.map((item2, index) => {
              return (
                <td key={`cell_${item2.field}_${index}`} className="p-5">
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

export const TableBody = memo(Body);
