import { useState, useEffect } from "react";

import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import Button from "react-bootstrap/esm/Button";
import Container from "react-bootstrap/esm/Container";

import Icon from "@mdi/react";
//import { mdiPlus } from "@mdi/js";
import { mdiCog } from "@mdi/js";

// randomly shuffles given array of objects
function shuffle(array) {
  for (var i = array.length - 1; i >= 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = { ...array[i] };
    array[i] = { ...array[j] };
    array[j] = { ...temp };
  }
  return array;
}

function SplitCardUI({
  cardIndex,
  setCardIndex,
  card,
  numOfCards,
  setShowConfig,
  changeCardState,
  textSegmentsSaved,
  updateTextSegments,
  cardStateSaved,
}) {
  //console.log(`card: ${JSON.stringify(card)}`);

  const [textSegments, setTextSegments] = useState(textSegmentsSaved || []);

  /** States whether the order of the segments is correct
   * "correct", "incorrect", "visited", "unvisited", "current"
   * */
  const [SplitCardState, setSplitCardState] = useState("unvisited");

  // Update textSegments whenever cardIndex or card changes
  useEffect(() => {
    if (textSegmentsSaved?.length > 0) {
      setTextSegments(textSegmentsSaved);
    } else if (card?.questionText) {
      const shuffledSegments = shuffle(
        card.questionText.split(";").map((textPart, index) => {
          return {
            id: index,
            text: textPart,
            checked: false,
            color: "secondary",
          };
        })
      );
      setTextSegments(shuffledSegments);
    }
    if (cardStateSaved !== undefined && cardStateSaved !== "unvisited") {
      setSplitCardState(cardStateSaved);
    } else {
      setSplitCardState("visited");
    }
  }, [cardIndex, card]);

  // Update SplitCardState whenever cardIndex or SplitCardState changes
  useEffect(() => {
    changeCardState(SplitCardState);
  }, [SplitCardState, cardIndex]);

  // Updates textSegmentsList held in the parent component
  useEffect(() => {
    updateTextSegments(textSegments);
  }, [textSegments]);

  // handles click on the card segment
  // Un/checks the card segment with given id
  function handleCardSegmentClick(id) {
    const tempObject = textSegments.find((segment) => {
      return segment.id === id;
    });
    tempObject.checked = !tempObject.checked;
    // Change color of the segment to white when the user unchecks it
    if (tempObject.checked === false) {
      tempObject.color = "secondary";
    }
    setTextSegments((preValue) => {
      return [
        ...preValue.filter((segment) => {
          return segment.id !== id;
        }),
        tempObject,
      ];
    });

    setSplitCardState("visited");
  }

  /***** helper functions *****/
  // returns array of SplitCardSegments that satisfy given filter function
  function getSpecifiedSegments(textSegments, myFilter) {
    return textSegments.filter(myFilter).map((segment) => (
      <Button
        onClick={() => handleCardSegmentClick(segment.id)}
        className="m-1"
        key={segment.id}
        variant={segment.color}
      >
        {segment.text}
      </Button>
    ));
  }

  // handles click on the reset button
  // sets state to "visited" and reset SplitCardSegments
  function handleReset() {
    /*TextSegments().map((segment) => {
      return { ...segment, checked: false, color: "white" };
    });
    */
    setTextSegments((prevTextSegments) =>
      prevTextSegments.map((segment) => {
        return { ...segment, checked: false, color: "secondary" };
      })
    );
    setSplitCardState("visited");
  }

  // handles click on the check button
  // sets correctResult to "correct" if all segments are checked and in correct order
  function handleCheck() {
    // change color of all incorrect segments to red and correct to green
    let iOfCheckedSegments = 0;
    for (let i = 0; i < textSegments.length; i++) {
      if (textSegments[i].checked === false) {
        continue;
      }
      if (textSegments[i].id === iOfCheckedSegments) {
        iOfCheckedSegments++;
        changeTextSegmentsElement(i, { color: "success" });
      } else {
        iOfCheckedSegments++;
        changeTextSegmentsElement(i, { color: "danger" });
      }
    }

    // check if all segments are checked and in correct order
    for (let i = 0; i < textSegments.length; i++) {
      if (textSegments[i].id !== i || textSegments[i].checked !== true) {
        setSplitCardState("incorrect");
        return;
      }
    }
    setSplitCardState("correct");
  }

  // Changes one element of the textSegments array without mutating the original array
  function changeTextSegmentsElement(id, newObject) {
    setTextSegments((preValue) => {
      return preValue.map((textSegment, index) => {
        if (index === id) {
          return { ...textSegment, ...newObject };
        }
        return textSegment;
      });
    });
  }

  return (
    <Card>
      <Card.Body>
        <Container className="d-flex justify-content-between mb-1">
          <Card.Title>{card?.title}</Card.Title>
          <Button variant="success" onClick={() => setShowConfig(true)}>
            <Icon path={mdiCog} size={1} />
          </Button>
        </Container>
        <ListGroup>
          <ListGroup.Item>
            {getSpecifiedSegments(textSegments, (textSegment) => {
              return textSegment.checked === true;
            })}
          </ListGroup.Item>
          <ListGroup.Item>
            {getSpecifiedSegments(textSegments, (textSegment) => {
              return textSegment.checked === false;
            })}
          </ListGroup.Item>
          <ListGroup.Item className="d-flex justify-content-between">
            <Button onClick={handleReset}>Reset</Button>
            <Button onClick={handleCheck}>Check</Button>
          </ListGroup.Item>
          <ListGroup.Item className="d-flex justify-content-between">
            <Button
              onClick={() => setCardIndex(cardIndex - 1)}
              disabled={cardIndex === 0}
            >
              {"<<"}
            </Button>
            <Button
              onClick={() => setCardIndex(cardIndex + 1)}
              disabled={cardIndex === numOfCards - 1}
            >
              {">>"}
            </Button>
          </ListGroup.Item>
          {SplitCardState === "correct" && (
            <ListGroup.Item variant="success">You are right!</ListGroup.Item>
          )}
          {SplitCardState === "incorrect" && (
            <ListGroup.Item variant="danger">You are incorrect</ListGroup.Item>
          )}
        </ListGroup>
      </Card.Body>
    </Card>
  );
}

export default SplitCardUI;
