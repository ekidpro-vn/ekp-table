import { Meta, Story } from '@storybook/react/types-6-0';
import React from 'react';
import 'tailwindcss/tailwind.css';
import { Loader, Pagination, StructureProps, Table, TableProps, useRefresh } from '../src';

const Template: Story<TableProps> = (args) => {
  const refresh = useRefresh(args.prefix);

  return (
    <div>
      <button onClick={refresh}>Click to refresh</button>
      <Table {...args} />
    </div>
  );
};

const defaultLoader: Loader<{ id: number }, { keyword: string }> = {
  url: 'api on server, we will mock something',
  fetch: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 3000);
    }).then(() => {
      const items = [
        {
          id: Math.random(),
        },
      ];

      const result: Pagination<{ id: number }> = {
        data: items,
        pagination: {
          currentPage: 1, // input.page,
          perPage: 5, // input.size,
          totalItems: 1,
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

const tableColumns: StructureProps[] = [{ enable: true, field: 'id', titleLanguage: '#' }];

export const TableWithRefresh = Template.bind({});
TableWithRefresh.args = {
  loader: defaultLoader,
  structure: tableColumns,
  prefix: 'default',
};

export default {
  title: 'Example/Table with refresh',
  component: TableWithRefresh,
  argTypes: {},
} as Meta;
