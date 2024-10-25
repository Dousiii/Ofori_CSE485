import React from "react";
import { Col, Row, Form, Input, Button, Anchor } from "antd";
import { DownCircleFilled } from '@ant-design/icons';
import "./style/homePage.css";
import image from "./assets/image.png";
function Homepage() {
  const { Link } = Anchor;
  const onFinish = async (e) => {
    console.log(e)
  }
  const aatext = () => {
    return <DownCircleFilled />
  }
  const aaButton = () => {
    return   <Button  className="buttonSubmit" >enroll now</Button>
  }
  return (
    <div className="bgColor">
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
          <Link href="#componentsSubmit" title={aaButton()}/>
        
        </div>
        <img className="rightImg" src={image} />
      </div>

      <div className="flexBox mt50 borderBottom"  >
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
         <Link href="#componentsSubmit" title={aaButton()}/>
      </div>
      <div className="infoTitle">Ofori Event Enrol</div>
      <Form
        className="mt50"
        name="basic"
        onFinish={onFinish}
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
            <Form.Item label="name" name="name">
              <Input />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item label="phone number" name="phoneNumber" rules={[
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
            <Form.Item label="email" name="email" rules={[
              () => ({
                validator(_, value) {
                  if (value && value.includes('@hotmail.com')) {
                    return Promise.resolve();
                  }
                  if (value && value.includes('@gmail.com')) {
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
      <Anchor>
        <Link href="#componentsSubmit" className="fixedButton" title={aatext()}/>
      </Anchor>
    </div>
    </div>
  );
}

export default Homepage;
