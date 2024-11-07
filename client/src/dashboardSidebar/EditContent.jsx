import React, { useState, useEffect } from 'react';
import './EditContent.css'; // Use your existing styles
import { message, Modal} from 'antd';

const EditContent = ({ events, onUpdateEvent }) => {
  const newestEvent = events[events.length - 1]; // Get the newest event
  const [eventData, setEventData] = useState({
    id: '',
    title: '',
    date: '',
    time: '',
    place: '',
    description: '',
  });

  useEffect(() => {
    if (newestEvent) {
      setEventData(newestEvent);
    }
  }, [newestEvent]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdateEvent(eventData);
    message.success('Event updated successfully!');
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
      <h2>Edit Latest Event: {newestEvent.title}</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="title">Title:</label>
        <input
          type="text"
          id="title"
          name="title"
          value={eventData.title}
          onChange={handleChange}
          required
        />

        <label htmlFor="date">Date:</label>
        <input
          type="date"
          id="date"
          name="date"
          value={eventData.date}
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
          required
        />

        <label htmlFor="place">Location:</label>
        <input
          type="text"
          id="place"
          name="place"
          value={eventData.place}
          onChange={handleChange}
          required
        />

        <label htmlFor="description">Description:</label>
        <textarea
          id="description"
          name="description"
          value={eventData.description}
          onChange={handleChange}
        ></textarea>

        <button type="submit">Update Event</button>
      </form>
    </div>
  );
};

export default EditContent;
