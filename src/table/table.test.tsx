import '@testing-library/jest-dom/extend-expect';
import { act, render } from '@testing-library/react';
import axios from 'axios';
import { get } from 'lodash';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import React from 'react';
import { Table } from './table';
import { ColumnsProps, Loader, Pagination } from './types';

interface UserFilter {
  type?: string;
  keyword?: string;
  status?: string;
}

export interface UserInfo {
  avatar: string;
  created_at: number;
  email: string;
  fullname: string;
  last_active?: number | null;
  metadata?: string | null;
  mobile?: string | null;
  status: string;
  type: string;
  uid: number;
  updated_at?: number;
  username: string;
}

export const ColumnsAdminList: ColumnsProps[] = [
  { field: 'uid', title: '#' },
  { field: 'fullname', title: 'INFO' },
  { field: 'mobile', title: 'PHONE' },
  { field: 'email', title: 'EMAIL' },
  { field: 'status', title: 'STATUS' },
  { field: 'created_at', title: 'CREATED_AT' },
  { field: 'updated_at', title: 'UPDATED_AT' },
  { field: 'action', title: 'ACTION' },
];

const server = setupServer(
  rest.get('/user/success', (req, res, ctx) => {
    return res(
      ctx.json({
        success: true,
        message: '200',
        data: [
          {
            uid: 290,
            username: 'ducnh1',
            fullname: 'Nguy\u1ec5n \u0110\u1ee9c',
            email: 'ducnh1@gmail.com',
            avatar: 'https://api-superapp-dev.ekidhub.com/upload/1612341181762cffcd1f82913c83bc361fe13e2b0576744.png',
            mobile: '0376876191',
            type: 'ADMIN',
            status: 'ACTIVE',
            metadata: '{"age":"hahahaha"}',
            last_active: null,
            created_at: 1612341181000,
            updated_at: 1614591213000,
          },
          {
            uid: 289,
            username: 'ducnh199x',
            fullname: 'Nguy\u1ec5n H\u1ed3ng \u0110\u1ee9c',
            email: 'autoclickvn@gmail.com',
            avatar: '',
            mobile: '',
            type: 'ADMIN',
            status: 'INACTIVE',
            metadata: '{"ducnh":"1999"}',
            last_active: null,
            created_at: 1612280794000,
            updated_at: 1612341237000,
          },
          {
            uid: 17,
            username: 'quangmd',
            fullname: 'Quang Mai Duy',
            email: 'quangmd@egroup.vn',
            avatar: 'https://api.ekidhub.com//upload/images/1595267746df8051d67d7b345671358e0222116365.jpeg',
            mobile: '0966666666',
            type: 'ADMIN',
            status: 'ACTIVE',
            metadata:
              '{"token_ekid":"Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIyMTEzIiwiZGV2aWNlX2lkIjoiZWE0ZmM1MmMtYzE3ZS00MDQyLTgwMWUtMWZjMmE3YjlkZjQ0In0.gVKpQUh7sqXs7NlHgZUy4NNUPxs-0HqGjbb1us6w40g"}',
            last_active: null,
            created_at: 1593592382000,
            updated_at: 1597654070000,
          },
          {
            uid: 1,
            username: 'admin',
            fullname: 'Admin',
            email: 'admin@ekidhub.com',
            avatar: '',
            mobile: '032323239',
            type: 'ADMIN',
            status: 'ACTIVE',
            metadata: null,
            last_active: 1593171767000,
            created_at: null,
            updated_at: 1607594081000,
          },
        ],
        status: 200,
        pagination: { total_items: 4, per_page: 10, current_page: 1, total_pages: 1 },
      })
    );
  }),
  rest.get('/user/empty', (req, res, ctx) => {
    return res(
      ctx.json({
        success: true,
        message: '200',
        data: [],
        status: 200,
        pagination: { total_items: 0, per_page: 10, current_page: 1, total_pages: 1 },
      })
    );
  }),
  rest.get('/user/error', (req, res, ctx) => {
    return res(
      ctx.json({
        message: 'Unauthorized.',
        status: false,
      })
    );
  }),
  rest.get('/user/loading', (req, res, ctx) => {
    return res(
      ctx.json({
        success: true,
        message: '200',
        data: null,
      })
    );
  }),
  rest.get('/user/html', (req, res, ctx) => {
    return res(ctx.text('<html>abc</html>'));
  })
);

