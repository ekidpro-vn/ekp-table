import React from 'react';
import styled from 'styled-components';

const ErrorPageDiv = styled.div`
  background-color: #fff;
  color: #000;
  font-family: helvetica, arial, sans-serif;
  font-size: 1.4em;
  line-height: 1.5;

  .emoji {
    font-size: 9em;
    text-align: center;
  }
  .title {
    text-align: center;
    line-height: 0em;
    color: grey;
  }
  .text {
    text-align: center;
  }
`;

export const ErrorPage: React.FC = () => {
  return (
    <ErrorPageDiv>
      <div className="centered">
        <div className="emoji">
          <p className="text">
            Looks like our server crashed 🙀
            <br />
            We're working on a quick fix, come back soon.
          </p>
        </div>
      </div>
    </ErrorPageDiv>
  );
};
