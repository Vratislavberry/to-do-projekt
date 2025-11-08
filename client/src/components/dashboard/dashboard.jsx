import Container from "react-bootstrap/esm/Container";

import ToDoListProvider from "./toDoListProvider";
import DashboardContent from "./dashboard-content";

function Dashboard() {
  return (
    <>
      <Container>
        <h1 className="display-4 text-center">DashBoard</h1>
        <ToDoListProvider>
          <DashboardContent />
        </ToDoListProvider>
      </Container>
    </>
  );
}

export default Dashboard;
