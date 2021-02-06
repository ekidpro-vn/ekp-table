import React from 'react';
import { Story, Meta } from '@storybook/react/types-6-0';
import 'tailwindcss/tailwind.css';


import { Table, TableProps, Loader, StructureProps, Pagination } from '../src';

export default {
  title: 'Example/Table',
  component: Table,
  argTypes: {},
} as Meta;

const Template: Story<TableProps> = (args) => <Table {...args} />;
type DefaultDataType = { uid: number; fullname: string; mobile: string };
const StructureAdminList: StructureProps[] = [
  { enable: true, field: 'uid', titleLanguage: '#' },
  { enable: true, field: 'fullname', titleLanguage: 'INFO' },
  { enable: true, field: 'mobile', titleLanguage: 'PHONE' },
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
          uid: 1,
          fullname: '1',
          mobile: '1',
        },
        {
          uid: 2,
          fullname: '2',
          mobile: '2',
        },
      ];

      const result: Pagination<DefaultDataType> = {
        data: items,
        pagination: {
          currentPage: input.page,
          perPage: input.size,
          totalItems: 2,
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
