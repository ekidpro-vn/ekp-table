import clsx from 'clsx';
import React, { memo, useCallback } from 'react';
import { useSort } from '../hooks';
import { SortValue } from '../hooks/use-sort';
import { ColumnsProps, HeaderProps, SortIconProps } from './types';

const SortIcon: React.FC<SortIconProps> = memo((props) => {
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
});

const ThHeader: React.FC<{ prefix: string; item: ColumnsProps }> = memo((props) => {
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
        'bg-gray-50 p-5 z-2': true,
        'md:sticky md:left-0 md:top-0': item.fixed === 'left',
        'md:sticky md:right-0 md:top-0': item.fixed === 'right',
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
});

export const TableHeader: React.FC<HeaderProps> = memo((props) => {
  const { columns } = props;
  const prefix = props.prefix ?? 'default';

  return (
    <tr className="bg-gray-800 text-left rounded relative">
      {columns && columns.map((item) => <ThHeader key={item.field} item={item} prefix={prefix} />)}
    </tr>
  );
});
