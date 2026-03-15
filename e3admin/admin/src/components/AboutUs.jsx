import React, { useState, useEffect } from 'react';
import { MdEdit, MdSave, MdCloudUpload, MdAdd, MdDelete, MdInfo, MdTrackChanges, MdInsertChart, MdStar } from 'react-icons/md';
import './AboutUs.css';
import api from '../api/axios';

const AboutUs = () => {
    const [activeTab, setActiveTab] = useState('hero');

    // Hero Section State
    const [heroData, setHeroData] = useState({
        heading: "Keeps Going And<br /><span style='color: #d11e1e'>Going And Going</span>",
        quote: "Success is not the key to happiness. Happiness is the key to success. If you love what you are doing, you will be successful.",
        author: "Albert Schweitzer",
        carouselImages: []
    });

    // Who We Are Section State
    const [whoWeAre, setWhoWeAre] = useState({
        subtitle: "WHO WE ARE",
        heading: "Driven by <span class='highlight-maroon'>Purpose</span>",
        description: "We are a team of visionaries dedicated to redefining standards. Our journey is fueled by passion and a relentless pursuit of excellence. Every project is a canvas, and we paint it with innovation.",
        images: []
    });

    // Stats Section State
    const [statsData, setStatsData] = useState({
        heading: "Number that<br />Guarantee Success",
        description: "The success of an influencer marketing campaign ultimately depends on the brand's specific goals and how well the campaign aligns with those goals",
        stats: [
            { id: 1, label: "Influencers<br />from<br />Instagram", value: "120M+", iconColor: "#E1306C" },
            { id: 2, label: "Creators<br />on<br />our database", value: "380M+", iconColor: "#e31e24" },
            { id: 3, label: "Influencers<br />from<br />YouTube", value: "100M+", iconColor: "#FF0000" }
        ]
    });

    // Mission & Vision State
    const [missionVision, setMissionVision] = useState({
        subtitle: "OUR MISSION",
        heading: "Crafting the <span class='highlight-maroon'>Future</span>",
        description: "We don't just follow trends; we set them. Our mission is to empower businesses with tools that stand the test of time. Join us in building a legacy of quality and integrity.",
        image: ""
    });

    const handleHeroChange = (e) => {
        const { name, value } = e.target;
        setHeroData(prev => ({ ...prev, [name]: value }));
    };

    const handleWhoWeAreChange = (e) => {
        const { name, value } = e.target;
        setWhoWeAre(prev => ({ ...prev, [name]: value }));
    };

    const handleMissionChange = (e) => {
        const { name, value } = e.target;
        setMissionVision(prev => ({ ...prev, [name]: value }));
    };

    const handleStatChange = (id, field, value) => {
        setStatsData(prev => ({
            ...prev,
            stats: prev.stats.map(s => s.id === id ? { ...s, [field]: value } : s)
        }));
    };

    useEffect(() => {
        fetchAboutContent();
    }, []);

    const fetchAboutContent = async () => {
        try {
            const response = await api.get('about-content/');
            response.data.forEach(item => {
                if (item.section_name === 'hero') setHeroData(item.data);
                if (item.section_name === 'who-we-are') setWhoWeAre(item.data);
                if (item.section_name === 'stats') setStatsData(item.data);
                if (item.section_name === 'mission') setMissionVision(item.data);
            });
        } catch (error) {
            console.error("Error fetching about content:", error);
        }
    };

    const handleSave = async (sectionKey) => {
        if (sectionKey === 'All') {
            await handleSave('Hero');
            await handleSave('Who We Are');
            await handleSave('Stats');
            await handleSave('Mission');
            return;
        }

        let sectionName = '';
        let sectionData = {};

        if (sectionKey === 'Hero') { sectionName = 'hero'; sectionData = heroData; }
        if (sectionKey === 'Who We Are') { sectionName = 'who-we-are'; sectionData = whoWeAre; }
        if (sectionKey === 'Stats') { sectionName = 'stats'; sectionData = statsData; }
        if (sectionKey === 'Mission') { sectionName = 'mission'; sectionData = missionVision; }

        try {
            await api.post('about-content/', { section_name: sectionName, data: sectionData });
            alert(`${sectionKey} saved successfully!`);
            fetchAboutContent(); // Refresh data after save
        } catch (error) {
            console.error("Error saving about content:", error);
            alert(`Error saving ${sectionKey}. Please try again.`);
        }
    };

    // Handle image file upload
    const handleImageUpload = async (e, section, index = null) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await api.post('media-assets/', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            console.log('Upload response:', response.data);

            // Use the full URL returned from the serializer
            const imageUrl = response.data.file;

            console.log('Image URL:', imageUrl);

            if (!imageUrl) {
                throw new Error('No image URL returned from server');
            }

            if (section === 'hero') {
                if (index !== null) {
                    const newImages = [...heroData.carouselImages];
                    newImages[index] = imageUrl;
                    setHeroData({ ...heroData, carouselImages: newImages });
                } else {
                    setHeroData({ ...heroData, carouselImages: [...heroData.carouselImages, imageUrl] });
                }
            } else if (section === 'who-we-are') {
                if (index !== null) {
                    const newImages = [...whoWeAre.images];
                    newImages[index] = imageUrl;
                    setWhoWeAre({ ...whoWeAre, images: newImages });
                } else {
                    setWhoWeAre({ ...whoWeAre, images: [...whoWeAre.images, imageUrl] });
                }
            } else if (section === 'mission') {
                setMissionVision({ ...missionVision, image: imageUrl });
            }

            alert('Image uploaded successfully! URL: ' + imageUrl);
        } catch (error) {
            console.error("Error uploading image:", error);
            console.error("Error response:", error.response?.data);
            alert("Failed to upload image. Check console for details.");
        }
    };

    return (
        <div className="about-admin-wrapper">
            <div className="about-header">
                <div className="header-info">
                    <h1>About Us Page Management</h1>
                    <p>Customize the content and visuals of your About Us page</p>
                </div>
                <div className="header-actions">
                    <button className="save-all-btn" onClick={() => handleSave('All')}>Save All Changes</button>
                </div>
            </div>

            <div className="about-tabs-container">
                <div className="about-tabs-sidebar">
                    <button
                        className={`tab-link ${activeTab === 'hero' ? 'active' : ''}`}
                        onClick={() => setActiveTab('hero')}
                    >
                        <MdStar className="tab-icon" />
                        <span>Hero Section</span>
                    </button>
                    <button
                        className={`tab-link ${activeTab === 'who-we-are' ? 'active' : ''}`}
                        onClick={() => setActiveTab('who-we-are')}
                    >
                        <MdInfo className="tab-icon" />
                        <span>Who We Are</span>
                    </button>
                    <button
                        className={`tab-link ${activeTab === 'stats' ? 'active' : ''}`}
                        onClick={() => setActiveTab('stats')}
                    >
                        <MdInsertChart className="tab-icon" />
                        <span>Statistics</span>
                    </button>
                    <button
                        className={`tab-link ${activeTab === 'mission' ? 'active' : ''}`}
                        onClick={() => setActiveTab('mission')}
                    >
                        <MdTrackChanges className="tab-icon" />
                        <span>Mission & Vision</span>
                    </button>
                </div>

                <div className="about-tabs-content">
                    {/* Hero Section Tab */}
                    {activeTab === 'hero' && (
                        <div className="tab-pane">
                            <div className="pane-header">
                                <h3>Hero Section Settings</h3>
                                <button className="pane-save-btn" onClick={() => handleSave('Hero')}><MdSave /> Save</button>
                            </div>
                            <div className="form-grid">
                                <div className="form-group full-width">
                                    <label>Main Heading (HTML allowed)</label>
                                    <input
                                        type="text"
                                        name="heading"
                                        value={heroData.heading}
                                        onChange={handleHeroChange}
                                        placeholder="Enter main heading"
                                    />
                                </div>
                                <div className="form-group full-width">
                                    <label>Quote Text</label>
                                    <textarea
                                        name="quote"
                                        value={heroData.quote}
                                        onChange={handleHeroChange}
                                        placeholder="Enter quote"
                                        rows="3"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Quote Author</label>
                                    <input
                                        type="text"
                                        name="author"
                                        value={heroData.author}
                                        onChange={handleHeroChange}
                                        placeholder="Enter author name"
                                    />
                                </div>
                                <div className="form-group full-width">
                                    <label>Hero Carousel Images</label>
                                    <div className="images-list">
                                        {heroData.carouselImages && heroData.carouselImages.map((img, idx) => (
                                            <div key={idx} className="image-item">
                                                <img src={img} alt={`Preview ${idx}`} style={{ width: '100px', height: '100px', objectFit: 'cover' }} />
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={(e) => handleImageUpload(e, 'hero', idx)}
                                                    style={{ display: 'none' }}
                                                    id={`hero-img-${idx}`}
                                                />
                                                <label htmlFor={`hero-img-${idx}`} className="upload-btn-small">
                                                    <MdCloudUpload /> Change
                                                </label>
                                                <button className="delete-img" onClick={() => {
                                                    const newImgs = heroData.carouselImages.filter((_, i) => i !== idx);
                                                    setHeroData({ ...heroData, carouselImages: newImgs });
                                                }}><MdDelete /></button>
                                            </div>
                                        ))}
                                        <div className="add-image-card">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => handleImageUpload(e, 'hero')}
                                                style={{ display: 'none' }}
                                                id="hero-add-img"
                                            />
                                            <label htmlFor="hero-add-img" style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                                <MdAdd />
                                                <span>Add Carousel Image</span>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Who We Are Tab */}
                    {activeTab === 'who-we-are' && (
                        <div className="tab-pane">
                            <div className="pane-header">
                                <h3>Who We Are Settings</h3>
                                <button className="pane-save-btn" onClick={() => handleSave('Who We Are')}><MdSave /> Save</button>
                            </div>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label>Section Subtitle</label>
                                    <input
                                        type="text"
                                        name="subtitle"
                                        value={whoWeAre.subtitle}
                                        onChange={handleWhoWeAreChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Main Heading (HTML allowed)</label>
                                    <input
                                        type="text"
                                        name="heading"
                                        value={whoWeAre.heading}
                                        onChange={handleWhoWeAreChange}
                                    />
                                </div>
                                <div className="form-group full-width">
                                    <label>Description Text</label>
                                    <textarea
                                        name="description"
                                        value={whoWeAre.description}
                                        onChange={handleWhoWeAreChange}
                                        rows="4"
                                    />
                                </div>
                                <div className="form-group full-width">
                                    <label>Section Images (Upload from your files)</label>
                                    <div className="images-list">
                                        {whoWeAre.images && whoWeAre.images.map((img, idx) => (
                                            <div key={idx} className="image-item">
                                                <img src={img} alt={`Preview ${idx}`} style={{ width: '100px', height: '100px', objectFit: 'cover' }} />
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={(e) => handleImageUpload(e, 'who-we-are', idx)}
                                                    style={{ display: 'none' }}
                                                    id={`who-img-${idx}`}
                                                />
                                                <label htmlFor={`who-img-${idx}`} className="upload-btn-small">
                                                    <MdCloudUpload /> Change
                                                </label>
                                                <button className="delete-img" onClick={() => {
                                                    const newImgs = whoWeAre.images.filter((_, i) => i !== idx);
                                                    setWhoWeAre({ ...whoWeAre, images: newImgs });
                                                }}><MdDelete /></button>
                                            </div>
                                        ))}
                                        <div className="add-image-card">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => handleImageUpload(e, 'who-we-are')}
                                                style={{ display: 'none' }}
                                                id="who-add-img"
                                            />
                                            <label htmlFor="who-add-img" style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                                <MdAdd />
                                                <span>Upload Image</span>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Stats Tab */}
                    {activeTab === 'stats' && (
                        <div className="tab-pane">
                            <div className="pane-header">
                                <h3>Statistics Settings</h3>
                                <button className="pane-save-btn" onClick={() => handleSave('Stats')}><MdSave /> Save</button>
                            </div>
                            <div className="form-grid">
                                <div className="form-group full-width">
                                    <label>Section Heading (HTML allowed)</label>
                                    <input
                                        type="text"
                                        value={statsData.heading}
                                        onChange={(e) => setStatsData({ ...statsData, heading: e.target.value })}
                                    />
                                </div>
                                <div className="form-group full-width">
                                    <label>Section Description</label>
                                    <textarea
                                        value={statsData.description}
                                        onChange={(e) => setStatsData({ ...statsData, description: e.target.value })}
                                        rows="2"
                                    />
                                </div>
                                <div className="stats-list-admin">
                                    {statsData.stats.map(stat => (
                                        <div key={stat.id} className="stat-edit-card">
                                            <div className="stat-edit-group">
                                                <label>Counter Value</label>
                                                <input
                                                    type="text"
                                                    value={stat.value}
                                                    onChange={(e) => handleStatChange(stat.id, 'value', e.target.value)}
                                                />
                                            </div>
                                            <div className="stat-edit-group">
                                                <label>Label (HTML allowed)</label>
                                                <input
                                                    type="text"
                                                    value={stat.label}
                                                    onChange={(e) => handleStatChange(stat.id, 'label', e.target.value)}
                                                />
                                            </div>
                                            <div className="stat-edit-group">
                                                <label>Theme Color</label>
                                                <input
                                                    type="color"
                                                    value={stat.iconColor}
                                                    onChange={(e) => handleStatChange(stat.id, 'iconColor', e.target.value)}
                                                />
                                            </div>
                                            <button className="delete-stat-btn" onClick={() => {
                                                const newStats = statsData.stats.filter(s => s.id !== stat.id);
                                                setStatsData({ ...statsData, stats: newStats });
                                            }}><MdDelete /></button>
                                        </div>
                                    ))}
                                    <button className="add-stat-btn" onClick={() => {
                                        const newId = statsData.stats.length > 0 ? Math.max(...statsData.stats.map(s => s.id)) + 1 : 1;
                                        setStatsData({
                                            ...statsData,
                                            stats: [...statsData.stats, { id: newId, label: 'New Stat', value: '0', iconColor: '#000000' }]
                                        });
                                    }}><MdAdd /> Add New Counter</button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Mission & Vision Tab */}
                    {activeTab === 'mission' && (
                        <div className="tab-pane">
                            <div className="pane-header">
                                <h3>Mission & Vision Settings</h3>
                                <button className="pane-save-btn" onClick={() => handleSave('Mission')}><MdSave /> Save</button>
                            </div>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label>Section Subtitle</label>
                                    <input
                                        type="text"
                                        name="subtitle"
                                        value={missionVision.subtitle}
                                        onChange={handleMissionChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Section Heading (HTML allowed)</label>
                                    <input
                                        type="text"
                                        name="heading"
                                        value={missionVision.heading}
                                        onChange={handleMissionChange}
                                    />
                                </div>
                                <div className="form-group full-width">
                                    <label>Description Text</label>
                                    <textarea
                                        name="description"
                                        value={missionVision.description}
                                        onChange={handleMissionChange}
                                        rows="4"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Mission Image (Upload from your files)</label>
                                    <div className="image-upload-wrapper">
                                        {missionVision.image && (
                                            <img src={missionVision.image} alt="Mission Preview" className="preview-img" style={{ marginBottom: '10px', maxWidth: '200px' }} />
                                        )}
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => handleImageUpload(e, 'mission')}
                                            style={{ display: 'none' }}
                                            id="mission-img"
                                        />
                                        <label htmlFor="mission-img" className="upload-btn">
                                            <MdCloudUpload /> {missionVision.image ? 'Change Image' : 'Upload Image'}
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AboutUs;
