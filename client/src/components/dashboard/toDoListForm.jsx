import { useContext, useState } from "react";

import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";

import { toDoListContext } from "./toDoListProvider.jsx";

function ToDoListForm({ item, onClose }) {
  const { state, handlerMap } = useContext(toDoListContext);
  const [errorState, setErrorState] = useState();

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
          if (item._id){
            result = await handlerMap.handleUpdate({...values, id: item._id});
          }
          else{
            result = await handlerMap.handleCreate({ ...values });
          }

          if (result.ok) {
            onClose();
          } else {
            setErrorState(result.error)
          }
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>{item._id ? "Edit" : "Create"} list</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Label>Title *</Form.Label>
          <Form.Control
            type="text"
            name="title"
            disabled={state === "pending"}
            defaultValue={item.title}
            required
            maxLength={50}
          />

          {!!errorState?.group?.message ? (
          <Alert variant={"danger"}>{errorState.group.message}</Alert>
        ) : null}
        
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
            {item._id ? "Edit" : "Create"}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default ToDoListForm;
