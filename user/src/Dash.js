// Dash.js
import React from 'react';
import { Outlet, Link } from "react-router-dom";

const Dash = () => {
  return (
    <div>
      <h2>Dashboard Page</h2>
      <li>
            <Link to="/">Link to Home</Link>
          </li>
          <Outlet />
    </div>
  );
};

export default Dash;
