import React, { useState } from 'react';
import '../styles/filter.css';

interface FilterProps {
  dataFilter: DataFilterProps[];
}

export interface DataFilterProps {
  FilterComponent: React.ReactElement;
}

export const FilterTable: React.FC<FilterProps> = (props) => {
  const { dataFilter } = props;
  const [showFilterMobile, setShowFilterMobile] = useState<'load' | 'show' | 'hidden'>('load');

  const onToggleFilter = () => {
    if (showFilterMobile === 'load' || showFilterMobile === 'hidden') {
      setShowFilterMobile('show');
    }
    if (showFilterMobile === 'show') {
      setShowFilterMobile('hidden');
    }
  };

  const renderClassName = (classLoad: string, classShow: string, classHidden: string) => {
    if (showFilterMobile === 'hidden') {
      return classHidden;
    }
    if (showFilterMobile === 'show') {
      return classShow;
    }
    return classLoad;
  };

  return (
    <div>
      {/* Mobile */}
      <div className="mb-5 sm:hidden">
        <div className={`mt-5 rounded ${renderClassName('', 'overflow-visible-filter', 'overflow-hidden-filter')}`}>
          <div
            className={`flex items-center justify-between w-full py-3 px-4 rounded bg-blue-50 mb-3`}
            onClick={onToggleFilter}
          >
            <span>Filter</span>
            <i
              className={`duration-300 fas text-xl fa-caret-right ${renderClassName(
                '',
                'accordion-filter-mobile-icon-expand',
                'accordion-filter-mobile-icon-shrink'
              )}`}
            ></i>
          </div>
          <div
            className={`${renderClassName(
              'duration-1000 max-h-0 overflow-hidden',
              'expand-filter-mobile',
              'shrink-filter-mobile'
            )}`}
          >
            {dataFilter.map((item, index) => {
              return (
                <div className="col-span-4 sm:col-span-2 lg:col-span-1 mt-2 sm:mt-0" key={index}>
                  {item.FilterComponent}
                </div>
              );
            })}
          </div>
        </div>
      </div>
      {/* End mobile */}

      <div className="grid-cols-4 gap-x-8 gap-y-4 mb-10 hidden sm:grid">
        {dataFilter.map((item, index) => {
          return (
            <div className="col-span-4 sm:col-span-2 lg:col-span-1 mt-2 sm:mt-0" key={index}>
              {item.FilterComponent}
            </div>
          );
        })}
      </div>
    </div>
  );
};
