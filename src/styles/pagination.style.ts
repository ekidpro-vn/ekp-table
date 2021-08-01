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

      justify-content: center;
    }
  }

  .ekp-pagination-dropdown:hover {
    span.ekp-pagination-dropdown-label {
      color: #fff !important;
      transition: 0.3s;
    }
    .arrow-down {
      color: #fff !important;
      transition: 0.3s;
    }
  }

  .perpage-options {
    box-shadow: 0px 1px 5px -2px rgba(0, 0, 0, 0.75);
    top: -465%;
  }

  .page-number-input::-webkit-outer-spin-button,
  .page-number-input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  .page-number-input {
    &:focus {
      outline: none;
    }
    -moz-appearance: textfield;
  }
`;
