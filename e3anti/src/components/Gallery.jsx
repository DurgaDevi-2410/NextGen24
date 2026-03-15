import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Container } from 'react-bootstrap';
import './Gallery.css';
import api from '../api/axios';

const Gallery = () => {
    const [galleryCategories, setGalleryCategories] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [activeCategory, setActiveCategory] = useState(null);
    const [selectedItem, setSelectedItem] = useState(null);
    const [isMobile, setIsMobile] = useState(false);
    const [loading, setLoading] = useState(true);

    const getImageUrl = (path) => {
        if (!path) return '';
        if (path.startsWith('http')) return path;
        return `http://localhost:8000${path}`;
    };

    useEffect(() => {
        const fetchGallery = async () => {
            try {
                const response = await api.get('gallery-categories/');

                const transformed = response.data.map(cat => ({
                    id: cat.id,
                    name: cat.name,
                    mainImage: getImageUrl(cat.main_image),
                    description: cat.description,
                    items: cat.items?.map(item => ({
                        type: item.item_type,
                        url: getImageUrl(item.url),
                        thumb: item.thumbnail ? getImageUrl(item.thumbnail) : null,
                        title: item.title,
                        description: item.description // In case added later
                    })) || []
                }));

                setGalleryCategories(transformed);
            } catch (error) {
                console.error("Error fetching gallery:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchGallery();
    }, []);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const nextCategory = () => {
        if (galleryCategories.length === 0) return;
        setCurrentIndex((prev) => (prev + 1) % galleryCategories.length);
    };

    const prevCategory = () => {
        if (galleryCategories.length === 0) return;
        setCurrentIndex((prev) => (prev - 1 + galleryCategories.length) % galleryCategories.length);
    };

    // Autoplay for carousel
    useEffect(() => {
        if (activeCategory || selectedItem || galleryCategories.length === 0) return;
        const interval = setInterval(nextCategory, 5000);
        return () => clearInterval(interval);
    }, [currentIndex, activeCategory, selectedItem, galleryCategories.length]);

    const handleNextItem = (e) => {
        if (e) e.stopPropagation();
        if (!activeCategory || !selectedItem) return;
        const newIndex = (selectedItem.index + 1) % activeCategory.items.length;
        const newItem = activeCategory.items[newIndex];
        setSelectedItem({ ...newItem, index: newIndex, categoryName: activeCategory.name });
    };

    const handlePrevItem = (e) => {
        if (e) e.stopPropagation();
        if (!activeCategory || !selectedItem) return;
        const newIndex = (selectedItem.index - 1 + activeCategory.items.length) % activeCategory.items.length;
        const newItem = activeCategory.items[newIndex];
        setSelectedItem({ ...newItem, index: newIndex, categoryName: activeCategory.name });
    };

    // Responsive configuration
    const cardSpacing = isMobile ? 160 : 260;
    const visibleRange = isMobile ? 1 : 2;

    if (loading) {
        return (
            <section className="gallery-section d-flex align-items-center justify-content-center" style={{ minHeight: '400px' }}>
                <div className="text-center">
                    <div className="spinner-border text-danger" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="gallery-section">
            <Container fluid className="gallery-container">
                <div className="gallery-header-container text-center mb-5">
                    <motion.h1
                        className="gallery-title"
                        initial={{ opacity: 0, y: -20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        Our Gallery
                    </motion.h1>
                    <motion.p
                        className="gallery-subtitle"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        A visual journey through our cultural celebrations and achievements.
                    </motion.p>
                </div>

                {/* 3D LAYERED CAROUSEL */}
                <div className="carousel-3d-viewport">
                    <div className="carousel-3d-container">
                        <AnimatePresence mode="popLayout">
                            {galleryCategories.map((cat, index) => {
                                let position = index - currentIndex;
                                if (position < -2) position += galleryCategories.length;
                                if (position > 2) position -= galleryCategories.length;

                                // Limit visible items based on screen size
                                if (Math.abs(position) > visibleRange) return null;

                                return (
                                    <motion.div
                                        key={cat.id}
                                        className={`carousel-card ${position === 0 ? 'active' : ''}`}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{
                                            x: position * cardSpacing,
                                            scale: position === 0 ? 1 : (Math.abs(position) === 1 ? 0.8 : 0.6),
                                            rotateY: 0,
                                            z: position === 0 ? 0 : -100 * Math.abs(position),
                                            opacity: position === 0 ? 1 : (Math.abs(position) === 1 ? 0.6 : 0.3),
                                            zIndex: 10 - Math.abs(position)
                                        }}
                                        exit={{ opacity: 0, scale: 0.5 }}
                                        transition={{ type: "spring", stiffness: 100, damping: 20 }}
                                        onClick={() => position === 0 ? setActiveCategory(cat) : setCurrentIndex(index)}
                                    >
                                        <div className="card-inner">
                                            <div className="card-image-box">
                                                <img
                                                    src={cat.mainImage || 'https://via.placeholder.com/600x400?text=Event+Collection'}
                                                    alt={cat.name}
                                                    onError={(e) => { e.target.src = 'https://via.placeholder.com/500x300?text=No+Image' }}
                                                />
                                                <div className="card-overlay-mask"></div>
                                            </div>
                                            <div className="card-content-overlay">
                                                <h3 className="category-label">EVENT</h3>
                                                <h2 className="category-name">{cat.name}</h2>
                                                <motion.button
                                                    className="explore-btn"
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                >
                                                    View Collection
                                                </motion.button>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </div>

                    {galleryCategories.length === 0 && !loading && (
                        <div className="no-gallery-message">
                            <p>No gallery categories found. Add some categories and images from the admin panel!</p>
                        </div>
                    )}

                    {galleryCategories.length > 0 && (
                        <div className="carousel-controls">
                            <div className="nav-indicators">
                                {galleryCategories.map((_, i) => (
                                    <div
                                        key={i}
                                        className={`indicator-dot ${currentIndex === i ? 'active' : ''}`}
                                        onClick={() => setCurrentIndex(i)}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* INTERACTION: DYNAMIC PANEL SLIDE-UP */}
                <AnimatePresence>
                    {activeCategory && (
                        <>
                            <motion.div
                                className="panel-overlay"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setActiveCategory(null)}
                            />
                            <motion.div
                                className="related-images-panel"
                                initial={{ y: '100%' }}
                                animate={{ y: 0 }}
                                exit={{ y: '100%' }}
                                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            >
                                <div className="panel-header">
                                    <div className="panel-drag-handle" />
                                    <div className="panel-info">
                                        <h4 className="panel-category">{activeCategory.name}</h4>
                                        <p className="panel-count">{activeCategory.items.length} Memories</p>
                                    </div>
                                    <button className="panel-close" onClick={() => setActiveCategory(null)}>
                                        <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2.5" fill="none"><path d="M18 6L6 18M6 6l12 12" /></svg>
                                    </button>
                                </div>
                                <div className="panel-grid-container">
                                    <div className="panel-grid">
                                        {activeCategory.items.map((item, idx) => (
                                            <motion.div
                                                key={idx}
                                                className="panel-item"
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: idx * 0.05 }}
                                                whileHover={{ y: -10, scale: 1.02 }}
                                                onClick={() => setSelectedItem({ ...item, index: idx, categoryName: activeCategory.name })}
                                            >
                                                {/* If video, show thumbnail */}
                                                <img
                                                    src={item.type === 'video' ? (item.thumb || item.url) : item.url}
                                                    alt={item.title}
                                                    onError={(e) => { e.target.src = 'https://via.placeholder.com/300x200?text=Error' }}
                                                />

                                                {/* Play Icon for Videos */}
                                                {item.type === 'video' && (
                                                    <div className="video-indicator">
                                                        <svg viewBox="0 0 24 24" width="40" height="40" fill="white"><path d="M8 5v14l11-7z" /></svg>
                                                    </div>
                                                )}

                                                <div className="item-overlay">
                                                    {item.type === 'video' ?
                                                        <svg viewBox="0 0 24 24" width="32" height="32" fill="white"><path d="M8 5v14l11-7z" /></svg> :
                                                        <svg viewBox="0 0 24 24" width="32" height="32" fill="white"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" /></svg>
                                                    }
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>

                {/* VIEWER: FULLSCREEN MODAL WITH BLUR */}
                <AnimatePresence>
                    {selectedItem && (
                        <motion.div
                            className="zoom-viewer-overlay"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedItem(null)}
                        >
                            <button
                                className="viewer-nav prev"
                                onClick={handlePrevItem}
                            >
                                <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" /></svg>
                            </button>

                            <motion.div
                                className="viewer-content"
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                transition={{ type: "spring", damping: 30, stiffness: 200 }}
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="viewer-image-wrapper">
                                    {selectedItem.type === 'video' ? (
                                        <video
                                            controls
                                            autoPlay
                                            className="viewer-video-player"
                                            src={selectedItem.url}
                                        >
                                            Your browser does not support the video tag.
                                        </video>
                                    ) : (
                                        <motion.img
                                            key={selectedItem.url}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ duration: 0.3 }}
                                            src={selectedItem.url}
                                            alt={selectedItem.title}
                                        />
                                    )}

                                    <div className="viewer-info-badge">
                                        <h3>{selectedItem.title?.replace(/\.[^/.]+$/, "") || "Memories"}</h3>
                                        <p>{selectedItem.categoryName} • {selectedItem.index + 1} of {activeCategory.items.length}</p>
                                    </div>
                                </div>
                                <button className="viewer-close" onClick={() => setSelectedItem(null)}>
                                    <svg viewBox="0 0 24 24" width="36" height="36" stroke="currentColor" strokeWidth="2.5" fill="none"><path d="M18 6L6 18M6 6l12 12" /></svg>
                                </button>
                            </motion.div>

                            <button
                                className="viewer-nav next"
                                onClick={handleNextItem}
                            >
                                <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" /></svg>
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </Container>
        </section>
    );
};

export default Gallery;

