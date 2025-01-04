import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Profile from "./components/profile";
import Dashboard from './pages/dashboard';


function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route path= "/"  element={<Dashboard/>}/>
        </Routes>
      </Router>
    </>
  );

}

export default App

