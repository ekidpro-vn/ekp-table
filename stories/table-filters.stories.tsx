import { Meta, Story } from '@storybook/react/types-6-0';
import React, { useState } from 'react';
import 'tailwindcss/tailwind.css';
import { ColumnsProps, Loader, Pagination, Table, TableProps } from '../src';
import { useTableFilter } from '../src/hooks';
import { Filter } from '../src/table/table';

function getDefault(val: string[] | undefined) {
  if (typeof val === 'undefined' || val.length === 0) {
    return '';
  }

  return val[0];
}

interface SearchProps {
  prefix: string;
}

function FilterSearch(props: SearchProps): JSX.Element {
  const { prefix } = props;
  const [keyword, setKeyword] = useTableFilter(prefix, 'keyword');
  const [value, setValue] = useState<string>(getDefault(keyword));
  const field = 'keyword';

  return (
    <div className="col-span-4 md:col-span-2 lg:col-span-1">
      <label className="block mb-1 font-medium">Search</label>
      <div className="relative">
        <input
          className="transition rounded border border-gray-300 py-1.5 pl-3 pr-7 w-full outline-none"
          type="text"
          value={value}
          placeholder="Enter..."
          name={field}
          id={field}
          onChange={(e) => setValue(e.target.value.trim())}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              if (!value) {
                if (getDefault(keyword)) {
                  setKeyword(undefined);
                }
                return;
              }
              setKeyword([value]);
            }
          }}
        />
        {value && (
          <span
            onClick={() => {
              setValue('');
              if (getDefault(keyword)) {
                setKeyword(undefined);
              }
            }}
            className="fas fa-times absolute cursor-pointer top-2.5 right-3 duration-300 text-gray-400 hover:text-gray-500"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </span>
        )}
      </div>
    </div>
  );
}

export default {
  title: 'Example/Filters',
  component: Table,
  argTypes: {},
} as Meta;

const Template: Story<TableProps<DefaultDataType>> = (args) => {
  return (
    <div>
      <Filter
        FilterComponents={[
          <FilterSearch prefix={args.prefix} />,
          <FilterSearch prefix={args.prefix} />,
          <FilterSearch prefix={args.prefix} />,
          <FilterSearch prefix={args.prefix} />,
        ]}
      />
      <Table
        {...args}
        render={(data, column) => {
          return <span>{data[column.field]}</span>;
        }}
      />
    </div>
  );
};
type DefaultDataType = {
  id: number;
  fullname: string;
  mobile: string;
  address: string;
  status: string;
  created_at: string;
  updated_at: string;
};
const ColumnsAdminList: ColumnsProps[] = [
  { field: 'id', title: '#', canSort: true },
  { field: 'fullname', title: 'NAME', canSort: true },
  { field: 'mobile', title: 'PHONE' },
  { field: 'email', title: 'EMAIL' },
  { field: 'address', title: 'ADDRESS' },
  { field: 'updated_at', title: 'UPDATED_AT' },
  { field: 'action', title: 'Action', fixed: 'right' },
];

const defaultLoader: Loader<DefaultDataType, { keyword: string }> = {
  fetch: (input) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(1);
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
          action: 'CREATE',
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
          action: 'UPDATE',
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
          action: 'DELETE',
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
          action: 'VIEW',
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
          currentPage: 3, // input.page,
          perPage: 10, // input.size,
          totalItems: 92,
          totalPages: 10,
        },
      };

      return result;
    });
  },
};

export const DefaultTable = Template.bind({});
DefaultTable.storyName = 'Table with filters';
DefaultTable.args = {
  loader: defaultLoader,
  columns: ColumnsAdminList,
  prefix: 'table-filter',
};
