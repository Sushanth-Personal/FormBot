import {
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";

import LandingPage from "./pages/LandingPage/LandingPage";
import LoginPage from "./pages/LoginPage/LoginPage";
// import Dashboard from "./pages/Dashboard/Dashboard";
function App() {
  return (
    <Router>
      <Routes>
        {/* Define routes for the login and home pages */}
        <Route path="/" element={<LandingPage />} />
        {/* <Route path="/dashboard/" element={<Dashboard />} /> */}
        <Route path="/login/" element={<LoginPage />} />
        <Route path="*" element={<LandingPage />} />
      </Routes>
    </Router>
  );
}

export default App;
