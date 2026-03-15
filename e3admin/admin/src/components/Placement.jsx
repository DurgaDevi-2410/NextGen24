import React, { useState, useEffect } from 'react';
import './Placement.css';
import { MdAdd, MdDelete, MdEdit, MdCloudUpload } from 'react-icons/md';
import api from '../api/axios';

const Placement = () => {
    const [placements, setPlacements] = useState([]);
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        fetchPlacements();
    }, []);

    const fetchPlacements = async () => {
        try {
            const response = await api.get('placements/');
            setPlacements(response.data);
        } catch (error) {
            console.error("Error fetching placements:", error);
        }
    };

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        role: '',
        logo: null,
        logoPreview: null
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({
                ...formData,
                logo: file,
                logoPreview: URL.createObjectURL(file)
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        console.log('Form data:', formData);

        if (!formData.name || !formData.role || !formData.logo) {
            alert('Please fill in all fields and upload a logo');
            return;
        }

        const data = new FormData();
        data.append('company_name', formData.name);
        data.append('role', formData.role);
        data.append('logo', formData.logo);

        console.log('Sending placement data to backend...');
        console.log('Company Name:', formData.name);
        console.log('Role:', formData.role);
        console.log('Logo:', formData.logo);

        try {
            const response = await api.post('placements/', data, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log('Placement saved successfully:', response.data);
            alert('Placement added successfully!');
            fetchPlacements();
            setFormData({ name: '', role: '', logo: null, logoPreview: null });
            setShowForm(false);
        } catch (error) {
            console.error("Error saving placement:", error);
            console.error("Error response:", error.response?.data);
            console.error("Error status:", error.response?.status);
            alert(`Failed to save placement: ${error.response?.data?.detail || error.message}`);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure?")) return;
        try {
            await api.delete(`placements/${id}/`);
            fetchPlacements();
        } catch (error) {
            console.error("Error deleting placement:", error);
        }
    };

    return (
        <div className="placement-container">
            <div className="placement-header">
                <div>
                    <h2>Placement Management</h2>
                    <p>Manage student placement records and company partnerships</p>
                </div>
                <button className="add-btn" onClick={() => setShowForm(!showForm)}>
                    <MdAdd /> {showForm ? 'Close Form' : 'Add New Placement'}
                </button>
            </div>

            {showForm && (
                <div className="placement-form-card">
                    <h3>Add New Company</h3>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Company Name</label>
                            <input
                                type="text"
                                name="name"
                                placeholder="e.g. Google"
                                value={formData.name}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="form-group">
                            <label>Role / Description</label>
                            <input
                                type="text"
                                name="role"
                                placeholder="e.g. Software Engineer"
                                value={formData.role}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="form-group">
                            <label>Company Logo</label>
                            <div className="file-upload-wrapper">
                                <input
                                    type="file"
                                    accept="image/*"
                                    id="logo-upload"
                                    onChange={handleImageUpload}
                                    hidden
                                />
                                <label htmlFor="logo-upload" className="file-upload-label">
                                    <MdCloudUpload className="upload-icon" />
                                    {formData.logoPreview ? 'Image Selected' : 'Click to Upload Logo'}
                                </label>
                            </div>
                            {formData.logoPreview && <img src={formData.logoPreview} alt="Preview" className="logo-preview" />}
                        </div>

                        <button type="submit" className="submit-btn">Save Placement</button>
                    </form>
                </div >
            )}

            <div className="placement-grid">
                {placements.map((item) => (
                    <div key={item.id} className="placement-card">
                        <div className="card-actions">
                            <button className="icon-btn delete" onClick={() => handleDelete(item.id)}><MdDelete /></button>
                        </div>
                        <div className="card-image">
                            <img src={item.logo} alt={item.company_name} />
                        </div>
                        <div className="card-info">
                            <h4>{item.company_name}</h4>
                            <p>{item.role}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div >
    );
};

export default Placement;
