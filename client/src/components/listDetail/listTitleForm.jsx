import { useContext } from "react";
import { listDetailContext } from "./listDetailProvider";
import { Form, Col, Button } from "react-bootstrap";

function ListTitleForm() {
  const { state, data, handlerMap } = useContext(listDetailContext);

  return (
    <Form
      onSubmit={async (e) => {
        // Prevents reloading the page - we handle submit ourselves
        e.preventDefault();
        // stops propagation of submit event to parent components
        // in some cases it can trigger another submit event.
        e.stopPropagation();

        const formData = new FormData(e.target);
        // extracts data from Modal form
        const values = Object.fromEntries(formData);

        let result = null;

        if (
          !confirm(
            `Are you sure you want to change title to "${values.title}"?`
          )
        ) {
          return;
        }
        result = await handlerMap.handleListUpdate({
          title: values.title,
        });
      }}
      className="my-3"
    >
      <Form.Group className="mb-3" controlId="listTitle">
        <Form.Label>Title</Form.Label>
        <Form.Control
          type="text"
          placeholder={data?.title}
          name="title"
          required
        />
      </Form.Group>
      <Button variant="primary" type="submit">
        Submit
      </Button>
    </Form>
  );
}

export default ListTitleForm;
