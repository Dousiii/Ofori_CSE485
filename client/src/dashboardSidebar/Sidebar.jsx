import React from 'react'
import {FaHome} from "react-icons/fa";
import { CiEdit, CiSquarePlus } from "react-icons/ci";
import { IoInformationCircleOutline } from "react-icons/io5";
import "./Sidebar.css";
import { useNavigate, Link } from 'react-router-dom';
import { MdSpaceDashboard } from "react-icons/md";
import { BsWindow } from "react-icons/bs";

const Sidebar = ({ setActiveContent }) => {
  const navigate = useNavigate();
  return (
    <div className="menu">
      <div className="title">
      <Link to="/home" className="card">
        <FaHome />
          Ofori
      </Link>
        
      </div>
      <div className="icon">
        <a href='#' className="card" onClick={() => setActiveContent("dashboard")}>
          <MdSpaceDashboard />
          Dashboard
        </a>
        <a href='#edit' className="card" onClick={() => setActiveContent("edit")}>
          <CiEdit />
          Edit
        </a>
        <a href='#add' className="card" onClick={() => setActiveContent("add")}>
          <CiSquarePlus />
          Add
        </a>
        <a href='#introduction' className="card" onClick={() => setActiveContent("introduction")}>
          <IoInformationCircleOutline />
          Introduction
        </a>
        <a href='#popupeditor' className="card" onClick={() => setActiveContent("popupeditor")}>
          <BsWindow />
          Popup
        </a>
      </div>
    </div>
  )
}

export default Sidebar;
