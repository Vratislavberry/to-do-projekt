import { useContext } from "react";
import { listDetailContext } from "./listDetailProvider";
import { Form, Col, Button } from "react-bootstrap";

import { useTranslation } from "react-i18next";

function ListTitleForm() {
  const { state, data, handlerMap } = useContext(listDetailContext);

  const [t, i18n] = useTranslation();

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
            `${t("detail.update_title_msg")} "${values.title}"?`
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
        <Form.Label>{t("detail.title")}</Form.Label>
        <Form.Control
          type="text"
          placeholder={data?.title}
          name="title"
          required
        />
      </Form.Group>
      <Button variant="primary" type="submit">
        {t("detail.submit")}
      </Button>
    </Form>
  );
}

export default ListTitleForm;
