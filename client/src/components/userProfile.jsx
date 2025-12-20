import { Row, Col, Card } from "react-bootstrap";
import { useTranslation } from "react-i18next";
function UserProfile({ name }) {
  const [t, i18n] = useTranslation();
  return (
    <Row className="mb-4 justify-content-end">
      <Col md={4} className="mb-3">
        <Card>
          <Card.Body className="text-center py-3">
            <Card.Title className="mb-1" style={{ fontSize: "1rem" }}>
              {t("dashboard.login")}: {name}
            </Card.Title>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
}

export default UserProfile;
