export interface Column<T> {
  id: string;
  label: string;
  render?: (item: T) => React.ReactNode;
}

export interface Action<T> {
  icon: React.ReactNode;
  tooltip: string;
  onClick: (item: T) => void;
  color?: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
}

export interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  actions?: Action<T>[];
  isLoading?: boolean;
  getRowId: (item: T) => string | number;
  rowsPerPageOptions?: number[];
  defaultRowsPerPage?: number;
  labelRowsPerPage?: string;
  labelDisplayedRows?: (params: { from: number; to: number; count: number }) => string;
} 