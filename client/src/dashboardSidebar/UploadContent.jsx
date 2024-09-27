import { useState, useEffect } from "react"
import React from 'react'
import "./UploadContent.css"

const UploadContent = () => {

  const [formData, setFormData] = useState({
    title: "",
    date: "",
    time: "",
    location: "",
    description: "",
    video: null,
  });

  const [minDate, setMinDate] = useState(""); // For preventing past date selection

  // Get today's date for the 'min' attribute on date input
  useEffect(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    setMinDate(`${year}-${month}-${day}`);
  }, []);

  // Handle input changes for form fields
  const handleChange = (event) => {
    const { name, value, type, files } = event.target;

    // Handle file input for video upload
    if (type === "file") {
      setFormData((prevFormData) => ({ ...prevFormData, video: files[0] }));
    } else {
      setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
    }
  };

  // Handle form submission
  const handleSubmit = (event) => {
    event.preventDefault();
    alert(
      `Title: ${formData.title}, Date: ${formData.date}, Time: ${formData.time}, Location: ${formData.location}, Description: ${formData.description}`
    );

    // Here you'd send the form data to your backend, including the video file

    // Reset form data after submission
    setFormData({
      title: "",
      date: "",
      time: "",
      location: "",
      description: "",
      video: null,
    });
  };

  return (
    <div>
    <form onSubmit={handleSubmit} className="form">

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


        <label htmlFor="video">Upload Video:</label>
        <input
          type="file"
          id="video"
          name="video"
          accept="video/*"
          onChange={handleChange}
          required
        />




      <button type="submit">Publish Event</button>

    </form>
    </div>
  );
}

export default UploadContent;