import { useState } from 'react';
import { Form } from 'react-bootstrap';

export function useForm(initialValues) {
  const [values, setValues] = useState(initialValues);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? checked : value;
    setValues((prev) => ({ ...prev, [name]: val }));
  };

  const resetForm = (next = initialValues) => {
    setValues(next);
  };

  return {
    values,
    handleChange,
    resetForm,
    setValues,
    setField: (name, value) => setValues((prev) => ({ ...prev, [name]: value })),
  };
}

export default function FormField({ label, name, type = 'text', value, onChange, as, children, helpText, ...rest }) {
  return (
    <Form.Group className="mb-3">
      <Form.Label className="form-label-custom">{label}</Form.Label>
      <Form.Control
        type={type}
        name={name}
        value={value ?? ''}
        onChange={onChange}
        as={as}
        className="form-control-custom"
        {...rest}
      >
        {children}
      </Form.Control>
      {helpText && <Form.Text className="text-muted small">{helpText}</Form.Text>}
    </Form.Group>
  );
}
