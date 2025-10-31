import { useContext } from "react";

import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

import { listDetailContext } from "./listDetailProvider";

function SplitCardForm({
  item,
  onClose,
}) {
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
            result = await handlerMap.handleUpdate({ ...values, _id: item._id });
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
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={onClose}
            disabled={state === "pending"}
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
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default SplitCardForm;
