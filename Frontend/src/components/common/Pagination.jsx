import { Pagination as BSPagination, Form } from 'react-bootstrap';
import { PAGE_SIZE_OPTIONS } from '../../constants';

export default function Pagination({ currentPage, totalPages, totalItems, pageSize, onPageChange, onPageSizeChange }) {
  if (totalItems === 0) return null;

  const pages = [];
  const max = 5;
  let start = Math.max(1, currentPage - 2);
  let end = Math.min(totalPages, start + max - 1);
  start = Math.max(1, end - max + 1);
  for (let p = start; p <= end; p += 1) pages.push(
    <BSPagination.Item key={p} active={p === currentPage} onClick={() => onPageChange(p)}>{p}</BSPagination.Item>,
  );

  return (
    <div className="pagination-bar">
      <div className="d-flex align-items-center gap-2 pagination-info">
        <span className="pagination-summary">
          Page {currentPage} of {totalPages} · {totalItems} items
        </span>
        <span className="pagination-summary-short">
          {currentPage}/{totalPages} · {totalItems}
        </span>
        <Form.Select size="sm" className="pagination-size-select" value={pageSize} onChange={(e) => onPageSizeChange(e.target.value)}>
          {PAGE_SIZE_OPTIONS.map((n) => <option key={n} value={n}>{n} / page</option>)}
        </Form.Select>
      </div>
      <BSPagination className="mb-0 pagination-nav">
        <BSPagination.First className="pagination-extreme" disabled={currentPage === 1} onClick={() => onPageChange(1)} />
        <BSPagination.Prev disabled={currentPage === 1} onClick={() => onPageChange(currentPage - 1)} />
        {pages}
        <BSPagination.Next disabled={currentPage === totalPages} onClick={() => onPageChange(currentPage + 1)} />
        <BSPagination.Last className="pagination-extreme" disabled={currentPage === totalPages} onClick={() => onPageChange(totalPages)} />
      </BSPagination>
    </div>
  );
}
