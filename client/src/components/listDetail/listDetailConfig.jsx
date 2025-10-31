import { useContext } from "react";
import { listDetailContext } from "./listDetailProvider";
import MemberTable from "./memberTable.jsx";
import ListTitleForm from "./listTitleForm.jsx";

import Offcanvas from "react-bootstrap/Offcanvas";
import Button from "react-bootstrap/Button";

function ListDetailConfig({ onClose }) {
  const { state, data } = useContext(listDetailContext);
  return (
    // set height on the Offcanvas element itself
    <Offcanvas
      onHide={onClose}
      show={true}
      placement="bottom"
      style={{ height: "60vh" }}
    >
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>List settings</Offcanvas.Title>
      </Offcanvas.Header>

      <Offcanvas.Body className="overflow-auto">
        <p>
          Owner: {data?.owner?.name}{" "}
          {data?.owner?._id === "671f4b2f9a8e7c1234560001" && "(you)"}
        </p>
        <ListTitleForm />
        <MemberTable />
      </Offcanvas.Body>
    </Offcanvas>
  );
}

export default ListDetailConfig;
