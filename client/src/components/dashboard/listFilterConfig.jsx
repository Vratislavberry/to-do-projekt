import Offcanvas from "react-bootstrap/Offcanvas";
import Button from "react-bootstrap/Button";
import { ButtonGroup } from "react-bootstrap";
import { useContext } from "react";
import { toDoListContext } from "./toDoListProvider";

import { useTranslation } from "react-i18next";

//onClose: () => void;
function ListFilterConfig({ onClose }) {
  const context = useContext(toDoListContext);
  const { handlerMap, filter } = context ?? {
    state: "pending",
    data: [],
  };

  const [t, i18n] = useTranslation();

  return (
    <Offcanvas onHide={onClose} show={true} placement="bottom" className="p-3">
      <h3 className="mt-3">{t("dashboard.filter")}</h3>
      <ButtonGroup>
        <Button
          variant={filter?.active ? "primary" : "secondary"}
          onClick={() =>
            handlerMap?.handleFilterChange("active", !filter?.active)
          }
        >
          {t("dashboard.active")}
        </Button>
        <Button
          variant={filter?.archived ? "primary" : "secondary"}
          onClick={() =>
            handlerMap?.handleFilterChange("archived", !filter?.archived)
          }
        >
          {t("dashboard.archived")}
        </Button>
      </ButtonGroup>
    </Offcanvas>
  );
}

export default ListFilterConfig;
