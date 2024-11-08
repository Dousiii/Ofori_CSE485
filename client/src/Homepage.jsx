import React, { useRef, useState } from "react";
import { Col, Row, Form, Input, Button, Anchor } from "antd";
import { DownCircleFilled } from '@ant-design/icons';
import "./style/homePage.css";
import image from "./assets/image.png";
import playImg from "./assets/play.png";
import stopImg from "./assets/stop.png";
function Homepage() {
  const [isPlay, setIsplay] = useState(false)
  const { Link } = Anchor;
  const videoRef = useRef()
  const onFinish = async (e) => {
    console.log(e)
  }
  const aatext = () => {
    return <DownCircleFilled />
  }
  const aaButton = () => {
    return <Button className="buttonSubmit" >enroll Button</Button>
  }
  const play = () => {
    videoRef.current.play()
    setIsplay(false)
  }
  const stop = () => {
    videoRef.current.pause()
    setIsplay(true)
  }
  const onVideoEnd = () => {
    setIsplay(true)
  }
  const validateList = ['com', 'org', 'net', 'int', 'edu', 'gov', 'mil', 'co']
  const validateExtension = (name) => {
    const normalizedName = name.toLowerCase().trimStart();

    const regex = new RegExp(validateList.map(ext => `\\.${ext}$`).join('|'));

    return regex.test(normalizedName);
  }
  return (
    <div className="bgColor">
      <div className="pageHome">
        <div className="headerTar ">
          <div> </div>
        </div>
        <div className="title">
          <h2>Ofori Event</h2>
          <div className="s12" style={{ marginTop: '10px' }}>Location: Online</div>
          <div className="s12">Date: Nov. 20th 2024</div>
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
            isPlay == true ? <img src={playImg} className="stopClass" onClick={play} /> : <img src={stopImg} className="stopClass" onClick={stop} />
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
            Join our FREE 21-day summit for expert insights that will help you
            walk with pride, knowing your hair is healthy, beautiful, and
            uniquely yours. Join our FREE 21-day summit for expert insights that
            will help you walk with pride, knowing your hair is healthy,
            beautiful, and uniquely yours.
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
              Join our FREE 21-day summit for expert insights that will help you
              walk with pride, knowing your hair is healthy, beautiful, and
              uniquely yours. Join our FREE 21-day summit for expert insights that
              will help you walk with pride, knowing your hair is healthy,
              beautiful, and uniquely yours.
            </div>
            <div className="flexBox mt30">
              <img src={image} className="avater" />
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
          style={{ width: "1200px", margin: "50px auto" ,marginBottom:"0" }}
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
                <Input />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label="Phone Number" name="phoneNumber" rules={[
                () => ({
                  validator(_, value) {
                    if (value && value.length == 10) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('from error'));
                  },
                }),
              ]}>
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <Form.Item label="Email" name="email" rules={[
                () => ({
                  validator(_, value) {
                    if (value && validateExtension(value)) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('from error'));
                  },
                }),
              ]}>
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <div className="flexCenterBox ">
            <Button htmlType="submit" className="buttonSubmit" id="componentsSubmit" >
              Submit
            </Button>
          </div>
        </Form>
        <div className="mt50 footerTitle " style={{fontSize:'16px'}}>Resources</div>
        <div className="footerTitle" style={{fontSize:'24px',fontWeight:600,marginTop:"10px"}} >Things you can do next</div>
        <div className="resourtes w1200">
          <div className="resourtesContent"></div>
          <div className="resourtesContent"></div>
          <div className="resourtesContent"></div>
        </div>
        <Anchor>
          <Link href="#componentsSubmit" className="fixedButton" title={aatext()} />
        </Anchor>
      </div>
    </div >
  );
}

export default Homepage;
