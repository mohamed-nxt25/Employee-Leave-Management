import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Card, Button, Form } from 'react-bootstrap';
import { getUserById, createUser, updateUser } from '../../api/usersApi';
import { getEmployees } from '../../api/employeesApi';
import PageHeader from '../../components/common/PageHeader';
import FormField, { useForm } from '../../components/common/FormField';
import AlertMessage from '../../components/common/AlertMessage';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { ROLES } from '../../constants';

export default function UserForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const form = useForm({ userId: 0, username: '', email: '', password: '', role: ROLES.EMPLOYEE, isActive: true, employeeId: 0 });

  useEffect(() => {
    (async () => {
      try {
        setEmployees((await getEmployees()).data || []);
        if (isEdit) {
          const res = await getUserById(id);
          if (!res.success) setError(res.message);
          else form.setValues({ ...res.data, password: '' });
        }
      } catch (e) { setError(e.message); }
      finally { setLoading(false); }
    })();
  }, [id, isEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const payload = { ...form.values, employeeId: Number(form.values.employeeId) || 0, isActive: Boolean(form.values.isActive) };
      const res = isEdit ? await updateUser(id, payload) : await createUser(payload);
      if (!res.success) setError(res.message);
      else navigate('/users');
    } catch (e) { setError(e.message); }
    finally { setSubmitting(false); }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <PageHeader title={isEdit ? 'Edit User' : 'Add User'} actions={<Button as={Link} to="/users" variant="light">Back</Button>} />
      <Card className="content-card border-0"><Card.Body className="p-4">
        <AlertMessage type="danger" message={error} onClose={() => setError('')} />
        <form onSubmit={handleSubmit} noValidate style={{ maxWidth: 520 }}>
          <FormField label="Username" name="username" value={form.values.username} onChange={form.handleChange} />
          <FormField label="Email" name="email" type="email" value={form.values.email} onChange={form.handleChange} />
          <FormField label={isEdit ? 'Password (leave blank to keep)' : 'Password'} name="password" type="password" value={form.values.password} onChange={form.handleChange} />
          <Form.Group className="mb-3">
            <Form.Label className="small fw-medium text-secondary">Role</Form.Label>
            <Form.Select name="role" value={form.values.role} onChange={form.handleChange}>
              {Object.values(ROLES).map((r) => <option key={r} value={r}>{r}</option>)}
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label className="small fw-medium text-secondary">Linked Employee</Form.Label>
            <Form.Select name="employeeId" value={form.values.employeeId} onChange={form.handleChange}>
              <option value={0}>None</option>
              {employees.map((e) => <option key={e.employeeId} value={e.employeeId}>{e.firstName} {e.lastName}</option>)}
            </Form.Select>
          </Form.Group>
          <Form.Check type="switch" name="isActive" label="Active account" checked={form.values.isActive} onChange={form.handleChange} className="mb-4" />
          <Button type="submit" className="btn-primary-custom" disabled={submitting}>{submitting ? 'Saving...' : 'Save User'}</Button>
        </form>
      </Card.Body></Card>
    </div>
  );
}
