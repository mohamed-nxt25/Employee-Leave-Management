import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Card, Form } from 'react-bootstrap';
import { LuPlus, LuSquarePen, LuTrash2, LuCheck, LuX } from 'react-icons/lu';
import { getLeaveRequests, deleteLeaveRequest, approveLeaveRequest, rejectLeaveRequest } from '../../api/leaveRequestsApi';
import { useAuth } from '../../context/AuthContext';
import PageHeader from '../../components/common/PageHeader';
import DataTable, { useTableData } from '../../components/common/DataTable';
import SearchBar from '../../components/common/SearchBar';
import FilterBar from '../../components/common/FilterBar';
import Pagination from '../../components/common/Pagination';
import ConfirmModal from '../../components/common/ConfirmModal';
import AlertMessage from '../../components/common/AlertMessage';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import StatusBadge from '../../components/common/StatusBadge';
import { canReviewLeave, canViewAllLeaveRequests } from '../../roles';
import { LEAVE_STATUS } from '../../constants';

export default function LeaveRequestList() {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const visible = useMemo(() => canViewAllLeaveRequests(user?.role) ? requests : requests.filter((r) => r.employeeId === user?.employeeId), [requests, user]);
  const table = useTableData(visible, ['employeeName', 'leaveTypeName', 'reason', 'status']);

  const load = async () => { setLoading(true); try { const res = await getLeaveRequests(); if (!res.success) setError(res.message); else setRequests(res.data || []); } catch (e) { setError(e.message); } finally { setLoading(false); } };
  useEffect(() => { load(); }, []);

  const review = async (row, action) => {
    setError('');
    try {
      const fn = action === 'approve' ? approveLeaveRequest : rejectLeaveRequest;
      const res = await fn(row.leaveRequestId, user.userId, row);
      if (!res.success) setError(res.message); else { setSuccess(res.message); load(); }
    } catch (e) { setError(e.message); }
  };

  const columns = [
    { key: 'employeeName', label: 'Employee' },
    { key: 'leaveTypeName', label: 'Leave Type' },
    { key: 'startDate', label: 'Start' },
    { key: 'endDate', label: 'End' },
    { key: 'totalDays', label: 'Days' },
    { key: 'status', label: 'Status', render: (r) => <StatusBadge status={r.status} /> },
    { key: 'actions', label: 'Actions', width: '200px', render: (r) => (
      <div className="d-flex gap-1 flex-wrap">
        {canReviewLeave(user?.role) && r.status === LEAVE_STATUS.PENDING && (
          <>
            <Button size="sm" variant="outline-success" title="Approve" onClick={() => review(r, 'approve')}><LuCheck /></Button>
            <Button size="sm" variant="outline-danger" title="Reject" onClick={() => review(r, 'reject')}><LuX /></Button>
          </>
        )}
        <Button as={Link} to={`/leave-requests/${r.leaveRequestId}/edit`} size="sm" variant="outline-primary"><LuSquarePen /></Button>
        <Button size="sm" variant="outline-danger" onClick={() => setDeleteTarget(r)}><LuTrash2 /></Button>
      </div>
    )},
  ];

  return (
    <div>
      <PageHeader title="Leave Requests" subtitle={canViewAllLeaveRequests(user?.role) ? 'Review and manage requests' : 'Your leave requests'} actions={<Button as={Link} to="/leave-requests/new" className="btn-primary-custom"><LuPlus className="me-1" />Apply Leave</Button>} />
      <AlertMessage type="success" message={success} onClose={() => setSuccess('')} />
      <AlertMessage type="danger" message={error} onClose={() => setError('')} />
      <Card className="content-card border-0"><Card.Body className="p-4">
          <FilterBar>
            <div className="row g-2">
              <div className="col-md-6"><SearchBar value={table.search} onChange={table.setSearch} placeholder="Search requests..." /></div>
              <div className="col-md-6">
                <Form.Select value={table.statusFilter} onChange={(e) => table.setStatusFilter(e.target.value)}>
                  <option value="">All Statuses</option>
                  {Object.values(LEAVE_STATUS).map((s) => <option key={s} value={s}>{s}</option>)}
                </Form.Select>
              </div>
            </div>
          </FilterBar>
        {loading ? <LoadingSpinner /> : (<><DataTable columns={columns} data={table.paginatedData.map((r) => ({ ...r, _key: r.leaveRequestId }))} /><Pagination {...table} onPageChange={table.goToPage} onPageSizeChange={table.setPageSize} /></>)}
      </Card.Body></Card>
      <ConfirmModal show={!!deleteTarget} message={`Delete request for ${deleteTarget?.employeeName}?`} loading={deleting} onCancel={() => setDeleteTarget(null)}
        onConfirm={async () => { setDeleting(true); try { const res = await deleteLeaveRequest(deleteTarget.leaveRequestId); if (!res.success) setError(res.message); else { setSuccess(res.message); setDeleteTarget(null); load(); } } catch (e) { setError(e.message); } finally { setDeleting(false); } }} />
    </div>
  );
}
