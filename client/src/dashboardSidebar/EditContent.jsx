import React, { useState, useEffect } from 'react';
import './EditContent.css';
import { message } from 'antd';

const EditContent = ({ events, onUpdateEvent }) => {
  const newestEvent = events[events.length - 1];
  const [eventData, setEventData] = useState({
    Event_id: '',
    Title: '',
    Date: '',
    Location: '',
    time: '',
    description: '',
  });

  useEffect(() => {
    if (newestEvent) {
      setEventData({
        Event_id: newestEvent.Event_id,
        Title: newestEvent.Title,
        Date: newestEvent.Date,
        Location: newestEvent.Location,
        time: '',
        description: '',
      });
    }
  }, [newestEvent]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch(`http://127.0.0.1:5000/updateEvent/${eventData.Event_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: eventData.Title,
          date: eventData.Date,
          location: eventData.Location,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        onUpdateEvent(data.event);
        message.success('Event updated successfully!');
      } else {
        message.error('Failed to update event: ' + data.error);
      }
    } catch (error) {
      console.error('Error updating event:', error);
      message.error('Failed to update event');
    }
  };

  if (events.length === 0) {
    return (
      <div className="edit-form">
        <h2>Edit Event</h2>
        <p>No events exist. Please add an event first.</p>
      </div>
    );
  }

  return (
    <div className="edit-form">
      <h2>Edit Latest Event: {newestEvent.Title}</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="Title">Title:</label>
        <input
          type="text"
          id="Title"
          name="Title"
          value={eventData.Title}
          onChange={handleChange}
          required
        />

        <label htmlFor="Date">Date:</label>
        <input
          type="date"
          id="Date"
          name="Date"
          value={eventData.Date}
          onChange={handleChange}
          required
        />

        <label htmlFor="time">Time:</label>
        <input
          type="time"
          id="time"
          name="time"
          value={eventData.time}
          onChange={handleChange}
        />

        <label htmlFor="Location">Location:</label>
        <input
          type="text"
          id="Location"
          name="Location"
          value={eventData.Location}
          onChange={handleChange}
          required
        />

        <label htmlFor="description">Description:</label>
        <textarea
          id="description"
          name="description"
          value={eventData.description}
          onChange={handleChange}
        />

        <button type="submit">Update Event</button>
      </form>
    </div>
  );
};

export default EditContent;
