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
  const [currentEventId, setCurrentEventId] = useState(null);
  const [formErrors, setFormErrors] = useState({
    name: '',
    phone: '',
    email: ''
  });

  // Validation function for email
  const validateExtension = (email) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

  // Function to validate phone number
  const validatePhone = (phone) => {
    return phone.length === 10;
  };

  useEffect(() => {
    // Fetch popup content
    axios.get("http://localhost:5000/getPopup")
      .then(response => {
        setTitle(response.data.title || "Are you sure you want to miss out on HEALTHY BEAUTY?");
        setText(response.data.description || "Join us to learn...");
      })
      .catch(error => {
        console.error("Failed to fetch popup content", error);
        message.error("Failed to load popup content");
      });
      
    // Fetch current event ID
    axios.get("http://localhost:5000/getEvents")
      .then(response => {
        if (response.data && response.data.length > 0) {
          // Get the most recent event (highest ID)
          const latestEvent = response.data.sort((a, b) => b.Event_id - a.Event_id)[0];
          setCurrentEventId(latestEvent.Event_id);
        }
      })
      .catch(error => {
        console.error("Failed to fetch events", error);
      });
  }, []);


  //prevent direct access, redirect to home page
  useEffect(() => {
      navigate("/home");
  }, []); 

  const validateForm = () => {
    let valid = true;
    const errors = { name: '', phone: '', email: '' };
    
    if (!name) {
      errors.name = 'Name is required';
      valid = false;
    }
    
    if (!phone) {
      errors.phone = 'Phone number is required';
      valid = false;
    } else if (!validatePhone(phone)) {
      errors.phone = 'Please enter a 10-digit phone number';
      valid = false;
    }
    
    if (!email) {
      errors.email = 'Email is required';
      valid = false;
    } else if (!validateExtension(email)) {
      errors.email = 'Please enter a valid email address';
      valid = false;
    }
    
    setFormErrors(errors);
    return valid;
  };

  const playSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    if (!currentEventId) {
      message.error("No active event found");
      return;
    }

    axios.post("http://localhost:5000/addAudienceInfo", {
      event_id: currentEventId,
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
              {formErrors.name && <div className="error-message">{formErrors.name}</div>}
            </div>
            <div className="pop-input-container">
              <input 
                type="tel" 
                placeholder="Phone Number" 
                required 
                value={phone} 
                onChange={(e) => setPhone(e.target.value)}
              />
              {formErrors.phone && <div className="error-message">{formErrors.phone}</div>}
            </div>
            <div className="pop-input-container">
              <input 
                type="email" 
                placeholder="Email" 
                required 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
              />
              {formErrors.email && <div className="error-message">{formErrors.email}</div>}
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