import React from "react";
import Form from "react-bootstrap/Form";

const setDarkMode = () => {
  document.querySelector("body").setAttribute("data-theme", "dark");
  document.querySelector("body").setAttribute(
    "data-bs-theme",
    "dark"
  );
};
const setlightMode = () => {
  document.querySelector("body").setAttribute("data-theme", "light");
  document.querySelector("body").setAttribute(
    "data-bs-theme",
    "light"
  );
};

const toggleTheme = (e) => {
  if (e.target.checked) setDarkMode();
  else setlightMode();
};

function ThemeToggle() {
  return (
    <>
      <Form>
        <Form.Check // prettier-ignore
          type="switch"
          id="custom-switch"
          label="Light / dark theme"
          onChange={toggleTheme}
        />
      </Form>
    </>
  );
}

export default ThemeToggle;
