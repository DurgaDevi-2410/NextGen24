import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import './Enroll.css';
import logoImg from '../assets/e3-logo.png';

import api from '../api/axios';

const Enroll = () => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        // 1. Personal Details
        fullName: '',
        birthDate: '',
        gender: '',
        photo: null,
        // 2. Contact Details
        mobileNumber: '',
        email: '',
        address: '',
        city: '',
        state: '',
        pincode: '',
        // 3. Education Details
        qualification: '',
        collegeName: '',
        passingYear: '',
        percentage: '',
        // 4. Course Details
        selectedCourse: '',
        courseType: '',
        batchTiming: '',
        startDate: '',
        // 5. Background Details
        experienceStatus: 'Fresher',
        yearsExperience: '',
        skills: '',
        // 6. Payment Details
        paymentMode: 'UPI',
        transactionId: '',
        paidAmount: '',
        // 7. Confirmation
        termsAccepted: false,
        declarationAccepted: false
    });

    const handleInputChange = (e) => {
        const { name, value, type, checked, files } = e.target;
        if (type === 'checkbox') {
            setFormData({ ...formData, [name]: checked });
        } else if (type === 'file') {
            setFormData({ ...formData, [name]: files[0] });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const nextStep = () => setStep(prev => Math.min(prev + 1, 7));
    const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

    const handleSubmit = async () => {
        if (!formData.termsAccepted || !formData.declarationAccepted) {
            alert("Please accept the terms and declaration.");
            return;
        }

        const data = new FormData();
        // Map to snake_case backend fields
        data.append('full_name', formData.fullName);
        data.append('birth_date', formData.birthDate);
        data.append('gender', formData.gender);
        if (formData.photo) data.append('photo', formData.photo);

        data.append('mobile_number', formData.mobileNumber);
        data.append('email', formData.email);
        data.append('address', formData.address);
        data.append('city', formData.city);
        data.append('state', formData.state);
        data.append('pincode', formData.pincode);

        data.append('qualification', formData.qualification);
        data.append('college_name', formData.collegeName);
        data.append('passing_year', formData.passingYear);
        data.append('percentage', formData.percentage);

        data.append('selected_course', formData.selectedCourse);
        data.append('course_type', formData.courseType);
        data.append('batch_timing', formData.batchTiming);

        data.append('experience_status', formData.experienceStatus);
        data.append('skills', formData.skills);

        data.append('payment_mode', formData.paymentMode);
        data.append('transaction_id', formData.transactionId);
        data.append('paid_amount', formData.paidAmount);

        data.append('terms_accepted', formData.termsAccepted ? 'True' : 'False');
        data.append('declaration_accepted', formData.declarationAccepted ? 'True' : 'False');

        try {
            await api.post('enrollments/', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            alert("Application Submitted Successfully!");
            // Optional: reset form or redirect
            window.location.reload();
        } catch (error) {
            console.error("Enrollment failed:", error);
            alert("Failed to submit application. Please feel free to contact us.");
        }
    };

    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <motion.div
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ duration: 0.3 }}
                        className="step-content"
                    >
                        {/* Red Pill Header */}
                        <div className="form-section-header">Personal Details</div>

                        <Form.Group className="mb-4">
                            <Form.Label className="fw-bold">Full Name:</Form.Label>
                            <Form.Control
                                type="text"
                                name="fullName"
                                placeholder="Enter your full name"
                                value={formData.fullName}
                                onChange={handleInputChange}
                                className="custom-input"
                            />
                        </Form.Group>
                        <Row className="mb-4">
                            <Col md={6}>
                                <Form.Label className="fw-bold">Date of Birth:</Form.Label>
                                <div className="input-with-icon">
                                    <Form.Control
                                        type="text"
                                        name="birthDate"
                                        placeholder="dd-mm-yyyy"
                                        value={formData.birthDate}
                                        onChange={handleInputChange}
                                        className="custom-input"
                                    />
                                    <i className="bi bi-calendar4 calendar-icon"></i>
                                </div>
                            </Col>
                            <Col md={6}>
                                <Form.Label className="fw-bold d-block">Gender:</Form.Label>
                                <div className="gender-radio-group d-flex gap-4">
                                    {['Male', 'Female', 'Other'].map(g => (
                                        <Form.Check
                                            key={g}
                                            type="radio"
                                            id={`gender-${g}`}
                                            label={g}
                                            name="gender"
                                            value={g}
                                            checked={formData.gender === g}
                                            onChange={handleInputChange}
                                            className="custom-radio-inline"
                                        />
                                    ))}
                                </div>
                            </Col>
                        </Row>
                        <Form.Group className="mb-4">
                            <Form.Label className="fw-bold">Photo (Optional):</Form.Label>
                            <div className="photo-upload-container">
                                <div className="photo-upload-area">
                                    <div className="camera-circle-large">
                                        <i className="bi bi-camera-fill"></i>
                                    </div>
                                    <div className="upload-text-section">
                                        <p className="upload-title mb-1">
                                            <strong>Upload your photo</strong> <span className="text-muted">(JPG/PNG, max 2MB)</span>
                                        </p>
                                        <p className="upload-subtitle text-muted mb-2">Drag & drop or</p>
                                        <label htmlFor="photo-input" className="browse-photo-btn">
                                            Browse Photo
                                        </label>
                                        <input
                                            id="photo-input"
                                            type="file"
                                            name="photo"
                                            onChange={handleInputChange}
                                            className="d-none"
                                            accept="image/*"
                                        />
                                    </div>
                                </div>
                                {formData.photo && (
                                    <div className="uploaded-file-name mt-2 text-success fw-bold">
                                        <i className="bi bi-check-circle-fill me-2"></i>
                                        {formData.photo.name}
                                    </div>
                                )}
                            </div>
                        </Form.Group>
                    </motion.div>
                );
            case 2:
                // ... (Repeat pattern for other steps - will focus on structure for now)
                return (
                    <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.3 }}>
                        <div className="form-section-header">Contact Details</div>
                        <Row className="mb-4">
                            <Col md={6}>
                                <Form.Label className="fw-bold">Mobile Number:</Form.Label>
                                <Form.Control type="tel" name="mobileNumber" placeholder="Enter mobile number" value={formData.mobileNumber} onChange={handleInputChange} className="custom-input" />
                            </Col>
                            <Col md={6}>
                                <Form.Label className="fw-bold">Email ID:</Form.Label>
                                <Form.Control type="email" name="email" placeholder="name@example.com" value={formData.email} onChange={handleInputChange} className="custom-input" />
                            </Col>
                        </Row>
                        <Form.Group className="mb-4">
                            <Form.Label className="fw-bold">Address:</Form.Label>
                            <Form.Control as="textarea" rows={2} name="address" placeholder="Full Street Address" value={formData.address} onChange={handleInputChange} className="custom-input" />
                        </Form.Group>
                        <Row className="mb-4">
                            <Col md={4}><Form.Label className="fw-bold">City:</Form.Label><Form.Control type="text" name="city" placeholder="City" value={formData.city} onChange={handleInputChange} className="custom-input" /></Col>
                            <Col md={4}><Form.Label className="fw-bold">State:</Form.Label><Form.Control type="text" name="state" placeholder="State" value={formData.state} onChange={handleInputChange} className="custom-input" /></Col>
                            <Col md={4}><Form.Label className="fw-bold">Pincode:</Form.Label><Form.Control type="text" name="pincode" placeholder="Pincode" value={formData.pincode} onChange={handleInputChange} className="custom-input" /></Col>
                        </Row>
                    </motion.div>
                );
            // ... (Other steps with minimal changes to structure, keeping data binding)
            case 3:
                return (
                    <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}>
                        <div className="form-section-header">Education Info</div>
                        <Form.Group className="mb-4"><Form.Label className="fw-bold">Qualification:</Form.Label><Form.Select name="qualification" value={formData.qualification} onChange={handleInputChange} className="custom-input"><option value="">Select Qualification</option><option value="10th">10th Standard</option><option value="12th">12th Standard / Diploma</option><option value="Degree">Undergraduate Degree</option></Form.Select></Form.Group>
                        <Form.Group className="mb-4"><Form.Label className="fw-bold">College / School Name:</Form.Label><Form.Control type="text" name="collegeName" placeholder="Institution Name" value={formData.collegeName} onChange={handleInputChange} className="custom-input" /></Form.Group>
                        <Row className="mb-4"><Col md={6}><Form.Label className="fw-bold">Passing Year:</Form.Label><Form.Control type="number" name="passingYear" placeholder="2023" value={formData.passingYear} onChange={handleInputChange} className="custom-input" /></Col><Col md={6}><Form.Label className="fw-bold">Percentage:</Form.Label><Form.Control type="text" name="percentage" placeholder="85% or 8.5" value={formData.percentage} onChange={handleInputChange} className="custom-input" /></Col></Row>
                    </motion.div>
                );
            case 4:
                return (
                    <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}>
                        <div className="form-section-header">Course Selection</div>
                        <Form.Group className="mb-4"><Form.Label className="fw-bold">Selected Course:</Form.Label><Form.Select name="selectedCourse" value={formData.selectedCourse} onChange={handleInputChange} className="custom-input"><option value="">Select Course</option><option value="Web Dev">Web Development</option><option value="Data Science">Data Science</option></Form.Select></Form.Group>
                        <Row className="mb-4">
                            <Col md={6}><Form.Label className="fw-bold d-block">Course Type:</Form.Label>
                                <div className="d-flex gap-3 pt-2">{['Online', 'Offline'].map(t => (<Form.Check key={t} type="radio" label={t} name="courseType" value={t} checked={formData.courseType === t} onChange={handleInputChange} className="custom-radio-inline" />))}</div>
                            </Col>
                            <Col md={6}><Form.Label className="fw-bold">Batch Timing:</Form.Label><Form.Select name="batchTiming" value={formData.batchTiming} onChange={handleInputChange} className="custom-input"><option value="">Select Timing</option><option value="Morning">Morning</option><option value="Evening">Evening</option></Form.Select></Col>
                        </Row>
                    </motion.div>
                );
            case 5:
                return (
                    <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}>
                        <div className="form-section-header">Background</div>
                        <Form.Group className="mb-4"><Form.Label className="fw-bold d-block">Experience:</Form.Label><div className="d-flex gap-3 pt-2">{['Fresher', 'Experienced'].map(s => (<Form.Check key={s} type="radio" label={s} name="experienceStatus" value={s} checked={formData.experienceStatus === s} onChange={handleInputChange} className="custom-radio-inline" />))}</div></Form.Group>
                        <Form.Group className="mb-4"><Form.Label className="fw-bold">Skills:</Form.Label><Form.Control as="textarea" rows={4} name="skills" placeholder="Skills..." value={formData.skills} onChange={handleInputChange} className="custom-input" /></Form.Group>
                    </motion.div>
                );
            case 6:
                return (
                    <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}>
                        <div className="form-section-header">Payment Detail</div>
                        <Form.Group className="mb-4"><Form.Label className="fw-bold">Mode:</Form.Label><Form.Select name="paymentMode" value={formData.paymentMode} onChange={handleInputChange} className="custom-input"><option value="UPI">UPI</option><option value="Card">Card</option></Form.Select></Form.Group>
                        <Row className="mb-4"><Col md={6}><Form.Label className="fw-bold">Txn ID:</Form.Label><Form.Control type="text" name="transactionId" placeholder="Ref No." value={formData.transactionId} onChange={handleInputChange} className="custom-input" /></Col><Col md={6}><Form.Label className="fw-bold">Amount:</Form.Label><Form.Control type="text" name="paidAmount" placeholder="Amount" value={formData.paidAmount} onChange={handleInputChange} className="custom-input" /></Col></Row>
                    </motion.div>
                );
            case 7:
                return (
                    <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}>
                        <div className="form-section-header">Confirmation</div>
                        <Form.Check type="checkbox" label="I accept Terms & Conditions" checked={formData.termsAccepted} name="termsAccepted" onChange={handleInputChange} className="mb-3 fw-bold custom-checkbox" />
                        <Form.Check type="checkbox" label="I declare details are correct" checked={formData.declarationAccepted} name="declarationAccepted" onChange={handleInputChange} className="mb-3 fw-bold custom-checkbox" />
                    </motion.div>
                );
            default: return null;
        }
    };

    return (
        <section className="enroll-page-wrapper">
            <Container fluid className="p-0 h-100">
                <Row className="g-0 min-vh-100">
                    {/* LEFT SIDEBAR COLUMN */}
                    <Col lg={2} className="sidebar-col">
                        <div className="sidebar-inner">
                            <div className="timeline-line"></div>

                            {/* 1. Personal Details Main Node */}
                            <div
                                className={`timeline-item group-node ${step === 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}
                                onClick={() => setStep(1)}
                            >
                                <div className="group-node-bg-gradient"></div>
                                <div className="node-circle-solid">
                                    {step > 1 ? <i className="bi bi-check-lg" style={{ fontSize: '1.5rem' }}></i> : <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#e31e24' }}>1</span>}
                                </div>
                                <div className="node-label">Personal Details</div>
                            </div>

                            {/* Sub Steps List (Now Unified Main Steps) */}
                            <div className="sub-steps-list">
                                {[
                                    { num: 2, label: "Contact Details" },
                                    { num: 3, label: "Education Info" },
                                    { num: 4, label: "Course Selection" },
                                    { num: 5, label: "Background" },
                                    { num: 6, label: "Payment Detail" },
                                    { num: 7, label: "Confirmation" }
                                ].map((item) => (
                                    <div
                                        key={item.num}
                                        className={`timeline-item group-node ${step === item.num ? 'active' : ''} ${step > item.num ? 'completed' : ''}`}
                                        onClick={() => setStep(item.num)}
                                    >
                                        <div className="group-node-bg-gradient"></div>
                                        <div className="node-circle-solid">
                                            {step > item.num ? (
                                                <i className="bi bi-check-lg" style={{ fontSize: '1.5rem' }}></i>
                                            ) : (
                                                <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#e31e24' }}>{item.num}</span>
                                            )}
                                        </div>
                                        <div className="node-label">{item.label}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Col>

                    {/* RIGHT CONTENT COLUMN */}
                    <Col lg={10} className="content-col">
                        <div className="content-inner">
                            {/* Top Header Area */}
                            <div className="top-header-area d-flex align-items-center mb-4">
                                <img src={logoImg} alt="Logo" style={{ height: '50px', marginRight: '20px' }} />
                                <div>
                                    <h5 className="text-secondary mb-1 fw-normal" style={{ fontSize: '1.1rem' }}>Join Nextgen</h5>
                                    <h2 className="text-danger fw-bold m-0" style={{ fontSize: '2rem' }}>Admission Enrollment Form</h2>
                                </div>
                            </div>

                            {/* Inner Floating White Card */}
                            <Card className="inner-form-card">
                                <Card.Body className="p-4 p-md-5">
                                    <AnimatePresence mode="wait">
                                        {renderStep()}
                                    </AnimatePresence>

                                    {/* Footer Buttons */}
                                    <div className="d-flex justify-content-between align-items-center mt-5">
                                        <Button
                                            variant="light"
                                            onClick={prevStep}
                                            disabled={step === 1}
                                            className="px-4 py-2 border back-btn"
                                        >
                                            Back
                                        </Button>
                                        <Button
                                            variant="info"
                                            onClick={step === 7 ? handleSubmit : nextStep}
                                            className="px-5 py-2 red-gradient-btn text-white fw-bold"
                                        >
                                            {step === 7 ? "Submit Application" : "Next Step"}
                                        </Button>
                                    </div>
                                </Card.Body>
                            </Card>
                        </div>
                    </Col>
                </Row>
            </Container>
        </section>
    );
};

export default Enroll;
