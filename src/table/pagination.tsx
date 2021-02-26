import clsx from 'clsx';
import React, { RefObject, useEffect, useRef, useState } from 'react';
import { DataPagination, Pagination } from './loader';
import { PaginationStyle } from './pagination.style';
import { useFilter } from './table';

const dataPerpage = [
  { value: 5, label: '5' },
  { value: 10, label: '10' },
  { value: 20, label: '20' },
  { value: 50, label: '50' },
  { value: 100, label: '100' },
];

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
  onClick?: (e: React.MouseEvent<HTMLLIElement, MouseEvent>) => void;
}> = (props) => {
  const { page, selected, special, disable, onClick } = props;
  const faName = renderText(selected, special);

  return (
    <li
      onClick={onClick}
      className={clsx({
        'transition group cursor-pointer rounded': true,
        'bg-transparent': !selected,
        'hover:bg-blue-500': !disable,
        'opacity-50': disable,
        'opacity-100': !disable,
        'bg-blue-500': selected,
        'cursor-not-allowed': disable,
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

const PerpageDropdown: React.FC<{
  pagination: DataPagination;
  dataPerpage: { value: number; label: string }[];
  prefix: string;
}> = (props) => {
  const { currentPage, totalItems, perPage } = props.pagination;
  const setFilter = useFilter(props.prefix);
  const [perpageCurrent, setPerpageCurrent] = useState<string>('10');
  const [showSelectPerpage, setShowSelectPerpage] = useState<boolean>(false);
  const perpageDropdownRef = useRef<HTMLDivElement>(null);

  const useOutsideElement = (ref: RefObject<HTMLDivElement>) => {
    useEffect(() => {
      const onClickOutside = (event) => {
        if (ref.current && !ref.current.contains(event.target)) {
          setShowSelectPerpage(false);
        }
      };
      document.addEventListener('mousedown', onClickOutside);
      return () => {
        document.removeEventListener('mousedown', onClickOutside);
      };
    }, [ref]);
  };

  const onSelectedPerpage = (item: { value: number; label: string }) => {
    setPerpageCurrent(item.label);
    setFilter({
      page: `${currentPage}`,
      size: `${item.value}`,
    });
    setShowSelectPerpage(false);
  };

  const start = (currentPage - 1) * perPage + 1;
  const end = currentPage * perPage > totalItems ? totalItems : currentPage * perPage;

  useOutsideElement(perpageDropdownRef);

  return (
    <div className="flex items-center ml-3 justify-center mb-5 sm:mb-0">
      <div
        className={`${
          showSelectPerpage ? 'bg-blue-500' : 'bg-gray-200'
        } ekp-pagination-dropdown relative cursor-pointer rounded inline-flex sm:flex items-center px-4 h-9 hover:bg-blue-500 duration-300`}
        onClick={() => setShowSelectPerpage(!showSelectPerpage)}
        ref={perpageDropdownRef}
      >
        <span className={`${showSelectPerpage ? 'text-white' : 'text-gray-500'} ekp-pagination-dropdown-label mr-3`}>
          {perpageCurrent}
        </span>
        <i className={`fas fa-chevron-down text-sm ${showSelectPerpage ? 'text-white' : 'text-gray-500'}`}></i>
        {showSelectPerpage && (
          <div>
            <div className="absolute -top-40 left-0 bg-white shadow-lg w-full z-20">
              {dataPerpage &&
                dataPerpage.length > 0 &&
                dataPerpage.map((item) => {
                  return (
                    <div
                      key={JSON.stringify(item.value)}
                      className={`${perpageCurrent === item.label ? 'bg-gray-100' : ''} py-1 px-4 hover:bg-gray-100`}
                      onClick={() => onSelectedPerpage(item)}
                    >
                      <span>{item.label}</span>
                    </div>
                  );
                })}
            </div>
          </div>
        )}
      </div>
      <div className="ml-3">
        <span>{`Showing ${start} - ${end} of ${totalItems}`}</span>
      </div>

      {/* {showSelectPerpage && <div className="w-screen h-screen z-10 opacity-0" onClick={() => setShowSelectPerpage(!showSelectPerpage)}></div>} */}
    </div>
  );
};

export const PaginationUI: React.FC<{ data: Pagination<unknown> | null; prefix: string }> = ({ data, prefix }) => {
  const setFilter = useFilter(prefix);

  if (data === null) {
    return null;
  }

  const { pagination } = data;
  const { currentPage, totalPages, perPage } = pagination;

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

  const onSelectPage = (page: number, disabled: boolean) => {
    !disabled &&
      setFilter({
        page: `${page}`,
        size: `${perPage}`,
      });
  };

  return (
    <PaginationStyle>
      <div className="h-28 sm:h-6">
        <div className="perpage-dropdown w-full sm:w-auto absolute left-0 bottom-28 sm:left-8 sm:bottom-20">
          <PerpageDropdown pagination={pagination} dataPerpage={dataPerpage} prefix={prefix} />
        </div>

        <div className="page-number w-full sm:w-auto flex justify-center absolute right-0 bottom-20 sm:right-8 sm:bottom-20">
          <PageNumber
            page={1}
            special="first"
            disable={currentPage === 1}
            onClick={() => onSelectPage(1, currentPage === 1)}
          />
          <PageNumber
            page={currentPage - 1}
            special="prev"
            disable={currentPage === 1}
            onClick={() => onSelectPage(currentPage - 1, currentPage === 1)}
          />
          {nums.map((idx) => (
            <PageNumber
              page={idx}
              key={`page_${idx}`}
              selected={currentPage === idx}
              onClick={() => onSelectPage(idx, false)}
            />
          ))}
          <PageNumber
            page={currentPage + 1}
            special="next"
            disable={currentPage >= totalPages}
            onClick={() => onSelectPage(currentPage + 1, currentPage >= totalPages)}
          />
          <PageNumber
            page={totalPages}
            special="last"
            disable={currentPage >= totalPages}
            onClick={() => onSelectPage(totalPages, currentPage >= totalPages)}
          />
        </div>
      </div>
    </PaginationStyle>
  );
};
