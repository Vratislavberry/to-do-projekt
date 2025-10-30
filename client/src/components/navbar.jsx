import Container from "react-bootstrap/esm/Container";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import { useNavigate } from "react-router-dom";

function NavBar() {
  const navigate = useNavigate();

  return (
    <Navbar sticky="top" bg="light" variant="light" expand="sm">
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
            Dashboard
          </Nav.Link>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavBar;
