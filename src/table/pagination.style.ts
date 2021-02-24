import styled from 'styled-components';

export const PaginationStyle = styled.ul`
  display: flex;
  background-color: white;
  align-items: center;
  justify-content: space-between;

  @media (max-width: 639px) {
    display: block;
  }

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

  .ekp-pagination-dropdown:hover {
    span.ekp-pagination-dropdown-label {
      color: #fff !important;
      transition: 0.3s;
    }
    i {
      color: #fff !important;
      transition: 0.3s;
    }
  }
`;
