import { Row, Col, Card } from "react-bootstrap";

function UserProfile({ name }) {
  return (
    <Row className="mb-4 justify-content-end">
      <Col md={4} className="mb-3">
        <Card>
          <Card.Body className="text-center py-3">
            <Card.Title className="mb-1" style={{ fontSize: "1rem" }}>
              Login: {name}
            </Card.Title>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
}

export default UserProfile;
