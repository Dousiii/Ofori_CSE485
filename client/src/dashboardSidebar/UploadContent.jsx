import { useState, useEffect } from "react"
import { useNavigate,useLocation } from 'react-router-dom';
import React from 'react'
import "./UploadContent.css"
import { message } from 'antd'

const UploadContent = ({ addEvent }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    time: '',
    location: '',
    description: '',
    video_url: '',
  });

  const [minDate, setMinDate] = useState(""); // For preventing past date selection
  const [showMessage, setShowMessage] = useState(false);
  
  const [fontSize, setFontSize]= useState(() => localStorage.getItem("titleCustomFontSize") || localStorage.getItem("fontSize") || "40px");
  const [locationFontSize, setLocationFontSize] = useState(() => localStorage.getItem("locationCustomFontSize") || localStorage.getItem("locationFontSize") || "20px");
  const [descFontSize, setDescFontSize] = useState(() => localStorage.getItem("descCustomFontSize") || localStorage.getItem("descFontSize") || "20px");
  const [persFontSize, setPersFontSize] = useState(() => localStorage.getItem("persCustomFontSize") || localStorage.getItem("persFontSize") || "17px");

  // Get today's date for the 'min' attribute on date input
  useEffect(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    setMinDate(`${year}-${month}-${day}`);
  }, []);

  useEffect(() => {
    if (location.state?.formData) {
      const receivedEvent = location.state.formData;
      setFormData({
        title: receivedEvent.title,
        date: receivedEvent.date,
        location: receivedEvent.location,
        time: receivedEvent.time || '',
        description: receivedEvent.description || '',
        video_url: receivedEvent.video_url || '',
      });
    }
  }, [location.state]);

  // Handle input changes for form fields
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    localStorage.setItem("admin_fontSize", fontSize);
    localStorage.setItem("admin_locationFontSize", locationFontSize);
    localStorage.setItem("admin_descFontSize", descFontSize);
    localStorage.setItem("admin_persFontSize", persFontSize);
    
    try {
      const response = await fetch('http://127.0.0.1:5000/createEvent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title,
          date: formData.date,
          location: formData.location,
          time: formData.time,
          description: formData.description,
          video_url: formData.video_url
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Add event to local state
        addEvent(data.event);
        message.success('Event created successfully!');
        
        // Reset form
        setFormData({
          title: "",
          date: "",
          time: "",
          location: "",
          description: "",
          video_url: "",
        });
      } else {
        message.error('Failed to create event: ' + data.error);
      }
    } catch (error) {
      console.error('Error creating event:', error);
      message.error('Failed to create event');
    }
  };

  const handlePreview = () => {
    sessionStorage.setItem('authAction', 'add');
    sessionStorage.setItem("fromAdmin", "true");
    navigate('/preview', { state: { formData } });
  };

  return (
    <div className="upload-form">
      <h2>Add New Event</h2>
      <form onSubmit={handleSubmit} >

        <label htmlFor="title">Title:</label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
        />


        <label htmlFor="date">Date:</label>
        <input
          type="date"
          id="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          min={minDate} // Prevent selecting dates before today
          required
        />



        <label htmlFor="time">Time:</label>
        <input
          type="time"
          id="time"
          name="time"
          value={formData.time}
          onChange={handleChange}
          required
        />



        <label htmlFor="location">Location:</label>
        <input
          type="text"
          id="location"
          name="location"
          value={formData.location}
          onChange={handleChange}
          required
        />



        <label htmlFor="description">Description:</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
        />


        <label htmlFor="Video_url">YouTube Video URL: </label>
        <label>
          Please enter your YouTube link (set video as Unlisted or Public):{" "}<div></div>
          <code>https://www.youtube.com/embed/&#123;YOUR_VIDEO_ID&#125;?autoplay=1&mute=1</code>
        </label>
        <label>
          Example:{" "}<div></div>
          <code>https://www.youtube.com/embed/Fp5ghKduTK8?autoplay=1&mute=1</code>
        </label>
        <input
          type="text"
          id="video_url"
          name="video_url"
          value={formData.video_url}
          onChange={handleChange}
          placeholder="Enter YouTube Video URL..."
          required
        />

      <button type="submit">Publish Event</button>
      <button 
          type="preview" 
          style={{ marginLeft: "30px" }} 
          onClick={handlePreview}
        >
          Preview Event
        </button>
    </form>
  </div>
  );
}

export default UploadContent;
