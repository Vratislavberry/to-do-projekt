import { useContext } from "react";
import { listDetailContext } from "./listDetailProvider";
import { Form, Col, Button } from "react-bootstrap";

function ListTitleForm() {
  const { state, data, handlerMap } = useContext(listDetailContext);

  return (
    <Form onSubmit={async (e) => {}} className="my-3">
      <Form.Group className="mb-3" controlId="listTitle">
        <Form.Label>Title</Form.Label>
        <Form.Control type="text" placeholder={data?.title} />
      </Form.Group>
      <Button variant="primary" type="submit">
        Submit
      </Button>
    </Form>
  );
}

export default ListTitleForm;
