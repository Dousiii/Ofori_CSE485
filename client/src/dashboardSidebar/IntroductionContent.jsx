import React, { useState, useEffect } from 'react';
import './IntroductionContent.css';
import { message } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';

const IntroductionContent = () => {
  const [introText, setIntroText] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const [fontSize, setFontSize]= useState(() => localStorage.getItem("titleCustomFontSize") || localStorage.getItem("fontSize") || "40px");
  const [locationFontSize, setLocationFontSize] = useState(() => localStorage.getItem("locationCustomFontSize") || localStorage.getItem("locationFontSize") || "20px");
  const [descFontSize, setDescFontSize] = useState(() => localStorage.getItem("descCustomFontSize") || localStorage.getItem("descFontSize") || "20px");
  const [persFontSize, setPersFontSize] = useState(() => localStorage.getItem("persCustomFontSize") || localStorage.getItem("persFontSize") || "17px");
  
  useEffect(() => {
    const fetchIntroduction = async () => {
      if (location.state?.introText) {
        setIntroText(location.state.introText);
      } else {
        try {
          const response = await fetch('http://127.0.0.1:5000/getIntroduction');
          const data = await response.json();
          
          if (response.ok) {
            setIntroText(data.intro_text);
          } else {
            message.error('Failed to load introduction');
          }
        } catch (error) {
          console.error('Error fetching introduction:', error);
          message.error('Failed to load introduction');
        }
      }
    };

    fetchIntroduction();
  }, [location.state]);

  const handleChange = (e) => {
    setIntroText(e.target.value);
  };

  const handlePreview = () => {
    sessionStorage.setItem('authAction', 'intro');
    navigate('/preview', { state: { introText } });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    localStorage.setItem("admin_fontSize", fontSize);
    localStorage.setItem("admin_locationFontSize", locationFontSize);
    localStorage.setItem("admin_descFontSize", descFontSize);
    localStorage.setItem("admin_persFontSize", persFontSize);
    
    try {
      const response = await fetch('http://127.0.0.1:5000/updateIntroduction', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          intro_text: introText
        }),
      });

      const data = await response.json();

      if (response.ok) {
        message.success('Introduction updated successfully!');
      } else {
        message.error('Failed to update introduction: ' + data.error);
      }
    } catch (error) {
      console.error('Error updating introduction:', error);
      message.error('Failed to update introduction');
    }
  };

  return (
    <div className="intro-form">
      <h2>Edit Introduction</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            name="description"
            value={introText}
            onChange={handleChange}
            placeholder="Enter introduction text..."
            required
          />
        </div>

        <button type="submit">Save Changes</button>
        <button 
          type="preview" 
          style={{ marginLeft: "30px" }} 
          onClick={handlePreview}
        >
          Preview Introduction
        </button>
      </form>
    </div>
  );
};

export default IntroductionContent;
