import React from 'react';
import ImageError from '../assets/error-image.png';

export const ErrorPage: React.FC = () => {
  return (
    <div className="mx-auto my-4" data-testid="error">
      <div className="flex justify-center items-center">
        <img src={ImageError} alt="error" className="w-52 mr-10" />
        <div>
          <span className="text-5xl font-bold block text-gray-700">Oops !</span>
          <span className="block text-gray-700 mt-8 text-xl">
            Looks like our server crashed !
            <br />
            We're working on a quick fix, come back soon.
          </span>
        </div>
      </div>
    </div>
  );
};
