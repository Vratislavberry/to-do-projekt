import { useContext, useState } from "react";

import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";

import { listDetailContext } from "./listDetailProvider.jsx";

function SplitCardDeleteForm({
  item,
  onClose,
  isLastCard,
  switchToPrevCard,
  setSplitCardStates,
  delCardTextSegments,
}) {
  const [errorState, setErrorState] = useState();
  const { state, handlerMap } = useContext(listDetailContext);

  return (
    <Modal show={true} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Delete splitCard</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {!!errorState?.message ? (
          <Alert variant={"danger"}>{errorState.message}</Alert>
        ) : null}
        Do you really want to delete splitCard <b>{item.title}</b>
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
              if (isLastCard) {
                switchToPrevCard();
              }
              setSplitCardStates();
              delCardTextSegments();

              onClose();
            } else {
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

export default SplitCardDeleteForm;
