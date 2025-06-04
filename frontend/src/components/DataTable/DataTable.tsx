'use client';

import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  IconButton,
  Tooltip,
} from '@mui/material';
import type { DataTableProps } from './types';

export function DataTable<T>({
  data,
  columns,
  actions,
  getRowId,
  rowsPerPageOptions = [5, 10, 25],
  defaultRowsPerPage = 10,
  labelRowsPerPage = 'Linhas por página',
  labelDisplayedRows = ({ from, to, count }) => `${from}-${to} de ${count}`,
}: DataTableProps<T>) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(defaultRowsPerPage);

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell key={column.id}>{column.label}</TableCell>
              ))}
              {actions && <TableCell align="right">Ações</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {data
              ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((item) => (
                <TableRow
                  hover
                  key={getRowId(item)}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  {columns.map((column) => (
                    <TableCell key={`${getRowId(item)}-${column.id}`}>
                      {column.render ? column.render(item) : (item as any)[column.id]}
                    </TableCell>
                  ))}
                  {actions && (
                    <TableCell align="right">
                      {actions.map((action, index) => (
                        <Tooltip key={index} title={action.tooltip}>
                          <IconButton
                            size="small"
                            onClick={() => action.onClick(item)}
                            color={action.color}
                          >
                            {action.icon}
                          </IconButton>
                        </Tooltip>
                      ))}
                    </TableCell>
                  )}
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={rowsPerPageOptions}
        component="div"
        count={data?.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage={labelRowsPerPage}
        labelDisplayedRows={labelDisplayedRows}
      />
    </Paper>
  );
} 