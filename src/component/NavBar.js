import { DeleteForeverOutlined, Home } from '@mui/icons-material';
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {  useNavigate } from "react-router-dom";

const NavBar = () => {
  const navigate = useNavigate();

  const location = useLocation();

  const logoutFunc=()=>{
    localStorage.removeItem("userid")
    navigate("/");

  }
  return (
    
    <div className="row flex items-center">
      <h1 className={`text-2xl font-semibold mb-4 mr-4 ${location.pathname === '/home' ? 'text-blue-500' : ''}`}>
        <Link to="/home">Search</Link>
      </h1>
      <h1 className={`text-2xl font-semibold mb-4 ${location.pathname === '/watchlist' ? 'text-blue-500' : ''}`}>
        <Link to="/watchlist">My Watch List</Link>
      </h1>
      <h1 className={`text-2xl font-semibold mb-4 mr-4 ${location.pathname === '/home' ? 'text-blue-500' : ''}`} onClick={logoutFunc}>
        <Link to="/"> <DeleteForeverOutlined/> LogOut</Link>
      </h1>

    </div>
  );
};

export default NavBar;
