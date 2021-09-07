import clsx from 'clsx';
import React, { FormEvent, memo, RefObject, useCallback, useEffect, useRef, useState } from 'react';
import { useFilter } from '../hooks';
import { PaginationStyle } from '../styles/pagination.style';
import { DataPagination, PageNumberProps, PageSizeDropdownProps, PaginationUIProps } from './types';

const dataPageSize: { value: number; label: string }[] = [5, 10, 20, 50, 100].map((item) => {
  return { value: item, label: `${item}` };
});

const ControlButton: React.FC<{ special?: 'first' | 'prev' | 'next' | 'last' }> = memo(({ special }) => {
  switch (special) {
    case 'first':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path
            fillRule="evenodd"
            d="M15.707 15.707a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 010 1.414zm-6 0a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 011.414 1.414L5.414 10l4.293 4.293a1 1 0 010 1.414z"
            clipRule="evenodd"
          />
        </svg>
      );

    case 'prev':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
          <path
            fillRule="evenodd"
            d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
            clipRule="evenodd"
          />
        </svg>
      );

    case 'next':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
          <path
            fillRule="evenodd"
            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
            clipRule="evenodd"
          />
        </svg>
      );

    case 'last':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path
            fillRule="evenodd"
            d="M10.293 15.707a1 1 0 010-1.414L14.586 10l-4.293-4.293a1 1 0 111.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z"
            clipRule="evenodd"
          />
          <path
            fillRule="evenodd"
            d="M4.293 15.707a1 1 0 010-1.414L8.586 10 4.293 5.707a1 1 0 011.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z"
            clipRule="evenodd"
          />
        </svg>
      );

    default:
      return null;
  }
});

const PageNumber: React.FC<PageNumberProps> = (props) => {
  const { page, selected, special, disable, onClick } = props;
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
          'w-5 h-5 overflow-hidden': true,
          'p-0': special === 'prev' || special === 'next',
          'p-2': special !== 'prev' && special !== 'next',
        })}
      >
        {special ? <ControlButton special={special} /> : <span className="font-medium">{page}</span>}
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
        className={clsx({
          'ekp-pagination-dropdown relative cursor-pointer rounded inline-flex sm:flex items-center px-4 h-9 hover:bg-blue-500 duration-300':
            true,
          'bg-blue-500': showSelectPageSize,
          'bg-gray-200': !showSelectPageSize,
        })}
        onClick={() => setShowSelectPageSize(!showSelectPageSize)}
        ref={pageSizeDropdownRef}
      >
        <span
          className={clsx({
            'ekp-pagination-dropdown-label mr-2': true,
            'text-white': showSelectPageSize,
            'text-gray-500': !showSelectPageSize,
          })}
        >
          {pageSize}
        </span>
        <span
          className={clsx({
            'text-white': showSelectPageSize,
            'text-gray-500 arrow-down': !showSelectPageSize,
          })}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </span>
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
                      className={clsx({
                        'group py-1 px-4 rounded-sm border border-t-0 border-l-0 border-r-0 border-white hover:bg-blue-500':
                          true,
                        'bg-blue-500': pageSize === item.value,
                      })}
                      onClick={() => onSelectPageSize(item)}
                    >
                      <span
                        className={clsx({
                          'group-hover:text-white': true,
                          'text-white': pageSize === item.value,
                        })}
                      >
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

  const getListPageNumber = useCallback(
    (pagination: DataPagination) => {
      const { currentPage, totalPages, perPage, totalItems } = pagination;
      const dataTable = data?.data || [];

      if (dataTable && dataTable.length > 0) {
        if (
          !Number.isInteger(currentPage) ||
          !Number.isInteger(totalPages) ||
          !Number.isInteger(perPage) ||
          !Number.isInteger(totalItems)
        ) {
          return [0];
        }

        if (totalPages < 1 || currentPage < 1 || perPage < 1 || totalItems < 1) {
          return [0];
        }
      }

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
      return listPage;
    },
    [data]
  );

  if (!data || !data.pagination || (data.pagination && data.pagination.totalPages && data.pagination.totalPages < 2)) {
    return null;
  }

  const { pagination } = data;
  const { currentPage, totalPages } = pagination;

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
            {getListPageNumber(pagination).map((idx) => (
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
