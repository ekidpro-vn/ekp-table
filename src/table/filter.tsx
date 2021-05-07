import clsx from 'clsx';
import React, { useCallback, useState } from 'react';
import { FilterStyle } from '../styles/filter.style';
import { FilterProps } from './types';

export const FilterTable: React.FC<FilterProps> = (props) => {
  const { dataFilter, gridClassName, colClassName } = props;
  const [showFilterMobile, setShowFilterMobile] = useState<'load' | 'show' | 'hidden'>('load');

  const onToggleFilter = useCallback(() => {
    if (showFilterMobile === 'load' || showFilterMobile === 'hidden') {
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
            <span>Filter</span>
            <i
              className={clsx({
                'duration-300 fas text-xl fa-caret-right': true,
                'accordion-filter-mobile-icon-shrink': showFilterMobile === 'hidden',
                'accordion-filter-mobile-icon-expand': showFilterMobile === 'show',
              })}
            ></i>
          </div>
          <div
            className={clsx({
              'duration-1000 max-h-0 overflow-hidden': showFilterMobile === 'load',
              'shrink-filter-mobile': showFilterMobile === 'hidden',
              'expand-filter-mobile': showFilterMobile === 'show',
            })}
          >
            {dataFilter.map((item, index) => {
              return (
                <div className="col-span-4 sm:col-span-2 lg:col-span-1 mt-2 sm:mt-0" key={`filter_mb_${index}`}>
                  {item.FilterComponent}
                </div>
              );
            })}
          </div>
        </div>
      </div>
      {/* End mobile */}

      <div className={gridClassName ?? 'grid-cols-4 gap-x-8 gap-y-4 mb-10 hidden sm:grid'} data-testid="filter">
        {dataFilter.map((item, index) => {
          return (
            <div
              className={colClassName ?? 'col-span-4 sm:col-span-2 lg:col-span-1 mt-2 sm:mt-0'}
              key={`filter_${index}`}
            >
              {item.FilterComponent}
            </div>
          );
        })}
      </div>
    </FilterStyle>
  );
};
