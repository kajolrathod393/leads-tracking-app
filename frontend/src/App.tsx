import { Routes, Route } from "react-router-dom";
import LeadsPage from "./pages/LeadsPage";
import CreateLeadPage from "./pages/CreateLeadPage";
import LeadDetailPage from "./pages/LeadDetailPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LeadsPage />} />
      <Route path="/leads/new" element={<CreateLeadPage />} />
      <Route path="/leads/:id" element={<LeadDetailPage />} />
    </Routes>
  );
}

export default App;
