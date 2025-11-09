import { useContext, useState } from "react";

import Container from "react-bootstrap/esm/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Image from "react-bootstrap/Image";

// to install:
//npm install @mdi/react
//npm install @mdi/js

import Icon from "@mdi/react";
import { mdiPlus } from "@mdi/js";
import { mdiSort } from "@mdi/js";

import { toDoListContext } from "./toDoListProvider";
import ToDoList from "./toDoList";
import PendingItem from "../pending-item";
import ToDoListForm from "./toDoListForm";
import ToDoListDeleteForm from "./toDoListDeleteForm";
import UserProfile from "../userProfile";
import ListFilterConfig from "./listFilterConfig";

function DashboardContent() {
  const { state, data, curUser, filter } = useContext(toDoListContext);
  const [listFormData, setListFormData] = useState();
  const [listDeleteFormData, setListDeleteFormData] = useState();
  const [showFilterConfig, setShowFilterConfig] = useState(false);

  return (
    <Container>
      {!!listFormData ? (
        <ToDoListForm item={listFormData} onClose={() => setListFormData()} />
      ) : null}

      {!!listDeleteFormData ? (
        <ToDoListDeleteForm
          item={listDeleteFormData}
          onClose={() => setListDeleteFormData()}
        />
      ) : null}

      {!!showFilterConfig ? (
        <ListFilterConfig onClose={() => setShowFilterConfig(false)} />
      ) : null}

      <UserProfile name={curUser?.name} />

      <h1 className="display-4 text-center">DashBoard</h1>

      {state === "pending" ? <PendingItem /> : null}

      {state === "ready" ? (
        <Row>
          <Col className="d-flex justify-content-end my-2">
            <Button
              variant="success"
              onClick={() => setShowFilterConfig(true)}
              disabled={state === "pending"}
            >
              <Icon path={mdiSort} size={1} />
            </Button>
          </Col>

          <p>Owner of: </p>
          {/* Active toDoLists */}
          {data?.ownerOf?.map(
            (list) =>
              list.archived === false &&
              filter.active && (
                <ToDoList
                  key={list._id}
                  data={list}
                  setListFormData={setListFormData}
                  setListDeleteFormData={setListDeleteFormData}
                  owner={curUser}
                  canEdit={true}
                />
              )
          )}

          {/* Archived toDoLists */}
          {data?.ownerOf?.map(
            (list) =>
              list.archived === true &&
              filter.archived && (
                <ToDoList
                  key={list._id}
                  data={list}
                  setListFormData={setListFormData}
                  setListDeleteFormData={setListDeleteFormData}
                  owner={curUser}
                  canEdit={true}
                />
              )
          )}

          {/* New list Button */}
          <Col
            sm="4"
            className="d-flex justify-content-center text-center my-2 mx-sm-0"
          >
            <Button
              disable={(state === "pending").toString()}
              onClick={() => setListFormData({})}
              className="w-100 w-sm-auto"
              variant="success"
            >
              <Icon path={mdiPlus} size={1} />
            </Button>
          </Col>

          <p>Member of: </p>
          {data?.memberOf?.map((list) => (
            <ToDoList
              key={list._id}
              data={list}
              setListFormData={setListFormData}
              setListDeleteFormData={setListDeleteFormData}
              owner={list.owner}
              canEdit={false}
            />
          ))}
        </Row>
      ) : null}
    </Container>
  );
}

export default DashboardContent;
