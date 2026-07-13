import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Card, Form } from 'react-bootstrap';
import { LuPlus, LuSquarePen, LuTrash2 } from 'react-icons/lu';
import { getEmployees, deleteEmployee } from '../../api/employeesApi';
import { getDepartments } from '../../api/departmentsApi';
import PageHeader from '../../components/common/PageHeader';
import DataTable, { useTableData } from '../../components/common/DataTable';
import SearchBar from '../../components/common/SearchBar';
import FilterBar from '../../components/common/FilterBar';
import Pagination from '../../components/common/Pagination';
import ConfirmModal from '../../components/common/ConfirmModal';
import AlertMessage from '../../components/common/AlertMessage';
import LoadingSpinner from '../../components/common/LoadingSpinner';

export default function EmployeeList() {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [deptFilter, setDeptFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const filtered = deptFilter ? employees.filter((e) => String(e.departmentId) === deptFilter) : employees;
  const table = useTableData(filtered, ['firstName', 'lastName', 'employeeCode', 'jobTitle', 'departmentName']);

  const load = async () => {
    setLoading(true);
    try {
      const [e, d] = await Promise.all([getEmployees(), getDepartments()]);
      if (!e.success) setError(e.message); else setEmployees(e.data || []);
      setDepartments(d.data || []);
    } catch (err) { setError(err.message); } finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const columns = [
    { key: 'employeeCode', label: 'Code' },
    { key: 'name', label: 'Name', render: (r) => `${r.firstName} ${r.lastName}` },
    { key: 'jobTitle', label: 'Job Title' },
    { key: 'departmentName', label: 'Department' },
    { key: 'hireDate', label: 'Hire Date' },
    { key: 'actions', label: 'Actions', width: '120px', render: (r) => (
      <div className="d-flex gap-1">
        <Button as={Link} to={`/employees/${r.employeeId}/edit`} size="sm" variant="outline-primary"><LuSquarePen /></Button>
        <Button size="sm" variant="outline-danger" onClick={() => setDeleteTarget(r)}><LuTrash2 /></Button>
      </div>
    )},
  ];

  return (
    <div>
      <PageHeader title="Employees" subtitle="Manage employee records" actions={<Button as={Link} to="/employees/new" className="btn-primary-custom"><LuPlus className="me-1" />Add</Button>} />
      <AlertMessage type="success" message={success} onClose={() => setSuccess('')} />
      <AlertMessage type="danger" message={error} onClose={() => setError('')} />
      <Card className="content-card border-0"><Card.Body className="p-4">
          <FilterBar>
            <div className="row g-2">
              <div className="col-md-6"><SearchBar value={table.search} onChange={table.setSearch} placeholder="Search employees..." /></div>
              <div className="col-md-6">
                <Form.Select value={deptFilter} onChange={(e) => { setDeptFilter(e.target.value); table.goToPage(1); }}>
                  <option value="">All Departments</option>
                  {departments.map((d) => <option key={d.departmentId} value={d.departmentId}>{d.departmentName}</option>)}
                </Form.Select>
              </div>
            </div>
          </FilterBar>
        {loading ? <LoadingSpinner /> : (<><DataTable columns={columns} data={table.paginatedData.map((r) => ({ ...r, _key: r.employeeId }))} /><Pagination {...table} onPageChange={table.goToPage} onPageSizeChange={table.setPageSize} /></>)}
      </Card.Body></Card>
      <ConfirmModal show={!!deleteTarget} message={`Delete ${deleteTarget?.firstName} ${deleteTarget?.lastName}?`} loading={deleting} onCancel={() => setDeleteTarget(null)}
        onConfirm={async () => { setDeleting(true); try { const res = await deleteEmployee(deleteTarget.employeeId); if (!res.success) setError(res.message); else { setSuccess(res.message); setDeleteTarget(null); load(); } } catch (e) { setError(e.message); } finally { setDeleting(false); } }} />
    </div>
  );
}
