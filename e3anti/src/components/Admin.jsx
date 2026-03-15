import React, { useState, useContext } from 'react';
import { SlideContext } from '../context/SlideContext';
import { useNavigate } from 'react-router-dom';
import './Admin.css';

const Admin = () => {
    const { slides, addSlide, removeSlide, resetSlides } = useContext(SlideContext);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: '',
        desc: '',
        bg: 'linear-gradient(135deg, #000000, #434343)',
        image: '',
        offsetX: 0,
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    let width = img.width;
                    let height = img.height;
                    const MAX_WIDTH = 800;
                    const MAX_HEIGHT = 800;

                    if (width > height) {
                        if (width > MAX_WIDTH) {
                            height *= MAX_WIDTH / width;
                            width = MAX_WIDTH;
                        }
                    } else {
                        if (height > MAX_HEIGHT) {
                            width *= MAX_HEIGHT / height;
                            height = MAX_HEIGHT;
                        }
                    }

                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);

                    // Compress to JPEG with 0.7 quality to save space
                    const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
                    setFormData(prev => ({ ...prev, image: dataUrl }));
                };
                img.src = event.target.result;
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.title || !formData.desc || !formData.image) {
            alert("Please fill all required fields");
            return;
        }

        addSlide({
            ...formData,
            offsetX: parseInt(formData.offsetX) || 0
        });

        // Reset form
        setFormData({
            title: '',
            desc: '',
            bg: 'linear-gradient(135deg, #000000, #434343)',
            image: '',
            offsetX: 0,
        });

        alert("Character added successfully!");
    };

    return (
        <div className="admin-container">
            <div className="admin-header">
                <h1>Admin Dashboard</h1>
                <button onClick={() => navigate('/')} className="back-btn">Back to Home</button>
            </div>

            <div className="admin-content">
                <div className="form-section">
                    <h2>Add New Character</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="input-group">
                            <label>Name (Title)</label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="e.g. IRON MAN"
                                required
                            />
                        </div>

                        <div className="input-group">
                            <label>Description</label>
                            <textarea
                                name="desc"
                                value={formData.desc}
                                onChange={handleChange}
                                placeholder="Character description..."
                                rows="4"
                                required
                            />
                        </div>

                        <div className="input-group">
                            <label>Background Gradient</label>
                            <input
                                type="text"
                                name="bg"
                                value={formData.bg}
                                onChange={handleChange}
                                placeholder="linear-gradient(...)"
                            />
                            <div className="color-preview" style={{ background: formData.bg }}></div>
                        </div>

                        <div className="input-group">
                            <label>Character Image</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                            />
                            {formData.image && (
                                <img src={formData.image} alt="Preview" className="image-preview" />
                            )}
                        </div>

                        <div className="input-group">
                            <label>Offset X (Position Adjustment)</label>
                            <input
                                type="number"
                                name="offsetX"
                                value={formData.offsetX}
                                onChange={handleChange}
                            />
                        </div>

                        <button type="submit" className="add-btn">Add Character</button>
                    </form>
                </div>

                <div className="list-section">
                    <div className="list-header">
                        <h2>Existing Characters ({slides.length})</h2>
                        <button onClick={resetSlides} className="reset-btn">Reset to Default</button>
                    </div>

                    <div className="slides-list">
                        {slides.map((slide, index) => (
                            <div key={index} className="slide-item">
                                <img src={slide.image} alt={slide.title} />
                                <div className="slide-info">
                                    <h3>{slide.title}</h3>
                                    <p>{slide.desc.substring(0, 50)}...</p>
                                </div>
                                <button onClick={() => removeSlide(index)} className="delete-btn">Delete</button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Admin;
