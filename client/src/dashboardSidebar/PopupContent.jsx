import React, { useState, useEffect } from 'react';
import './PopupContent.css';
import { message } from 'antd';
import axios from 'axios';

const PopupContent = () => {
    const [title, setTitle] = useState("");
    const [text, setText] = useState("");

    useEffect(() => {
        axios.get("http://localhost:5000/getPopup")
            .then(response => {
                setTitle(response.data.title || "Are you sure you want to miss out on HEALTHY BEAUTY?");
                setText(response.data.description || "Join us to learn...");
            })
            .catch(error => {
                console.error("Failed to fetch popup content", error);
            });
    }, []);

    const handleSave = () => {
        axios.put("http://localhost:5000/updatePopup", {
            title: title,
            description: text
        })
        .then(() => {
            message.success("Changes Saved!");
        })
        .catch(error => {
            console.error("Failed to update popup", error);
            message.error("Failed to save changes");
        });
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const text = (e.clipboardData || window.clipboardData).getData('text/plain'); 
        document.execCommand('insertText', false, text); 
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
                        onPaste={handlePaste} 
                    >
                        {title}
                    </h2>

                    <div className="pop-separator"></div>

                    <p 
                        className="popup-tagline editable"
                        contentEditable={true}
                        suppressContentEditableWarning
                        onBlur={(e) => setText(e.target.innerHTML.replace(/\n/g, "<br>"))}
                        style={{ whiteSpace: "pre-line" }} 
                        dangerouslySetInnerHTML={{ __html: text }}
                        onPaste={handlePaste} 
                    >
                    </p>

                    <form className="optin-form">
                        <div className="pop-input-container">
                            <input type="text" placeholder="Full Name" autoComplete="off" readOnly />
                        </div>
                        <div className="pop-input-container">
                        <input type="tel" placeholder="Phone Number" autoComplete="off" readOnly />
                        </div>
                        <div className="pop-input-container">
                            <input type="email" placeholder="Email" autoComplete="off" readOnly />
                        </div>

                        <button type="button" className="pop-submit-button" disabled>
                            JOIN NOW →
                        </button>
                    </form>
                </div>
            </div>
            {/* Save Button */}
            <div className="popupButton">
                <button className="save-btn" onClick={handleSave}>Save Changes</button>
            </div>
        </div>
    );
}

export default PopupContent;