import ListDetailProvider from "./listDetailProvider";
import ListDetailContent from "./listDetailContent";
import { useLocation } from "react-router-dom";

import Container from "react-bootstrap/esm/Container";

function ListDetail() {
  const location = useLocation();

  // Parse the query parameters
  //Example URL: http://localhost:3000/listDetail?id=1&title=Spagheti
  const params = new URLSearchParams(location.search);
  const listID = params.get("id");

  return (
    <>
      <Container>
        <ListDetailProvider listID={listID}>
          <ListDetailContent />
        </ListDetailProvider>
      </Container>
    </>
  );
}

export default ListDetail;
