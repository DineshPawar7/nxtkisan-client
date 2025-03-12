import React, { useState } from "react";
import { FaHome, FaRobot, FaTractor, FaPlusCircle, FaUser, FaCamera, FaVideo, FaFileAlt } from "react-icons/fa";
import "./Sidebar.css";

const Sidebar = ({ onCreate }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [showSubMenu, setShowSubMenu] = useState(false);

  return (
    <div className={`sidebar ${isOpen ? "open" : "closed"}`}>
      <div className="logo" onClick={() => setIsOpen(!isOpen)}>NxtKisan</div>
      <ul className="menu">
        <li><FaHome className="icon" /><span>Home</span></li>
        <li><FaRobot className="icon" /><span>AI</span></li>
        <li><FaTractor className="icon" /><span>Mandibhav</span></li>

        {/* Create Button */}
        <li onClick={() => setShowSubMenu(!showSubMenu)} className="create-btn">
          <FaPlusCircle className="icon" /><span>Create</span>
        </li>

        {showSubMenu && (
          <ul className="submenu">
            <li onClick={() => onCreate("photo")}><FaCamera className="icon" /></li>
            <li onClick={() => onCreate("video")}><FaVideo className="icon" /></li>
            <li onClick={() => onCreate("article")}><FaFileAlt className="icon" /></li>
          </ul>
        )}

        <li><FaUser className="icon" /><span>Profile</span></li>
      </ul>
    </div>
  );
};

export default Sidebar;
