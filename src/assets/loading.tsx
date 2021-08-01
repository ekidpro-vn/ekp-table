import React from 'react';

export const LoadingIcon: React.FC = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      style={{ background: 'none' }}
      width="35"
      height="35"
      display="block"
      preserveAspectRatio="xMidYMid"
      viewBox="0 0 100 100"
    >
      <circle
        cx="50"
        cy="50"
        r="32"
        fill="none"
        stroke="#2491db"
        strokeDasharray="150.79644737231007 52.26548245743669"
        strokeWidth="7"
      >
        <animateTransform
          attributeName="transform"
          dur="1.1363636363636365s"
          keyTimes="0;1"
          repeatCount="indefinite"
          type="rotate"
          values="0 50 50;360 50 50"
        ></animateTransform>
      </circle>
    </svg>
  );
};
