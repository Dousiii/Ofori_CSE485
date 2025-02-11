import React, { useState, useEffect } from 'react';
import './PopupContent.css';
import { message } from 'antd';
import http from './http';


const PopupContent = () => {
    const [title, setTitle] = useState(() => localStorage.getItem("popupTitle") || "Are you sure you want to miss out on HEALTHY BEAUTY?");
    const [text, setText] = useState(() => localStorage.getItem("popupText") || 
      "Join us to learn how to embrace beauty in a healthy way and say goodbye to unhealthy beauty practices!\n\nGet personalized beauty guidance for free and confidently reveal your true self..."
    );

    const handleSave = () => {
        localStorage.setItem("popupTitle", title);
        localStorage.setItem("popupText", text);
        message.success("Changes Saved!");
      };

    return (
        <div className="popupContent_form">
            <div className="popupContent">
                <button className="close-popup-button">×</button>

                <div className="popup-left">
                    <img src="/Image/poppic.png" alt="Poppic" className="image-placeholder" />
                </div>

                <div className="popup-right">
                    {/* Title */}
                    <h2 
                        className="popup-title editable"
                        contentEditable={true}
                        suppressContentEditableWarning
                        onBlur={(e) => setTitle(e.target.innerText)}
                    >
                        {title}
                    </h2>

                    <div className="pop-separator"></div>

                    {/* Editable text area */}
                    <p 
                        className="popup-tagline editable"
                        contentEditable={true}
                        suppressContentEditableWarning
                        onBlur={(e) => setText(e.target.innerText)}
                    >
                        {text}
                    </p>


                    <form className="optin-form">
                    <div className="pop-input-container">
                        <input type="text" placeholder="Full Name"  />
                    </div>
                    <div className="pop-input-container">
                        <input type="tel" placeholder="Phone Number"  />
                    </div>
                    <div className="pop-input-container">
                        <input type="email" placeholder="Email"  />
                    </div>

                    <button type="submit" className="pop-submit-button">JOIN NOW →</button>
                    </form>
                </div>
            </div>
            {/* Save Buttons */}
            <div className="popupButton">
                <button className="save-btn">Save Changes</button>
            </div>
            
        </div>
    );      
}
export default PopupContent;
