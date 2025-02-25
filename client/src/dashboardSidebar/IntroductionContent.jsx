import React, { useState, useEffect } from 'react';
import './IntroductionContent.css';
import { message } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';

const IntroductionContent = () => {
  const [introText, setIntroText] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const [imageUrl, setImageUrl] = useState('');

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
            setImageUrl(data.image_url);
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
    const { name, value } = e.target;
    if (name === 'introText') {
      setIntroText(value);
    } else if (name === 'imageUrl') {
      setImageUrl(value);
    }
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
          intro_text: introText,
          image_url: imageUrl
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
        <div className='form-group'>
        <label htmlFor="introText">Introduction Text:</label>
        <textarea
          id="introText"
          name="introText"
          value={introText}
          onChange={handleChange}
          required
        />

        <label htmlFor="imageUrl">Image URL:</label>
        <input
          type="text"
          id="imageUrl"
          name="imageUrl"
          value={imageUrl}
          onChange={handleChange}
          placeholder="Enter image URL..."
          required
        />

        <button type="submit">Update Introduction</button>
        <button 
          type="preview" 
          style={{ marginLeft: "30px" }} 
          onClick={handlePreview}
        >
          Preview Introduction
        </button>
        </div>
      </form>
    </div>
  );
};

export default IntroductionContent;
