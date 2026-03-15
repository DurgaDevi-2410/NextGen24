import React, { useState, useEffect } from 'react';
import {
    MdAdd,
    MdDelete,
    MdArrowBack,
    MdPhotoLibrary,
    MdCloudUpload,
    MdEdit,
    MdCollections
} from 'react-icons/md';
import './Gallery.css';
import api from '../api/axios';

const Gallery = () => {
    // Helper to construct full image URL
    const getImageUrl = (path) => {
        if (!path) return null;
        if (path.startsWith('http')) return path;
        // Assuming backend runs on localhost:8000
        return `http://localhost:8000${path}`;
    };

    // view: 'overview' | 'detail'
    const [view, setView] = useState('overview');
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [events, setEvents] = useState([]);

    useEffect(() => {
        fetchCollections();
    }, []);

    const fetchCollections = async () => {
        try {
            const response = await api.get('gallery-categories/');
            setEvents(response.data);
        } catch (error) {
            console.error("Error fetching collections:", error);
        }
    };

    const handleOpenEvent = (event) => {
        setSelectedEvent(event);
        setView('detail');
    };

    const handleBack = () => {
        setView('overview');
        setSelectedEvent(null);
    };

    const handleDeleteEvent = async (e, id) => {
        e.stopPropagation();
        if (window.confirm("Delete this entire collection and all its photos?")) {
            try {
                await api.delete(`gallery-categories/${id}/`);
                fetchCollections();
            } catch (error) {
                console.error("Error deleting collection:", error);
            }
        }
    };

    const handleCreateEvent = async () => {
        const title = prompt("Enter Event/Collection Name:");
        if (title) {
            try {
                const formData = new FormData();
                formData.append('name', title.toUpperCase());
                // In a real app, you'd let them pick a cover image. 
                // For now, we'll send a placeholder or require one.
                await api.post('gallery-categories/', formData);
                fetchCollections();
            } catch (error) {
                console.error("Error creating collection:", error);
            }
        }
    };

    const handleAddPhotos = async (e) => {
        const files = e.target.files;
        if (files && selectedEvent && files.length > 0) {
            // Create upload promises
            const promises = Array.from(files).map(file => {
                const formData = new FormData();
                formData.append('category', selectedEvent.id);
                formData.append('url', file);
                formData.append('title', file.name);
                formData.append('item_type', 'image');
                return api.post('gallery-items/', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            });

            try {
                await Promise.all(promises);

                // Auto-set cover image if missing
                if (!selectedEvent.main_image) {
                    const coverData = new FormData();
                    coverData.append('main_image', files[0]);
                    try {
                        await api.patch(`gallery-categories/${selectedEvent.id}/`, coverData, {
                            headers: { 'Content-Type': 'multipart/form-data' }
                        });
                    } catch (err) {
                        console.error("Auto-cover failed", err);
                    }
                }

                // Refresh data
                const response = await api.get(`gallery-categories/${selectedEvent.id}/`);
                setSelectedEvent(response.data);
                fetchCollections();

                // Clear input to allow re-uploading same file
                e.target.value = null;

            } catch (error) {
                console.error("Error adding photos:", error);
                alert("Failed to upload photos. Check console for details.");
            }
        }
    };

    const handleRemovePhoto = async (itemId) => {
        if (window.confirm("Delete this photo?")) {
            try {
                await api.delete(`gallery-items/${itemId}/`);
                // Refresh detail view
                const response = await api.get(`gallery-categories/${selectedEvent.id}/`);
                setSelectedEvent(response.data);
                fetchCollections();
            } catch (error) {
                console.error("Error removing photo:", error);
            }
        }
    };

    return (
        <div className="gallery-admin-wrapper">
            {view === 'overview' ? (
                <div className="gallery-overview">
                    <div className="gallery-header">
                        <div className="header-info">
                            <h1>Gallery Management</h1>
                            <p>Organize your campus memories into collections and events</p>
                        </div>
                        <button className="create-event-btn" onClick={handleCreateEvent}>
                            <MdAdd /> Create New Collection
                        </button>
                    </div>

                    <div className="events-grid">
                        {events.map((event) => (
                            <div key={event.id} className="event-card" onClick={() => handleOpenEvent(event)}>
                                <div className="event-cover">
                                    {event.main_image ? (
                                        <img src={getImageUrl(event.main_image)} alt={event.name} />
                                    ) : (
                                        <div className="placeholder-cover">
                                            <MdPhotoLibrary size={48} color="#ccc" />
                                        </div>
                                    )}
                                    <div className="event-overlay">
                                        <span className="photo-count"><MdPhotoLibrary /> {event.items ? event.items.length : 0} Photos</span>
                                        <button className="event-delete-btn" onClick={(e) => handleDeleteEvent(e, event.id)}>
                                            <MdDelete />
                                        </button>
                                    </div>
                                </div>
                                <div className="event-info">
                                    <span className="event-type">Event</span>
                                    <h3 className="event-title">{event.name}</h3>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="gallery-detail">
                    <div className="detail-header">
                        <div className="header-left">
                            <button className="back-btn" onClick={handleBack}><MdArrowBack /></button>
                            <div>
                                <h2>{selectedEvent.name}</h2>
                                <p>{selectedEvent.items ? selectedEvent.items.length : 0} Photos in this collection</p>
                            </div>
                        </div>
                        <div className="header-actions">
                            <label className="upload-photos-btn">
                                <MdCloudUpload /> Add Photos
                                <input type="file" multiple accept="image/*" hidden onChange={handleAddPhotos} />
                            </label>
                            <button className="edit-collection-btn"><MdEdit /> Edit Title</button>
                        </div>
                    </div>

                    <div className="detail-grid">
                        {(!selectedEvent.items || selectedEvent.items.length === 0) ? (
                            <div className="empty-state">
                                <MdCollections />
                                <p>This collection is empty. Start adding some memories!</p>
                            </div>
                        ) : (
                            selectedEvent.items.map((item, idx) => (
                                <div key={item.id} className="photo-item">
                                    <img src={getImageUrl(item.url)} alt={`Gallery ${idx}`} />
                                    <button className="photo-delete-btn" onClick={() => handleRemovePhoto(item.id)}>
                                        <MdDelete />
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Gallery;
