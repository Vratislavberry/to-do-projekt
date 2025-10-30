import Offcanvas from "react-bootstrap/Offcanvas";
import Button from "react-bootstrap/Button";

function SplitCardConfig({
  currentCard,
  onClose,
  setSplitCardFormData,
  setSplitCardDeleteFormData,
}) {
  return (
    <Offcanvas onHide={onClose} show={true} placement="bottom">
      <Button
        onClick={() => {
          setSplitCardFormData({});
          onClose();
        }}
        className="m-1"
      >
        Create
      </Button>
      <Button
        onClick={() => {
          setSplitCardFormData(currentCard);
          onClose();
        }}
        className="m-1"
      >
        Update
      </Button>
      <Button
        onClick={() => {
          setSplitCardDeleteFormData(currentCard);
          onClose();
        }}
        className="m-1"
      >
        Delete
      </Button>
    </Offcanvas>
  );
}

export default SplitCardConfig;
