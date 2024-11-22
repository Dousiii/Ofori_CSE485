import React, { useState } from 'react'
import "./DefaultContent.css"
import { Modal, message } from 'antd';


const DefaultContent = ({ events, audiences, onDeleteEvent }) => {


  const [searchQuery, setSearchQuery] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedEventAudiences, setSelectedEventAudiences] = useState([]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredEvents = events?.filter(event =>
    event?.Title?.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const sortedEvents = filteredEvents.length > 0
    ? [...filteredEvents].sort((a, b) => new Date(b.Date) - new Date(a.Date))
    : [];

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    const eventAudiences = audiences?.filter(audience => 
      audience?.Event_id === event?.Event_id
    ) || [];
    setSelectedEventAudiences(eventAudiences);
  };

  const handleDeleteClick = (event, e) => {
    e.stopPropagation();
    setEventToDelete(event);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/deleteEvent/${eventToDelete.Event_id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        onDeleteEvent(eventToDelete.Event_id);
        setShowDeleteModal(false);
        setEventToDelete(null);
        message.success('Event deleted successfully!');
      } else {
        const data = await response.json();
        message.error('Failed to delete event: ' + data.error);
      }
    } catch (error) {
      console.error('Error deleting event:', error);
      message.error('Failed to delete event');
    }
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
                key={event.Event_id}
                className={`event-card ${selectedEvent?.Event_id === event.Event_id ? 'selected' : ''}`}
                onClick={() => handleEventClick(event)}
              >
                <div className="event-content">
                  <div className="event-details">
                    <h3>{event.Title}</h3>
                    <p>Date: {event.Date}</p>
                    <p>Location: {event.Location}</p>
                    <p>Total Attendees: {event.Total_audi}</p>
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
          <h2>{selectedEvent ? `Participants for ${selectedEvent.Title}` : 'Select an event to view participants'}</h2>
          {selectedEventAudiences.map(audience => (
            <div key={audience.Audience_id} className="peopleInfo">
              <div>
                <p><strong>Name:</strong> {audience.Name}</p>
                <p><strong>Email:</strong> {audience.Email}</p>
                <p><strong>Phone:</strong> {audience.Phone || 'N/A'}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Modal
        title="Confirm Delete"
        open={showDeleteModal}
        onOk={handleDeleteConfirm}
        onCancel={() => setShowDeleteModal(false)}
      >
        <p>Are you sure you want to delete this event?</p>
      </Modal>
    </div>
  )
}

export default DefaultContent;
