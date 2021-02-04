import clsx from 'clsx';
import React from 'react';
import { Pagination } from './loader';
import { PaginationStyle } from './pagination.style';

const renderText = (selected?: boolean, special?: 'first' | 'prev' | 'next' | 'last') => {
  switch (special) {
    case 'first':
      return 'fa fa-angle-double-left';

    case 'prev':
      return 'fa fa-angle-left';

    case 'next':
      return 'fa fa-angle-right';

    case 'last':
      return 'fa fa-angle-double-right';

    default:
      return null;
  }
};

const PageNumber: React.FC<{
  page: number;
  selected?: boolean;
  disable?: boolean;
  special?: 'first' | 'prev' | 'next' | 'last';
}> = (props) => {
  const { page, selected, special, disable } = props;
  const faName = renderText(selected, special);

  return (
    <li
      className={clsx({
        'transition group rounded': true,
        'bg-transparent': !selected,
        'hover:bg-blue-500': !disable,
        'opacity-50': disable,
        'opacity-100': !disable,
        'bg-blue-500': selected,
      })}
    >
      <div
        className={clsx({
          'text-gray-500 group-hover:text-white': !selected && !disable,
          'text-white': selected,
        })}
      >
        {faName ? (
          <i
            className={`${faName} ${clsx({
              'text-gray-500 group-hover:text-white': !selected && !disable,
              'text-white': selected,
            })}`}
          />
        ) : (
          page
        )}
      </div>
    </li>
  );
};

export const PaginationUI: React.FC<{ data: Pagination<unknown> | null }> = ({ data }) => {
  if (data === null) {
    return null;
  }

  const { pagination } = data;
  const { currentPage, totalItems, totalPages } = pagination;

  const nums: number[] = [];
  for (let idx = currentPage - 2; idx < currentPage; idx += 1) {
    if (idx >= 1) {
      nums.push(idx);
    }
  }

  for (let idx = currentPage; idx < currentPage + 2; idx += 1) {
    if (idx > totalPages) {
      break;
    }

    if (nums.length >= 5) {
      break;
    }

    nums.push(idx);
  }

  return (
    <PaginationStyle>
      <PageNumber page={1} special="first" disable={currentPage === 1} />
      <PageNumber page={currentPage - 1} special="prev" disable={currentPage === 1} />
      {nums.map((idx) => (
        <PageNumber page={idx} key={`page_${idx}`} selected={currentPage === idx} />
      ))}
      <PageNumber page={currentPage + 1} special="next" disable={currentPage >= totalPages} />
      <PageNumber page={totalPages} special="last" disable={currentPage >= totalPages} />
    </PaginationStyle>
  );
};
