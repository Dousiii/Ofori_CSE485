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

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  const playSubmit = (e) => {
    console.log(e);
    // form.validateFields()
    //   .then(values => {
    //     console.log("Form Values:", values);
        http.post('/addUserInfo', {
          username: e.password.name,
          password: e.password.phoneNumber,  // Assuming you use phone number as password
          email: e.password.email
        }).then(response => {
          message.success('User added successfully!');
        }).catch(error => {
          message.error('Failed to add user.');
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

  const locationInfo = http.get('/getEvents').then(response => {
      console.log(response.data);
      let dataList = response.data;
      for (let i = 0; i < dataList.length;i++)
      {
        if(dataList[i].Event_id===3)
        {
          setLocate(dataList[i].Location);
          setDdTime(dataList[i].Date);
          setTitle(dataList[i].Title);
          return "ok";
        }
      }
     
      return "kok";
      }).catch(error => {
     console.error('Failed to fetch resources:', error);
     setLocate("daa");
     return "demo";
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
          >
            <source src="https://cfvod.kaltura.com/pd/p/1825021/sp/182502100/serveFlavor/entryId/1_9xisrkmq/v/1/ev/4/flavorId/1_iuroaxir/name/a.mp4" type="video/mp4"></source>
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
                          Daniella Adisson is the CEO and founder of Ofori Beauty, a company
                          providing highly informative hair and skin care classes for various
                          skin types. Her passion for skincare has led her to launch Ofori
                          Beauty in efforts to enhance the confidence and quality of life of
                          those struggling with their hair and skin.
            </div>
            <div className="flexBox mt30">
              <img src={demoImg} />
              <div className="rightText">
                <div>Join our FREE </div>
                <div> summit for expert insigh</div>
              </div>
            </div>
          </div>
        </div>
        <div className="infoTitle">Sigu-Up for Join Event</div>
        <Form
          className=" borderBottom "
          name="basic"
          onFinish={onFinish}
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
            <Button htmlType="submit" onSubmit={playSubmit} className="buttonSubmit" id="componentsSubmit">
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
