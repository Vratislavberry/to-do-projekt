import { useContext, useState, useEffect } from "react";

import Container from "react-bootstrap/esm/Container";
import Row from "react-bootstrap/Row";
import { Col, Button } from "react-bootstrap";
import Icon from "@mdi/react";
import { mdiSort } from "@mdi/js";

// to install:
//npm install @mdi/react
//npm install @mdi/js

import { listDetailContext } from "./listDetailProvider";
import PendingItem from "../pending-item";
import ItemForm from "./itemForm";
import ItemFormDelete from "./itemFormDelete";
import ListDetailConfig from "./listDetailConfig";
import ItemUI from "./itemUI";
import ItemFilterConfig from "./itemFilterConfig";
import ItemCounter from "./ItemCounter";
import { mdiCog } from "@mdi/js";

function ListDetailContent() {
  const { state, data, filter } = useContext(listDetailContext);
  const [showConfig, setShowConfig] = useState(false);
  const [showFilterConfig, setShowFilterConfig] = useState(false);
  const [itemFormData, setItemFormData] = useState();
  const [itemFormDeleteData, setItemFormDeleteData] = useState();

  // when data is ready, initialize SplitCardStates
  // with "current" for the first card and "unvisited" for the rest
  useEffect(() => {
    if (state === "ready" && data?.itemList?.length > 0) {
      setSplitCardStates(
        data?.splitCardList.map((item, i) => {
          return "unvisited";
        })
      );
      setTextSegmentsList(
        data?.splitCardList.map((item) => {
          return [];
        })
      );
    }
  }, [state]);

  return (
    <Container>
      {!!showConfig ? (
        <ListDetailConfig onClose={() => setShowConfig(false)} />
      ) : null}

      {!!itemFormData ? (
        <ItemForm
          item={itemFormData}
          onClose={() => setItemFormData()}
          setItemFormDeleteData={setItemFormDeleteData}
        />
      ) : null}

      {!!itemFormDeleteData ? (
        <ItemFormDelete
          item={itemFormDeleteData}
          onClose={() => setItemFormDeleteData()}
        />
      ) : null}

      {!!showFilterConfig ? (
        <ItemFilterConfig onClose={() => setShowFilterConfig(false)} />
      ) : null}

      <h1 className="display-4 text-center">{data?.title}</h1>

      <Col className="d-flex justify-content-end my-2">
        <Button
          variant="success"
          onClick={() => setShowFilterConfig(true)}
          disabled={state === "pending"}
        >
          <Icon path={mdiSort} size={1} />
        </Button>

        <Button
          variant="success"
          onClick={() => setShowConfig(true)}
          className="mx-2"
          disabled={state === "pending"}
        >
          <Icon path={mdiCog} size={1} />
        </Button>
      </Col>

      {state === "pending" ? <PendingItem /> : null}

      {state === "ready" && data?.itemList?.length > 0 ? (
        <Row>
          <ItemCounter />

          {data.itemList.map((item) =>
            filter[item.state] ? (
              <ItemUI
                key={item._id}
                item={item}
                setItemFormData={setItemFormData}
              />
            ) : null
          )}

          <Col sm="12" className="my-2">
            <Button
              variant="success"
              className="w-100 text-start"
              disabled={state === "pending"}
              onClick={() => setItemFormData({})}
            >
              Create new note
            </Button>
          </Col>
        </Row>
      ) : null}

      {/* no item is created yet */}
      {state === "ready" && data?.itemList?.length === 0 ? (
        <Row>
          <p>There are no items yet...</p>
          <Col sm="12" className="my-2">
            <Button
              variant="success"
              className="w-100 text-start"
              disabled={state === "pending"}
              onClick={() => setItemFormData({})}
            >
              Create new note
            </Button>
          </Col>
        </Row>
      ) : null}
    </Container>
  );
}

export default ListDetailContent;
