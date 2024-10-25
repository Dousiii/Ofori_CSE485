import React, { useState } from "react";
import "./admin.css";
import Sidebar from './dashboardSidebar/Sidebar';
import Content from "./dashboardSidebar/DefaultContent";
import History from "./dashboardSidebar/History";
import EditContent from "./dashboardSidebar/EditContent";
import UploadContent from "./dashboardSidebar/UploadContent";
import { initialEvents } from "./eventsData";
import { message } from 'antd'; // Import the message component from antd


  const Panels = () => {

    const [activeContent, setActiveContent] = useState("dashboard"); // Default to "dashboard"
    const [events, setEvents] = useState(initialEvents); // Manage events in Panels
    

    // Function to add new event
    const addEvent = (newEvent) => {
      setEvents([...events, newEvent]);
      setActiveContent("dashboard");
    };
    
    const updateEvent = (updatedEvent) => {
      setEvents((prevEvents) =>
        prevEvents.map((event) => (event.id === updatedEvent.id ? updatedEvent : event))
      );
      setActiveContent("dashboard");
    };

    const deleteEvent = (eventId) => {
      setEvents(events.filter(event => event.id !== Number(eventId)));
      setActiveContent("dashboard"); // Switch to default conten
    };

    const renderContent = () => {
      switch (activeContent) {
        case "dashboard":
          return <Content events={events}/>;
        case "edit":
          return <EditContent events={events} onUpdateEvent={updateEvent} onDeleteEvent={deleteEvent} />;
        case "add":
          return <UploadContent addEvent={addEvent}/>;
        default:
          return <Content events={events}/>;
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
