import { useState, useMemo } from 'react';
import { Table } from 'react-bootstrap';
import { DEFAULT_PAGE_SIZE } from '../../constants';
import EmptyState from './EmptyState';

// Search + filter + pagination for list pages
export function useTableData(data = [], searchKeys = [], pageSize = DEFAULT_PAGE_SIZE) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(pageSize);

  const filtered = useMemo(() => {
    let rows = [...data];
    if (search.trim()) {
      const term = search.toLowerCase();
      rows = rows.filter((row) =>
        searchKeys.some((key) => String(row[key] ?? '').toLowerCase().includes(term)),
      );
    }
    if (statusFilter) rows = rows.filter((row) => row.status === statusFilter);
    return rows;
  }, [data, search, searchKeys, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / rowsPerPage));
  const safePage = Math.min(currentPage, totalPages);

  const paginated = useMemo(() => {
    const start = (safePage - 1) * rowsPerPage;
    return filtered.slice(start, start + rowsPerPage);
  }, [filtered, safePage, rowsPerPage]);

  return {
    search, statusFilter, currentPage: safePage, pageSize: rowsPerPage,
    filteredData: filtered, paginatedData: paginated,
    totalItems: filtered.length, totalPages,
    setSearch: (v) => { setSearch(v); setCurrentPage(1); },
    setStatusFilter: (v) => { setStatusFilter(v); setCurrentPage(1); },
    setPageSize: (v) => { setRowsPerPage(Number(v)); setCurrentPage(1); },
    goToPage: (p) => setCurrentPage(Math.max(1, Math.min(p, totalPages))),
  };
}

export default function DataTable({ columns, data, emptyMessage = 'No records found.', emptyAction }) {
  return (
    <div className="table-wrap">
      <Table hover responsive className="align-middle mb-0 custom-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key} style={col.width ? { width: col.width } : undefined}>{col.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="border-0">
                <EmptyState title={emptyMessage} action={emptyAction} />
              </td>
            </tr>
          ) : data.map((row) => (
            <tr key={row._key ?? row.id}>
              {columns.map((col) => (
                <td key={col.key}>{col.render ? col.render(row) : row[col.key]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}
