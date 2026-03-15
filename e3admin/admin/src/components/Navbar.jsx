import React from 'react';
import './Navbar.css';
import { MdMenu, MdSearch, MdLogout } from 'react-icons/md';

const Navbar = ({ toggleSidebar, onLogout }) => {
    return (
        <div className="navbar">
            <div className="navbar-left">
                <MdMenu className="menu-icon" onClick={toggleSidebar} />
                <h1>Dashboard</h1>
            </div>

            <div className="navbar-center">
                <div className="search-box">
                    <MdSearch className="search-icon" />
                    <input type="text" placeholder="Search here" />
                </div>
            </div>

            <div className="navbar-right">
                <div className="user-profile">
                    <img
                        src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80"
                        alt="User"
                        className="avatar"
                    />
                    <div className="user-info">
                        <span className="user-name">John Doe</span>
                        <span className="user-role">Super admin</span>
                    </div>
                </div>
                <button className="logout-btn" onClick={onLogout} title="Logout">
                    <MdLogout />
                </button>
            </div>
        </div>
    );
};

export default Navbar;
