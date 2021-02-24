import React from 'react';
import ImageError from '../assets/error-image.png';

export const ErrorPage: React.FC = () => {
  return (
    <div className="mx-auto my-4">
      <div className="flex justify-center items-center">
        <img src={ImageError} alt="error" className="w-36 mr-5" />
        <span className="text-center text-gray-600">
          Looks like our server crashed !
          <br />
          We're working on a quick fix, come back soon.
        </span>
      </div>
    </div>
  );
};
