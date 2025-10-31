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
import SplitCardUI from "./splitCardUI";
import ItemForm from "./itemForm";
import ItemFormDelete from "./itemFormDelete";
import SplitCardBlank from "./splitCard-blank";
import SplitCardConfig from "./splitCard-config";
import SplitCardBar from "./splitCard-bar";
import ItemUI from "./itemUI";
import ItemFilterConfig from "./itemFilterConfig";
import ItemCounter from "./ItemCounter";

function ListDetailContent() {
  const { state, data, filter } = useContext(listDetailContext);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showConfig, setShowConfig] = useState(false);
  const [showFilterConfig, setShowFilterConfig] = useState(false);
  const [itemFormData, setItemFormData] = useState();
  const [itemFormDeleteData, setItemFormDeleteData] = useState();
  const [SplitCardStates, setSplitCardStates] = useState();
  const [textSegmentsList, setTextSegmentsList] = useState([]);

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
        <SplitCardConfig
          onClose={() => setShowConfig(false)}
          setSplitCardFormData={setItemFormData}
          setSplitCardDeleteFormData={setSplitCardDeleteFormData}
          currentCard={data?.splitCardList[currentCardIndex]}
        />
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

      <Col className="d-flex justify-content-end my-2">
        <Button
          variant="success"
          onClick={() => setShowFilterConfig(true)}
          disabled={state === "pending"}
        >
          <Icon path={mdiSort} size={1} />
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

      {/*
        <Row>
          <SplitCardBar
            splitCardStates={SplitCardStates}
            currentCardIndex={currentCardIndex}
            setCurrentCardIndex={setCurrentCardIndex}
          />
          <SplitCardUI
            cardIndex={currentCardIndex}
            setCardIndex={setCurrentCardIndex}
            card={data?.splitCardList[currentCardIndex]}
            numOfCards={data?.splitCardList?.length}
            setShowConfig={setShowConfig}
            cardStateSaved={SplitCardStates?.[currentCardIndex]}
            changeCardState={(state) =>
              setSplitCardStates(
                SplitCardStates?.map((prevState, i) => {
                  if (i === currentCardIndex) {
                    return state;
                  } else {
                    return prevState;
                  }
                })
              )
            }
            textSegmentsSaved={textSegmentsList[currentCardIndex]}
            updateTextSegments={(updSegments) => {
              setTextSegmentsList(
                textSegmentsList.map((item, i) => {
                  if (i === currentCardIndex) {
                    return updSegments;
                  } else {
                    return item;
                  }
                })
              );
            }}
          />
        </Row>
      ) : null}
      */}

      {/* no item is created yet */}
      {state === "ready" && data?.splitCardList?.length === 0 ? (
        <Row>
          <SplitCardBlank onCreateFormClose={() => setItemFormData({})} />
        </Row>
      ) : null}
    </Container>
  );
}

export default ListDetailContent;
