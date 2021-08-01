import styled from 'styled-components';

export const TableStyle = styled.div`
  .wrap-table::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 3px rgba(0, 0, 0, 0.1);
    border-radius: 10px;
    background-color: #f1f1f1;
  }

  .wrap-table::-webkit-scrollbar {
    background-color: #f1f1f1;
    height: 5px;
  }

  .wrap-table::-webkit-scrollbar-thumb {
    border-radius: 10px;
    -webkit-box-shadow: inset 0 0 3px rgba(0, 0, 0, 0.1);
    background-color: #c1c1c1;
  }
`;
