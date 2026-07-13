import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Card, Button } from 'react-bootstrap';
import { getDepartmentById, createDepartment, updateDepartment } from '../../api/departmentsApi';
import PageHeader from '../../components/common/PageHeader';
import FormField, { useForm } from '../../components/common/FormField';
import AlertMessage from '../../components/common/AlertMessage';
import LoadingSpinner from '../../components/common/LoadingSpinner';

export default function DepartmentForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const form = useForm({ departmentId: 0, departmentName: '', description: '' });

  useEffect(() => {
    if (!isEdit) return;
    (async () => {
      try { const res = await getDepartmentById(id); if (!res.success) setError(res.message); else form.setValues(res.data); }
      catch (e) { setError(e.message); } finally { setLoading(false); }
    })();
  }, [id, isEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const res = isEdit ? await updateDepartment(id, form.values) : await createDepartment(form.values);
      if (!res.success) setError(res.message);
      else navigate('/departments');
    } catch (err) { setError(err.message); }
    finally { setSubmitting(false); }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <PageHeader title={isEdit ? 'Edit Department' : 'Add Department'} actions={<Button as={Link} to="/departments" variant="light">Back</Button>} />
      <Card className="content-card border-0"><Card.Body className="p-4">
        <AlertMessage type="danger" message={error} onClose={() => setError('')} />
        <form onSubmit={handleSubmit} noValidate style={{ maxWidth: 520 }}>
          <FormField label="Department Name" name="departmentName" value={form.values.departmentName} onChange={form.handleChange} />
          <FormField label="Description" name="description" as="textarea" rows={3} value={form.values.description} onChange={form.handleChange} />
          <Button type="submit" className="btn-primary-custom" disabled={submitting}>{submitting ? 'Saving...' : 'Save'}</Button>
        </form>
      </Card.Body></Card>
    </div>
  );
}
