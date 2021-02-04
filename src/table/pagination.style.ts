import styled from 'styled-components';

export const PaginationStyle = styled.ul`
  display: flex;
  background-color: white;

  li {
    display: inline-block;
    margin-right: 4px;

    div {
      display: flex;
      align-items: center;
      height: 2.25rem;
      min-width: 2.25rem;
      padding: 0.5rem;

      justify-content: center;
    }
  }
`;
