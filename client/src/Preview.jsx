import React, {useState, useRef, useEffect} from "react";
import { useNavigate } from 'react-router-dom';
import { Col, Row, Form, Input, Button, Anchor, Select, Space } from "antd";
import { DownCircleFilled } from '@ant-design/icons';
import "./preview.css";
import parse from "html-react-parser";
import image from "./assets/image.png";

function Preview({ eventTitle, eventDate, eventLocation, description, personalInfo }) {
    const navigate = useNavigate();
    const { Link } = Anchor;
    const { Option } = Select;

    const [showDropdown, setShowDropdown] = useState(null); //set dropdown
    const [titleCustomFontSize, setTitleCustomFontSize] = useState(""); // use to custon title size
    const [dateCustomFontSize, setDateCustomFontSize] = useState("");  // use to custon date size
    const [locationCustomFontSize, setlocationCustomFontSize] = useState("");  //use to custon location size
    const [descCustomFontSize, setDescCustomFontSize] = useState(""); //use to custon descrption size
    const [persCustomFontSize, setPersCustomFontSize] = useState(""); //use to custon personal info size
    const [scaling, setScaling] = useState(false);  //set scaling
    const [showBorder, setShowBorder] = useState(false); //set for show border
    const [isCustomClicked, setIsCustomClicked] = useState(false); // use ti check if custom button click
    const [fontSize, setFontSize] = useState("40px");   //set title font size
    const [dateFontSize, setDateFontSize] = useState("20px");//set date font size
    const [locationFontSize, setLocationFontSize] = useState("20px");//set location font size
    const [descFontSize, setDescFontSize] = useState("20px");//set description font size
    const [persFontSize, setPersFontSize] = useState("17px");//set personal info font size
    const dropdownRef = useRef(null); // check for click, if user click outside of the box, dropdown cancel
    const customButtonRef = useRef(null); // if user click save, dropdown cancel
    const [isCustomMode, setIsCustomMode] = useState(false); // check if in custom or save change


    //check mouse click
    useEffect(() => {
        const handleGlobalClick = (e) => {
            if (
                dropdownRef.current && !dropdownRef.current.contains(e.target) &&
                customButtonRef.current && !customButtonRef.current.contains(e.target)
            ) {
                setShowDropdown(null); // 
            }
        };

        document.addEventListener("click", handleGlobalClick);
        return () => {
            document.removeEventListener("click", handleGlobalClick);
        };
    }, []);

    const toggleBorder = () => {
        setShowBorder((prevState) => !prevState); 
    };

    //use to get the font size from the text box
    const handleCustomFontSizeChange = (box, e) => {
        const value = e.target.value;
        if (box === "title") {
            setTitleCustomFontSize(value); 
        } else if (box === "date") {
            setDateCustomFontSize(value); 
        } else if (box === "location") {
            setlocationCustomFontSize(value);
        } else if (box === "desc") {
            setDescCustomFontSize(value);
        } else if (box === "personal") {
            setPersCustomFontSize(value);
        }
    }
    
    //use to apply the font size that user custom
    const applyCustomFontSize = (box) => {
        let value = "";
        if (box === "title") {
            value = titleCustomFontSize.trim(); 
        } else if (box === "date") {
            value = dateCustomFontSize.trim();  
        } else if (box === "location") {
            value = locationCustomFontSize.trim();
        } else if (box === "desc") {
            value = descCustomFontSize.trim();
        } else if (box === "personal") {
            value = persCustomFontSize.trim();
        }
    
        if (value && !isNaN(parseFloat(value))) {
            if (!value.endsWith("px")) {
                value += "px"; 
            }
            if (box === "title") {
                setFontSize(value); 
            } else if (box === "date") {
                setDateFontSize(value); 
            } else if (box === "location") {
                setLocationFontSize(value);
            } else if (box === "desc") {
                setDescFontSize(value)
            } else if (box === "personal") {
                setPersFontSize(value);
            }
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


    const handleDateBoxClick = (box) => {
        // show the drop down
        toggleDropdown(box);
    };

    const handleLocationBoxClick = (box) => {
        // show the drop down
        toggleDropdown(box);
    };

    const handleDescriptionClick = (box) => {
        // show the drop down
        toggleDropdown(box);
    };

    const handlePersonalInfoClick = (box) => {
        // show the drop down
        toggleDropdown(box);
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

    const handleBack = () => {
        const authAction = sessionStorage.getItem('authAction');
        if (authAction === 'edit') {
            navigate('/admin#edit'); // Redirect to the admin page after Sign In
          } else if (authAction === 'add') {
            navigate('/admin#add'); // Redirect to reset password page
          } else {
            console.error('Unknown action type');
          }
      };


    return (
        <div className="previewHome">
        <h2 style={{ textAlign: "center", marginBottom: "50px", fontSize: "40px", marginTop: "30px" }}>This is a preview page</h2>
        <div className="bgBorder">
            <button onClick={handleBack} className="backButton">Back</button>
            <button ref={customButtonRef} className="customButton" onClick={() => {
                toggleBorder(); 
                setIsCustomClicked((prevState) => !prevState); 
                setShowDropdown(null);
                setIsCustomMode((prevState) => !prevState); 
                }}>
                {isCustomMode ? "Save Change" : "Custom" }
            </button>
            <div className={`eventinfoBox ${showBorder ? "withBorder" : "noBorder"}`}>
                <div className={`eventTitleBox ${showBorder ? "withBorder" : "noBorder"} ${isCustomClicked ? "hoverEnabled" : ""}`} 
                     onClick={(e) => {if (isCustomClicked) {
                        handleTitleBoxClick("title");
                        e.stopPropagation();
                        }}
                    }
                     style={{
                        fontSize: fontSize,
                        transform: isCustomClicked && showDropdown === "title" && scaling ? "scale(1.05)" : "scale(1)", // Apply scaling when dropdown is open
                        transition: "transform 0.2s", // Smooth transition for scaling
                        cursor: isCustomClicked ? "pointer" : "default",
                      }}
                    >
                    {eventTitle} 
                    
                    {showDropdown === "title" && (
                        <div ref={dropdownRef} className="fontSizeDropdown" onClick={handleDropdownClick} style={{ display: "inline-block", marginLeft: "10px" }}>
                            <Select
                                defaultValue={fontSize}
                                style={{ width: 120 }}
                                onChange={(value) => setFontSize(value)}
                                dropdownRender={(menu) => (
                                <>
                                    {menu}
                                    <Space style={{ padding: "5px", display: "flex", flexDirection: "column" }}>
                                    <Input
                                        value={titleCustomFontSize}
                                        onChange={(e) => handleCustomFontSizeChange("title", e)}
                                        style={{ width: 80 }}
                                        placeholder="e.g., 18px"
                                    />
                                    <Button onClick={() => applyCustomFontSize("title")} type="primary" style={{ marginTop: "5px" }}>
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
                
                <div className={`eventDateBox ${showBorder ? "withBorder" : "noBorder"} ${isCustomClicked ? "hoverEnabled" : ""}`}  
                    onClick={(e) => {if (isCustomClicked) {
                        handleDateBoxClick("date");
                        e.stopPropagation();
                        }}
                    }
                    style={{
                        fontSize: dateFontSize,
                        transform: isCustomClicked && showDropdown === "date" && scaling ? "scale(1.05)" : "scale(1)", // Apply scaling when dropdown is open
                        transition: "transform 0.2s", // Smooth transition for scaling
                        cursor: isCustomClicked ? "pointer" : "default",
                    }}>
                        The Event Date is: 
                        {eventDate}

                    {showDropdown === "date" && (
                        <div ref={dropdownRef} className="fontSizeDropdown" onClick={handleDropdownClick} style={{ display: "inline-block", marginLeft: "10px" }}>
                            <Select
                                defaultValue={dateFontSize}
                                style={{ width: 120 }}
                                onChange={(value) => setDateFontSize(value)}
                                dropdownRender={(menu) => (
                                <>
                                    {menu}
                                    <Space style={{ padding: "5px", display: "flex", flexDirection: "column" }}>
                                    <Input
                                        value={dateCustomFontSize}
                                        onChange={(e) => handleCustomFontSizeChange("date", e)}
                                        style={{ width: 80 }}
                                        placeholder="e.g., 18px"
                                    />
                                    <Button onClick={() => applyCustomFontSize("date")}  type="primary" style={{ marginTop: "5px" }}>
                                        Apply
                                    </Button>
                                    </Space>
                                </>
                                )}
                            >
                            <Option value="15px">15px</Option>
                            <Option value="20px">20px</Option>
                            <Option value="25px">25px</Option>
                            <Option value="30px">30px</Option>
                            <Option value="35px">35px</Option>
                        </Select> 
                        </div>
                    )}
                </div>


                <div className={`eventLocationBox ${showBorder ? "withBorder" : "noBorder"} ${isCustomClicked ? "hoverEnabled" : ""} `} 
                    onClick={(e) => {if (isCustomClicked) {
                        handleLocationBoxClick("location");
                        e.stopPropagation();
                        }}
                    }
                    style={{
                        fontSize: locationFontSize,
                        transform: isCustomClicked && showDropdown === "location" && scaling ? "scale(1.05)" : "scale(1)", // Apply scaling when dropdown is open
                        transition: "transform 0.2s", // Smooth transition for scaling
                        cursor: isCustomClicked ? "pointer" : "default",
                    }}
                    >
                    The Event Location is: 
                    {eventLocation}

                    {showDropdown === "location" && (
                        <div ref={dropdownRef} className="fontSizeDropdown" onClick={handleDropdownClick} style={{ display: "inline-block", marginLeft: "10px" }}>
                            <Select
                                defaultValue={locationFontSize}
                                style={{ width: 120 }}
                                onChange={(value) => setLocationFontSize(value)}
                                dropdownRender={(menu) => (
                                <>
                                    {menu}
                                    <Space style={{ padding: "5px", display: "flex", flexDirection: "column" }}>
                                    <Input
                                        value={locationCustomFontSize}
                                        onChange={(e) => handleCustomFontSizeChange("location", e)}
                                        style={{ width: 80 }}
                                        placeholder="e.g., 18px"
                                    />
                                    <Button onClick={() => applyCustomFontSize("location")}  type="primary" style={{ marginTop: "5px" }}>
                                        Apply
                                    </Button>
                                    </Space>
                                </>
                                )}
                            >
                            <Option value="15px">15px</Option>
                            <Option value="20px">20px</Option>
                            <Option value="25px">25px</Option>
                            <Option value="30px">30px</Option>
                            <Option value="35px">35px</Option>
                        </Select> 
                        </div>
                    )}
                </div>

            </div>

            <div
                className="flexCenterBox mt50 borderBottom"
                style={{ flexDirection: "column", alignItems: "center" }}>
                <video
                    className="videoBox"
                    src="/video/a.mp4"
                    controls>
                </video>
                <Link href="#componentsSubmit" title={enrollButton()}/>
            </div>
        
            
            <div className="flexBox mt50 borderBottom" style={{flexDirection: "column", alignItems: "center"}}>
                <div className={`descriptionBox ${showBorder ? "withBorder" : "noBorder"} ${isCustomClicked ? "hoverEnabled" : ""}`} 
                    onClick={(e) => {if (isCustomClicked) {
                        handleDescriptionClick("desc");
                        e.stopPropagation();
                        }}
                    }
                    style={{
                        fontSize: descFontSize,
                        transform: isCustomClicked && showDropdown === "desc" && scaling ? "scale(1.05)" : "scale(1)", // Apply scaling when dropdown is open
                        transition: "transform 0.2s", // Smooth transition for scaling
                        cursor: isCustomClicked ? "pointer" : "default",
                        position: "relative",
                    }}
                    >
                        {parse(description)}

                    {showDropdown === "desc" && (
                        <div ref={dropdownRef} 
                             className="fontSizeDropdown" 
                             onClick={handleDropdownClick} 
                             style={{ display: "inline-block", marginLeft: "10px", marginTop: "-50px"
                                    }}>
                            <Select
                                defaultValue={descFontSize}
                                style={{ width: 120 }}
                                onChange={(value) => setDescFontSize(value)}
                                dropdownRender={(menu) => (
                                <>
                                    {menu}
                                    <Space style={{ padding: "5px", display: "flex", flexDirection: "column" }}>
                                    <Input
                                        value={descCustomFontSize}
                                        onChange={(e) => handleCustomFontSizeChange("desc", e)}
                                        style={{ width: 80 }}
                                        placeholder="e.g., 18px"
                                    />
                                    <Button onClick={() => applyCustomFontSize("desc")}  type="primary" style={{ marginTop: "5px" }}>
                                        Apply
                                    </Button>
                                    </Space>
                                </>
                                )}
                            >
                            <Option value="15px">15px</Option>
                            <Option value="17px">17px</Option>
                            <Option value="20px">20px</Option>
                            <Option value="25px">25px</Option>
                            <Option value="30px">30px</Option>
                        </Select> 
                        </div>
                    )}
                </div>
                <div className="flexCenterBox">
                    <Link href="#componentsSubmit" title={enrollButton()} />
                </div>
            </div>



            <div className="bgBox  mt30" >
                <div className={`personalInfoBox ${showBorder ? "withBorder" : "noBorder"} ${isCustomClicked ? "hoverEnabled" : ""}`}
                    onClick={(e) => {if (isCustomClicked) {
                        handlePersonalInfoClick("personal");
                        e.stopPropagation();
                        }}
                    }
                    style={{
                        fontSize: persFontSize,
                        transform: isCustomClicked && showDropdown === "personal" && scaling ? "scale(1.05)" : "scale(1)", // Apply scaling when dropdown is open
                        transition: "transform 0.2s", // Smooth transition for scaling
                        cursor: isCustomClicked ? "pointer" : "default",
                        flexDirection: "column",
                        alignItems: "center"
                    }}
                     >
                        {parse(personalInfo)}

                        {showDropdown === "personal" && (
                        <div ref={dropdownRef} 
                             className="fontSizeDropdown" 
                             onClick={handleDropdownClick} 
                             style={{ display: "inline-block", marginLeft: "10px", marginTop: "-50px"
                                    }}>
                            <Select
                                defaultValue={persFontSize}
                                style={{ width: 120 }}
                                onChange={(value) => setPersFontSize(value)}
                                dropdownRender={(menu) => (
                                <>
                                    {menu}
                                    <Space style={{ padding: "5px", display: "flex", flexDirection: "column" }}>
                                    <Input
                                        value={persCustomFontSize}
                                        onChange={(e) => handleCustomFontSizeChange("personal", e)}
                                        style={{ width: 80 }}
                                        placeholder="e.g., 18px"
                                    />
                                    <Button onClick={() => applyCustomFontSize("personal")}  type="primary" style={{ marginTop: "5px" }}>
                                        Apply
                                    </Button>
                                    </Space>
                                </>
                                )}
                            >
                            <Option value="15px">15px</Option>
                            <Option value="17px">17px</Option>
                            <Option value="20px">20px</Option>
                            <Option value="25px">25px</Option>
                            <Option value="30px">30px</Option>
                        </Select> 
                        </div>
                    )}

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
        and empowering.`,
    personalInfo:`
        Here you can put some infomation of yourself. <br/>
        Join our FREE 21-day summit for expert insights that will help you
        walk with pride, knowing your hair is healthy, beautiful, and
        uniquely yours. Join our FREE 21-day summit for expert insights that
        will help you walk with pride, knowing your hair is healthy,
        beautiful, and uniquely yours.
    `
};

export default Preview;
