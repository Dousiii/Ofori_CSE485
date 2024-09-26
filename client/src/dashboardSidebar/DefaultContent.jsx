import React, { useState } from 'react'
import "./DefaultContent.css"
import { Button, Space, DatePicker, version } from 'antd';

const DefaultContent = () => {
  const events = [
    {
      id: 1,
      title: "React Workshop",
      date: "2024-09-30",
      time: "10:00 AM",
      place: "Conference Room A",
      people: ["Alice Smith", "Bob Johnson", "Charlie Brown"]
    },
    {
      id: 2,
      title: "Python Bootcamp",
      date: "2024-10-01",
      time: "2:00 PM",
      place: "Lab 101",
      people: ["Diana Prince", "Ethan Hunt", "Fiona Apple"]
    },
    {
      id: 3,
      title: "AI Seminar",
      date: "2024-10-05",
      time: "11:00 AM",
      place: "Auditorium B",
      people: ["George Clooney", "Hannah Montana", "Ian Malcolm"]
    },
  ];

  // State to track the current event and the people who signed up
  const [selectedEvent, setSelectedEvent] = useState(events[0]);
  const [peopleList, setPeopleList] = useState(events[0].people);

  // Handle event click
  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setPeopleList(event.people);
  };

  return (
    <div className="content">
      <div className="title">
      <h3>Welcome</h3>
      </div>  
      <div className="cards">

        <div className="event-list">
          {events.map(event => (
            <div 
              key={event.id} 
              className="event-card" 
              onClick={() => handleEventClick(event)} 
              style={{ cursor: 'pointer', padding: '10px', border: '1px solid #ccc', marginBottom: '10px' }}
            >
              <h3>{event.title}</h3>
              <p>Date: {event.date}</p>
              <p>Time: {event.time}</p>
              <p>Place: {event.place}</p>
            </div>
          ))}
        </div>

        {/* Selected Event Details */}
        <div className="peopleList">
          <h2>People Signed Up for "{selectedEvent.title}"</h2>
          <div className="scrollable-box">
            <ul>
              {peopleList.map((person, index) => (
                <li key={index} className={index % 2 === 0 ? 'even' : 'odd'}>
                  {person}
                </li>
              ))}
            </ul>
          </div>
        </div>

      </div>
    </div>
  )
}

export default DefaultContent;