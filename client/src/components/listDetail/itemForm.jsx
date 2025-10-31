import { useContext } from "react";

import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";

import { listDetailContext } from "./listDetailProvider";

function SplitCardForm({ item, onClose, setItemFormDeleteData }) {
  const { state, data, handlerMap } = useContext(listDetailContext);

  return (
    <Modal show={true} onHide={onClose}>
      <Form
        onSubmit={async (e) => {
          // Prevents reloading the page - we handle submit ourselves
          e.preventDefault();
          // stops propagation of submit event to parent components
          // in some cases it can trigger another submit event.
          e.stopPropagation();
          const formData = new FormData(e.target);
          // extracts data from Modal form
          const values = Object.fromEntries(formData);

          let result = null;
          if (item._id) {
            result = await handlerMap.handleUpdate({
              ...values,
              _id: item._id,
            });
          } else {
            result = await handlerMap.handleCreate({ ...values });
          }
          if (result.ok) {
            onClose();
          }
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>{item?._id ? "Update" : "Add"} Item</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Label>Title *</Form.Label>
          <Form.Control
            type="text"
            name="title"
            disabled={state === "pending"}
            defaultValue={item?.title}
            required
            maxLength={100}
          />
        </Modal.Body>

        <Modal.Footer className="d-flex justify-content-between">
          <Col>
            {item._id ? (
              <Button
                className="self-align-start"
                variant="danger"
                onClick={() => {
                  setItemFormDeleteData(item);
                  onClose();
                }}
                disabled={state === "pending"}
              >
                Delete
              </Button>
            ) : null}
          </Col>
          <Col className="d-flex justify-content-end">
            <Button
              variant="secondary"
              onClick={onClose}
              disabled={state === "pending"}
              className="mx-2"
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              type="submit"
              disabled={state === "pending"}
            >
              {item?._id ? "Update" : "Create"}
            </Button>
          </Col>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default SplitCardForm;
