import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Card, Button, Form } from 'react-bootstrap';
import { getLeaveTypeById, createLeaveType, updateLeaveType } from '../../api/leaveTypesApi';
import PageHeader from '../../components/common/PageHeader';
import FormField, { useForm } from '../../components/common/FormField';
import AlertMessage from '../../components/common/AlertMessage';
import LoadingSpinner from '../../components/common/LoadingSpinner';

export default function LeaveTypeForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const form = useForm({ leaveTypeId: 0, typeName: '', description: '', maxDaysPerYear: 1, isPaid: true });

  useEffect(() => {
    if (!isEdit) return;
    (async () => { try { const res = await getLeaveTypeById(id); if (!res.success) setError(res.message); else form.setValues(res.data); } catch (e) { setError(e.message); } finally { setLoading(false); } })();
  }, [id, isEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const payload = { ...form.values, maxDaysPerYear: Number(form.values.maxDaysPerYear), isPaid: Boolean(form.values.isPaid) };
      const res = isEdit ? await updateLeaveType(id, payload) : await createLeaveType(payload);
      if (!res.success) setError(res.message);
      else navigate('/leave-types');
    } catch (err) { setError(err.message); }
    finally { setSubmitting(false); }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <PageHeader title={isEdit ? 'Edit Leave Type' : 'Add Leave Type'} actions={<Button as={Link} to="/leave-types" variant="light">Back</Button>} />
      <Card className="content-card border-0"><Card.Body className="p-4">
        <AlertMessage type="danger" message={error} onClose={() => setError('')} />
        <form onSubmit={handleSubmit} noValidate style={{ maxWidth: 520 }}>
          <FormField label="Type Name" name="typeName" value={form.values.typeName} onChange={form.handleChange} />
          <FormField label="Description" name="description" as="textarea" rows={3} value={form.values.description} onChange={form.handleChange} />
          <FormField label="Max Days Per Year" name="maxDaysPerYear" type="number" value={form.values.maxDaysPerYear} onChange={form.handleChange} />
          <Form.Check type="switch" name="isPaid" label="Paid leave" checked={form.values.isPaid} onChange={form.handleChange} className="mb-4" />
          <Button type="submit" className="btn-primary-custom" disabled={submitting}>{submitting ? 'Saving...' : 'Save'}</Button>
        </form>
      </Card.Body></Card>
    </div>
  );
}
