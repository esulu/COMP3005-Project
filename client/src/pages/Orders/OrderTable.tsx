import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { useState, useEffect } from "react";
import { UseToken } from "../../components";

/*
Code architecture comes from https://mui.com/components/tables
but modified to suit orders
*/

// Each column
interface Column {
  id: 'Tracking Number' | 'Shipping Company' | 'Order Status' | 'Order Date' | 'Shipped to Address'; // Each possible column table (is actually the key)
  label: string; // Name/label of the column
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
  },
  {
    id: 'Order Date',
    label: 'Order Date',
    minWidth: 170,
    align: 'right',
  },
  {
    id: 'Shipped to Address',
    label: 'Shipped to Address',
    minWidth: 170,
    align: 'right',
  },
];

// Maps a column name to a data name
// Required for going through a row of a data column and determining which item to output.
function columnDataMapper(column: Column): string {
  switch (column.id) {
    case 'Tracking Number': return "order_id";
    case 'Shipping Company': return "company_name";
    case 'Order Status': return "status";
    case 'Order Date': return "order_date";
    case 'Shipped to Address': return "order_address";
    default: return "";
  }
}

// Interface for data that comes from the server
// Matches exact response from the server
interface Data {
  order_id: string;
  company_name: string;
  status: string;
  order_date: string;
  order_address: string;
  [name: string]: string;
}

export const OrderTable = () => {
  const { token } = UseToken(); // token verifies which user this order table is for
  const [orders, setOrders] = useState<Data[]>([]);

  // states for moving pages
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  

  // Functions for moving the pages
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  // Function gets the order data respective to the user's id/token
  // and fills the orders state
  const getOrderData = async () => {
    let response = await fetch("http://localhost:5000/orderInfo", {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token })});

      let data = (await response.json()).rows;
      data = data.map( (obj: Data) => {
        obj.order_date = new Date(obj.order_date).toDateString();
        return obj;
      });

      setOrders(data);
  }

  // Only get orders once
  useEffect(() => {
    getOrderData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          {/* Table headers, are the columns we defined above */}
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
          {/* Output all orders given from the state */}
          <TableBody>
            {orders
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={`order-${row.order_id}`}>
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
      {/* Enables page movement in the table in bottom right corner */}
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={orders.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}