import React, { useState, useEffect } from 'react';
import './UploadContent.css'; // Use your existing styles
import { message, Modal} from 'antd';

const EditContent = ({ events, onUpdateEvent, onDeleteEvent }) => {
  const [selectedEventId, setSelectedEventId] = useState(events[0]?.id || '');
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [eventData, setEventData] = useState({
    id: '',
    title: '',
    date: '',
    time: '',
    place: '',
    description: '',
  });

  // Update event data whenever the selected event changes
  useEffect(() => {
    const selectedEvent = events.find(event => event.id === Number(selectedEventId));
    if (selectedEvent) {
      setEventData(selectedEvent);
      console.log('Selected Event:', selectedEvent); // Log the selected event details
    }
  }, [selectedEventId, events]);

  useEffect(() => {
    console.log('Updated event data:', eventData); // Log updated event data whenever it changes
  }, [eventData]);

  const handleEventChange = (e) => {
    const newSelectedEventId = e.target.value;
    setSelectedEventId(newSelectedEventId);
    console.log('Event changed to:', newSelectedEventId); // Log the newly selected event ID
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdateEvent(eventData);
    message.success('Event updated successfully!');
    setSelectedEventId('');
    setEventData({
      id: '',
      title: '',
      date: '',
      time: '',
      place: '',
      description: '',
    });
  };

  const showDeleteConfirm = () => {
    setIsDeleteModalVisible(true);
  };
  
  const handleDeleteConfirm = () => {
    onDeleteEvent(selectedEventId);
    message.success('Event deleted successfully!');
    setIsDeleteModalVisible(false);
    setSelectedEventId('');
    setEventData({
      id: '',
      title: '',
      date: '',
      time: '',
      place: '',
      description: '',
    });
  };
  
  const handleDeleteCancel = () => {
    setIsDeleteModalVisible(false);
  };
  
  const handleDelete = () => {
    showDeleteConfirm();
  };

  if (events.length === 0) {
    return (
      <div className="form">
        <h2>Edit Event</h2>
        <p>No events exist. Please add an event first.</p>
      </div>
    );
  }

  return (
    <div className="form">
      <h2>Edit Event</h2>
      <label htmlFor="eventSelect">Select Event:</label>
      <select id="eventSelect" value={selectedEventId} onChange={handleEventChange}>
        {events.map(event => (
          <option key={event.id} value={event.id}>
            {event.title}
          </option>
        ))}
      </select>

      <form onSubmit={handleSubmit}>
        <label htmlFor="title">Title:</label>
        <input
          type="text"
          id="title"
          name="title"
          value={eventData.title} // Prefill with current title
          onChange={handleChange}
          required
        />

        <label htmlFor="date">Date:</label>
        <input
          type="date"
          id="date"
          name="date"
          value={eventData.date} // Prefill with current date
          onChange={handleChange}
          required
        />

        <label htmlFor="time">Time:</label>
        <input
          type="time"
          id="time"
          name="time"
          value={eventData.time} // Prefill with current time
          onChange={handleChange}
          required
        />

        <label htmlFor="place">Place:</label>
        <input
          type="text"
          id="place"
          name="place"
          value={eventData.place} // Prefill with current place
          onChange={handleChange}
          required
        />

        <label htmlFor="description">Description:</label>
        <textarea
          id="description"
          name="description"
          value={eventData.description} // Prefill with current description
          onChange={handleChange}
        ></textarea>

        <button type="submit">Update Event</button>
        <button type="button" onClick={handleDelete} style={{ marginLeft: '10px', backgroundColor: 'red', color: 'white' }}>
          Delete Event
        </button>
      </form>
      <Modal
        title="Confirm Delete"
        visible={isDeleteModalVisible}
        onOk={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      >
        <p>Are you sure you want to delete this event? This action cannot be undone.</p>
      </Modal>
    </div>
  );
};

export default EditContent;
