import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import Button from "react-bootstrap/esm/Button";
import Container from "react-bootstrap/esm/Container";

import Icon from "@mdi/react";
import { mdiPlus } from "@mdi/js";

function splitCardBlank({onCreateFormClose}) {
  return (
    <Card>
      <Card.Body>
        <Container className="d-flex justify-content-between mb-1">
          <Card.Title>Create new SplitCard</Card.Title>
          <Button variant="success" onClick={onCreateFormClose}>
            <Icon path={mdiPlus} size={1} />
          </Button>
        </Container>
        <ListGroup>
          <ListGroup.Item>There are no SplitCards yet</ListGroup.Item>
        </ListGroup>
      </Card.Body>
    </Card>
  );
}

export default splitCardBlank;
