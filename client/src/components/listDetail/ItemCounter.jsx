import { useContext } from "react";
import { listDetailContext } from "./listDetailProvider";
import { Col } from "react-bootstrap";

function ItemCounter() {
  const { data } = useContext(listDetailContext);

  return (
    <Col>
      {data?.itemList?.reduce(
        (accum, item) => (item.state === "checked" ? accum + 1 : accum),
        0
      )}{" "}
      / {data?.itemList?.length} items checked
    </Col>
  );
}

export default ItemCounter;
