import React from "react";
import { BrowserRouter as Router , Routes, Route } from "react-router-dom";
import Login from './pages/Login'
import Register from './pages/Register'
import Home from './pages/Home'
import Profile from "./pages/Profile";
import UserProfile from "./pages/userProfile";

const App = () => {
  return(
    <Router>
      <Routes>
        <Route path="/" element={<Register/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path= "/home" element={<Home/>}/>
        <Route path= "/Profile" element={<Profile/>}/>
        <Route path= "/user/:id" element={<UserProfile/>}/>
      </Routes>
    </Router>
  )
}

export default App;