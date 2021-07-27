import { Meta, Story } from '@storybook/react';
import { ColumnsProps, Loader, Pagination, Table, TableProps, useTableFilter } from '../src';

export default {
  title: 'Example/Filter',
  component: Table,
  argTypes: {},
} as Meta;

function TableWithRouter(args: TableProps<DefaultDataType>) {
  const [filter, setFilter] = useTableFilter(args.prefix);
  const [filterWithKey, setFilterWithKey] = useTableFilter(args.prefix, 'another_filter_key');

  return (
    <div className="flex flex-col space-y-3">
      <div className="p-4 bg-gray-300 flex flex-row space-x-4">
        <div>
          <span>Filter:</span>
          <div>{JSON.stringify(filter)}</div>
        </div>

        <div>
          <span>Filter with key:</span>
          <div>{JSON.stringify(filterWithKey)}</div>
        </div>
      </div>

      <div className="flex flex-row space-x-2">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={() => setFilter({ name: 'Nguyễn Văn C' })}
        >
          Set filter name = 'Nguyễn Văn C'
        </button>

        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={() => setFilter({ name: ['Nguyễn Văn A', 'Nguyễn Văn D'] })}
        >
          Set filter name = 'Nguyễn Văn A' || 'Nguyễn Văn D'
        </button>

        <button className="bg-red-500 text-white px-4 py-2 rounded" onClick={() => setFilterWithKey('Nguyễn Văn C')}>
          Set filter with key = 'Nguyễn Văn C'
        </button>

        <button
          className="bg-red-500 text-white px-4 py-2 rounded"
          onClick={() => setFilterWithKey(['Nguyễn Văn A', 'Nguyễn Văn D'])}
        >
          Set filter with key = 'Nguyễn Văn A' || 'Nguyễn Văn D'
        </button>
      </div>

      <Table
        {...args}
        render={(data, column) => {
          return <span>{data[column.field]}</span>;
        }}
      />
    </div>
  );
}

const Template: Story<TableProps<DefaultDataType>> = (args) => {
  return (
    <div>
      <TableWithRouter {...args} />
    </div>
  );
};

const ColumnsAdminList: ColumnsProps[] = [
  { field: 'id', title: '#', canSort: true },
  { field: 'fullname', title: 'NAME', canSort: true },
  { field: 'mobile', title: 'PHONE' },
  { field: 'email', title: 'EMAIL' },
  { field: 'address', title: 'ADDRESS' },
  { field: 'updated_at', title: 'UPDATED_AT' },
  { field: 'action', title: 'ACTION' },
];

type DefaultDataType = {
  id: number;
  fullname: string;
  mobile: string;
  address: string;
  status: string;
  created_at: string;
  updated_at: string;
};

const defaultLoader: Loader<DefaultDataType, { keyword: string; name?: string | string[] }> = {
  fetch: (input) => {
    console.log(999, input);
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
      ].filter((o) => {
        if (typeof input.filter.name === 'undefined') {
          return o;
        }

        if (typeof input.filter.name === 'string' && input.filter.name !== '') {
          return o.fullname === input.filter.name;
        }

        return input.filter.name.includes(o.fullname);
      });

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
DefaultTable.storyName = 'Table with filter';
DefaultTable.args = {
  loader: defaultLoader,
  columns: ColumnsAdminList,
  prefix: 'filter',
};
