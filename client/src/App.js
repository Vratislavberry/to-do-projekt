import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "./components/layout";
import ListDetail from "./components/listDetail/listDetail";
import Dashboard from "./components/dashboard/dashboard";

function App() {
  /*alt+shift+f = zarovnani*/
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            {/* formát route: http://localhost:3001/listDetail?listID=671f4b2f9a8e7c1234567890 */}
            <Route path="/listDetail" element={<ListDetail />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
