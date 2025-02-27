import React, { useState, useEffect } from 'react';
import { message } from "antd";
import http from './http';
import Cookies from 'js-cookie';
import './popup.css';

function Popup({ onClose, isEditing = false, onExit }) {
  const [title, setTitle] = useState(() => localStorage.getItem("popupTitle") || "Are you sure you want to miss out on HEALTHY BEAUTY?");
  const [text, setText] = useState(() => localStorage.getItem("popupText") || 
    "Join us to learn how to embrace beauty in a healthy way and say goodbye to unhealthy beauty practices!\n\nGet personalized beauty guidance for free and confidently reveal your true self..."
  );

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [newestEvent, setNewestEvent] = useState(null);


  // Save the edited content
  const handleSave = () => {
    localStorage.setItem("popupTitle", title);
    localStorage.setItem("popupText", text);
    message.success("Changes Saved!");
  };

  useEffect(() => {
    const fetchNewestEvent = async () => {
      try {
        const response = await http.get('/getEvents');
        console.log(response.data, 'newEvents');
        const events = response.data;

        if (events.length > 0) {
          // Sort events by date in descending order and select the newest one
          const sortedEvents = events.sort((a, b) => new Date(b.Date) - new Date(a.Date));
          setNewestEvent(sortedEvents[0]);
        }
      } catch (error) {
        console.error('Failed to fetch events:', error);
      }
    };

    fetchNewestEvent();
  }, []);

  const playSubmit = (e) => {
    e.preventDefault();

    http.post('/addAudienceInfo', {
      event_id: newestEvent?.Event_id,
      name: name,
      email: email,
      phone: phone
    })
    .then(() => {
      message.success('Audience member added successfully!');
      setName('');
      setPhone('');
      setEmail('');
      onClose();
    })
    .catch((error) => {
      message.error('Failed to add audience member.');
      console.error('API error:', error);
    });
  };

   //use to prevent go to the page without login
  /*
  useEffect(() => {
    if (Cookies.get("skipVerification")) {
      navigate("/admin"); // Directly go to admin page
      return;
    }
    
    // Proceed to verification if no cookie
    navigate("/login");
  }, []); */

  return (
    <div className={`popup-overlay ${isEditing ? "editing-mode" : ""}`}>
      <div className="popup-container">
        <button onClick={onClose} className="close-popup-button">×</button>

        <div className="popup-left">
          <img src="/Image/poppic.png" alt="Poppic" className="image-placeholder" />
        </div>
        
        <div className="popup-right">
          {/* Title */}
          <h2 
            className={`popup-title ${isEditing ? "editable" : ""}`}
            contentEditable={isEditing}
            suppressContentEditableWarning
            onBlur={(e) => setTitle(e.target.innerText)}
          >
            {title}
          </h2>

          <div className="pop-separator"></div>

          {/* Editable text area */}
          <p 
            className={`popup-tagline ${isEditing ? "editable" : ""}`}
            contentEditable={isEditing}
            suppressContentEditableWarning
            onBlur={(e) => setText(e.target.innerHTML.replace(/\n/g, '<br>'))}
            dangerouslySetInnerHTML={{ __html: text }} // Parse the <br> line
          >
          </p>

          {/* Input information is allowed only when not in edit mode */}
          <form className="optin-form" onSubmit={playSubmit}>
            <div className="pop-input-container">
              <input 
                type="text" 
                placeholder="Full Name" 
                required 
                value={name} 
                onChange={(e) => setName(e.target.value)}
                disabled={isEditing}
              />
            </div>
            <div className="pop-input-container">
              <input 
                type="tel" 
                placeholder="Phone Number" 
                required 
                value={phone} 
                onChange={(e) => setPhone(e.target.value)}
                disabled={isEditing}
              />
            </div>
            <div className="pop-input-container">
              <input 
                type="email" 
                placeholder="Email" 
                required 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                disabled={isEditing}
              />
            </div>

            <button 
              type="submit" 
              className="pop-submit-button" 
              disabled={isEditing}
            >
              JOIN NOW →
            </button>
          </form>
        </div>
      </div>

      {/* Save and exit buttons */}
      {isEditing && (
        <div className="popup-actions">
          <button className="save-btn" onClick={handleSave}>Save Changes</button>
          <button className="exit-btn" onClick={() => onExit("dashboard")}>Exit</button>
        </div>
      )}
    </div>
  );
}

export default Popup;
