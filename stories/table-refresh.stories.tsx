import { Meta, Story } from '@storybook/react/types-6-0';
import React from 'react';
import 'tailwindcss/tailwind.css';
import { Loader, Pagination, ColumnsProps, Table, TableProps, useRefresh } from '../src';

const Template: Story<TableProps<{ id: number }>> = (args) => {
  const refresh = useRefresh(args.prefix);

  return (
    <div>
      <button onClick={refresh} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Click to refresh
      </button>
      <Table {...args} />
    </div>
  );
};

const defaultLoader: Loader<{ id: number }, { keyword: string }> = {
  fetch: () => {
    return new Promise<void>((resolve) => {
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
};

const tableColumns: ColumnsProps[] = [{ field: 'id', title: '#' }];

export const TableWithRefresh = Template.bind({});
TableWithRefresh.args = {
  loader: defaultLoader,
  columns: tableColumns,
  prefix: 'default',
};

export default {
  title: 'Example/Table with refresh',
  component: TableWithRefresh,
  argTypes: {},
} as Meta;
