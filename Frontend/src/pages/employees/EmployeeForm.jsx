import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Card, Button, Form } from 'react-bootstrap';
import { getEmployeeById, createEmployee, updateEmployee } from '../../api/employeesApi';
import { getDepartments } from '../../api/departmentsApi';
import PageHeader from '../../components/common/PageHeader';
import FormField, { useForm } from '../../components/common/FormField';
import AlertMessage from '../../components/common/AlertMessage';
import LoadingSpinner from '../../components/common/LoadingSpinner';

export default function EmployeeForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const form = useForm({
    employeeId: 0, userId: 0, departmentId: '', employeeCode: '', firstName: '', lastName: '', phone: '', hireDate: '', jobTitle: '',
  });

  useEffect(() => {
    (async () => {
      try {
        setDepartments((await getDepartments()).data || []);
        if (isEdit) { const res = await getEmployeeById(id); if (!res.success) setError(res.message); else form.setValues(res.data); }
      } catch (e) { setError(e.message); } finally { setLoading(false); }
    })();
  }, [id, isEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const payload = { ...form.values, departmentId: Number(form.values.departmentId), userId: Number(form.values.userId) || 0 };
      const res = isEdit ? await updateEmployee(id, payload) : await createEmployee(payload);
      if (!res.success) setError(res.message);
      else navigate('/employees');
    } catch (err) { setError(err.message); }
    finally { setSubmitting(false); }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <PageHeader title={isEdit ? 'Edit Employee' : 'Add Employee'} actions={<Button as={Link} to="/employees" variant="light">Back</Button>} />
      <Card className="content-card border-0"><Card.Body className="p-4">
        <AlertMessage type="danger" message={error} onClose={() => setError('')} />
        <form onSubmit={handleSubmit} noValidate style={{ maxWidth: 640 }}>
          <div className="row">
            <div className="col-md-6"><FormField label="Employee Code" name="employeeCode" value={form.values.employeeCode} onChange={form.handleChange} /></div>
            <div className="col-md-6"><FormField label="Job Title" name="jobTitle" value={form.values.jobTitle} onChange={form.handleChange} /></div>
            <div className="col-md-6"><FormField label="First Name" name="firstName" value={form.values.firstName} onChange={form.handleChange} /></div>
            <div className="col-md-6"><FormField label="Last Name" name="lastName" value={form.values.lastName} onChange={form.handleChange} /></div>
            <div className="col-md-6"><FormField label="Phone" name="phone" value={form.values.phone} onChange={form.handleChange} /></div>
            <div className="col-md-6"><FormField label="Hire Date" name="hireDate" type="date" value={(form.values.hireDate || '').split('T')[0]} onChange={form.handleChange} /></div>
            <div className="col-md-6">
              <Form.Group className="mb-3">
                <Form.Label className="small fw-medium text-secondary">Department</Form.Label>
                <Form.Select name="departmentId" value={form.values.departmentId} onChange={form.handleChange}>
                  <option value="">Select department</option>
                  {departments.map((d) => <option key={d.departmentId} value={d.departmentId}>{d.departmentName}</option>)}
                </Form.Select>
              </Form.Group>
            </div>
          </div>
          <Button type="submit" className="btn-primary-custom" disabled={submitting}>{submitting ? 'Saving...' : 'Save Employee'}</Button>
        </form>
      </Card.Body></Card>
    </div>
  );
}
