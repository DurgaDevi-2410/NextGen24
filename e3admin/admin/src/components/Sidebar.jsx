import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import e3logo from '../assets/e3logo.png';
import './Sidebar.css';
import {
  MdDashboard,
  MdInfo,
  MdSchool,
  MdWork,
  MdContactMail,
  MdHowToReg,
  MdPhotoLibrary,
  MdSupervisorAccount,
  MdApartment
} from 'react-icons/md';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLinkClick = (path) => {
    navigate(path);
    if (window.innerWidth <= 992) {
      toggleSidebar();
    }
  };

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <MdDashboard /> },
    { name: 'About', path: '/about', icon: <MdInfo /> },
    { name: 'Course', path: '/course', icon: <MdSchool /> },
    { name: 'Placement', path: '/placement', icon: <MdWork /> },
    { name: 'Contact', path: '/contact', icon: <MdContactMail /> },
    { name: 'Enroll', path: '/enroll', icon: <MdHowToReg /> },
    { name: 'Gallery', path: '/gallery', icon: <MdPhotoLibrary /> },
    { name: 'Trainer', path: '/trainer', icon: <MdSupervisorAccount /> },
  ];

  return (
    <div className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-header" style={{ padding: '20px 25px', display: 'flex', justifyContent: 'center' }}>
        <h2 style={{ fontSize: '28px', fontWeight: 'bold', margin: 0, fontStyle: 'italic' }}>NEXTGEN</h2>
        <button className="mobile-close-btn" onClick={toggleSidebar}>×</button>
      </div>
      <ul className="sidebar-menu">
        {menuItems.map((item, index) => (
          <li
            key={index}
            className={`menu-item ${location.pathname === item.path ? 'active' : ''}`}
            onClick={() => handleLinkClick(item.path)}
          >
            <span className="icon">{item.icon}</span>
            <span>{item.name}</span>
          </li>
        ))}
      </ul>
      {/* Overlay for mobile */}
      {isOpen && <div className="sidebar-overlay" onClick={toggleSidebar}></div>}
    </div>
  );
};

export default Sidebar;
