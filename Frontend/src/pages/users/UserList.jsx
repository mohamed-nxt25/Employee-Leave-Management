import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Card } from 'react-bootstrap';
import { LuPlus, LuSquarePen, LuTrash2 } from 'react-icons/lu';
import { getUsers, deleteUser } from '../../api/usersApi';
import PageHeader from '../../components/common/PageHeader';
import DataTable, { useTableData } from '../../components/common/DataTable';
import SearchBar from '../../components/common/SearchBar';
import FilterBar from '../../components/common/FilterBar';
import Pagination from '../../components/common/Pagination';
import ConfirmModal from '../../components/common/ConfirmModal';
import AlertMessage from '../../components/common/AlertMessage';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import StatusBadge from '../../components/common/StatusBadge';

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const table = useTableData(users, ['username', 'email', 'role']);

  const load = async () => {
    setLoading(true);
    try {
      const res = await getUsers();
      if (!res.success) setError(res.message);
      else setUsers(res.data || []);
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const columns = [
    { key: 'username', label: 'Username' },
    { key: 'email', label: 'Email' },
    { key: 'role', label: 'Role', render: (r) => <StatusBadge status={r.role} /> },
    { key: 'isActive', label: 'Status', render: (r) => <StatusBadge status={r.isActive ? 'Active' : 'Inactive'} /> },
    { key: 'employeeId', label: 'Employee', render: (r) => (r.employeeId > 0 ? `#${r.employeeId}` : '—') },
    { key: 'actions', label: 'Actions', width: '120px', render: (r) => (
      <div className="d-flex gap-1">
        <Button as={Link} to={`/users/${r.userId}/edit`} size="sm" variant="outline-primary"><LuSquarePen /></Button>
        <Button size="sm" variant="outline-danger" onClick={() => setDeleteTarget(r)}><LuTrash2 /></Button>
      </div>
    )},
  ];

  return (
    <div>
      <PageHeader title="Users" subtitle="Manage login accounts" actions={<Button as={Link} to="/users/new" className="btn-primary-custom"><LuPlus className="me-1" />Add User</Button>} />
      <AlertMessage type="success" message={success} onClose={() => setSuccess('')} />
      <AlertMessage type="danger" message={error} onClose={() => setError('')} />
      <Card className="content-card border-0">
        <Card.Body className="p-4">
          <FilterBar>
            <div style={{ maxWidth: 360 }}><SearchBar value={table.search} onChange={table.setSearch} placeholder="Search users..." /></div>
          </FilterBar>
          {loading ? <LoadingSpinner /> : (
            <>
              <DataTable columns={columns} data={table.paginatedData.map((r) => ({ ...r, _key: r.userId }))} />
              <Pagination {...table} onPageChange={table.goToPage} onPageSizeChange={table.setPageSize} />
            </>
          )}
        </Card.Body>
      </Card>
      <ConfirmModal show={!!deleteTarget} message={`Delete user "${deleteTarget?.username}"?`} loading={deleting}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={async () => {
          setDeleting(true);
          try {
            const res = await deleteUser(deleteTarget.userId);
            if (!res.success) setError(res.message);
            else { setSuccess(res.message); setDeleteTarget(null); load(); }
          } catch (e) { setError(e.message); }
          finally { setDeleting(false); }
        }}
      />
    </div>
  );
}
