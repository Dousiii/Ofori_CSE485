import React from 'react'
import {FaHome} from "react-icons/fa";
import { CiEdit, CiSquarePlus } from "react-icons/ci";
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
      <a href='#' className="card" onClick={() => setActiveContent("edit")}>
        <CiEdit />
        Edit
      </a>
      <a href='#' className="card"onClick={()  => setActiveContent("add")}>
        <CiSquarePlus />
        Add
      </a>
      </div>
    </div>
  )
}

export default Sidebar;
