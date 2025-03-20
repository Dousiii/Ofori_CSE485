import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import { Col, Row, Form, Input, Button, Anchor, Select, Space } from "antd";
import { DownCircleFilled } from '@ant-design/icons';
import "./preview.css";
import playImg from "./assets/play.png";
import stopImg from "./assets/stop.png";
import parse from "html-react-parser";
import image from "./assets/demo.png";
import { message } from 'antd';

const isValidURL = (str) => {
    const pattern = /^(https?:\/\/)?([\w-]+(\.[\w-]+)+)(\/[\w-./?%&=]*)?$/i;
    return pattern.test(str);
};

function Preview() {
    const navigate = useNavigate();
    const { Link } = Anchor;
    const { Option } = Select;
    const [showDropdown, setShowDropdown] = useState(null); //set dropdown
    const [titleCustomFontSize, setTitleCustomFontSize] = useState(localStorage.getItem("titleCustomFontSize") || ""); // use to custon title size
    const [locationCustomFontSize, setlocationCustomFontSize] = useState(localStorage.getItem("locationCustomFontSize") || ""); //use to custon location size
    const [descCustomFontSize, setDescCustomFontSize] = useState(localStorage.getItem("descCustomFontSize") || ""); //use to custon descrption size
    const [persCustomFontSize, setPersCustomFontSize] = useState(localStorage.getItem("persCustomFontSize") || "");//use to custon personal info size
    const [scaling, setScaling] = useState(false);  //set scaling
    const [showBorder, setShowBorder] = useState(false); //set for show border
    const [isCustomClicked, setIsCustomClicked] = useState(false); // use ti check if custom button click
    const [fontSize, setFontSize] = useState(localStorage.getItem("fontSize") || "40px");   //set title font size
    const [locationFontSize, setLocationFontSize] = useState(localStorage.getItem("locationFontSize") || "20px");//set location font size
    const [descFontSize, setDescFontSize] = useState(localStorage.getItem("descFontSize") || "20px");//set description font size
    const [persFontSize, setPersFontSize] = useState(localStorage.getItem("persFontSize") || "17px");//set personal info font size
    const dropdownRef = useRef(null); // check for click, if user click outside of the box, dropdown cancel
    const customButtonRef = useRef(null); // if user click save, dropdown cancel
    const [isCustomMode, setIsCustomMode] = useState(false); // check if in custom or save change
    const videoRef = useRef();
    const [dynamicPersonalInfo, setDynamicPersonalInfo] = useState("");
    const location = useLocation();
    const introText = location.state?.introText || '';
    const introSectionRef = useRef(null);
    const { eventData } = location.state || {};
    const [eventTitle, setEventTitle] = useState('');
    const [eventDate, setEventDate] = useState('');
    const [eventLocation, setEventLocation] = useState('');
    const [eventTime, setEventTime] = useState('');
    const [description, setDescription] = useState('');
    const [video_url, setVideourl] = useState('');
    const { formData } = location.state || {};

    useEffect(() => {
        const checkSourceAndLoad = async () => {
          const authAction = sessionStorage.getItem('authAction');
    
          //check if from intro page
        if (authAction === 'intro'){
            setTimeout(() => {
                introSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
              }, 100);
            if (location.state?.introText) {
                setDynamicPersonalInfo(location.state.introText);
            } 
        }else {
        //if not, load from database
            try {
                const response = await fetch('http://127.0.0.1:5000/getIntroduction');
                const data = await response.json();

                if (response.ok) {
                setDynamicPersonalInfo(data.intro_text);
                } else {
                message.error('Failed to load introduction');
                }
            } catch (error) {
                console.error('Error fetching introduction:', error);
                message.error('Failed to load introduction');
            }
        }
        };
    
        checkSourceAndLoad();
    }, [location.state]);

    useEffect(() => {
        if(location.state?.eventData)
        {
            setEventTitle(location.state.eventData.Title);
            setEventDate(location.state.eventData.Date);
            setEventTime(location.state.eventData.Time);
            setEventLocation(location.state.eventData.Location);
            setDescription(location.state.eventData.Description);
            setVideourl(location.state.eventData.Video_url);
        }
        else if(location.state?.formData)
        {
            setEventTitle(location.state.formData.title);
            setEventDate(location.state.formData.date);
            setEventTime(location.state.formData.time);
            setEventLocation(location.state.formData.location);
            setDescription(location.state.formData.description); 
        }
    }, []);

    // Save to localStorage when "Save Change" button is clicked
  const handleSaveChange = () => {
    if (isCustomMode) {
        setFontSize((prev) => {
            localStorage.setItem("fontSize", prev);
            return prev;
          });
      
          setLocationFontSize((prev) => {
            localStorage.setItem("locationFontSize", prev);
            return prev;
          });
      
          setDescFontSize((prev) => {
            localStorage.setItem("descFontSize", prev);
            return prev;
          });
      
          setPersFontSize((prev) => {
            localStorage.setItem("persFontSize", prev);
            return prev;
          });
      
          setTitleCustomFontSize((prev) => {
            localStorage.setItem("titleCustomFontSize", prev);
            return prev;
          });
      
          setlocationCustomFontSize((prev) => {
            localStorage.setItem("locationCustomFontSize", prev);
            return prev;
          });
      
          setDescCustomFontSize((prev) => {
            localStorage.setItem("descCustomFontSize", prev);
            return prev;
          });
      
          setPersCustomFontSize((prev) => {
            localStorage.setItem("persCustomFontSize", prev);
            return prev;
          });
      
          setIsCustomMode(false); // exit custom mode
    }
  };

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
                setTitleCustomFontSize("");
            } else if (box === "location") {
                setLocationFontSize(value);
                setlocationCustomFontSize("");
            } else if (box === "desc") {
                setDescFontSize(value)
                setDescCustomFontSize("");
            } else if (box === "personal") {
                setPersFontSize(value);
                setPersCustomFontSize("");
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
        return <Button className="buttonSubmit" >Enroll Now</Button>
    }

    const handleBack = () => {
        const authAction = sessionStorage.getItem('authAction');
        if (authAction === 'edit') {
            navigate('/admin#edit', { state: { eventData } }); // Redirect to the edit
        } else if (authAction === 'add') {
            navigate('/admin#add', { state: { formData } }); // Redirect to create
        } else if (authAction === 'intro') {
            navigate('/admin#introduction', { state: { introText } }); // Redirect to introduction page
        }
        else {
            console.error('Unknown action type');
        }
    };


    return (
        <div className="previewHome">
            <h2 style={{ textAlign: "center", marginBottom: "50px", fontSize: "40px", marginTop: "30px" }}>This is a preview page</h2>
            <div className="bgBorder">
                <div className="fixedBorderContainer">
                    <button onClick={handleBack} className="backButton">Back</button>
                    <button ref={customButtonRef} className="customButton" onClick={() => {
                        if (isCustomMode) {
                            handleSaveChange(); // Save when in custom mode
                            setIsCustomMode(false); // Switch back to "Custom Font Size" after saving
                          } else {
                            // If not in custom mode, enter custom mode to edit font size
                            setIsCustomMode(true); 
                          }
                          toggleBorder();
                          setIsCustomClicked((prevState) => !prevState);
                          setShowDropdown(null);
                    }}>
                        {isCustomMode ? "Save Change" : "Custom Font Size"}
                    </button>
                </div>
                <div className={`eventinfoBox ${showBorder ? "withBorder" : "noBorder"}`}>
                    <div className={`eventTitleBox ${showBorder ? "withBorder" : "noBorder"} ${isCustomClicked ? "hoverEnabled" : ""}`}
                        onClick={(e) => {
                            if (isCustomClicked) {
                                handleTitleBoxClick("title");
                                e.stopPropagation();
                            }
                        }
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
                                    value={fontSize}
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

                    <div className={`eventLocationBox ${showBorder ? "withBorder" : "noBorder"} ${isCustomClicked ? "hoverEnabled" : ""} `}
                        onClick={(e) => {
                            if (isCustomClicked) {
                                handleLocationBoxClick("location");
                                e.stopPropagation();
                            }
                        }
                        }
                        style={{
                            fontSize: locationFontSize,
                            transform: isCustomClicked && showDropdown === "location" && scaling ? "scale(1.05)" : "scale(1)", // Apply scaling when dropdown is open
                            transition: "transform 0.2s", // Smooth transition for scaling
                            cursor: isCustomClicked ? "pointer" : "default",
                        }}>
                        The Event Location is: 
                        {" "}
                        {isValidURL(eventLocation) ? (
                            <a 
                                href={eventLocation.startsWith("http") ? eventLocation : `https://${eventLocation}`} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                style={{ color: "blue", textDecoration: "underline" }}
                            >
                                {eventLocation}
                            </a>
                        ) : (
                            eventLocation
                        )}
                        <div></div>
                        The Event Date is: 
                        {eventDate}
                        <div></div>
                        The Event Time is: 
                        {eventTime}

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
                                                <Button onClick={() => applyCustomFontSize("location")} type="primary" style={{ marginTop: "5px" }}>
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
                    className="flexCenterBox mt50 borderBottom videoBox"
                    style={{ flexDirection: "column", alignItems: "center", position: "relative" }}>

                    <video
                        autoPlay
                        muted
                        controls
                        className="videoItem"
                        ref={videoRef}
                        src={video_url || ""}
                    > 
                    </video>
                    <Link href="#componentsSubmit" title={enrollButton()} />
                </div>


                <div className="flexBox mt50 borderBottom" style={{ flexDirection: "column", alignItems: "center" }}>
                    <div className={`descriptionBox ${showBorder ? "withBorder" : "noBorder"} ${isCustomClicked ? "hoverEnabled" : ""}`}
                        onClick={(e) => {
                            if (isCustomClicked) {
                                handleDescriptionClick("desc");
                                e.stopPropagation();
                            }
                        }
                        }
                        style={{
                            fontSize: descFontSize,
                            transform: isCustomClicked && showDropdown === "desc" && scaling ? "scale(1.05)" : "scale(1)", // Apply scaling when dropdown is open
                            transition: "transform 0.2s", // Smooth transition for scaling
                            cursor: isCustomClicked ? "pointer" : "default",
                            position: "relative",
                        }}
                    >
                        {parse(description.replace(/\n/g, "<br />"))}
                        {showDropdown === "desc" && (
                            <div ref={dropdownRef}
                                className="fontSizeDropdown"
                                onClick={handleDropdownClick}
                                style={{
                                    display: "inline-block", marginLeft: "10px", marginTop: "-50px"
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
                                                <Button onClick={() => applyCustomFontSize("desc")} type="primary" style={{ marginTop: "5px" }}>
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



                <div className="mt30 introduction_p" ref={introSectionRef}>
                    <img src={image}  className="mt30 demo"/> 
                    <div className={`personalInfoBox ${showBorder ? "withBorder" : "noBorder"} ${isCustomClicked ? "hoverEnabled" : ""}`}
                        onClick={(e) => {
                            if (isCustomClicked) {
                                handlePersonalInfoClick("personal");
                                e.stopPropagation();
                            }
                        }
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
                        {parse(dynamicPersonalInfo.replace(/\n/g, "<br />"))}

                        {showDropdown === "personal" && (
                            <div ref={dropdownRef}
                                className="fontSizeDropdown"
                                onClick={handleDropdownClick}
                                style={{
                                    display: "inline-block", marginLeft: "10px", marginTop: "-50px"
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
                                                <Button onClick={() => applyCustomFontSize("personal")} type="primary" style={{ marginTop: "5px" }}>
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
                    <Link href="#componentsSubmit" className="fixedButton" title={aatext()} />
                </Anchor>
            </div>
        </div>
    );
}

export default Preview;
