import React, {useState} from "react";
import { Col, Row, Form, Input, Button, Anchor, Select, Space } from "antd";
import { DownCircleFilled } from '@ant-design/icons';
import "./preview.css";
import image from "./assets/image.png";

function Preview({ eventTitle, eventDate, eventLocation, description }) {
    const { Link } = Anchor;
    const { Option } = Select;

    const [fontSize, setFontSize] = useState("40px");   //set font size
    const [showDropdown, setShowDropdown] = useState(null); //set dropdown
    const [customFontSize, setCustomFontSize] = useState("");   //set font size custom
    const [scaling, setScaling] = useState(false);  //set scaling

    //use to change font size select from dropdown box
    const handleFontSizeChange = (value) => {
        setFontSize(value);
        setCustomFontSize(""); // Clear the custom font size input
        setScaling(false);
        setShowDropdown(null);
      };

    //use to get the font size from the text box
    const handleCustomFontSizeChange = (e) => {
        setCustomFontSize(e.target.value);// Update the custom font size
      };

    //use to apply the font size that user custom
    const applyCustomFontSize = () => {
        let value = customFontSize.trim();
        // Check if the value ends with "px" or if it's just a number
        if (value && !isNaN(parseFloat(value))) {
          if (!value.endsWith("px")) {
            value += "px"; // Add "px" if it's not there already
          }
          setFontSize(value); // Apply the custom font size
          setScaling(false); 
          setShowDropdown(null);
        } else {
          alert("Please enter a valid font size (e.g., 18px or 18).");
        }
      };

    //use to toggle the drop down box
    const toggleDropdown = (box) => {
        // Toggle dropdown for the clicked box
        if (showDropdown === box) {
            setScaling(false); // Reset scaling effect when closing the dropdown
            setShowDropdown(null); // Close dropdown if clicked again
          } else {
            setScaling(true); // Apply scaling effect when dropdown is shown
            setShowDropdown(box); // Open dropdown for the clicked box
          }
      };

    //use to handle when the dropdown is click
    const handleDropdownClick = (e) => {
        e.stopPropagation(); // Prevent the click event from propagating to the parent
    };

    //use to handle when the title box click
    const handleTitleBoxClick = (box) => {
        // show the drop down
        toggleDropdown(box);
    };


    const handleDateBoxClick = () => {
        // Add your navigation or action here
        console.log("Event box clicked!");
    };

    const handleLocationBoxClick = () => {
        // Add your navigation or action here
        console.log("Event box clicked!");
    };

        
    const onFinish = async (e) => {
        console.log(e)
    }
    const aatext = () => {
        return <DownCircleFilled />
    }
    const enrollButton = () => {
        return   <Button  className="buttonSubmit" >Enroll Now</Button>
    }


    return (
        <div className="previewHome">
        <h2 style={{ textAlign: "center", marginBottom: "50px", fontSize: "40px", marginTop: "30px" }}>This is a preview page</h2>
        <div className="bgBorder">
            <div className="eventinfoBox">
                <div className="eventTitleBox" 
                     onClick={() => handleTitleBoxClick("title")} 
                     style={{
                        fontSize: fontSize,
                        transform: scaling ? "scale(1.05)" : "scale(1)", // Apply scaling when dropdown is open
                        transition: "transform 0.2s", // Smooth transition for scaling
                      }}
                    >
                    {eventTitle} 
                    
                    {showDropdown === "title" && (
                        <div className="fontSizeDropdown" onClick={handleDropdownClick} style={{ display: "inline-block", marginLeft: "10px" }}>
                            <Select
                                defaultValue={fontSize}
                                style={{ width: 120 }}
                                onChange={handleFontSizeChange}
                                dropdownRender={(menu) => (
                                <>
                                    {menu}
                                    <Space style={{ padding: "5px", display: "flex", flexDirection: "column" }}>
                                    <Input
                                        value={customFontSize}
                                        onChange={handleCustomFontSizeChange}
                                        style={{ width: 80 }}
                                        placeholder="e.g., 18px"
                                    />
                                    <Button onClick={applyCustomFontSize} type="primary" style={{ marginTop: "5px" }}>
                                        Apply
                                    </Button>
                                    </Space>
                                </>
                                )}
                            >
                            <Option value="30px">30px</Option>
                            <Option value="35px">35px</Option>
                            <Option value="40px">40px</Option>
                            <Option value="45px">45px</Option>
                            <Option value="50px">50px</Option>
                        </Select> 
                        </div>
                    )}
                </div>                    
                
                <div className="eventDateBox" onClick={handleDateBoxClick}>The Event Date is: {eventDate}</div>
                <div className="eventLocationBox" onClick={handleLocationBoxClick}>The Event Location is: {eventLocation}</div>

                

            </div>

            <div
            className="flexCenterBox mt50 borderBottom"
            style={{ flexDirection: "column", alignItems: "center" }}>
            <video
                className="videoBox"
                src="https://cfvod.kaltura.com/pd/p/1825021/sp/182502100/serveFlavor/entryId/1_9xisrkmq/v/1/ev/4/flavorId/1_iuroaxir/name/a.mp4"
                controls>
            </video>
            <Link href="#componentsSubmit" title={enrollButton()}/>
            </div>
        
            
            <div className="flexBox mt50 borderBottom" style={{flexDirection: "column", alignItems: "center"}}>
                <div className="descriptionBox" dangerouslySetInnerHTML={{ __html: description }} />
                <div className="flexCenterBox">
                    <Link href="#componentsSubmit" title={enrollButton()} />
                </div>
            </div>

            <div className="bgBox  mt30" >
                <div className="w1200" style={{ flexDirection: "column", alignItems: "center" }}>
                    <div>
                        Here you can put some infomation of yourself. <br/>
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
                <Col span={23}>
                    <Form.Item label="Name" name="name">
                    <Input />
                    </Form.Item>
                </Col>
                <Col span={23}>
                    <Form.Item label="Phone Number" name="phoneNumber" rules={[
                    () => ({
                        validator(_, value) {
                        if (value && value.length === 10) {
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
                <Col span={23}>
                    <Form.Item label="Email" name="email" rules={[
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

Preview.defaultProps = {
    eventTitle: "Your Event Title Here",
    eventDate: "11/05/2024, 6:00pm MST",
    eventLocation: "ZOOM LINK",
    description:  `
        Hair and skin beauty is about embracing, nourishing, and enhancing our natural features, creating a foundation of confidence and wellness. 
        For hair, care begins with understanding its type and needs—whether curly, straight, fine, or thick. Key elements like hydration, regular scalp care, and the right products can help 
        maintain strength and shine, ensuring resilience against everyday environmental stressors. Healthy hair routines also include minimizing heat and chemical treatments that can weaken strands 
        over time, while encouraging natural texture and growth.
        <br /><br />
        For skin, the goal is to achieve a healthy glow that feels as good as it looks. 
        Skin beauty focuses on consistent hydration, sun protection, and a balanced routine tailored to 
        each individual’s unique skin type. A gentle cleanser, an effective moisturizer, and SPF protection 
        lay the groundwork, while targeted serums, antioxidants, and exfoliation work to rejuvenate and refresh.
        <br /><br />
        Ultimately, hair and skin beauty aren’t just about outward appearances—they reflect the overall health and 
        care we invest in ourselves. Embracing this journey of self-care supports a lasting, radiant look that is authentic 
        and empowering.
    `
};

export default Preview;
