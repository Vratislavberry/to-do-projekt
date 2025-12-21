import { useContext } from "react";
import { listDetailContext } from "./listDetailProvider";
import MemberTable from "./memberTable.jsx";
import ListTitleForm from "./listTitleForm.jsx";

import Offcanvas from "react-bootstrap/Offcanvas";
import Button from "react-bootstrap/Button";

import { useTranslation } from "react-i18next";

function ListDetailConfig({ onClose }) {
  const { state, data, curUserId } = useContext(listDetailContext);

  const [t, i18n] = useTranslation();

  return (
    // set height on the Offcanvas element itself
    <Offcanvas
      onHide={onClose}
      show={true}
      placement="bottom"
      style={{ height: "60vh" }}
    >
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>{t("detail.list_settings")}</Offcanvas.Title>
      </Offcanvas.Header>

      <Offcanvas.Body className="overflow-auto">
        <p>
          {t("detail.owner")}: <b>{data?.owner?.name}</b>{" "}
          {data?.owner?._id === curUserId && "(" + t("detail.you") + ")"}
        </p>

        {data?.owner?._id === curUserId && <ListTitleForm />}
        <MemberTable />
      </Offcanvas.Body>
    </Offcanvas>
  );
}

export default ListDetailConfig;
