import styled, { keyframes } from 'styled-components';

const rotateFilterExpand = keyframes`
  0% {transform: rotate(0);}
  100% {transform: rotate(90deg);}
`;

const rotateFilterShrink = keyframes`
  0% {transform: rotate(90deg);}
  100% {transform: rotate(0);}
`;

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
  .accordion-filter-mobile-icon-expand {
    animation: ${rotateFilterExpand} 0.3s forwards;
  }

  .accordion-filter-mobile-icon-shrink {
    animation: ${rotateFilterShrink} 0.3s forwards;
  }

  .overflow-visible-filter {
    animation: ${overflowVisibleFilter} 0.5s forwards;
  }

  .overflow-hidden-filter {
    animation: ${overflowHiddenFilter} 0.5s forwards;
  }
`;
