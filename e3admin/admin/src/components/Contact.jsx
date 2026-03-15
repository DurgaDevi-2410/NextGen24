import React, { useState, useEffect } from 'react';
import {
    MdEmail,
    MdPhone,
    MdLocationOn,
    MdSend,
    MdDelete,
    MdCheckCircle,
    MdSettings,
    MdChat,
    MdSearch,
    MdFilterList,
    MdShare
} from 'react-icons/md';
import {
    FaWhatsapp,
    FaFacebookF,
    FaTwitter,
    FaInstagram,
    FaLinkedinIn
} from 'react-icons/fa';
import './Contact.css';
import api from '../api/axios';

const Contact = () => {
    const [activeTab, setActiveTab] = useState('enquiries');
    const [enquiries, setEnquiries] = useState([]);
    const [contactInfo, setContactInfo] = useState({
        primaryPhone: "",
        whatsapp: "",
        official_email: "",
        address: "",
        facebook: "",
        twitter: "",
        instagram: "",
        linkedin: ""
    });

    useEffect(() => {
        fetchEnquiries();
        fetchSettings();
    }, []);

    const fetchEnquiries = async () => {
        try {
            const response = await api.get('contact-messages/');
            setEnquiries(response.data);
        } catch (error) {
            console.error("Error fetching enquiries:", error);
        }
    };

    const fetchSettings = async () => {
        try {
            const response = await api.get('contact-settings/');
            if (response.data.length > 0) {
                setContactInfo(response.data[0]);
            }
        } catch (error) {
            console.error("Error fetching contact settings:", error);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this enquiry?")) return;
        try {
            await api.delete(`contact-messages/${id}/`);
            fetchEnquiries();
        } catch (error) {
            console.error("Error deleting enquiry:", error);
        }
    };

    const handleStatusChange = async (id, newStatus) => {
        try {
            await api.patch(`contact-messages/${id}/`, { status: newStatus });
            fetchEnquiries();
        } catch (error) {
            console.error("Error updating status:", error);
        }
    };

    const handleSaveSettings = async () => {
        try {
            const data = {
                address: contactInfo.address,
                primary_phone: contactInfo.primary_phone || contactInfo.primaryPhone,
                official_email: contactInfo.official_email,
                whatsapp: contactInfo.whatsapp,
                facebook: contactInfo.facebook,
                twitter: contactInfo.twitter,
                instagram: contactInfo.instagram,
                linkedin: contactInfo.linkedin
            };

            if (contactInfo.id) {
                await api.put(`contact-settings/${contactInfo.id}/`, data);
            } else {
                await api.post('contact-settings/', data);
            }
            alert("Settings saved successfully!");
            fetchSettings();
        } catch (error) {
            console.error("Error saving settings:", error);
            alert("Failed to save settings. Please check all fields.");
        }
    };

    return (
        <div className="contact-admin-wrapper">
            <div className="contact-header">
                <div className="header-info">
                    <h1>Contact & Enquiries</h1>
                    <p>Manage visitor messages and campus contact information</p>
                </div>
                <div className="contact-tabs">
                    <button
                        className={`contact-tab-btn ${activeTab === 'enquiries' ? 'active' : ''}`}
                        onClick={() => setActiveTab('enquiries')}
                    >
                        <MdChat /> Enquiries
                        <span className="count-badge">{enquiries.length}</span>
                    </button>
                    <button
                        className={`contact-tab-btn ${activeTab === 'settings' ? 'active' : ''}`}
                        onClick={() => setActiveTab('settings')}
                    >
                        <MdSettings /> Contact Settings
                    </button>
                </div>
            </div>

            <div className="contact-main-content">
                {activeTab === 'enquiries' ? (
                    <div className="enquiries-panel">
                        <div className="table-actions">
                            <div className="search-box">
                                <MdSearch />
                                <input type="text" placeholder="Search enquiries..." />
                            </div>
                            <button className="filter-btn"><MdFilterList /> Filter</button>
                        </div>

                        <div className="enquiries-table-container">
                            <table className="enquiries-table">
                                <thead>
                                    <tr>
                                        <th>Sender Details</th>
                                        <th>Enquiry Type</th>
                                        <th>Message Preview</th>
                                        <th>Date</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {enquiries.map((enquiry) => (
                                        <tr key={enquiry.id} className={enquiry.status === 'New' ? 'new-row' : ''}>
                                            <td>
                                                <div className="sender-info">
                                                    <span className="sender-name">{enquiry.first_name} {enquiry.last_name}</span>
                                                    <span className="sender-meta">{enquiry.email}</span>
                                                    <span className="sender-meta">{enquiry.phone_number}</span>
                                                </div>
                                            </td>
                                            <td>
                                                <span className={`type-tag ${enquiry.enquiry_type ? enquiry.enquiry_type.toLowerCase() : 'general'}`}>
                                                    {enquiry.enquiry_type || 'General'}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="msg-preview">{enquiry.message}</div>
                                            </td>
                                            <td><span className="date-text">{new Date(enquiry.created_at).toLocaleDateString()}</span></td>
                                            <td>
                                                <span className={`status-pill ${enquiry.status ? enquiry.status.toLowerCase() : 'new'}`}>
                                                    {enquiry.status || 'New'}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="action-btns">
                                                    <button className="icon-btn reply" title="Reply"><MdSend /></button>
                                                    <button
                                                        className="icon-btn mark"
                                                        title="Mark Read"
                                                        onClick={() => handleStatusChange(enquiry.id, 'Read')}
                                                    >
                                                        <MdCheckCircle />
                                                    </button>
                                                    <button
                                                        className="icon-btn delete"
                                                        title="Delete"
                                                        onClick={() => handleDelete(enquiry.id)}
                                                    >
                                                        <MdDelete />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : (
                    <div className="contact-settings-panel">
                        <div className="settings-grid">
                            <div className="settings-card">
                                <h3><MdLocationOn /> Business Details</h3>
                                <div className="settings-form">
                                    <div className="form-group">
                                        <label>Office Address</label>
                                        <textarea
                                            value={contactInfo.address}
                                            onChange={(e) => setContactInfo({ ...contactInfo, address: e.target.value })}
                                            rows="3"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Primary Phone</label>
                                        <input
                                            type="text"
                                            value={contactInfo.primary_phone || contactInfo.primaryPhone || ""}
                                            onChange={(e) => setContactInfo({ ...contactInfo, primary_phone: e.target.value })}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Official Email</label>
                                        <input
                                            type="email"
                                            value={contactInfo.official_email}
                                            onChange={(e) => setContactInfo({ ...contactInfo, official_email: e.target.value })}
                                        />
                                    </div>
                                    <button className="save-settings-btn" onClick={handleSaveSettings}>Save Business Info</button>
                                </div>
                            </div>

                            <div className="settings-card">
                                <h3><MdShare /> Social Media & Connectivity</h3>
                                <div className="settings-form">
                                    <div className="input-with-icon">
                                        <FaWhatsapp className="wa-icon" />
                                        <input
                                            type="text"
                                            placeholder="WhatsApp Number"
                                            value={contactInfo.whatsapp}
                                            onChange={(e) => setContactInfo({ ...contactInfo, whatsapp: e.target.value })}
                                        />
                                    </div>
                                    <div className="input-with-icon">
                                        <FaFacebookF className="fb-icon" />
                                        <input
                                            type="text"
                                            placeholder="Facebook URL"
                                            value={contactInfo.facebook}
                                            onChange={(e) => setContactInfo({ ...contactInfo, facebook: e.target.value })}
                                        />
                                    </div>
                                    <div className="input-with-icon">
                                        <FaTwitter className="tw-icon" />
                                        <input
                                            type="text"
                                            placeholder="Twitter URL"
                                            value={contactInfo.twitter}
                                            onChange={(e) => setContactInfo({ ...contactInfo, twitter: e.target.value })}
                                        />
                                    </div>
                                    <div className="input-with-icon">
                                        <FaInstagram className="ig-icon" />
                                        <input
                                            type="text"
                                            placeholder="Instagram URL"
                                            value={contactInfo.instagram}
                                            onChange={(e) => setContactInfo({ ...contactInfo, instagram: e.target.value })}
                                        />
                                    </div>
                                    <div className="input-with-icon">
                                        <FaLinkedinIn className="li-icon" />
                                        <input
                                            type="text"
                                            placeholder="LinkedIn URL"
                                            value={contactInfo.linkedin}
                                            onChange={(e) => setContactInfo({ ...contactInfo, linkedin: e.target.value })}
                                        />
                                    </div>
                                    <button className="save-settings-btn" onClick={handleSaveSettings}>Update Links</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Contact;
