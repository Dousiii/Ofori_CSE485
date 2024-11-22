import React, { useState } from 'react';
import http from './http';
import './popup.css';  

function Popup({ onClose }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  const playSubmit = (e) => {
    e.preventDefault(); // Prevent the form from submitting traditionally
    console.log("Name:", name);
    console.log("Phone:", phone);
    console.log("Email:", email);
    http.post('/addUserInfo',{
      username:name,
      password:phone,
      email: email
    });
  };

  return (
    <div className="popup-overlay">
      <div className="popup-container">
        <div className="popup-left">
          <img src="/Image/poppic.png" alt="Poppic" className="image-placeholder" />
        </div>
        <div className="popup-right">
          <h2 className="popup-title">
            <span className="pop-highlight pop-big-A">A</span>re you sure you want to miss out on
            <span className="pop-highlight"> HEALTHY BEAUTY</span>?
          </h2>
          <div className="pop-separator"></div>
          <p className="popup-tagline">
            Join us to learn how to embrace beauty in a healthy way and say goodbye to unhealthy beauty practices!<br /> 
            <br /> 
            Get personalized beauty guidance for free and confidently reveal your true self...
          </p>
          <form className="optin-form" onSubmit={playSubmit}> {/* form now has onSubmit */}
            <div className="pop-input-container">
              <input 
                type="text" 
                id="name" 
                name="name" 
                placeholder="Full Name" 
                required 
                value={name} 
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="pop-input-container">
              <input 
                type="tel" 
                id="phone" 
                name="phone" 
                placeholder="Phone Number" 
                required 
                value={phone} 
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div className="pop-input-container">
              <input 
                type="email" 
                id="email" 
                name="email" 
                placeholder="Email" 
                required 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <button type="submit" className="pop-submit-button">JOIN NOW →</button>
          </form>
          <button onClick={onClose} className="close-popup-button">×</button>
        </div>
      </div>
    </div>
  );
}

export default Popup;
