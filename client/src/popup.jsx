import React, { useState } from 'react';
import './popup.css';  

function Popup() {  
  const [isOpen, setIsOpen] = useState(false);  

  const openPopup = () => {
    setIsOpen(true);
  };

  const closePopup = () => {
    setIsOpen(false);
  };

  return (
    <div>
      <button onClick={openPopup} className="open-popup-button">Open Opt-in Popup</button>
      
      {isOpen && (
        <div className="popup-overlay"> {/* background */}
          <div className="popup-container"> {/* popup background */}
            <div className="popup-left"> {/* popup left - shows the picture */}
              <img src="/Image/poppic.png" alt="Poppic" className="image-placeholder" />
            </div>
            <div className="popup-right"> {/* popup left - shows the info */}
              <h2 className="popup-title"><span className="pop-highlight">A</span>re you sure you want to miss out on <span className="pop-highlight">HEALTHY BEAUTY</span>?</h2>
              <div className="pop-separator"></div> {/* separator line */}
              <p className="popup-tagline"> {/* propagation language */}
                Join us to learn how to embrace beauty in a healthy way and say goodbye to unhealthy beauty practices!<br /> 
                <br /> 
                Get personalized beauty guidance for free and confidently reveal your true self...
              </p>
              <form className="optin-form"> {/* user input */}
                <div className="pop-input-container">
                  <input type="text" id="name" name="name" placeholder="Full Name" required />
                </div>
                <div className="pop-input-container">
                  <input type="email" id="email" name="email" placeholder="Email" required />
                </div>
                <button type="submit" className="pop-submit-button">JOIN NOW →</button> {/* button */}
              </form>
              <button onClick={closePopup} className="close-popup-button">×</button> {/* close popup button */}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Popup;