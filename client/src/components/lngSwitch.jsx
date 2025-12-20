import React from "react";
import { useTranslation } from "react-i18next";

function LngSwitch() {
  const [t, i18n] = useTranslation();
  const hangleLngChange = (lang) => {
    i18n.changeLanguage(lang);
  };
  return (
    <>
      <button onClick={() => hangleLngChange("cz")}>czech</button>
      <button onClick={() => hangleLngChange("en")}>english</button>
    </>
  );
}

export default LngSwitch;
