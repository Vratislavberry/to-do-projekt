import Container from "react-bootstrap/esm/Container";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

function NavBar() {
  const navigate = useNavigate();
  const [t, i18n] = useTranslation();

  return (
    <Navbar sticky="top" expand="sm" bg="body" variant="body">
      <Container>
        <Navbar.Brand
          onClick={() => navigate("/")}
          style={{ cursor: "pointer" }}
        >
          ToDoMan
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          {/* what collapses */}
          <Nav.Link
            onClick={() => navigate("/")}
            active={window.location.pathname === "/"}
          >
            {t("dashboard.dashboard")}
          </Nav.Link>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavBar;
