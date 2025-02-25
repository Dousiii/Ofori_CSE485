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

function Homepage() {
  const [isPlay, setIsplay] = useState(false);
  const [locate,setLocate] = useState("Demo");
  const [ddTime,setDdTime] = useState("Demo");
  const [title,setTitle] = useState("Demo");
  const [currentPopup, setCurrentPopup] = useState(null); // Current popup: 'leave', 'timer', or null
  const [hasLeavePopupTriggered, setHasLeavePopupTriggered] = useState(false); // Move the mouse out of the pop-up window to trigger the marker
  const [hasTimerPopupTriggered, setHasTimerPopupTriggered] = useState(false); // Random pop-up trigger mark
  const { Link } = Anchor;
  const videoRef = useRef();
  const [form] = Form.useForm();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  const [newestEvent, setNewestEvent] = useState(null);

  const [introData, setIntroData] = useState({
    intro_text: "",
    image_url: ""
  });

  const playSubmit = (values) => {
    http.post('/addAudienceInfo', {
      event_id: 17, // Setting Event_id to current
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

 // const [location, setLocation] = useRef("Demo");

  const onFinish = async (e) => {
    console.log(e);
  };

  // const timeInfo = http.get('/getEvents').then(response => {
  //   console.log(response.data);
  //  }).catch(error => {
  //   console.error('Failed to fetch resources:', error);
  //  });

  const aatext = () => {
    return <DownCircleFilled />;
  };

  const aaButton = () => {
    return <Button className="buttonSubmit">Enroll Now</Button>;
  };

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
    const fetchNewestEvent = async () => {
      try {
        const response = await http.get('/getEvents');
        const events = response.data;

        if (events.length > 0) {
          const sortedEvents = events.sort((a, b) => new Date(b.Date) - new Date(a.Date));
          setNewestEvent(sortedEvents[0]);
          setLocate(sortedEvents[0].Location);
          setDdTime(sortedEvents[0].Date);
          setTitle(sortedEvents[0].Title);
        }
      } catch (error) {
        console.error('Failed to fetch events:', error);
        // Don't set to "daa" here, keep the previous valid state
      }
    };

    fetchNewestEvent();
  }, []);

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
        <div className="headerTar ">
          <div> </div>
        </div>
        <div className="title">
          <h2>{title}</h2>
          <div className="s12" style={{ marginTop: '10px' }}>Location: {locate}</div>
          <div className="s12">Date:  {ddTime}</div>
          <div className="s12">Time: 12:00</div>
        </div>

        <div className="videoBox">
          <video
            autoPlay
            muted
            onEnded={onVideoEnd}
            className="videoItem"
            ref={videoRef}
            src={newestEvent?.Video_url || ""}
          >
          </video>
          {
            isPlay === true ? <img src={playImg} className="stopClass" onClick={play} /> : <img src={stopImg} className="stopClass" onClick={stop} />
          }
        </div>
        <div className="w1200 borderBottom">
          <Link href="#componentsSubmit" title={aaButton()} />
        </div>

        <div className="w1200 " style={{ flexDirection: "column", alignItems: "center" }}>
          <div>
            Join our FREE 21-day summit for expert insights that will help you
            walk with pride, knowing your hair is healthy, beautiful, and
            uniquely yours. Join our FREE 21-day summit for expert insights that
            will help you walk with pride, knowing your hair is healthy,
            beautiful, and uniquely yours.
          </div>
          <Link href="#componentsSubmit" title={aaButton()} />
        </div>
        <div className="bgBox  mt30" >
          <div className="w1200" style={{ flexDirection: "column", alignItems: "center" }}>
            <div>
              {introData.intro_text}
            </div>
              <img 
                src={introData.image_url} 
                style={{ width: '40%', height: 'auto' }}
              />
              <div className="rightText">
                <div>Join our FREE </div>
                <div> summit for expert insigh</div>
            </div>
          </div>
        </div>
        <div className="infoTitle">Sigu-Up for Join Event</div>
        <Form
          form = {form}
          className=" borderBottom "
          name="basic"
          onFinish={playSubmit}
          style={{ width: "1200px", margin: "50px auto", marginBottom: "0" }}
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
                      if (value && value.length === 10) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('from error'));
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
                      if (value && validateExtension(value)) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('from error'));
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
