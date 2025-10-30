import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "./components/layout";
//import Dashboard from "./components/dashboard/dashboard";
import ListDetail from "./components/listDetail/listDetail";

function App() {
  /*alt+shift+f = zarovnani*/
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            {/*<Route index element={<Dashboard />} />*/}
            <Route index element={<h1 className="display-4 text-center">DashBoard</h1>} />
            {/* formát route: http://localhost:3001/listDetail?listID=671f4b2f9a8e7c1234567890&title=Grocery%20Checklist */}
            <Route path="/listDetail" element={<ListDetail />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
