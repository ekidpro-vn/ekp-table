import React from 'react';
import { ErrorIcon } from '../assets/error-icon';

export const ErrorPage: React.FC<{ messages?: string }> = ({ messages }) => {
  return (
    <div className="mx-auto mb-4 pt-10" data-testid="error">
      <div className="flex justify-center items-center">
        <div className="mr-20">
          <ErrorIcon />
        </div>
        <div>
          <span className="text-5xl font-bold block text-gray-700">Oops !</span>
          {messages ? (
            <span className="block text-gray-700 mt-8 text-xl">{messages}</span>
          ) : (
            <span className="block text-gray-700 mt-8 text-xl">
              Looks like our server crashed !
              <br />
              We're working on a quick fix, come back soon.
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
