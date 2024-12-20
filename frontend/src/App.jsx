import {
    BrowserRouter as Router,
    Route,
    Routes,
  } from "react-router-dom";
  
  import LandingPage from "./pages/LandingPage/LandingPage";
  import LoginPage from "./pages/LoginPage/LoginPage";
    function App() {
    return (
      <Router>
        <Routes>
          {/* Define routes for the login and home pages */}
          <Route path="/" element={<LandingPage/>} />
          <Route path="/login/" element={<LoginPage />} />
         
        </Routes>
      </Router>
    );
  }
  
  export default App;
  