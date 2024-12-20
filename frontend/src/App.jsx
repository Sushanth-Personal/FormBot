import {
    BrowserRouter as Router,
    Route,
    Routes,
  } from "react-router-dom";
  
  import LandingPage from "./pages/LandingPage/LandingPage";
    function App() {
    return (
      <Router>
        <Routes>
          {/* Define routes for the login and home pages */}
          <Route path="/" element={<LandingPage/>} />
       
         
        </Routes>
      </Router>
    );
  }
  
  export default App;
  