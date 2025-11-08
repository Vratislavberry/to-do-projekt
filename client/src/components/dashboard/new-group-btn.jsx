import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";

import { useContext } from "react";
import { GroupListContext } from "./group-list-provider";

function newGroupBtn({ id, title }) {
  const { data } = useContext(GroupListContext);
  return (
    <Col
      sm="4"
      className="d-flex justify-content-center text-center m-1 m-sm-0"
    >
      <Button className="w-100 w-sm-auto">{title}</Button>
    </Col>
  );
}

export default Group;
