import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { message } from "antd";
import './popup.css';
import { useNavigate } from 'react-router-dom';

function Popup({ onClose }) {
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:5000/getPopup")
      .then(response => {
        setTitle(response.data.title || "Are you sure you want to miss out on HEALTHY BEAUTY?");
        setText(response.data.description || "Join us to learn...");
      })
      .catch(error => {
        console.error("Failed to fetch popup content", error);
        message.error("Failed to load popup content");
      });
  }, []);

  //prevent direct access, redirect to home page
  useEffect(() => {
      navigate("/home");
  }, []); 

  const playSubmit = (e) => {
    e.preventDefault();

    axios.post("http://localhost:5000/addAudienceInfo", {
      event_id: 3,
      name: name,
      email: email,
      phone: phone
    })
    .then(() => {
      message.success("Audience member added successfully!");
      setName('');
      setPhone('');
      setEmail('');
      onClose();
    })
    .catch((error) => {
      message.error("Failed to add audience member.");
      console.error("API error:", error);
    });
  };

  return (
    <div className="popup-overlay">
      <div className="popup-container">
        <button onClick={onClose} className="close-popup-button">×</button>

        <div className="popup-left">
          <img src="/Image/poppic.png" alt="Poppic" className="image-placeholder" />
        </div>
        
        <div className="popup-right">
          {/* Title */}
          <h2 className="popup-title">{title}</h2>

          <div className="pop-separator"></div>

          {/* Description with line breaks */}
          <p 
              className="popup-tagline" 
              style={{ whiteSpace: "pre-line" }}
              dangerouslySetInnerHTML={{ __html: text }}
            />

          <form className="optin-form" onSubmit={playSubmit}>
            <div className="pop-input-container">
              <input 
                type="text" 
                placeholder="Full Name" 
                required 
                value={name} 
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="pop-input-container">
              <input 
                type="tel" 
                placeholder="Phone Number" 
                required 
                value={phone} 
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div className="pop-input-container">
              <input 
                type="email" 
                placeholder="Email" 
                required 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <button type="submit" className="pop-submit-button">
              JOIN NOW →
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Popup;