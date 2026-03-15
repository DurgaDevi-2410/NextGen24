import React, { useState, useEffect } from 'react';
import {
    MdAdd,
    MdEdit,
    MdDelete,
    MdCloudUpload,
    MdSearch,
    MdClose,
    MdMoreHoriz
} from 'react-icons/md';
import {
    FaLinkedin,
    FaTwitter,
    FaGlobe
} from 'react-icons/fa';
import './Trainer.css';

import api from '../api/axios';

const Trainer = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeFilter, setActiveFilter] = useState('All');
    const [showModal, setShowModal] = useState(false);

    // Initial State Structure
    const initialTrainerState = {
        name: "",
        role: "",
        category: "Technical",
        biography: "",
        image: null,
        linkedin: "",
        twitter: "",
        github: ""
    };

    const [editingTrainer, setEditingTrainer] = useState(initialTrainerState);
    const [trainers, setTrainers] = useState([]);

    // For Image Preview
    const [imagePreview, setImagePreview] = useState(null);

    const categories = ['All', 'Leadership', 'Technical', 'Design', 'Marketing'];

    useEffect(() => {
        fetchTrainers();
    }, []);

    const fetchTrainers = async () => {
        try {
            const response = await api.get('trainers/');
            setTrainers(response.data);
        } catch (error) {
            console.error("Error fetching trainers:", error);
        }
    };

    const handleAdd = () => {
        setEditingTrainer(initialTrainerState);
        setImagePreview(null);
        setShowModal(true);
    };

    const handleEdit = (trainer) => {
        setEditingTrainer({ ...trainer });
        // Set preview to existing image URL
        setImagePreview(trainer.image);
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Delete this trainer profile?")) {
            try {
                await api.delete(`trainers/${id}/`);
                fetchTrainers();
            } catch (error) {
                console.error("Error deleting trainer:", error);
            }
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setEditingTrainer({ ...editingTrainer, image: file });
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        const formData = new FormData();

        // Append text fields
        formData.append('name', editingTrainer.name);
        formData.append('role', editingTrainer.role);
        formData.append('category', editingTrainer.category);
        formData.append('biography', editingTrainer.biography);
        formData.append('linkedin', editingTrainer.linkedin || '');
        formData.append('twitter', editingTrainer.twitter || '');
        formData.append('github', editingTrainer.github || ''); // Using github field as Website/Globe

        // Append Image only if it's a new File object
        if (editingTrainer.image instanceof File) {
            formData.append('image', editingTrainer.image);
        }

        try {
            if (editingTrainer.id) {
                await api.patch(`trainers/${editingTrainer.id}/`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            } else {
                await api.post('trainers/', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            }
            setShowModal(false);
            fetchTrainers();
        } catch (error) {
            console.error("Error saving trainer:", error);
            alert("Failed to save trainer. Please check console.");
        }
    };

    const filteredTrainers = trainers.filter(t => {
        const matchesSearch = t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            t.role.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = activeFilter === 'All' || t.category === activeFilter;
        return matchesSearch && matchesCategory;
    });

    const [activeMenuId, setActiveMenuId] = useState(null);

    // Toggle menu handler
    const toggleMenu = (e, id) => {
        e.stopPropagation();
        setActiveMenuId(activeMenuId === id ? null : id);
    };

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = () => setActiveMenuId(null);
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    return (
        <div className="trainer-admin-wrapper">
            <div className="trainer-header">
                <div className="header-info">
                    <h1>Experts Management</h1>
                    <p>Manage your instructors, leadership, and technical team profiles</p>
                </div>
                <button className="add-trainer-btn" onClick={handleAdd}>
                    <MdAdd /> Add New Expert
                </button>
            </div>

            <div className="trainer-controls-card">
                <div className="search-box">
                    <MdSearch className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search by name or role..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="filter-pills">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            className={`filter-pill ${activeFilter === cat ? 'active' : ''}`}
                            onClick={() => setActiveFilter(cat)}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            <div className="trainer-grid">
                {filteredTrainers.map(trainer => (
                    <div key={trainer.id} className="expert-card">
                        <div className="expert-image-container">
                            <img src={trainer.image} alt={trainer.name} />
                        </div>

                        <div className="expert-info">
                            <span className="expert-category-badge">{trainer.category || "IT"}</span>
                            <h3 className="expert-name">{trainer.name}</h3>
                            <p className="expert-role">{trainer.role}</p>
                        </div>

                        <div className="expert-menu-container">
                            <button className="menu-trigger" onClick={(e) => toggleMenu(e, trainer.id)}>
                                <MdMoreHoriz />
                            </button>
                            {activeMenuId === trainer.id && (
                                <div className="expert-dropdown-menu">
                                    <button onClick={() => handleEdit(trainer)}><MdEdit /> Edit</button>
                                    <button onClick={() => handleDelete(trainer.id)} className="delete-option"><MdDelete /> Delete</button>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal for Add/Edit */}
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content trainer-modal">
                        <div className="modal-header">
                            <h2>{editingTrainer.id ? 'Edit Expert Profile' : 'Add New Expert'}</h2>
                            <button className="close-modal" onClick={() => setShowModal(false)}><MdClose /></button>
                        </div>
                        <form onSubmit={handleSave} className="trainer-form">
                            <div className="form-left">
                                <div className="image-upload-section">
                                    <div className="image-preview-box">
                                        {imagePreview ? (
                                            <img src={imagePreview} alt="Preview" />
                                        ) : (
                                            <div className="placeholder-text">No Image</div>
                                        )}
                                    </div>
                                    <label htmlFor="trainer-image-upload" className="upload-btn">
                                        <MdCloudUpload /> {imagePreview ? 'Change Photo' : 'Upload Photo'}
                                    </label>
                                    <input
                                        id="trainer-image-upload"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        style={{ display: 'none' }}
                                    />
                                </div>
                            </div>
                            <div className="form-right">
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Full Name</label>
                                        <input
                                            type="text"
                                            required
                                            value={editingTrainer.name}
                                            onChange={(e) => setEditingTrainer({ ...editingTrainer, name: e.target.value })}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Role/Designation</label>
                                        <input
                                            type="text"
                                            required
                                            value={editingTrainer.role}
                                            onChange={(e) => setEditingTrainer({ ...editingTrainer, role: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Category</label>
                                    <select
                                        value={editingTrainer.category}
                                        onChange={(e) => setEditingTrainer({ ...editingTrainer, category: e.target.value })}
                                    >
                                        {categories.filter(c => c !== 'All').map(c => (
                                            <option key={c} value={c}>{c}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Biography</label>
                                    <textarea
                                        rows="3"
                                        required
                                        value={editingTrainer.biography}
                                        onChange={(e) => setEditingTrainer({ ...editingTrainer, biography: e.target.value })}
                                    />
                                </div>
                                <div className="social-inputs">
                                    <label>Social Links (Optional)</label>
                                    <div className="social-row">
                                        <FaLinkedin />
                                        <input
                                            type="text"
                                            placeholder="LinkedIn URL"
                                            value={editingTrainer.linkedin}
                                            onChange={(e) => setEditingTrainer({ ...editingTrainer, linkedin: e.target.value })}
                                        />
                                    </div>
                                    <div className="social-row">
                                        <FaTwitter />
                                        <input
                                            type="text"
                                            placeholder="Twitter URL"
                                            value={editingTrainer.twitter}
                                            onChange={(e) => setEditingTrainer({ ...editingTrainer, twitter: e.target.value })}
                                        />
                                    </div>
                                    <div className="social-row">
                                        <FaGlobe />
                                        <input
                                            type="text"
                                            placeholder="Website/Portfolio URL"
                                            value={editingTrainer.github}
                                            onChange={(e) => setEditingTrainer({ ...editingTrainer, github: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="form-actions">
                                    <button type="button" className="cancel-btn" onClick={() => setShowModal(false)}>Cancel</button>
                                    <button type="submit" className="save-btn">Save Profile</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Trainer;
