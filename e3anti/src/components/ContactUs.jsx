import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPaperPlane, FaMedal, FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaWhatsapp } from 'react-icons/fa';
import { IoIosArrowForward } from 'react-icons/io';
import studentImage from '../assets/student_image.png';
import modernLibrary from '../assets/modern_library.png';
import groupStudents from '../assets/group_students.png';
import './ContactUs.css';


// Carousel Images
const images = [
    studentImage,
    modernLibrary,
    groupStudents
];

// Confetti Component (Color Papers)
const Confetti = () => {
    // Generate random particles
    const particles = Array.from({ length: 60 }).map((_, i) => ({
        id: i,
        x: (Math.random() - 0.5) * 600, // Wide spread X
        yStart: 100, // Start slightly below center
        yEnd: (Math.random() - 1) * 400 - 100, // Shoot UP
        rotation: Math.random() * 360,
        scale: Math.random() * 0.5 + 0.5,
        color: ['#FFD700', '#FF4500', '#00FA9A', '#00BFFF', '#FF69B4', '#FFFFFF'][Math.floor(Math.random() * 6)]
    }));

    return (
        <div className="confetti-container">
            {particles.map((p) => (
                <motion.div
                    key={p.id}
                    className="confetti-particle"
                    initial={{ x: 0, y: p.yStart, opacity: 0, scale: 0 }}
                    animate={{
                        x: p.x,
                        y: p.yEnd,
                        opacity: [0, 1, 1, 0], // Fade in then out
                        rotate: p.rotation + 720,
                        scale: p.scale
                    }}
                    transition={{
                        duration: 2,
                        ease: "easeOut",
                        delay: Math.random() * 0.2
                    }}
                    style={{ backgroundColor: p.color }}
                />
            ))}
        </div>
    );
};

import api from '../api/axios';

