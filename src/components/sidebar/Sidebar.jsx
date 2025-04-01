import React, { useState } from "react";
import { FaHome, FaRobot, FaTractor, FaPlusCircle, FaUser, FaCamera, FaVideo, FaFileAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import "./Sidebar.css";

const Sidebar = ({ onCreate }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [showSubMenu, setShowSubMenu] = useState(false);

  const handleCreate = async (type) => {
    if (!onCreate) {
      console.error("Error: `onCreate` function is missing!");
      return;
    }

    onCreate(type);
  };

  return (
    <div className={`sidebar ${isOpen ? "open" : "closed"}`}>
      <div className="logo" onClick={() => setIsOpen(!isOpen)}>
        NxtKisan
      </div>

      {/* Sidebar Menu */}
      <ul className="menu">
        <li>
          <Link to="/">
            <FaHome className="icon" />
            {isOpen && <span>Home</span>}
          </Link>
        </li>

        <li>
          <Link to="/chatbot">
            <FaRobot className="icon" />
            {isOpen && <span>AI</span>}
          </Link>
        </li>

        <li>
          <Link to="/mandibhav">
            <FaTractor className="icon" />
            {isOpen && <span>Mandibhav</span>}
          </Link>
        </li>

        <li className="create-btn" onClick={() => setShowSubMenu(!showSubMenu)}>
          <FaPlusCircle className="icon" />
          {isOpen && <span>Create</span>}
        </li>

        {showSubMenu && (
          <ul className="submenu">
            <li onClick={() => handleCreate("photo")}>
              <FaCamera className="icon" />
              {isOpen && <span>Photo</span>}
            </li>
            <li onClick={() => handleCreate("video")}>
              <FaVideo className="icon" />
              {isOpen && <span>Video</span>}
            </li>
            <li onClick={() => handleCreate("article")}>
              <FaFileAlt className="icon" />
              {isOpen && <span>Article</span>}
            </li>
          </ul>
        )}

        <li>
          <Link to="/profile">
            <FaUser className="icon" />
            {isOpen && <span>Profile</span>}
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
