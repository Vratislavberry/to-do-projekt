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

import { toDoListContext } from "./toDoListProvider";
import ToDoList from "./toDoList";
import PendingItem from "../pending-item";
import ToDoListForm from "./toDoListForm";
import GroupDeleteForm from "./group-delete-form";
import UserProfile from "../userProfile";

function DashboardContent() {
  const { state, data, curUser } = useContext(toDoListContext);
  const [listFormData, setListFormData] = useState();
  const [listDeleteFormData, setListDeleteFormData] = useState();

  return (
    <Container>
      {!!listFormData ? (
        <ToDoListForm item={listFormData} onClose={() => setListFormData()} />
      ) : null}

      {!!listDeleteFormData ? (
        <GroupDeleteForm
          item={listDeleteFormData}
          onClose={() => setListDeleteFormData()}
        />
      ) : null}

      <UserProfile name={curUser?.name}/>

      <h1 className="display-4 text-center">DashBoard</h1>

      {state === "pending" ? <PendingItem /> : null}

      {state === "ready" ? (
        <Row>
          <p>Owner of: </p>
          {data?.ownerOf?.map((list) => (
            <ToDoList
              key={list._id}
              data={list}
              setListFormData={setListFormData}
              setListDeleteFormData={setListDeleteFormData}
              owner={curUser}
            />
          ))}
          <p>Member of</p>
          {data?.memberOf?.map((list) => (
            <ToDoList
              key={list._id}
              data={list}
              setListFormData={setListFormData}
              setListDeleteFormData={setListDeleteFormData}
              owner={list.owner}
            />
          ))}
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
        </Row>
      ) : null}
    </Container>
  );
}

export default DashboardContent;
