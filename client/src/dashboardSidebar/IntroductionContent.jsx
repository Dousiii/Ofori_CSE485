import React, { useState, useEffect } from 'react';
import './IntroductionContent.css';
import { message } from 'antd';

const IntroductionContent = () => {
  const [introText, setIntroText] = useState('');

  useEffect(() => {
    const fetchIntroduction = async () => {
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
    };

    fetchIntroduction();
  }, []);

  const handleChange = (e) => {
    setIntroText(e.target.value);
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
      </form>
    </div>
  );
};

export default IntroductionContent;
