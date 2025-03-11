import React from 'react'
import {FaHome} from "react-icons/fa";
import { CiEdit, CiSquarePlus } from "react-icons/ci";
import { IoInformationCircleOutline } from "react-icons/io5";
import "./Sidebar.css";

const Sidebar = ({ setActiveContent }) => {
  return (
    <div className="menu">
      <div className="title">
        Ofori
      </div>
      <div className="icon">
        <a href='#' className="card" onClick={() => setActiveContent("dashboard")}>
          <FaHome />
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
          <CiSquarePlus />
          Popup
        </a>
      </div>
    </div>
  )
}

export default Sidebar;
