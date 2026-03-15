import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Course.css';
import { MdAdd, MdEdit, MdDelete, MdStar, MdAccessTime, MdSchool, MdCloudUpload } from 'react-icons/md';
import api from '../api/axios';

const Course = () => {
    const navigate = useNavigate();
    const [courses, setCourses] = useState([]);

    // Initial Form State
    const initialFormState = {
        title: '',
        duration: '60 Hours',
        rating: 5,
        icon: null, // File object
        modes: 'In-center | Online | Hybrid | Full/Part time',
        features: '60 Hours | Placements',
        icon_color: '#e31e24',
        categories: 'Development'
    };

    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState(initialFormState);
    const [iconPreview, setIconPreview] = useState(null);

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            const response = await api.get('courses/');
            // Map backend fields to frontend expected fields if needed, 
            // but looks like backend has 'image' instead of 'icon'.
            // Let's use backend fields directly or map them.
            // Backend keys: title, duration, rating, image, icon_color, icon_text, mode_text, placement_text
            setCourses(response.data);
        } catch (error) {
            console.error("Error fetching courses:", error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({ ...formData, icon: file });
            setIconPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = new FormData();
        data.append('title', formData.title);
        data.append('duration', formData.duration);
        data.append('rating', formData.rating);
        data.append('icon_color', formData.icon_color);
        data.append('mode_text', formData.modes); // Backend uses 'mode_text'
        data.append('placement_text', formData.features); // Backend uses 'placement_text'

        // Backend 'image' field for icon
        if (formData.icon) {
            data.append('image', formData.icon);
        }

        // Just sending required fields for now based on models.py
        data.append('categories', formData.categories);

        try {
            await api.post('courses/', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setShowForm(false);
            setFormData(initialFormState);
            setIconPreview(null);
            fetchCourses();
        } catch (error) {
            console.error("Error creating course:", error);
            alert("Failed to create course. Check console.");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this course?")) {
            try {
                await api.delete(`courses/${id}/`);
                fetchCourses();
            } catch (error) {
                console.error("Error deleting course:", error);
            }
        }
    };

    return (
        <div className="course-container">
            <div className="course-header">
                <div>
                    <h2>Course Management</h2>
                    <p>Manage courses, curriculum, and details</p>
                </div>
                <button className="add-btn" onClick={() => setShowForm(!showForm)}>
                    <MdAdd /> {showForm ? 'Close Form' : 'Add New Course'}
                </button>
            </div>

            {showForm && (
                <div className="course-form-card">
                    <h3>Add New Course</h3>
                    <form onSubmit={handleSubmit}>
                        <div className="d-flex gap-4">
                            {/* Left Side - Image Upload & Color */}
                            <div className="form-upload-section">
                                <div className="image-preview-box">
                                    {iconPreview ? (
                                        <img src={iconPreview} alt="Preview" />
                                    ) : (
                                        <div style={{ color: '#aaa', fontSize: '0.9rem' }}>No Icon</div>
                                    )}
                                </div>
                                <label className="upload-label-btn">
                                    <MdCloudUpload size={20} />
                                    Upload Icon
                                    <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
                                </label>
                            </div>

                            {/* Right Side - Fields */}
                            <div className="form-inputs-section">
                                <div className="form-group">
                                    <label>Course Title</label>
                                    <input
                                        type="text"
                                        name="title"
                                        className="form-control"
                                        placeholder="e.g. PYTHON FULL STACK"
                                        value={formData.title}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="row">
                                    <div className="col-md-6 form-group">
                                        <label>Duration</label>
                                        <input
                                            type="text"
                                            name="duration"
                                            className="form-control"
                                            value={formData.duration}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div className="col-md-6 form-group">
                                        <label>Rating (1-5)</label>
                                        <input
                                            type="number"
                                            name="rating"
                                            max="5"
                                            min="1"
                                            className="form-control"
                                            value={formData.rating}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Modes</label>
                                    <input
                                        type="text"
                                        name="modes"
                                        className="form-control"
                                        value={formData.modes}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <button type="submit" className="submit-btn" disabled={!formData.title}>Save Course</button>
                            </div>
                        </div>
                    </form>
                </div>
            )}

            <div className="course-grid">
                {courses.map((course, index) => (
                    <div key={course.id} className="course-card" style={{ animationDelay: `${index * 0.1}s` }}>
                        <div className="card-floating-icon">
                            {course.image && <img src={course.image} alt="icon" />}
                        </div>

                        <div className="card-badge">
                            {course.duration}
                        </div>

                        <div className="card-stars">
                            {[...Array(course.rating || 5)].map((_, i) => <MdStar key={i} />)}
                        </div>

                        <h3 className="course-title">{course.title}</h3>

                        <div className="card-footer-box">
                            <p>{course.mode_text || course.modes}</p>
                            <p><strong>{course.placement_text || 'Placement Support'}</strong></p>
                        </div>

                        <div className="card-admin-actions">
                            <button className="action-btn edit" onClick={() => navigate(`/course-details/${course.id}`)}><MdEdit /> Edit/View</button>
                            <button className="action-btn delete" onClick={() => handleDelete(course.id)}><MdDelete /> Delete</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Course;
