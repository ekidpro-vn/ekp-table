import clsx from 'clsx';
import React, { useCallback, useState } from 'react';
import { FilterStyle } from '../styles/filter.style';
import { FilterProps } from './types';

export const FilterTable: React.FC<FilterProps> = (props) => {
  const { FilterComponents, gridClassName, colClassName } = props;
  const [showFilterMobile, setShowFilterMobile] = useState<'show' | 'hidden'>('hidden');

  const onToggleFilter = useCallback(() => {
    if (showFilterMobile === 'hidden') {
      setShowFilterMobile('show');
    }
    if (showFilterMobile === 'show') {
      setShowFilterMobile('hidden');
    }
  }, [showFilterMobile]);

  return (
    <FilterStyle>
      {/* Mobile */}
      <div className="mb-5 sm:hidden" data-testid="filter-mobile">
        <div
          className={clsx({
            'mt-5 rounded': true,
            'overflow-visible-filter': showFilterMobile === 'hidden',
            'overflow-hidden-filter': showFilterMobile === 'show',
          })}
        >
          <div
            className={`flex items-center justify-between w-full py-3 px-4 rounded bg-blue-50 mb-3`}
            onClick={onToggleFilter}
          >
            <span className="font-medium">Filter</span>
            {showFilterMobile === 'hidden' && (
              <span className="duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
            )}
            {showFilterMobile === 'show' && (
              <span className="duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
            )}
          </div>
          <div
            className={clsx({
              'duration-1000 max-h-0 overflow-hidden shrink-filter-mobile': showFilterMobile === 'hidden',
              'expand-filter-mobile': showFilterMobile === 'show',
            })}
          >
            {FilterComponents.map((item, index) => {
              return (
                <div className="col-span-4 sm:col-span-2 lg:col-span-1 mt-2 sm:mt-0" key={`filter_mb_${index}`}>
                  {item}
                </div>
              );
            })}
          </div>
        </div>
      </div>
      {/* End mobile */}

      <div className={gridClassName ?? 'grid-cols-4 gap-x-8 gap-y-4 mb-10 hidden sm:grid'} data-testid="filter">
        {FilterComponents.map((item, index) => {
          return (
            <div
              className={colClassName ?? 'col-span-4 sm:col-span-2 lg:col-span-1 mt-2 sm:mt-0'}
              key={`filter_${index}`}
            >
              {item}
            </div>
          );
        })}
      </div>
    </FilterStyle>
  );
};
