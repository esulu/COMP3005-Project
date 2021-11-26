import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { switchClasses } from '@mui/material';

/*
Majority of the code comes from https://mui.com/components/tables
*/

interface Column {
  id: 'Tracking Number' | 'Shipping Company' | 'Order Status' | 'Order Date' | 'Shipped to Address';
  label: string;
  minWidth?: number;
  align?: 'right';
  format?: (value: number) => string;
}

const columns: readonly Column[] = [
  {
    id: 'Tracking Number',
    label: 'Tracking Number',
    minWidth: 170
  },
  {
    id: 'Shipping Company',
    label: 'Shipping Company',
    minWidth: 100
  },
  {
    id: 'Order Status',
    label: 'Order Status',
    minWidth: 170,
    align: 'right',
    //format: (value: number) => value.toLocaleString('en-US'),
  },
  {
    id: 'Order Date',
    label: 'Order Date',
    minWidth: 170,
    align: 'right',
    //format: (value: number) => value.toLocaleString('en-US'),
  },
  {
    id: 'Shipped to Address',
    label: 'Shipped to Address',
    minWidth: 170,
    align: 'right',
    //format: (value: number) => value.toFixed(2),
  },
];

function columnDataMapper(column: Column) : string {
  switch (column.id) {
    case 'Tracking Number': return "order_id";
    case 'Shipping Company': return "company_name";
    case 'Order Status': return "status";
    case 'Order Date': return "order_date";
    case 'Shipped to Address': return "order_address";
    default: return "";
  }
}


interface Data {
  order_id: string;
  company_name: string;
  status: string;
  order_date: string;
  order_address: string;
  [name:string] : string;
}

const rows : Data[] = [
  {
    order_id: '1',
    order_date: '2021-11-25T05:00:00.000Z',
    order_address: 'oaskd@gmail.com',
    company_name: 'Intact Courier',
    status: 'Received'
  } ,
  {
    order_id: '2',
    order_date: '2021-11-26T05:00:00.000Z',
    order_address: 'dsadad',
    company_name: 'Canada Post',
    status: 'Received'
  }
];

export const OrderTable = () => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={0}>
                    {columns.map((column) => {
                      const value = row[columnDataMapper(column)];
                      return (
                        <TableCell key={column.id} align={column.align}>
                          {value}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}