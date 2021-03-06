import { Meta, Story } from '@storybook/react/types-6-0';
import React from 'react';
import 'tailwindcss/tailwind.css';
import { Loader, Pagination, StructureProps, Table, TableProps } from '../src';

export default {
  title: 'Example/Table',
  component: Table,
  argTypes: {},
} as Meta;

const Template: Story<TableProps> = (args) => <Table {...args} />;
type DefaultDataType = {
  id: number;
  fullname: string;
  mobile: string;
  email: string;
  address: string;
  status: string;
  created_at: string;
  updated_at: string;
};
const StructureAdminList: StructureProps[] = [
  { enable: true, field: 'id', titleLanguage: '#' },
  { enable: true, field: 'fullname', titleLanguage: 'NAME' },
  { enable: true, field: 'mobile', titleLanguage: 'PHONE' },
  { enable: true, field: 'email', titleLanguage: 'EMAIL' },
  { enable: true, field: 'address', titleLanguage: 'ADDRESS' },
  { enable: true, field: 'status', titleLanguage: 'STATUS' },
  { enable: true, field: 'created_at', titleLanguage: 'CREATED_AT' },
  { enable: true, field: 'updated_at', titleLanguage: 'UPDATED_AT' },
];
const defaultLoader: Loader<DefaultDataType, { keyword: string }> = {
  url: 'api on server, we will mock something',
  fetch: (input) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 3000);
    }).then(() => {
      const items = [
        {
          id: 1,
          fullname: 'Nguyễn Văn A',
          mobile: '0123456789',
          email: 'nguyenvana@gmail.com',
          address: 'Hà Nội - Việt Nam',
          status: 'ACTIVE',
          created_at: '03/02/2021 15:33',
          updated_at: '03/02/2021 15:33',
        },
        {
          id: 2,
          fullname: 'Nguyễn Văn B',
          mobile: '0123456789',
          email: 'nguyenvana@gmail.com',
          address: 'Hà Nội - Việt Nam',
          status: 'ACTIVE',
          created_at: '03/02/2021 15:33',
          updated_at: '03/02/2021 15:33',
        },
        {
          id: 3,
          fullname: 'Nguyễn Văn C',
          mobile: '0123456789',
          email: 'nguyenvana@gmail.com',
          address: 'Hà Nội - Việt Nam',
          status: 'ACTIVE',
          created_at: '03/02/2021 15:33',
          updated_at: '03/02/2021 15:33',
        },
        {
          id: 4,
          fullname: 'Nguyễn Văn D',
          mobile: '0123456789',
          email: 'nguyenvana@gmail.com',
          address: 'Hà Nội - Việt Nam',
          status: 'ACTIVE',
          created_at: '03/02/2021 15:33',
          updated_at: '03/02/2021 15:33',
        },
        {
          id: 5,
          fullname: 'Nguyễn Văn E',
          mobile: '0123456789',
          email: 'nguyenvana@gmail.com',
          address: 'Hà Nội - Việt Nam',
          status: 'ACTIVE',
          created_at: '03/02/2021 15:33',
          updated_at: '03/02/2021 15:33',
        },
      ];

      const result: Pagination<DefaultDataType> = {
        data: items,
        pagination: {
          currentPage: 1, // input.page,
          perPage: 5, // input.size,
          totalItems: 5,
          totalPages: 1,
        },
      };

      return result;
    });
  },
  render: (data, field) => {
    return <span>{data[field] ?? 'Unknown'}</span>;
  },
};

export const DefaultTable = Template.bind({});
DefaultTable.args = {
  loader: defaultLoader,
  structure: StructureAdminList,
  prefix: 'default',
};
