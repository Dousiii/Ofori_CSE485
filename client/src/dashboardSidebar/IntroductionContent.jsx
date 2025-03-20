import React, { useState, useEffect } from 'react';
import './IntroductionContent.css';
import { message } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';

const IntroductionContent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [introData, setIntroData] = useState({
    intro_text: '',
    image_url: '',
  });

  const [fontSize, setFontSize]= useState(() => localStorage.getItem("titleCustomFontSize") || localStorage.getItem("fontSize") || "40px");
  const [locationFontSize, setLocationFontSize] = useState(() => localStorage.getItem("locationCustomFontSize") || localStorage.getItem("locationFontSize") || "20px");
  const [descFontSize, setDescFontSize] = useState(() => localStorage.getItem("descCustomFontSize") || localStorage.getItem("descFontSize") || "20px");
  const [persFontSize, setPersFontSize] = useState(() => localStorage.getItem("persCustomFontSize") || localStorage.getItem("persFontSize") || "17px");
  
  useEffect(() => {
    const fetchIntroduction = async () => {
      if (location.state?.introData) {
        const receivedEvent = location.state.introData;
        setIntroData({
          intro_text: receivedEvent.intro_text,
          image_url: receivedEvent.image_url,
        });
      } else {
        try {
          const response = await fetch('http://127.0.0.1:5000/getIntroduction');
          const data = await response.json();
          
          if (response.ok) {
            setIntroData({
              intro_text: data.intro_text,
              image_url: data.image_url,
            });
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
    setIntroData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handlePreview = () => {
    sessionStorage.setItem('authAction', 'intro');
    navigate('/preview', { state: { introData } });
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
          intro_text: introData.intro_text,
          image_url: introData.image_url,
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

        <div>
        <label htmlFor="intro_text">Introduction Text:</label>
        <textarea
          typr="text"
          id="intro_text"
          name="intro_text"
          value={introData.intro_text}
          onChange={handleChange}
          required
        />
        </div>

        <div className="image">
        <label htmlFor="image_url">Image URL:</label>
        <input
          type="text"
          id="image_url"
          name="image_url"
          value={introData.image_url}
          onChange={handleChange}
          placeholder="Enter image URL..."
          required
        />
        </div>

        <div>
        <button type="submit">Update Introduction</button>
        <button 
          type="preview" 
          style={{ marginLeft: "30px" }} 
          onClick={handlePreview}
        >
          Preview Introduction
        </button>
        </div>
        </div>
      </form>
    </div>
  );
};

export default IntroductionContent;
