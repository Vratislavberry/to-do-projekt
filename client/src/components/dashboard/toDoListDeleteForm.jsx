import { useContext, useState } from "react";

import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";

import { toDoListContext } from "./toDoListProvider.jsx";

import { useTranslation } from "react-i18next";

function GroupDeleteForm({ item, onClose }) {
  const [errorState, setErrorState] = useState();
  const { state, handlerMap } = useContext(toDoListContext);
  const [t, i18n] = useTranslation();

  return (
    <Modal show={true} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>{t("dashboard.delete")}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {!!errorState?.message ? (
          <Alert variant={"danger"}>{errorState.message}</Alert>
        ) : null}
        {t("dashboard.list_delete_msg")} <b>{item.title}</b> ? 
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={onClose}
          disabled={state === "pending"}
        >
          {t("dashboard.close")}
        </Button>
        <Button
          variant="danger"
          disabled={state === "pending"}
          onClick={async () => {
            const result = await handlerMap.handleDelete({ id: item._id });
            if (result.ok) {
              onClose();
            } else {
              console.log(result.error);
              setErrorState(result.error);
            }
          }}
        >
          {t("dashboard.delete")}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default GroupDeleteForm;
