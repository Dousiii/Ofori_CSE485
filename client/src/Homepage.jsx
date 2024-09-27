import React from "react";
import { Col, Row, Form, Input } from "antd";
import { useNavigate } from "react-router-dom"; // Change to useNavigate
import "./style/homePage.css";
import image from "./assets/image.png";
function Homepage() {
  return (
    <div className="pageHome">
      <h1 className="title">event title</h1>
      <div className="flexBox mt50 borderBottom">
        <div className="leftText">
          <div>
            Join our FREE 21-day summit for expert insights that will help you
            walk with pride, knowing your hair is healthy, beautiful, and
            uniquely yours. Join our FREE 21-day summit for expert insights that
            will help you walk with pride, knowing your hair is healthy,
            beautiful, and uniquely yours.
          </div>
          <div className="buttonSubmit">enroll now</div>
        </div>
        <img className="rightImg" src={image} />
      </div>
      <div className="flexBox mt50 borderBottom">
        <img className="rightImg" src={image} />
        <div className="leftText">
          <div>
            Join our FREE 21-day summit for expert insights that will help you
            walk with pride, knowing your hair is healthy, beautiful, and
            uniquely yours. Join our FREE 21-day summit for expert insights that
            will help you walk with pride, knowing your hair is healthy,
            beautiful, and uniquely yours.
          </div>
        </div>
      </div>
      <div
        className="flexCenterBox mt50 borderBottom"
        style={{ flexDirection: "column", alignItems: "center" }}
      >
        <video
          className="videoBox"
          src="https://video.shipin520.com/videos/36/08/77/b_Z1mR3n9Nd2Eh1578360877.mp4"
          controls
        ></video>
        <div className="buttonSubmit">enroll now</div>
      </div>
      <Form
        className="mt50"
        name="basic"
        size="large"
        labelCol={{
          span:8,
        }}
        wrapperCol={{
          span: 12,
        }}
      >
        <Row>
          <Col span={12}>
            <Form.Item label="Username" name="username">
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Phone" name="username">
              <Input />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <Form.Item label="mailbox" name="username">
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="address" name="username">
              <Input />
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <div className="buttonSubmit" >enroll now</div>
    </div>
  );
}

export default Homepage;
