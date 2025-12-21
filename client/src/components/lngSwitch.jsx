import React from "react";
import { useTranslation } from "react-i18next";
import i18next from "i18next";
import Dropdown from "react-bootstrap/Dropdown";



function LngSwitch() {
  const [t, i18n] = useTranslation();

  const languages = [
    { code: "en", label: "English", flag: "/flags/en.png" },
    { code: "cz", label: "Čeština", flag: "/flags/cz.png" },
  ];
  const currentLang = i18next.language;
  const current = languages.find((l) => l.code === currentLang) || languages[0];
  return (
    <>
      <Dropdown>
        <Dropdown.Toggle
          variant="body"
          id="language-switcher"
          className="d-flex align-items-center"
        >
          <img
            src={current.flag}
            alt={current.label}
            width="30"
            className="me-2"
          />
          {current.code.toUpperCase()}
        </Dropdown.Toggle>

        <Dropdown.Menu>
          {languages.map((lang) => (
            <Dropdown.Item
              key={lang.code}
              onClick={() => i18next.changeLanguage(lang.code)}
            >
              <img
                src={lang.flag}
                alt={lang.label}
                width="20"
                className="me-2"
              />
              {lang.label}
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>
    </>
  );
}

export default LngSwitch;
