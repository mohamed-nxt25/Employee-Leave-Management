import { Modal, Button } from 'react-bootstrap';
import { LuTriangleAlert } from 'react-icons/lu';

export default function ConfirmModal({ show, title = 'Confirm Delete', message, onConfirm, onCancel, loading }) {
  return (
    <Modal show={show} onHide={onCancel} centered>
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title className="d-flex align-items-center gap-3 fs-5">
          <span className="modal-icon-wrap"><LuTriangleAlert size={22} /></span>
          {title}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>{message}</Modal.Body>
      <Modal.Footer className="border-0 pt-0">
        <Button variant="light" className="btn-soft" onClick={onCancel} disabled={loading}>Cancel</Button>
        <Button variant="danger" onClick={onConfirm} disabled={loading} className="rounded-3 px-3 fw-bold">
          {loading ? 'Deleting...' : 'Delete'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
