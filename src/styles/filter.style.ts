import styled, { keyframes } from 'styled-components';

const overflowVisibleFilter = keyframes`
  0% {overflow: hidden;}
  100%{overflow: visible;}
`;

const overflowHiddenFilter = keyframes`
  0% {overflow: visible;}
  100%{overflow: hidden;}
`;

export const FilterStyle = styled.div`
  .expand-filter-mobile {
    transition: max-height 1s;
    max-height: 1000px;
  }

  .shrink-filter-mobile {
    max-height: 0;
    transition: max-height 0.3s;
  }

  .shrink-filter-mobile div {
    opacity: 0;
    transition: 0.3s;
  }

  .overflow-visible-filter {
    animation: ${overflowVisibleFilter} 0.5s forwards;
  }

  .overflow-hidden-filter {
    animation: ${overflowHiddenFilter} 0.5s forwards;
  }
`;
