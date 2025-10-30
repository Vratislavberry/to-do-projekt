import { Col, ButtonGroup, Button } from "react-bootstrap";
import Icon from "@mdi/react";
import { mdiRadioboxBlank, mdiRadioboxMarked } from "@mdi/js";
import { useContext } from "react";
import { listDetailContext } from "./listDetailProvider";

const ItemUI = ({ item, setItemFormData }) => {
  const context = useContext(listDetailContext);
  const { handlerMap } = context ?? {
    state: "pending",
    data: [],
  };

  return (
    <Col sm="12" className="d-flex justify-content-center my-2">
      <ButtonGroup key={item.id} className="w-100">
        <Button
          className="flex-grow-1 text-start"
          onClick={() => setItemFormData(item)}
        >
          {item.title}
        </Button>
        <Button
          onClick={() => {
            let newState = item.state === "unchecked" ? "checked" : "unchecked";
            handlerMap?.handleUpdate({ ...item, state: newState});
          }}
          className="flex-grow-0"
        >
          <Icon
            path={
              item.state === "unchecked" ? mdiRadioboxBlank : mdiRadioboxMarked
            }
            size={1}
          />
        </Button>
      </ButtonGroup>
    </Col>
  );
};

export default ItemUI;
