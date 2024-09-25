import React from "react";
import "./Panels.css";
import Sidebar from './dashboardSidebar/Sidebar';
import Content from "./dashboardSidebar/Content";


  const Panels = () => {
    return (
      <div className="dashboard">
        <Sidebar />
        <div className="content-info">
        <Content />
        </div>
      </div>
    );
  };

export default Panels;