import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Card, Button, Form } from 'react-bootstrap';
import { getLeaveRequestById, createLeaveRequest, updateLeaveRequest } from '../../api/leaveRequestsApi';
import { getEmployees, getMyEmployee } from '../../api/employeesApi';
import { getLeaveTypes } from '../../api/leaveTypesApi';
import { useAuth } from '../../context/AuthContext';
import PageHeader from '../../components/common/PageHeader';
import FormField, { useForm } from '../../components/common/FormField';
import AlertMessage from '../../components/common/AlertMessage';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { canViewAllLeaveRequests } from '../../roles';
import { LEAVE_STATUS } from '../../constants';

const calcDays = (start, end) => {
  if (!start || !end) return 0;
  return Math.max(1, Math.floor((new Date(end) - new Date(start)) / 86400000) + 1);
};

export default function LeaveRequestForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { user } = useAuth();
  const isManager = canViewAllLeaveRequests(user?.role);
  const [employees, setEmployees] = useState([]);
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const form = useForm({
    leaveRequestId: 0, employeeId: user?.employeeId || '', leaveTypeId: '', startDate: '', endDate: '', totalDays: 1, reason: '', status: LEAVE_STATUS.PENDING,
  });

  useEffect(() => {
    (async () => {
      setError('');
      try {
        const leaveTypesRes = await getLeaveTypes();
        if (!leaveTypesRes.success) {
          setError(leaveTypesRes.message);
        } else {
          setLeaveTypes(leaveTypesRes.data || []);
        }

        if (isManager) {
          const employeesRes = await getEmployees();
          if (!employeesRes.success) {
            setError(employeesRes.message);
          } else {
            setEmployees(employeesRes.data || []);
          }
        } else if (user?.employeeId > 0) {
          const employeeRes = await getMyEmployee();
          if (!employeeRes.success) {
            setError(employeeRes.message);
          } else if (employeeRes.data) {
            setEmployees([employeeRes.data]);
          }
        } else {
          setError('Your account is not linked to an employee record. Contact HR.');
        }

        if (isEdit) {
          const res = await getLeaveRequestById(id);
          if (!res.success) setError(res.message);
          else form.setValues(res.data);
        } else if (user?.employeeId > 0) {
          form.setField('employeeId', user.employeeId);
        }
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [id, isEdit, isManager, user?.employeeId]);

  useEffect(() => {
    const days = calcDays(form.values.startDate, form.values.endDate);
    if (days > 0 && days !== form.values.totalDays) form.setField('totalDays', days);
  }, [form.values.startDate, form.values.endDate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const payload = { ...form.values, employeeId: Number(form.values.employeeId), leaveTypeId: Number(form.values.leaveTypeId), totalDays: Number(form.values.totalDays) };
      const res = isEdit ? await updateLeaveRequest(id, payload) : await createLeaveRequest(payload);
      if (!res.success) setError(res.message);
      else navigate('/leave-requests');
    } catch (err) { setError(err.message); }
    finally { setSubmitting(false); }
  };

  if (loading) return <LoadingSpinner />;

  const locked = !isManager && user?.employeeId > 0;

  return (
    <div>
      <PageHeader title={isEdit ? 'Edit Leave Request' : 'Apply for Leave'} actions={<Button as={Link} to="/leave-requests" variant="light">Back</Button>} />
      <Card className="content-card border-0"><Card.Body className="p-4">
        <AlertMessage type="danger" message={error} onClose={() => setError('')} />
        <form onSubmit={handleSubmit} noValidate style={{ maxWidth: 640 }}>
          <Form.Group className="mb-3">
            <Form.Label className="small fw-medium text-secondary">Employee</Form.Label>
            <Form.Select name="employeeId" value={form.values.employeeId} onChange={form.handleChange} disabled={locked}>
              <option value="">Select employee</option>
              {employees.map((e) => <option key={e.employeeId} value={e.employeeId}>{e.firstName} {e.lastName}</option>)}
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label className="small fw-medium text-secondary">Leave Type</Form.Label>
            <Form.Select name="leaveTypeId" value={form.values.leaveTypeId} onChange={form.handleChange}>
              <option value="">Select leave type</option>
              {leaveTypes.map((lt) => <option key={lt.leaveTypeId} value={lt.leaveTypeId}>{lt.typeName}</option>)}
            </Form.Select>
          </Form.Group>
          <div className="row">
            <div className="col-md-6"><FormField label="Start Date" name="startDate" type="date" value={(form.values.startDate || '').split('T')[0]} onChange={form.handleChange} /></div>
            <div className="col-md-6"><FormField label="End Date" name="endDate" type="date" value={(form.values.endDate || '').split('T')[0]} onChange={form.handleChange} /></div>
            <div className="col-md-6"><FormField label="Total Days" name="totalDays" type="number" value={form.values.totalDays} onChange={form.handleChange} /></div>
          </div>
          <FormField label="Reason" name="reason" as="textarea" rows={4} value={form.values.reason} onChange={form.handleChange} />
          <Button type="submit" className="btn-primary-custom" disabled={submitting || !form.values.employeeId || leaveTypes.length === 0}>{submitting ? 'Saving...' : isEdit ? 'Update' : 'Submit Request'}</Button>
        </form>
      </Card.Body></Card>
    </div>
  );
}
