import Container from "react-bootstrap/Container";

import { Outlet } from "react-router-dom";
import NavBar from "./navbar";
import ThemeToggle from "./themeToggle";
import LngSwitch from "./lngSwitch";
import { Row, Col, Card } from "react-bootstrap";

function Layout() {
  return (
    <>
      <NavBar />
      <Container className="p-0 mt-1">
        <Container>
          <Container>
            <Row className="justify-content-start">
              <Col md={4} className="mb-3">
                <Card>
                  <Card.Body className="text-center py-3">
                    <ThemeToggle />
                    <LngSwitch />
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Container>
        </Container>
        <Outlet />{" "}
        {/* Outlet se nahradi vnorenym kodem podle zvolene router v app.jsx */}
      </Container>
    </>
  );
}

export default Layout;
