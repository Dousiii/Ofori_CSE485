import React, { useState, useEffect } from "react";
import "./admin.css";
import Sidebar from './dashboardSidebar/Sidebar';
import Content from "./dashboardSidebar/DefaultContent";
import EditContent from "./dashboardSidebar/EditContent";
import UploadContent from "./dashboardSidebar/UploadContent";
import { Modal, message } from 'antd';

const Panels = () => {
  const [activeContent, setActiveContent] = useState("dashboard");
  const [events, setEvents] = useState([]);
  const [audiences, setAudiences] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        await Promise.all([fetchEvents(), fetchAudiences()]);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/getEvents');
      const data = await response.json();
      setEvents(data);
    } catch (error) {
      console.error('Error fetching events:', error);
      message.error('Failed to load events');
    }
  };

  const fetchAudiences = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/getAudiences');
      const data = await response.json();
      setAudiences(data);
    } catch (error) {
      console.error('Error fetching audiences:', error);
      message.error('Failed to load audience data');
    }
  };

  // Function to add new event
  const addEvent = (newEvent) => {
    setEvents([...events, newEvent]);
    setActiveContent("dashboard");
  };
  
  const updateEvent = (updatedEvent) => {
    setEvents((prevEvents) =>
      prevEvents.map((event) => (event.Event_id === updatedEvent.Event_id ? updatedEvent : event))
    );
    setActiveContent("dashboard");
  };

  const deleteEvent = (eventId) => {
    setEvents(events.filter(event => event.Event_id !== Number(eventId)));
    setActiveContent("dashboard");
  };

  const renderContent = () => {
    if (isLoading) {
      return <div>Loading...</div>;
    }
    
    switch (activeContent) {
      case "dashboard":
        return <Content events={events} audiences={audiences} onDeleteEvent={deleteEvent}/>;
      case "edit":
        return <EditContent events={events} onUpdateEvent={updateEvent} />;
      case "add":
        return <UploadContent addEvent={addEvent}/>;
      default:
        return <Content events={events} audiences={audiences} onDeleteEvent={deleteEvent}/>;
    }
  };

  return (
    <div className="dashboard">
      <Sidebar setActiveContent={setActiveContent}/>
      <div className="content-info">
        {renderContent()}
        <button className="logout-button">Logout</button>
      </div>
    </div>
  );
};

export default Panels;
