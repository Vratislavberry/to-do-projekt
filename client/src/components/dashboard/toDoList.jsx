import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/esm/Container";

import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { toDoListContext } from "./toDoListProvider";

function ToDoList({
  data,
  setListFormData,
  setListDeleteFormData,
  owner,
  canEdit,
}) {
  const { curUser } = useContext(toDoListContext);
  const navigate = useNavigate();
  return (
    <Col
      sm="4"
      className="d-flex justify-content-center text-center my-2 mx-sm-0"
    >
      <Card
        className="w-100 w-sm-auto"
        onClick={() =>
          navigate(`/listDetail?id=${data._id}`, {
            state: { list: data, curUser: curUser, owner: owner },
          })
        }
        style={{ cursor: "pointer", transition: "box-shadow 0.2s" }}
        onMouseOver={(e) => e.currentTarget.classList.add("shadow")}
        onMouseOut={(e) => e.currentTarget.classList.remove("shadow")}
      >
        <Card.Body>
          <Card.Title>{data.title}</Card.Title>
          <Container className="d-flex justify-content-between px-0">
            <Button
              disabled={canEdit ? false : true}
              className="me-1"
              variant="warning"
              onClick={(e) => {
                // otherwise it would trigger the card button onClick() too
                e.stopPropagation();
                setListFormData(data);
              }}
            >
              Edit
            </Button>
            <Button
              disabled={canEdit ? false : true}
              variant="danger"
              onClick={(e) => {
                // otherwise it would trigger the card button onClick() too
                e.stopPropagation();
                setListDeleteFormData(data);
              }}
            >
              Delete
            </Button>
          </Container>
        </Card.Body>
      </Card>
    </Col>
  );
}

export default ToDoList;
