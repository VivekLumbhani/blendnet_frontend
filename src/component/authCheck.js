import React, { useEffect } from 'react';

import {  useNavigate } from "react-router-dom";

const Home = () => {
    
    const navigate = useNavigate();

  useEffect(() => {
    const userid = localStorage.getItem('userid');

    if (!userid) {

        navigate("/");
    }
  }, [navigate]);

  return (
    <div>

      <h1>Welcome to the Home Page</h1>
    </div>
  );
};

export default Home;
