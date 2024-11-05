import React, { useState } from 'react'
import "./DefaultContent.css"
import { Modal, message } from 'antd';


const DefaultContent = ({ events, onDeleteEvent }) => {


  const [searchQuery, setSearchQuery] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);

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

  const handleDeleteClick = (event, e) => {
    e.stopPropagation(); // Prevent event click handler from firing
    setEventToDelete(event);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = () => {
    onDeleteEvent(eventToDelete.id);
    setShowDeleteModal(false);
    setEventToDelete(null);
    message.success('Event deleted successfully!');
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
              >
                <div className="event-content">
                  <div className="event-details">
                    <h3>{event.title}</h3>
                    <p>Date: {event.date}</p>
                    <p>Time: {event.time}</p>
                    <p>Place: {event.place}</p>
                  </div>
                  <div className="delete-container">
                    <button 
                      className="delete-button"
                      onClick={(e) => handleDeleteClick(event, e)}
                    >
                      ×
                    </button>
                  </div>
                </div>
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
      <Modal
        title="Confirm Delete"
        visible={showDeleteModal}
        onOk={handleDeleteConfirm}
        onCancel={() => setShowDeleteModal(false)}
      >
        <p>Are you sure you want to delete this event? This action cannot be undone.</p>
      </Modal>
    </div>
  )
}

export default DefaultContent;
