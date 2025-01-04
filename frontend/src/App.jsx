import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/dashboard';
import LandingPage from './pages/landingpage';
import Location from './pages/user';


function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route path= "/dashboard"  element={<Dashboard/>}/>
          <Route path="/" element={<LandingPage/>}/>
          {/* <Route path='/login' element={<Profile/>}/> */}
          <Route path='/user' element={<Location/>}/>
        </Routes>
      </Router>
    </>
  );

}

export default App

