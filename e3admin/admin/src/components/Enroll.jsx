import React, { useState, useEffect } from 'react';
import './Enroll.css';
import { MdAdd, MdDelete, MdEdit, MdVisibility, MdSearch, MdFilterList, MdArrowBack, MdClose, MdCheckCircle } from 'react-icons/md';
import api from '../api/axios';

const Enroll = () => {
    const [view, setView] = useState('list'); // 'list', 'form', 'details'
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');
    const [editMode, setEditMode] = useState(false);

    // Data State
    const [enrollments, setEnrollments] = useState([]);
    const [loading, setLoading] = useState(true);

    // Form State (Aligned with backend fields where possible, or mapped on submit)
    const [formData, setFormData] = useState({
        full_name: '', mobile_number: '', email: '', selected_course: 'Java Full Stack',
        qualification: 'Graduate', batch_timing: 'Morning', status: 'Pending'
    });

    const [currentStep, setCurrentStep] = useState(1);
    const steps = ["Personal Details", "Contact Details", "Education Info", "Course Selection", "Background", "Payment Detail", "Confirmation"];

    // Fetch Enrollments
    const fetchEnrollments = async () => {
        setLoading(true);
        try {
            const response = await api.get('enrollments/');
            setEnrollments(response.data);
        } catch (error) {
            console.error("Error fetching enrollments:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEnrollments();
    }, []);

    // Action Handlers
    const handleAddNew = () => {
        setFormData({
            full_name: '', mobile_number: '', email: '', selected_course: 'Java Full Stack',
            qualification: 'Graduate', batch_timing: 'Morning', status: 'Pending'
        });
        setEditMode(false);
        setCurrentStep(1);
        setView('form');
    };

    const handleEdit = (enrollment) => {
        setFormData(enrollment);
        setEditMode(true);
        setCurrentStep(1);
        setView('form');
    };

    const handleViewDetails = (enrollment) => {
        setFormData(enrollment);
        setView('details');
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this enrollment?")) {
            try {
                await api.delete(`enrollments/${id}/`);
                fetchEnrollments();
            } catch (error) {
                console.error("Error deleting:", error);
            }
        }
    };

    // Simplified Submit for Admin (Creating/Editing)
    // Note: A full implementation would need all fields. For now, we support basic updates.
    const handleSubmit = async () => {
        try {
            if (editMode && formData.id) {
                await api.patch(`enrollments/${formData.id}/`, formData);
            } else {
                // For new Admin creation, we might need a separate serializer or fill defaults
                // Accessing form data here directly for the example fields
                await api.post('enrollments/', formData);
            }
            fetchEnrollments();
            setView('list');
        } catch (error) {
            console.error("Error saving enrollment:", error);
            alert("Failed to save. Check console.");
        }
    };

    // Filter Logic
    const filteredEnrollments = enrollments.filter(item => {
        // Safe check for fields
        const name = item.full_name || '';
        // ID is integer usually in backend, convert to string
        const idStr = item.id ? item.id.toString() : '';

        const matchesSearch = name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            idStr.includes(searchQuery);
        const matchesStatus = filterStatus === 'All' || item.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    const getStatusColor = (status) => {
        switch (status) {
            case 'Approved': return '#2e7d32';
            case 'Pending': return '#ed6c02';
            case 'Verification': return '#0288d1';
            case 'Rejected': return '#e31e24';
            default: return '#757575';
        }
    };

    const handleStatusUpdate = async (newStatus) => {
        try {
            await api.patch(`enrollments/${formData.id}/`, { status: newStatus });
            // Update local state details to reflect change immediately
            setFormData(prev => ({ ...prev, status: newStatus }));
            fetchEnrollments();
        } catch (error) {
            console.error("Error updating status:", error);
        }
    };

    // Sub-components
    const DetailModal = () => (
        <div className="modal-overlay fade-in">
            <div className="details-modal">
                <div className="modal-header">
                    <h3>Student Details - {formData.id}</h3>
                    <button className="close-modal" onClick={() => setView('list')}><MdClose /></button>
                </div>
                <div className="modal-body">
                    <div className="detail-row"><span>Name:</span> <strong>{formData.full_name}</strong></div>
                    <div className="detail-row"><span>Course:</span> <strong>{formData.selected_course}</strong></div>
                    <div className="detail-row"><span>Mobile:</span> <strong>{formData.mobile_number}</strong></div>
                    <div className="detail-row"><span>Email:</span> <strong>{formData.email}</strong></div>
                    <div className="detail-row"><span>Education:</span> <strong>{formData.qualification}</strong></div>
                    <div className="detail-row"><span>Batch:</span> <strong>{formData.batch_timing}</strong></div>
                    <div className="detail-row"><span>Photo:</span>
                        {formData.photo ?
                            <a href={formData.photo} target="_blank" rel="noreferrer">View Photo</a> :
                            'N/A'
                        }
                    </div>
                    <div className="detail-row"><span>Current Status:</span>
                        <span className="status-badge" style={{ backgroundColor: getStatusColor(formData.status) + '15', color: getStatusColor(formData.status) }}>
                            {formData.status}
                        </span>
                    </div>

                    <div className="status-actions mt-3">
                        <p>Update Status:</p>
                        <button className="btn btn-sm btn-success me-2" onClick={() => handleStatusUpdate('Approved')}>Approve</button>
                        <button className="btn btn-sm btn-warning me-2" onClick={() => handleStatusUpdate('Pending')}>Pending</button>
                        <button className="btn btn-sm btn-danger" onClick={() => handleStatusUpdate('Rejected')}>Reject</button>
                    </div>
                </div>
                <div className="modal-footer">
                    <button className="edit-btn-alt" onClick={() => handleEdit(formData)}><MdEdit /> Edit Profile</button>
                    <button className="close-btn-alt" onClick={() => setView('list')}>Close</button>
                </div>
            </div>
        </div>
    );

    if (view === 'form') {
        // Simplified Form View for Admin - wiring up key fields
        return (
            <div className="enroll-management-container fade-in">
                <div className="management-header">
                    <button className="back-to-list" onClick={() => setView('list')}>
                        <MdArrowBack /> Back
                    </button>
                    <h2>{editMode ? 'Edit Enrollment' : 'New Enrollment'}</h2>
                </div>
                <div className="enroll-main" style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <div className="enroll-card p-4">
                        <div className="form-group mb-3">
                            <label>Full Name</label>
                            <input className="form-control" value={formData.full_name || ''} onChange={(e) => setFormData({ ...formData, full_name: e.target.value })} />
                        </div>
                        <div className="form-group mb-3">
                            <label>Email</label>
                            <input className="form-control" value={formData.email || ''} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                        </div>
                        <div className="form-group mb-3">
                            <label>Phone</label>
                            <input className="form-control" value={formData.mobile_number || ''} onChange={(e) => setFormData({ ...formData, mobile_number: e.target.value })} />
                        </div>
                        <div className="form-group mb-3">
                            <label>Course</label>
                            <select className="form-control" value={formData.selected_course || ''} onChange={(e) => setFormData({ ...formData, selected_course: e.target.value })}>
                                <option value="Java Full Stack">Java Full Stack</option>
                                <option value="Python Full Stack">Python Full Stack</option>
                                <option value="Data Science">Data Science</option>
                                <option value="Web Development">Web Development</option>
                            </select>
                        </div>
                        <div className="form-group mb-3">
                            <label>Status</label>
                            <select className="form-control" value={formData.status || 'Pending'} onChange={(e) => setFormData({ ...formData, status: e.target.value })}>
                                <option value="Pending">Pending</option>
                                <option value="Approved">Approved</option>
                                <option value="Rejected">Rejected</option>
                            </select>
                        </div>

                        <button className="btn btn-primary mt-3" onClick={handleSubmit}>Save Changes</button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="enroll-management-container fade-in">
            <div className="management-header">
                <div>
                    <h2>Enrollment Management</h2>
                    <p>Manage student applications ({enrollments.length})</p>
                </div>
                <button className="add-btn" onClick={handleAddNew}>
                    <MdAdd /> New Enrollment
                </button>
            </div>

            <div className="list-controls">
                <div className="search-bar">
                    <MdSearch />
                    <input type="text" placeholder="Search by name..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                </div>
                <div className="filter-group">
                    <MdFilterList />
                    <select className="status-filter" onChange={(e) => setFilterStatus(e.target.value)}>
                        <option value="All">All Status</option>
                        <option value="Approved">Approved</option>
                        <option value="Pending">Pending</option>
                        <option value="Rejected">Rejected</option>
                    </select>
                </div>
            </div>

            <div className="enrollment-list-card">
                {loading ? <p style={{ padding: '20px' }}>Loading...</p> : (
                    <table className="enrollment-table">
                        <thead>
                            <tr>
                                <th>Student ID</th>
                                <th>Student Name</th>
                                <th>Course</th>
                                <th>Date</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredEnrollments.length === 0 ? (
                                <tr><td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>No enrollments found.</td></tr>
                            ) : (
                                filteredEnrollments.map((enrollee) => (
                                    <tr key={enrollee.id}>
                                        <td className="id-cell">{enrollee.id}</td>
                                        <td>{enrollee.full_name}</td>
                                        <td>{enrollee.selected_course}</td>
                                        <td>{new Date(enrollee.created_at).toLocaleDateString()}</td>
                                        <td>
                                            <span className="status-badge" style={{ backgroundColor: getStatusColor(enrollee.status) + '15', color: getStatusColor(enrollee.status) }}>
                                                {enrollee.status}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="action-buttons">
                                                <button className="action-icon view" onClick={() => handleViewDetails(enrollee)}><MdVisibility /></button>
                                                <button className="action-icon edit" onClick={() => handleEdit(enrollee)}><MdEdit /></button>
                                                <button className="action-icon delete" onClick={() => handleDelete(enrollee.id)}><MdDelete /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                )}
            </div>
            {view === 'details' && <DetailModal />}
        </div>
    );
};

export default Enroll;
