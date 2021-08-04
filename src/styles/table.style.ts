import styled from 'styled-components';

export const TableStyle = styled.div`
  .wrap-table::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 3px rgba(0, 0, 0, 0.1);
    border-radius: 15px;
    background-color: #f1f1f1;
    transition: 0.3s;
  }

  .wrap-table::-webkit-scrollbar {
    background-color: #f1f1f1;
    height: 7px;
    transition: 0.3s;
  }
  .wrap-table::-webkit-scrollbar-thumb {
    border-radius: 15px;
    -webkit-box-shadow: inset 0 0 3px rgba(0, 0, 0, 0.1);
    background-color: #a5a5a5;
  }
`;