const UserLoader: Loader<UserInfo, { keyword: string }> = {
  // /user/loading, /user/error, /user/10-page, /user/empty
  fetch: async (input) => {
    const response = await axios({
      method: 'get',
      url: '/user/success',
      params: {
        current_page: input.page,
        per_page: input.size,
        type: 'ADMIN',
        keyword: input.filter.keyword,
        ...input.filter,
      },
    });

    const { success, message, data } = response.data;

    if (!success) {
      throw Error(message);
    }
    // transform data
    const result: Pagination<UserInfo> = {
      data: data,
      pagination: {
        currentPage: get(response, 'data.pagination.current_page') ?? 1,
        perPage: get(response, 'data.pagination.per_page') ?? 10,
        totalItems: get(response, 'data.pagination.total_items') ?? 0,
        totalPages: get(response, 'data.pagination.total_pages') ?? 0,
      },
    };
    return result;
  },
};

const renderView = (data: UserInfo, column: ColumnsProps) => {
  if (!data) {
    return <></>;
  }

  const { uid, avatar, fullname, username, mobile, email, status, created_at, updated_at } = data;

  switch (column.field) {
    case 'uid':
      return <span>{uid}</span>;

    case 'fullname':
      return <span>{uid}</span>;

    case 'mobile':
      return <span>{uid}</span>;

    default:
      return <span>{get(data, 'column.field')}</span>;
  }
};

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// TODO:
// 1. check table, phân trang được hiển thị

// 2. Check wrapper được hiển thị hay ko

// 3. Check có filter hay ko

// 4: Check khi data rỗng []

// 5: Check api lỗi

// 6: check loading

// 7: check data trả về bị lỗi html

// sử dụng lại các test case  (chưa làm)

test('1. Exist table, pagination', async () => {
  await act(async () => {
    const { findByTestId } = render(<Table loader={UserLoader} columns={ColumnsAdminList} render={renderView} />);
    const table = await findByTestId('table');
    const pagination = await findByTestId('pagination');

    expect(table).toBeTruthy();
    expect(pagination).toBeTruthy();
  });
});

test('2. Exist wrapper', async () => {
  await act(async () => {
    const Wrapper: React.FC = (props) => {
      return <div data-testid="wrapper">{props.children}</div>;
    };
    const { findByTestId } = render(
      <Table<UserInfo>
        loader={UserLoader}
        columns={ColumnsAdminList}
        Wrapper={Wrapper}
        render={(data, column: ColumnsProps) => {
          if (!data) {
            return <></>;
          }
          const { field } = column;

          switch (column.field) {
            case 'uid':
              return <span>{data[field]}</span>;

            case 'fullname':
              return <span>{data[field]}</span>;

            case 'mobile':
              return <span>{data[field]}</span>;

            default:
              return <span>{get(data, 'column.field')}</span>;
          }
        }}
      />
    );
    const wrapper = await findByTestId('wrapper');
    const table = await findByTestId('table');

    expect(wrapper).toBeTruthy();
    expect(table).toBeTruthy();
  });
});

test('3. Exist filter data', async () => {
  await act(async () => {
    const dataFilter = [{ FilterComponent: <div>ducnh</div> }];
    const { findByTestId } = render(
      <>
        <Table loader={UserLoader} columns={ColumnsAdminList} render={renderView} />
      </>
    );
    const filter = await findByTestId('filter');
    const filterMobile = await findByTestId('filter-mobile');
    const table = await findByTestId('table');

    expect(filter).toBeTruthy();
    expect(filterMobile).toBeTruthy();
    expect(table).toBeTruthy();
  });
});

test('4. Empty data', async () => {
  await act(async () => {
    const configLoader = UserLoader;
    // configLoader.url = '/user/empty';
    const { findByTestId } = render(<Table loader={configLoader} columns={ColumnsAdminList} render={renderView} />);
    const empty = await findByTestId('empty');
    const table = await findByTestId('table');

    expect(empty).toBeTruthy();
    expect(table).toBeTruthy();
  });
});

test('5. API error', async () => {
  await act(async () => {
    const configLoader = UserLoader;
    // configLoader.url = '/user/error';
    const { findByTestId } = render(<Table loader={configLoader} columns={ColumnsAdminList} render={renderView} />);
    const error = await findByTestId('error');

    expect(error).toBeTruthy();
  });
});

test('6. Exist loading', async () => {
  await act(async () => {
    const configLoader = UserLoader;
    // configLoader.url = '/user/loading';
    const { findByTestId } = render(<Table loader={configLoader} columns={ColumnsAdminList} render={renderView} />);
    const loading = await findByTestId('loading');

    expect(loading).toBeTruthy();
  });
});

test('7. API error html', async () => {
  await act(async () => {
    const configLoader = UserLoader;
    // configLoader.url = '/user/html';
    const { findByTestId } = render(<Table loader={configLoader} columns={ColumnsAdminList} render={renderView} />);
    const error = await findByTestId('error');

    expect(error).toBeTruthy();
  });
});
