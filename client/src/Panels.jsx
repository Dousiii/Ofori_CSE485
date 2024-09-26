import React, { useState } from "react";
import "./Panels.css";
import Sidebar from './dashboardSidebar/Sidebar';
import Content from "./dashboardSidebar/DefaultContent";
import History from "./dashboardSidebar/History";
import EditContent from "./dashboardSidebar/EditContent";
import UploadContent from "./dashboardSidebar/UploadContent";


  const Panels = () => {

    const [activeContent, setActiveContent] = useState("dashboard"); // Default to "dashboard"

    const renderContent = () => {
      switch (activeContent) {
        case "dashboard":
          return <Content />;
        case "edit":
          return <EditContent />;
        case "add":
          return <UploadContent />;
        default:
          return <EditContent />;
      }
    };

    return (
      <div className="dashboard">
        <Sidebar setActiveContent={setActiveContent}/>
        <div className="content-info">
          {renderContent()}
        </div>
      </div>
    );
  };

export default Panels;