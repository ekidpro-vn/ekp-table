import React, { memo } from 'react';
import { LoadingIcon } from '../assets/loading';

export const TableLoading: React.FC = memo(() => {
  return (
    <div
      className="absolute z-50 top-0 left-0 flex items-center justify-center min-h-96 bg-gray-100 bg-opacity-50 w-full h-full pt-10 pb-20"
      data-testid="loading"
    >
      <div className="absolute left-0 top-44 right-0 mx-auto w-52 text-center flex shadow-md rounded-full items-center justify-center px-4 overflow-hidden bg-white py-2.5">
        <LoadingIcon />
        <span className="ml-3 text-indigo-900 font-semibold">Loading...</span>
      </div>
    </div>
  );
});
