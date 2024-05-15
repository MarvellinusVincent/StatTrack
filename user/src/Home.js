// Home.js
import React from 'react';
import { Outlet, Link } from "react-router-dom";

const Home = () => {
  return (
    <div>
      <h2>Home Page</h2>
      <li>
            <Link to="/dash">Link to Dash</Link>
          </li>
          <Outlet />
    </div>
    
  );
};

export default Home;
