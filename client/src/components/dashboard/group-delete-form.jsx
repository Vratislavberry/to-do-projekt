import { useContext, useState } from "react";

import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";

import { GroupListContext } from "./group-list-provider.jsx";

function GroupDeleteForm({ item, onClose }) {
  const [errorState, setErrorState] = useState();
  const { state, handlerMap } = useContext(GroupListContext);

  return (
    <Modal show={true} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Delete group</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {!!errorState?.message ? (
          <Alert variant={"danger"}>{errorState.message}</Alert>
        ) : null}
        Do you really want to delete group <b>{item.title}</b>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={onClose}
          disabled={state === "pending"}
        >
          Close
        </Button>
        <Button
          variant="danger"
          disabled={state === "pending"}
          onClick={async () => {
            const result = await handlerMap.handleDelete({ id: item.id });
            if (result.ok) {
              onClose();
            } else {
              console.log(result.error);
              setErrorState(result.error);
            }
          }}
        >
          Delete
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default GroupDeleteForm;
