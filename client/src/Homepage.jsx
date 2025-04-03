import React, { useRef, useState, useEffect } from "react";
import { Col, Row, Form, Input, Button, Anchor, message } from "antd";
import { DownCircleFilled, FrownFilled } from '@ant-design/icons';
import "./style/homePage.css";
import Popup from "./popup"; // Pop up page
import image from "./assets/image.png";
import playImg from "./assets/play.png";
import stopImg from "./assets/stop.png";
import demoImg from "./assets/demo.png";
import http from "./http";
import parse from "html-react-parser";

const isValidURL = (str) => {
  const pattern = /^(https?:\/\/)?([\w-]+(\.[\w-]+)+)(\/[\w-./?%&=]*)?$/i;
  return pattern.test(str);
};

function Homepage() {
  const [isPlay, setIsplay] = useState(false);
  const [locate,setLocate] = useState("");
  const [ddTime,setDdTime] = useState("");
  const [title,setTitle] = useState("");
  const [time, setTime] = useState("");
  const [description, setDescription] = useState("");
  const [currentPopup, setCurrentPopup] = useState(null); // Current popup: 'leave', 'timer', or null
  const [hasLeavePopupTriggered, setHasLeavePopupTriggered] = useState(false); // Move the mouse out of the pop-up window to trigger the marker
  const [hasTimerPopupTriggered, setHasTimerPopupTriggered] = useState(false); // Random pop-up trigger mark
  const { Link } = Anchor;
  const videoRef = useRef();
  const [form] = Form.useForm();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  const [video, setVideo] = useState(null);

  //set font size
  const [fontSize, setFontSize] = useState(() => localStorage.getItem("admin_fontSize") || "40px");
  const [locationFontSize, setLocationFontSize] = useState(() => localStorage.getItem("admin_locationFontSize") || "20px");
  const [descFontSize, setDescFontSize] = useState(() =>  localStorage.getItem("admin_descFontSize") || "20px");
  const [persFontSize, setPersFontSize] = useState(() =>  localStorage.getItem("admin_persFontSize") || "17px");

  // Add this state to track current event ID
  const [currentEventId, setCurrentEventId] = useState(null);

  useEffect(() => {
    if (fontSize) setFontSize(fontSize);
    if (locationFontSize) setLocationFontSize(locationFontSize);
    if (descFontSize) setDescFontSize(descFontSize);
    if (persFontSize) setPersFontSize(persFontSize);
  }, []); // This runs only once when the Home page is loaded

  const [introData, setIntroData] = useState({
    intro_text: "",
    image_url: ""
  });

  const playSubmit = (values) => {
    if (!currentEventId) {
      message.error('No active event found. Please try again later.');
      return;
    }

    http.post('/addAudienceInfo', {
      event_id: currentEventId, // Use the dynamic event ID
      name: values.name,
      email: values.email,
      phone: values.phoneNumber
    })
      .then(() => {
        message.success('Audience member added successfully!');
        form.resetFields(); // Reset the form after successful submission
      })
      .catch((error) => {
        message.error('Failed to add audience member.');
        console.error('API error:', error);
      });
  };

  const onFinish = async (e) => {
    console.log(e);
  };

  const aatext = () => {
    return <DownCircleFilled />;
  };

  const aaButton = () => {
    return <Button className="buttonSubmit">Enroll Now</Button>;
  };

  const locationInfo = http.get('/getEvents').then(response => {
      console.log(response.data);
      let dataList = response.data;
      if (dataList.length > 0) {
        let lastEvent = dataList[dataList.length - 1];
        setLocate(lastEvent.Location);
        setDdTime(lastEvent.Date);
        setTitle(lastEvent.Title);
        setTime(lastEvent.Time);
        setDescription(lastEvent.Description);
        setVideo(lastEvent.Video_url);
        setCurrentEventId(lastEvent.Event_id); // Store the current event ID
        return "ok";
      }
      }).catch(error => {
     console.error('Failed to fetch resources:', error);
  });

  const play = () => {
    videoRef.current.play();
    setIsplay(false);
  };

  const stop = () => {
    videoRef.current.pause();
    setIsplay(true);
  };

  const onVideoEnd = () => {
    setIsplay(true);
  };

  const validateList = ['com', 'org', 'net', 'int', 'edu', 'gov', 'mil', 'co'];

  const validateExtension = (name) => {
    const normalizedName = name.toLowerCase().trimStart();

    const regex = new RegExp(validateList.map(ext => `\\.${ext}$`).join('|'));

    return regex.test(normalizedName);
  };

  // Random pop-up logic
  useEffect(() => {
    if (!currentPopup && !hasTimerPopupTriggered) {
      const randomDelay = Math.floor(Math.random() * 5000) + 10000; // 10~15s pop up
      const timer = setTimeout(() => {
        setCurrentPopup("timer");
        setHasTimerPopupTriggered(true); // Mark random pop-up window triggered
      }, randomDelay);

      return () => clearTimeout(timer);
    }
  }, [currentPopup, hasTimerPopupTriggered]);

  // Mouse out triggers pop-up logic
  useEffect(() => {
    if (!currentPopup && !hasLeavePopupTriggered) {
      const handleMouseLeave = (e) => {
        if (e.clientY <= 0) {
          setCurrentPopup("leave");
          setHasLeavePopupTriggered(true); // Mark the mouse out of the pop-up window has been triggered
        }
      };

      document.addEventListener("mouseleave", handleMouseLeave);
      return () => document.removeEventListener("mouseleave", handleMouseLeave);
    }
  }, [currentPopup, hasLeavePopupTriggered]);

  // Reset state when closing popup
  const closePopup = () => setCurrentPopup(null);

  useEffect(() => {
    const fetchIntroduction = async () => {
      try {
        const response = await fetch('http://127.0.0.1:5000/getIntroduction');
        const data = await response.json();
        
        if (response.ok) {
          setIntroData(data);
        }
      } catch (error) {
        console.error('Error fetching introduction:', error);
      }
    };

    fetchIntroduction();
  }, []);

  return (
    <div className="bgColor">
      <div className="pageHome">
      <div className="headerBackground"></div> 
      <div className="headerTar">
          <a href="https://www.oforibeauty.ca/" target="_blank" rel="noopener noreferrer">
              <img src="/Image/logo.png" alt="Logo" className="logo" />
          </a>
      </div>
        <div className="title">
          <h2 style={{ fontSize: fontSize }}>{title}</h2>
          <div className="s12" style={{ marginTop: '10px', fontSize: locationFontSize }}>
              Location:{" "}
              {isValidURL(locate) ? (
                  <a 
                      href={locate.startsWith("http") ? locate : `https://${locate}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      style={{ color: "blue", textDecoration: "underline" }}
                  >
                      {locate}
                  </a>
              ) : (
                  locate
              )}
          </div>
          <div className="s12" style={{ fontSize:  locationFontSize }}>Date:  {ddTime}</div>
          <div className="s12" style={{ fontSize:  locationFontSize }}>Time: {time}</div>
        </div>

        <div className="videoBox">
          <video
            autoPlay
            muted
            controls
            onEnded={onVideoEnd}
            className="videoItem"
            ref={videoRef}
            src={video || ""}
          >
          </video>
        </div>
        <div className="w1200 borderBottom">
          <Link href="#componentsSubmit" title={aaButton()} />
        </div>

        <div className="w1200 " style={{ flexDirection: "column", alignItems: "center" }}>
          <div style={{ fontSize:  descFontSize }}>
          {parse(description.replace(/\n/g, "<br />"))}
          </div>
          <Link href="#componentsSubmit" title={aaButton()} />
        </div>
        
        <div
          className="introduction_p mt30"
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
            backgroundColor: "#f3dcdc", // light pink background like the second image
            flexWrap: "wrap" // ensures responsiveness on mobile
          }}
        >
          <img
            src={introData.image_url}
            alt="Introduction"
            className="image_home"
          />
          <div
            style={{
              maxWidth: "700px",
              fontSize: persFontSize,
              color: "#C88686FF",
              margin: "20px"
            }}
          >
            {parse(introData.intro_text.replace(/\n/g, "<br />"))}
          </div>
        </div>

        <div className="infoTitle">Sigu-Up for Join Event</div>
        <Form
          form = {form}
          className="borderBottom fromBox"
          name="basic"
          onFinish={playSubmit}
          size="large"
          labelCol={{
            span: 9,
          }}
          wrapperCol={{
            span: 8,
          }}
        >
          <Row>
            <Col span={24}>
              <Form.Item label="Name" name="name">
                <Input  value={name}  />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                label="Phone Number"
                name="phoneNumber"
                rules={[
                  () => ({
                    validator(_, value) {
                      if (!value || value.length === 0) {
                        return Promise.resolve(); // Don't validate empty input
                      }
                      if (value.length === 10) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('Please enter a 10-digit phone number'));
                    },
                  }),
                ]}
              >
                <Input value={phone} />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <Form.Item
                label="Email"
                name="email"
                rules={[
                  () => ({
                    validator(_, value) {
                      if (!value || value.length === 0) {
                        return Promise.resolve(); // Don't validate empty input
                      }
                      if (validateExtension(value)) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('Please enter a valid email address'));
                    },
                  }),
                ]}
              >
                <Input value={email} />
              </Form.Item>
            </Col>
          </Row>
          <div className="flexCenterBox ">
            <Button htmlType="submit" type="primary" className="buttonSubmit" id="componentsSubmit">
              Submit
            </Button>
          </div>
        </Form>
        
        <Anchor>
          <Link href="#componentsSubmit" className="fixedButton" title={aatext()} />
        </Anchor>
      </div>
        {/* pop up */}
        {currentPopup === "leave" && <Popup onClose={closePopup} />}
        {currentPopup === "timer" && <Popup onClose={closePopup} />}
      
    </div>

  );
}

export default Homepage;
