import Container from "react-bootstrap/Container";

import { Outlet } from "react-router-dom";
import NavBar from "./navbar";
import ThemeToggle from "./themeToggle";

function Layout() {
  return (
    <>
      <NavBar />
      <Container className="p-0 mt-1">
        <ThemeToggle className="" />
        <Outlet />{" "}
        {/* Outlet se nahradi vnorenym kodem podle zvolene router v app.jsx */}
      </Container>
    </>
  );
}

export default Layout;
