import React from "react";
import Form from "react-bootstrap/Form";

import { useTranslation } from "react-i18next";

const setDarkMode = () => {
  document.querySelector("body").setAttribute("data-theme", "dark");
  document.querySelector("body").setAttribute("data-bs-theme", "dark");
};
const setlightMode = () => {
  document.querySelector("body").setAttribute("data-theme", "light");
  document.querySelector("body").setAttribute("data-bs-theme", "light");
};

const toggleTheme = (e) => {
  if (e.target.checked) setDarkMode();
  else setlightMode();
};

function ThemeToggle() {
  const [t, i18n] = useTranslation();

  return (
    <>
      <Form>
        <Form.Check // prettier-ignore
          type="switch"
          id="custom-switch"
          label={t("dashboard.theme_msg")}
          onChange={toggleTheme}
        />
      </Form>
    </>
  );
}

export default ThemeToggle;
