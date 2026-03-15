import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './CourseDetails.css';
import { MdCheckCircle, MdArrowBack, MdCloudUpload } from 'react-icons/md';
import api from '../api/axios';

const CourseDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('description');
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);

    const [courseData, setCourseData] = useState({
        title: "",
        description: "",
        objective: "",
        image: null, // Current image URL
        newImage: null, // New file to upload
        features: {
            duration: "",
            mode_text: "",
            placement_text: "",
            // learnFrom: "Certified Professionals" // Can be hardcoded or added to model if needed
        },
        topics: [],
        scope: "",
        projects: []
    });
    const [imagePreview, setImagePreview] = useState(null);

    useEffect(() => {
        if (id) {
            fetchCourseDetails();
        }
    }, [id]);

    const fetchCourseDetails = async () => {
        try {
            const response = await api.get(`courses/${id}/`);
            const data = response.data;

            // Map backend data to UI state
            setCourseData({
                title: data.title,
                description: data.description,
                objective: data.objective || "",
                image: data.image,
                newImage: null,
                features: {
                    duration: data.duration,
                    mode_text: data.mode_text, // Mapping backend fields
                    placement_text: data.placement_text,
                },
                topics: Array.isArray(data.topics) ? data.topics : [], // Handle JSONField list
                scope: data.scope || "",
                projects: Array.isArray(data.projects) ? data.projects : []
            });
            setImagePreview(data.image);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching course details:", error);
            setLoading(false);
        }
    };

    const handleDataChange = (field, value, subfield = null) => {
        if (subfield) {
            setCourseData({
                ...courseData,
                features: { ...courseData.features, [subfield]: value }
            });
        } else {
            setCourseData({ ...courseData, [field]: value });
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setCourseData({ ...courseData, newImage: file });
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleListChange = (field, index, value) => {
        const newList = [...courseData[field]];
        newList[index] = value;
        setCourseData({ ...courseData, [field]: newList });
    };

    const addListItem = (field) => {
        setCourseData({ ...courseData, [field]: [...courseData[field], "New Item"] });
    };

    const removeListItem = (field, index) => {
        const newList = courseData[field].filter((_, i) => i !== index);
        setCourseData({ ...courseData, [field]: newList });
    };

    const saveChanges = async () => {
        try {
            const formData = new FormData();
            formData.append('title', courseData.title);
            formData.append('description', courseData.description);
            formData.append('objective', courseData.objective);
            formData.append('duration', courseData.features.duration);
            formData.append('mode_text', courseData.features.mode_text);
            formData.append('placement_text', courseData.features.placement_text);
            formData.append('scope', courseData.scope);

            // Append lists properly
            courseData.topics.forEach(topic => formData.append('topics', topic));
            courseData.projects.forEach(project => formData.append('projects', project));

            // Append Image if new one exists
            if (courseData.newImage) {
                formData.append('image', courseData.newImage);
            }

            // Note: If your backend expects 'topics' and 'projects' as JSON strings for FormData,
            // you might need to use JSON.stringify(courseData.topics).
            // However, usually DRF handles list of values if configured, or React sends repeat keys.
            // Let's assume backend handles repeated keys or modify to JSON if needed.
            // If backend is using JSONField and standard FormParser, it handles it differently.
            // Safe bet: Send as JSON string for complex fields if simple FormData fails, 
            // BUT previous code sent JSON payload. 
            // Combining JSON + Files usually requires 'multipart/form-data'.
            // Let's try sending everything as FormData. If topics/projects fail, we fix that.
            // Actually, for JSONField in DRF with FormData, you often need to send JSON string.
            // Let's check api.patch.

            // Since we are changing to FormData, let's format the lists as strings if they are JSONFields
            // or rely on the backend. Given the previous code sent a JSON Object, the backend likely expects JSON.
            // To upload a file with JSON data, the headers need content-type multipart/form-data.

            // Alternative: Send 'topics' as a stringified JSON if it's a single field in DB.
            formData.append('topics', JSON.stringify(courseData.topics));
            formData.append('projects', JSON.stringify(courseData.projects));


            await api.patch(`courses/${id}/`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            setIsEditing(false);
            alert("Course details updated successfully!");
        } catch (error) {
            console.error("Error saving course details:", error);
            alert("Failed to save changes.");
        }
    };

    const menuItems = [
        { id: 'description', label: 'Course Description' },
        { id: 'topics', label: 'Key Topics Covered' },
        { id: 'scope', label: 'Scope & Career Opportunities' },
        { id: 'projects', label: 'Real Time Projects' }
    ];

    const renderContent = () => {
        if (loading) return <div>Loading...</div>;

        if (isEditing) {
            switch (activeTab) {
                case 'description':
                    return (
                        <div className="edit-form fade-in">
                            <div className="form-upload-section">
                                <label>Course Image</label>
                                <div className="image-preview-box">
                                    {imagePreview ? (
                                        <img src={imagePreview} alt="Preview" />
                                    ) : (
                                        <div style={{ color: '#aaa' }}>No Image</div>
                                    )}
                                </div>
                                <label className="upload-label-btn">
                                    <MdCloudUpload size={20} />
                                    Upload New Image
                                    <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
                                </label>
                            </div>

                            <label>Course Title</label>
                            <input value={courseData.title} onChange={(e) => handleDataChange('title', e.target.value)} />
                            <label>Description</label>
                            <textarea value={courseData.description} onChange={(e) => handleDataChange('description', e.target.value)} rows="6" />
                            <label>Objective</label>
                            <textarea value={courseData.objective} onChange={(e) => handleDataChange('objective', e.target.value)} rows="3" />
                        </div>
                    );
                case 'topics':
                    return (
                        <div className="edit-form fade-in">
                            <h3>Edit Topics</h3>
                            {courseData.topics.map((topic, index) => (
                                <div key={index} className="edit-list-item">
                                    <input value={topic} onChange={(e) => handleListChange('topics', index, e.target.value)} />
                                    <button onClick={() => removeListItem('topics', index)} className="remove-btn">×</button>
                                </div>
                            ))}
                            <button onClick={() => addListItem('topics')} className="add-list-btn">+ Add Topic</button>
                        </div>
                    );
                case 'scope':
                    return (
                        <div className="edit-form fade-in">
                            <label>Scope & Career Details</label>
                            <textarea value={courseData.scope} onChange={(e) => handleDataChange('scope', e.target.value)} rows="6" />
                        </div>
                    );
                case 'projects':
                    return (
                        <div className="edit-form fade-in">
                            <h3>Edit Projects</h3>
                            {courseData.projects.map((project, index) => (
                                <div key={index} className="edit-list-item">
                                    <input value={project} onChange={(e) => handleListChange('projects', index, e.target.value)} />
                                    <button onClick={() => removeListItem('projects', index)} className="remove-btn">×</button>
                                </div>
                            ))}
                            <button onClick={() => addListItem('projects')} className="add-list-btn">+ Add Project</button>
                        </div>
                    );
                default: return null;
            }
        }

        switch (activeTab) {
            case 'description':
                return (
                    <div className="tab-content fade-in">
                        {courseData.image && (
                            <div className="course-detail-image-box" style={{ marginBottom: '20px', borderRadius: '12px', overflow: 'hidden', maxHeight: '300px' }}>
                                <img src={courseData.image} alt={courseData.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>
                        )}
                        <h3>{courseData.title}</h3>
                        <p>{courseData.description || "No description available."}</p>
                        {courseData.objective && (
                            <>
                                <h4>Course Objective</h4>
                                <p>{courseData.objective}</p>
                            </>
                        )}
                    </div>
                );
            case 'topics':
                return (
                    <div className="tab-content fade-in">
                        <h3>Key Topics Covered</h3>
                        {courseData.topics.length > 0 ? (
                            <ul className="topic-list">
                                {courseData.topics.map((topic, index) => (
                                    <li key={index}><MdCheckCircle className="check-icon" /> {topic}</li>
                                ))}
                            </ul>
                        ) : <p>No topics listed.</p>}
                    </div>
                );
            case 'scope':
                return (
                    <div className="tab-content fade-in">
                        <h3>Scope & Career Opportunities</h3>
                        <p>{courseData.scope || "No scope details available."}</p>
                    </div>
                );
            case 'projects':
                return (
                    <div className="tab-content fade-in">
                        <h3>Real Time Projects</h3>
                        {courseData.projects.length > 0 ? (
                            <ul className="project-list">
                                {courseData.projects.map((project, index) => (
                                    <li key={index}><MdCheckCircle className="check-icon" /> {project}</li>
                                ))}
                            </ul>
                        ) : <p>No projects listed.</p>}
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="course-details-page">
            <div className="page-top-actions">
                <button className="back-btn" onClick={() => navigate('/course')}>
                    <div className="back-icon-circle">
                        <MdArrowBack />
                    </div>

                </button>
                {isEditing ? (
                    <button className="edit-toggle-btn saving" onClick={saveChanges}>
                        Save Changes
                    </button>
                ) : (
                    <button className="edit-toggle-btn" onClick={() => setIsEditing(true)}>
                        Edit Page Content
                    </button>
                )}
            </div>

            <div className="course-details-layout">
                <div className="course-main-section">
                    <div className="details-header">
                        <h2>{courseData.title}</h2>
                    </div>

                    <div className="tabs-wrapper">
                        <div className="tabs-container">
                            {menuItems.map((item) => (
                                <button
                                    key={item.id}
                                    className={`tab-btn ${activeTab === item.id ? 'active' : ''}`}
                                    onClick={() => setActiveTab(item.id)}
                                >
                                    {item.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="content-display-area">
                        {renderContent()}
                    </div>
                </div>

                {/* Sidebar Features Section */}
                <div className="course-features-sidebar">
                    <div className="features-card">
                        <h3>Course Features</h3>
                        <div className="features-list">
                            {Object.entries(courseData.features).map(([key, value]) => (
                                <div className="feature-item" key={key}>
                                    <span>{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:</span>
                                    {isEditing ? (
                                        <input
                                            value={value}
                                            onChange={(e) => handleDataChange('features', e.target.value, key)}
                                            className="feature-edit"
                                        />
                                    ) : (
                                        <strong>{value}</strong>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseDetails;