const ContactUs = () => {
    // Animation Variants
    const slideUpSlow = {
        hidden: { y: 100, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { duration: 1.5, ease: "easeOut", delay: 0.2 } }
    };

    const fadeInZoom = {
        hidden: { opacity: 0, scale: 0.9 },
        visible: { opacity: 1, scale: 1, transition: { duration: 1.2, ease: [0.4, 0, 0.2, 1] } }
    };

    const [formState, setFormState] = useState({
        firstName: '',
        lastName: '',
        email: '', // Added email field
        phoneNumber: '',
        enquiryType: '',
        message: ''
    });
    const [focused, setFocused] = useState({});
    const [status, setStatus] = useState('idle');
    const [currentIndex, setCurrentIndex] = useState(0);
    const [contactSettings, setContactSettings] = useState(null);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const response = await api.get('contact-settings/');
                if (response.data.length > 0) {
                    setContactSettings(response.data[0]);
                }
            } catch (error) {
                console.error("Error fetching contact settings:", error);
            }
        };
        fetchSettings();
    }, []);

    const handleNext = () => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
    };

    const handlePrev = () => {
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    const handleFocus = (field) => {
        setFocused(prev => ({ ...prev, [field]: true }));
    };

    const handleBlur = (field) => {
        if (!formState[field]) {
            setFocused(prev => ({ ...prev, [field]: false }));
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormState(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('loading');
        try {
            await api.post('contact-messages/', {
                first_name: formState.firstName,
                last_name: formState.lastName,
                email: formState.email,
                phone_number: formState.phoneNumber,
                enquiry_type: formState.enquiryType,
                message: formState.message || ""
            });
            setStatus('success');
        } catch (error) {
            console.error("Error sending message:", error);
            setStatus('idle');
            alert("Failed to send message. Please try again.");
        }
    };

    const handleReset = () => {
        setStatus('idle');
        setFormState({ firstName: '', lastName: '', phoneNumber: '', enquiryType: '' });
        setFocused({});
    };

    return (
        <section className="contact-section">
            <div className="contact-wrapper">
                <div className={`unified-card ${status === 'success' ? 'reverse-layout' : ''}`}>

                    {/* LEFT PANEL: FORM WITH SUCCESS ANIMATION */}
                    <motion.div
                        className="card-panel form-panel"
                        initial="hidden"
                        animate={status === 'success' ? { backgroundColor: '#e31e24', y: 0, opacity: 1 } : "visible"}
                        variants={slideUpSlow}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="panel-content">
                            <AnimatePresence mode="wait">
                                {status !== 'success' ? (
                                    <motion.div
                                        key="form"
                                        initial="hidden"
                                        animate="visible"
                                        exit="exit"
                                        variants={{
                                            hidden: { opacity: 0, x: -20 },
                                            visible: {
                                                opacity: 1,
                                                x: 0,
                                                transition: { staggerChildren: 0.1, delayChildren: 0.1 }
                                            },
                                            exit: { opacity: 0, x: -20, transition: { duration: 0.2 } }
                                        }}
                                        className="form-container-inner"
                                    >
                                        <div className="text-header">
                                            <motion.h2 variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 } }}>Contact Us</motion.h2>
                                            <motion.p variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 } }}>Start your journey with us. We are here to help.</motion.p>
                                        </div>

                                        <form onSubmit={handleSubmit}>
                                            <div className="input-row">
                                                <motion.div
                                                    className="input-group"
                                                    variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                                                >
                                                    <input
                                                        type="text" name="firstName" value={formState.firstName} onChange={handleChange}
                                                        onFocus={() => handleFocus('firstName')} onBlur={() => handleBlur('firstName')} required
                                                    />
                                                    <label className={focused.firstName || formState.firstName ? 'active' : ''}>First Name</label>
                                                </motion.div>
                                                <motion.div
                                                    className="input-group"
                                                    variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                                                >
                                                    <input
                                                        type="text" name="lastName" value={formState.lastName} onChange={handleChange}
                                                        onFocus={() => handleFocus('lastName')} onBlur={() => handleBlur('lastName')} required
                                                    />
                                                    <label className={focused.lastName || formState.lastName ? 'active' : ''}>Last Name</label>
                                                </motion.div>
                                            </div>

                                            <motion.div
                                                className="input-group"
                                                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                                            >
                                                <input
                                                    type="email" name="email" value={formState.email} onChange={handleChange}
                                                    onFocus={() => handleFocus('email')} onBlur={() => handleBlur('email')} required
                                                />
                                                <label className={focused.email || formState.email ? 'active' : ''}>Email Address</label>
                                            </motion.div>

                                            <motion.div
                                                className="input-group"
                                                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                                            >
                                                <input
                                                    type="tel" name="phoneNumber" value={formState.phoneNumber} onChange={handleChange}
                                                    onFocus={() => handleFocus('phoneNumber')} onBlur={() => handleBlur('phoneNumber')} required
                                                />
                                                <label className={focused.phoneNumber || formState.phoneNumber ? 'active' : ''}>Phone Number</label>
                                            </motion.div>

                                            <motion.div
                                                className="input-group"
                                                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                                            >
                                                <select
                                                    name="enquiryType" value={formState.enquiryType} onChange={handleChange}
                                                    onFocus={() => handleFocus('enquiryType')} onBlur={() => handleBlur('enquiryType')} required
                                                >
                                                    <option value="" disabled hidden></option>
                                                    <option value="admission">Admissions</option>
                                                    <option value="courses">Programs</option>
                                                    <option value="support">Student Support</option>
                                                </select>
                                                <label className={focused.enquiryType || formState.enquiryType ? 'active' : ''}>Enquiry Type</label>
                                                <IoIosArrowForward className="select-arrow" />
                                            </motion.div>

                                            <motion.button
                                                type="submit"
                                                className={`submit-btn ${status}`}
                                                disabled={status === 'loading'}
                                                variants={{ hidden: { opacity: 0, scale: 0.9 }, visible: { opacity: 1, scale: 1 } }}
                                            >
                                                {status === 'loading' ?
                                                    <span className="loader"></span> :
                                                    <span>Send Message <FaPaperPlane /></span>
                                                }
                                            </motion.button>

                                            <motion.div
                                                className="social-media-section"
                                                variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { delay: 0.5 } } }}
                                            >
                                                <div className="social-icons">
                                                    {contactSettings?.whatsapp && <a href={`https://wa.me/${contactSettings.whatsapp}`} className="social-icon" target="_blank" rel="noreferrer"><FaWhatsapp /></a>}
                                                    {contactSettings?.facebook && <a href={contactSettings.facebook} className="social-icon" target="_blank" rel="noreferrer"><FaFacebookF /></a>}
                                                    {contactSettings?.twitter && <a href={contactSettings.twitter} className="social-icon" target="_blank" rel="noreferrer"><FaTwitter /></a>}
                                                    {contactSettings?.instagram && <a href={contactSettings.instagram} className="social-icon" target="_blank" rel="noreferrer"><FaInstagram /></a>}
                                                    {contactSettings?.linkedin && <a href={contactSettings.linkedin} className="social-icon" target="_blank" rel="noreferrer"><FaLinkedinIn /></a>}
                                                </div>
                                            </motion.div>
                                        </form>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="success"
                                        className="success-view-maroon"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.2 }}
                                    >
                                        <Confetti />

                                        {/* 1. Plane Flies Away */}
                                        <motion.div
                                            className="flying-plane"
                                            initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
                                            animate={{ x: 500, y: -500, opacity: 0 }}
                                            transition={{ duration: 0.8, ease: "easeIn" }}
                                        >
                                            <FaPaperPlane size={50} color="#FFD700" />
                                        </motion.div>

                                        {/* 2. Reward Symbol Pops In (after plane) */}
                                        <motion.div
                                            className="reward-box"
                                            initial={{ scale: 0, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1, rotate: [0, -10, 10, -5, 5, 0] }}
                                            transition={{ delay: 0.6, type: "spring", stiffness: 200, damping: 12 }}
                                        >
                                            <div className="gift-glow"></div>
                                            <FaMedal size={80} color="#FFD700" />
                                        </motion.div>

                                        {/* 3. Text Message */}
                                        <motion.div
                                            className="success-text-content"
                                            initial={{ y: 20, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            transition={{ delay: 1, type: "spring" }}
                                        >
                                            <h3>Congratulations!</h3>
                                            <p>Your enquiry has been sent. Here is a surprise for you!</p>
                                            <button onClick={handleReset} className="reset-btn-white">Send Another</button>
                                        </motion.div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>

                    {/* RIGHT PANEL: 3-PART SPLIT IMAGE */}
                    <motion.div
                        className="card-panel visual-panel"
                        initial="hidden"
                        animate="visible"
                        variants={fadeInZoom}
                    >
                        <div className="triptych-container">
                            {/* Mobile View Image */}
                            <div className="mobile-hero-img">
                                <AnimatePresence mode="wait">
                                    <motion.img
                                        key={currentIndex}
                                        src={images[currentIndex]}
                                        alt="Banner"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.5 }}
                                    />
                                </AnimatePresence>
                            </div>

                            {/* Desktop Triptych View */}
                            <AnimatePresence mode="popLayout">
                                <motion.div key={currentIndex} className="strip-img-wrapper" initial={{ y: "-100%" }} animate={{ y: "0%" }} exit={{ y: "100%" }} transition={{ duration: 0.8 }} style={{ clipPath: "polygon(0 0, 33% 0, 33% 100%, 0 100%)" }}>
                                    <img src={images[currentIndex]} alt="Left" />
                                </motion.div>
                                <motion.div key={currentIndex + "-2"} className="strip-img-wrapper" initial={{ y: "100%" }} animate={{ y: "0%" }} exit={{ y: "-100%" }} transition={{ duration: 0.8, delay: 0.1 }} style={{ clipPath: "polygon(33% 0, 66% 0, 66% 100%, 33% 100%)" }}>
                                    <img src={images[currentIndex]} alt="Center" />
                                </motion.div>
                                <motion.div key={currentIndex + "-3"} className="strip-img-wrapper" initial={{ y: "-100%" }} animate={{ y: "0%" }} exit={{ y: "100%" }} transition={{ duration: 0.8, delay: 0.2 }} style={{ clipPath: "polygon(66% 0, 100% 0, 100% 100%, 66% 100%)" }}>
                                    <img src={images[currentIndex]} alt="Right" />
                                </motion.div>
                            </AnimatePresence>

                            <div className="triptych-text">
                                <h3>Excellence</h3>
                                <p>In Education</p>
                            </div>

                            <div className="carousel-controls">
                                <button className="nav-btn prev" onClick={handlePrev}><IoIosArrowForward className="icon-flip" /></button>
                                <div className="indicators">
                                    {images.map((_, idx) => (
                                        <span key={idx} className={`indicator ${idx === currentIndex ? 'active' : ''}`} onClick={() => setCurrentIndex(idx)}></span>
                                    ))}
                                </div>
                                <button className="nav-btn next" onClick={handleNext}><IoIosArrowForward /></button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default ContactUs;
