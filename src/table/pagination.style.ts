import styled from 'styled-components';

export const PaginationStyle = styled.div`
  height: 100%;
  width: 100%;
  background-color: white;

  @media (max-width: 639px) {
    display: block;
    .perpage-dropdown,
    .page-number {
      margin: 0 auto;
    }
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
