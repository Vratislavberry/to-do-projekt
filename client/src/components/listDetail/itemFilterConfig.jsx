import Offcanvas from "react-bootstrap/Offcanvas";
import Button from "react-bootstrap/Button";
import { ButtonGroup } from "react-bootstrap";
import { useContext } from "react";
import { listDetailContext } from "./listDetailProvider";

import { useTranslation } from "react-i18next";

//onClose: () => void;
function ItemFilterConfig({ onClose }) {
  const [t, i18n] = useTranslation();
  const context = useContext(listDetailContext);
  const { handlerMap, filter } = context ?? {
    state: "pending",
    data: [],
  };

  return (
    <Offcanvas onHide={onClose} show={true} placement="bottom" className="p-3">
      <h3 className="mt-3">{t("detail.filter")}</h3>
      <ButtonGroup>
        <Button
          variant={filter?.checked ? "primary" : "secondary"}
          onClick={() =>
            handlerMap?.handleFilterChange("checked", !filter?.checked)
          }
        >
          {t("detail.checked")}
        </Button>
        <Button
          variant={filter?.unchecked ? "primary" : "secondary"}
          onClick={() =>
            handlerMap?.handleFilterChange("unchecked", !filter?.unchecked)
          }
        >
          {t("detail.unchecked")}
        </Button>
      </ButtonGroup>
    </Offcanvas>
  );
}

export default ItemFilterConfig;
