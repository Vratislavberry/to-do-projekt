import Spinner from "react-bootstrap/Spinner";
import Col from "react-bootstrap/Col";

function PendingItem() {
  return (
    <Col className="d-flex justify-content-center mt-5 ">
      <Spinner className="" animation="border" role="status" />
    </Col>
  );
}

export default PendingItem;
