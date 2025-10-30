import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/esm/Container";


import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { GroupListContext } from "./group-list-provider";

function Group({ data, setGroupFormData, setGroupDeleteFormData }) {
  const navigate = useNavigate();
  //const { data } = useContext(GroupListContext);
  return (
    <Col
      sm="4"
      className="d-flex justify-content-center text-center my-2 mx-sm-0"
    >
      <Card
        className="w-100 w-sm-auto"
        onClick={() =>
          navigate(`/groupDetail?id=${data.id}&title=${data.title}`)
        }
        style={{ cursor: "pointer", transition: "box-shadow 0.2s" }}
        onMouseOver={(e) => e.currentTarget.classList.add("shadow")}
        onMouseOut={(e) => e.currentTarget.classList.remove("shadow")}
      >
        <Card.Body>
          <Card.Title>{data.title}</Card.Title>
          <Container className="d-flex justify-content-between px-0">
                <Button 
                  className="me-1"
                  variant="warning"
                  onClick={(e) => {
                    // otherwise it would trigger the card button onClick() too
                    e.stopPropagation();
                    setGroupFormData(data);
                  }}
                >
                  Edit
                </Button>
                <Button
                  variant="danger"
                  onClick={(e) => {
                    // otherwise it would trigger the card button onClick() too
                    e.stopPropagation();
                    setGroupDeleteFormData(data);
                  }}
                >
                  Delete
                </Button>
          </Container>
        </Card.Body>
      </Card>
    </Col>
  );

  /*
  return (
    <Accordion.Item eventKey={categoryId} style={{ width: "100%" }}>
      <Accordion.Header className="p-0">
        <Stack direction="horizontal" gap={2}>
          <div>{data?.categoryMap[categoryId].name}</div>
          <div>{sum.toLocaleString("cs")}</div>
        </Stack>
      </Accordion.Header>
      <Accordion.Body>
        <Row>
          {itemList?.map((item) => {
            return (
              <TransactionItem
                item={item}
                setTransactionItemFormData={setTransactionItemFormData}
                setTransactionItemDeleteDialog={setTransactionItemDeleteDialog}
              />
            );
          })}
        </Row>
      </Accordion.Body>
    </Accordion.Item>
  );
  */
}

export default Group;
