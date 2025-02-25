import React, { useState, useEffect } from 'react';
import './IntroductionContent.css';
import { message } from 'antd';

const IntroductionContent = () => {
  const [introText, setIntroText] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    const fetchIntroduction = async () => {
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
    };

    fetchIntroduction();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'introText') {
      setIntroText(value);
    } else if (name === 'imageUrl') {
      setImageUrl(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
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
        </div>
      </form>
    </div>
  );
};

export default IntroductionContent;
