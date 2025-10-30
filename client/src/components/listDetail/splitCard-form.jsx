import { useContext } from "react";

import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

import { listDetailContext } from "./listDetailProvider";

function SplitCardForm({
  item,
  onClose,
  switchToNewCard,
  resetTextSegmentItem,
}) {
  const { state, data, handlerMap, groupId } = useContext(listDetailContext);

  
  function getCurrentDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0"); // Months are 0-based
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

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

          // set current date in form data in format YYYY-MM-DD
          values.date = getCurrentDate();
          // set groupId in form data
          values.groupId = groupId;

          let result = null;
          if (item.id) {
            result = await handlerMap.handleUpdate({ ...values, id: item.id });
          } else {
            result = await handlerMap.handleCreate({ ...values });
          }

          if (result.ok) {
            // If we created a new card, switch to it
            if (!item.id) {
              switchToNewCard();
            }
            if (item?.id) {
              resetTextSegmentItem();
            }
            onClose();
          }
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>{item?.id ? "Update" : "Add"} SplitCard</Modal.Title>
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

          <Form.Label>Question text *</Form.Label>
          <Form.Control
            type="text"
            name="questionText"
            disabled={state === "pending"}
            defaultValue={item?.questionText}
            required
            maxLength={250}
          />
          <Form.Text className="text-muted text-center">
            * SplitCard pieces are separated via ";"
          </Form.Text>
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
            {item?.id ? "Update" : "Create"}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default SplitCardForm;
