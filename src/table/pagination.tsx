import clsx from 'clsx';
import React, { FormEvent, RefObject, useCallback, useEffect, useRef, useState } from 'react';
import { useFilter } from '../hooks';
import { PaginationStyle } from '../styles/pagination.style';
import { PageNumberProps, PageSizeDropdownProps, PaginationUIProps } from './types';

const dataPageSize: { value: number; label: string }[] = [5, 10, 20, 50, 100].map((item) => {
  return { value: item, label: `${item}` };
});

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

const PageNumber: React.FC<PageNumberProps> = (props) => {
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

const PageSizeDropdown: React.FC<PageSizeDropdownProps> = (props) => {
  const { onSelectSize, pagination } = props;
  const { currentPage, totalItems, perPage } = pagination;
  const [pageSize, setPageSize] = useState<number>(perPage);
  const [showSelectPageSize, setShowSelectPageSize] = useState<boolean>(false);
  const pageSizeDropdownRef = useRef<HTMLDivElement>(null);

  const useOutsideElement = (ref: RefObject<HTMLDivElement>) => {
    useEffect(() => {
      const onClickOutside = (event) => {
        if (ref.current && !ref.current.contains(event.target)) {
          setShowSelectPageSize(false);
        }
      };
      document.addEventListener('mousedown', onClickOutside);
      return () => {
        document.removeEventListener('mousedown', onClickOutside);
      };
    }, [ref]);
  };

  const onSelectPageSize = useCallback(
    (item: { value: number; label: string }) => {
      if (item.value === perPage) {
        return;
      }
      setPageSize(item.value);
      onSelectSize(item.value);
      setShowSelectPageSize(false);
    },
    [perPage, onSelectSize]
  );

  const start = totalItems === 0 ? 0 : (currentPage - 1) * perPage + 1;
  const end = currentPage * perPage > totalItems ? totalItems : currentPage * perPage;

  useOutsideElement(pageSizeDropdownRef);

  return (
    <div className="flex items-center sm:ml-3 justify-center mb-5 sm:mb-0">
      <div
        className={`${
          showSelectPageSize ? 'bg-blue-500' : 'bg-gray-200'
        } ekp-pagination-dropdown relative cursor-pointer rounded inline-flex sm:flex items-center px-4 h-9 hover:bg-blue-500 duration-300`}
        onClick={() => setShowSelectPageSize(!showSelectPageSize)}
        ref={pageSizeDropdownRef}
      >
        <span className={`${showSelectPageSize ? 'text-white' : 'text-gray-500'} ekp-pagination-dropdown-label mr-3`}>
          {pageSize}
        </span>
        <i className={`fas fa-chevron-down text-sm ${showSelectPageSize ? 'text-white' : 'text-gray-500'}`}></i>
        {showSelectPageSize && (
          <div>
            <div className="absolute left-0 bg-white overflow-hidden perpage-options w-full z-20">
              {dataPageSize &&
                dataPageSize.length > 0 &&
                dataPageSize.map((item) => {
                  if (item.value > totalItems) {
                    return (
                      <div
                        key={`perpage_${item.value}`}
                        className="py-1 px-4 bg-gray-100 cursor-not-allowed border border-t-0 border-l-0 border-r-0 border-gray-100"
                      >
                        <span className="text-gray-500">{item.label}</span>
                      </div>
                    );
                  }
                  return (
                    <div
                      key={`perpage_${item.value}`}
                      className={`${
                        pageSize === item.value ? 'bg-blue-500' : ''
                      } group py-1 px-4 rounded-sm border border-t-0 border-l-0 border-r-0 border-white hover:bg-blue-500`}
                      onClick={() => onSelectPageSize(item)}
                    >
                      <span className={`${pageSize === item.value ? 'text-white' : ''} group-hover:text-white`}>
                        {item.label}
                      </span>
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
    </div>
  );
};

export const PaginationUI: React.FC<PaginationUIProps> = ({ data, prefix }) => {
  const setFilter = useFilter(prefix);
  const [inputNumber, setInputNumber] = useState<string>('');

  const onSelectPage = useCallback(
    (page: number, disabled: boolean) => {
      if (data) {
        if (disabled || page === data.pagination.currentPage) {
          return;
        }
        setInputNumber('');
        setFilter({
          page: `${page}`,
          size: `${data.pagination.perPage}`,
        });
      }
    },
    [data, setFilter]
  );

  const onSubmitPageNumber = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      if (data) {
        e.preventDefault();
        if (!inputNumber) {
          return;
        }
        if (data.pagination.currentPage === Number(inputNumber)) {
          return;
        }
        setFilter({
          page: inputNumber,
          size: `${data.pagination.perPage}`,
        });
      }
    },
    [data, inputNumber, setFilter]
  );

  const onSelectSize = useCallback(
    (size: number) => {
      setInputNumber('');
      setFilter({
        page: `1`,
        size: `${size}`,
      });
    },
    [setFilter]
  );

  if (data === null) {
    return null;
  }

  const { pagination } = data;
  const { currentPage, totalPages } = pagination;
  const listPage: number[] = [];

  for (let i = currentPage - 2; i < currentPage + 3; i++) {
    if (i > 0 && i <= totalPages && currentPage <= totalPages) {
      if (currentPage < 3) {
        listPage.push(i);
      } else if (currentPage >= 3 && currentPage <= totalPages - 3) {
        listPage.push(i);
      } else if (currentPage > totalPages - 3) {
        listPage.push(i);
      }
    }
  }

  return (
    <PaginationStyle>
      <div className="w-full h-full sm:flex sm:justify-between" data-testid="pagination">
        <div className="perpage-dropdown w-full sm:w-auto">
          <PageSizeDropdown pagination={pagination} dataPageSize={dataPageSize} onSelectSize={onSelectSize} />
        </div>
        <div className="page-number w-full sm:w-auto sm:flex justify-center">
          <div className="flex justify-center items-center mb-5 sm:mb-0">
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
            {listPage.map((idx) => (
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
          <div className="flex items-center justify-center lg:mr-4 lg:ml-16">
            <span className="block mr-3">Go to page</span>
            <form onSubmit={onSubmitPageNumber}>
              <input
                type="number"
                className="page-number-input overflow-hidden rounded-md text-center px-1 w-9 h-9 border border-gray-300 hover:border-gray-400  focus:border-gray-400 duration-300"
                value={inputNumber}
                onChange={(e) => setInputNumber(e.target.value)}
              />
            </form>
          </div>
        </div>
      </div>
    </PaginationStyle>
  );
};
