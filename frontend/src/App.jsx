import { useAuth0 } from "@auth0/auth0-react"
import LoginButton from "./components/loginButton"
import LogoutButton from "./components/logoutButton";
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Profile from "./components/profile";

function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route path='/login' element={<Profile/>}/>
        </Routes>
      </Router>
    </>
  );

}

export default App
