import React, { useState } from 'react'
import "./DefaultContent.css"
import { Button, Space, DatePicker, version } from 'antd';

const DefaultContent = ({ events }) => {

   // Sort events by date to ensure the newest event comes first
   const sortedEvents = events && events.length > 0
   ? [...events].sort((a, b) => new Date(b.date) - new Date(a.date))
   : [];

 // Set the newest event (the first one after sorting) as the default
 const initialEvent = sortedEvents.length > 0 ? sortedEvents[0] : null;

 // State to track the current event and the people who signed up
 const [selectedEvent, setSelectedEvent] = useState(initialEvent);
 const [peopleList, setPeopleList] = useState(initialEvent ? initialEvent.people : []);
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