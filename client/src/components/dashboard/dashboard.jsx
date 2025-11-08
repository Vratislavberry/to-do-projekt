import Container from "react-bootstrap/esm/Container";

import ToDoListProvider from "./toDoListProvider";
import DashboardContent from "./dashboard-content";

function Dashboard() {
  return (
    <>
      <Container>
        <ToDoListProvider>
          <DashboardContent />
        </ToDoListProvider>
      </Container>
    </>
  );
}

export default Dashboard;
