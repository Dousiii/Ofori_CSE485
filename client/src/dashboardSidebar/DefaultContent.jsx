import React, { useState } from 'react'
import "./DefaultContent.css"


const DefaultContent = ({ events }) => {


  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredEvents = events.filter(event =>
    event.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedEvents = filteredEvents.length > 0
    ? [...filteredEvents].sort((a, b) => new Date(b.date) - new Date(a.date))
    : [];

  const initialEvent = sortedEvents.length > 0 ? sortedEvents[0] : null;

  const [selectedEvent, setSelectedEvent] = useState(initialEvent);
  const [peopleList, setPeopleList] = useState(initialEvent ? initialEvent.people : []);

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setPeopleList(event.people);
  };

  if (events.length === 0) {
    return (
      <div className="content">
        <div className="title">
          <h3>Welcome</h3>
        </div>
        <div className="cards">
          <p>No events exist. Please add an event.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="content">
      <div className="title">
        <h3>Welcome</h3>
      </div>

      <div className="cards">
        <div className="groupSearch">
        <input
        type="text"
        placeholder="Search events..."
        value={searchQuery}
        onChange={handleSearchChange}
      />
          <div className="event-list">
            {sortedEvents.map(event => (
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
        </div>

        <div className="peopleList">
          <h2>People Signed Up for "{selectedEvent.title}"</h2>
          <div className="scrollable-box">
            <ul>
              {peopleList.map((person, index) => (
                <li key={index} className={index % 2 === 0 ? 'even' : 'odd'}>
                  <div className="peopleInfo">
                    <span>{person.name}</span>
                    <span style={{ paddingLeft: '10px' }}>{person.email}</span>
                  </div>
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
