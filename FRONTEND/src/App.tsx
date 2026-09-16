import { BrowserRouter, Route, Routes } from "react-router-dom";
import CaseDetails from "./pages/CaseDetails";
import Dashboard from "./pages/Dashboard";
import BulkSharePage from "./pages/BulkSharePage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/cases/:caseId" element={<CaseDetails />} />
        <Route path="/bulk-share" element={<BulkSharePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
