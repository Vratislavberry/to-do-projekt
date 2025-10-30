import Container from "react-bootstrap/esm/Container";

import GroupListProvider from "./group-list-provider";
import DashboardContent from "./dashboard-content";

function Dashboard() {
  return (
    <>
      <Container>
        <h1 className="display-4 text-center">DashBoard</h1>
        <GroupListProvider>
          <DashboardContent />
        </GroupListProvider>
      </Container>
    </>
  );
}

export default Dashboard;
