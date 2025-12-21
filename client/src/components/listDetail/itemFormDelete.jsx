import { useContext, useState } from "react";

import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";

import { listDetailContext } from "./listDetailProvider.jsx";

import { useTranslation } from "react-i18next";

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

  const [t, i18n] = useTranslation();

  return (
    <Modal show={true} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>{t("detail.delete")} {t("detail.item")}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {!!errorState?.message ? (
          <Alert variant={"danger"}>{errorState.message}</Alert>
        ) : null}
        {t("detail.item_delete_msg")} <b>{item.title}</b> ?
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={onClose}
          disabled={state === "pending"}
        >
          {t("detail.cancel")}
        </Button>
        <Button
          variant="danger"
          disabled={state === "pending"}
          onClick={async () => {
            const result = await handlerMap.handleDelete({ id: item._id });
            if (result.ok) {
              onClose();
            } else {
              setErrorState(result.error);
            }
          }}
        >
          {t("detail.delete")}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default SplitCardDeleteForm;
