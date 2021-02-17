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
        {
          uid: 3,
          fullname: '3',
          mobile: '3',
        },
        {
          uid: 4,
          fullname: '4',
          mobile: '4',
        },
        {
          uid: 5,
          fullname: '5',
          mobile: '5',
        },
        {
          uid: 6,
          fullname: '6',
          mobile: '6',
        },
        {
          uid: 7,
          fullname: '7',
          mobile: '7',
        },
        {
          uid: 8,
          fullname: '8',
          mobile: '8',
        },
        {
          uid: 9,
          fullname: '9',
          mobile: '9',
        },
        {
          uid: 10,
          fullname: '10',
          mobile: '10',
        },
        {
          uid: 11,
          fullname: '11',
          mobile: '11',
        },
        {
          uid: 12,
          fullname: '12',
          mobile: '12',
        },
      ];

      const result: Pagination<DefaultDataType> = {
        data: items,
        pagination: {
          currentPage: 1,//input.page,
          perPage: 4, // input.size,
          totalItems: 12,
          totalPages: 3,
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
