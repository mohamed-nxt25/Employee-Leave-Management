import { Card, Button } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { changePassword } from '../api/authApi';
import PageHeader from '../components/common/PageHeader';
import FormField, { useForm } from '../components/common/FormField';
import AlertMessage from '../components/common/AlertMessage';
import { useState } from 'react';
import { LuKeyRound } from 'react-icons/lu';

export default function ChangePassword() {
  const { user } = useAuth();
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { values, handleChange, resetForm } = useForm({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess('');
    setError('');
    setLoading(true);
    try {
      const res = await changePassword({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
        confirmPassword: values.confirmPassword,
      });
      if (!res.success) setError(res.message);
      else { setSuccess(res.message); resetForm(); }
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  return (
    <div>
      <PageHeader title="Change Password" subtitle="Keep your account secure with a strong password" badge="Security" />
      <Card className="content-card border-0 form-page-card">
        <Card.Body>
          <div className="d-flex align-items-center gap-3 mb-4 pb-3 border-bottom">
            <div className="form-page-icon"><LuKeyRound size={24} /></div>
            <div>
              <h6 className="section-title mb-0">Account credentials</h6>
              <small className="section-sub">Signed in as {user?.username}</small>
            </div>
          </div>
          <AlertMessage type="success" message={success} onClose={() => setSuccess('')} />
          <AlertMessage type="danger" message={error} onClose={() => setError('')} />
          <form onSubmit={handleSubmit} noValidate>
            <FormField label="Current Password" name="currentPassword" type="password" value={values.currentPassword} onChange={handleChange} />
            <FormField label="New Password" name="newPassword" type="password" value={values.newPassword} onChange={handleChange} />
            <FormField label="Confirm Password" name="confirmPassword" type="password" value={values.confirmPassword} onChange={handleChange} />
            <Button type="submit" className="btn-primary-custom mt-1" disabled={loading}>
              {loading ? 'Updating...' : 'Update Password'}
            </Button>
          </form>
        </Card.Body>
      </Card>
    </div>
  );
}
