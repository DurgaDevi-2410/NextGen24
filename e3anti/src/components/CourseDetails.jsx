import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import api from '../api/axios';
import './CourseDetails.css';

const CourseDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("description"); // description, topics, scope, projects
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [latestCourses, setLatestCourses] = useState([]);

    // Scroll to top on mount
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [id]);

    useEffect(() => {
        fetchCourseData();
        fetchLatestCourses();
    }, [id]);

    const fetchCourseData = async () => {
        try {
            setLoading(true);
            const response = await api.get(`courses/${id}/`);
            setCourse(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching course:", error);
            setLoading(false);
        }
    };

    const fetchLatestCourses = async () => {
        try {
            const response = await api.get('courses/');
            // Just take first 3 for now, or random
            setLatestCourses(response.data.slice(0, 3));
        } catch (error) {
            console.error("Error fetching latest courses:", error);
        }
    };

    // Loading State
    if (loading) {
        return <div className="text-center py-5"><h2>Loading Course Details...</h2></div>;
    }

    // If course not found, show error
    if (!course) {
        return (
            <div className="text-center py-5">
                <h2>Course not found</h2>
                <Button variant="primary" onClick={() => navigate('/')}>Go Back</Button>
            </div>
        );
    }

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: {
            opacity: 1,
            x: 0,
            transition: { duration: 0.4 }
        }
    };

    const sidebarVariants = {
        hidden: { opacity: 0, x: 50 },
        visible: {
            opacity: 1,
            x: 0,
            transition: { duration: 0.6, delay: 0.3 }
        }
    };

    const renderTabContent = () => {
        switch (activeTab) {
            case "description":
                return (
                    <motion.div
                        className="tab-pane-content"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        <motion.h4 variants={itemVariants} className="sub-title-small-red mb-4">{course.title}</motion.h4>
                        <motion.p variants={itemVariants} className="description-text mb-4">
                            {course.description || "No description provided."}
                        </motion.p>

                        {course.objective && (
                            <div className="course-objective-section">
                                <motion.h4 variants={itemVariants} className="section-heading mb-4">Course Objective</motion.h4>
                                <motion.p variants={itemVariants} className="description-text">
                                    {course.objective}
                                </motion.p>
                            </div>
                        )}
                    </motion.div>
                );
            case "topics":
                // Handle topics being a list
                const topics = Array.isArray(course.topics) ? course.topics : [];
                // Split topics for two columns if enough items
                const mid = Math.ceil(topics.length / 2);
                const col1 = topics.slice(0, mid);
                const col2 = topics.slice(mid);

                return (
                    <div className="tab-pane-content">
                        <Row>
                            <Col md={topics.length > 5 ? 6 : 12}>
                                {topics.length === 0 ? <p>No topics listed.</p> : (
                                    <motion.ul
                                        className="list-unstyled check-list"
                                        variants={containerVariants}
                                        initial="hidden"
                                        animate="visible"
                                    >
                                        {col1.map((item, idx) => (
                                            <motion.li key={idx} variants={itemVariants} className="mb-2 d-flex align-items-start">
                                                <i className="bi bi-check-circle-fill text-danger me-2 mt-1"></i>
                                                <span>{item}</span>
                                            </motion.li>
                                        ))}
                                    </motion.ul>
                                )}
                            </Col>
                            {col2.length > 0 && (
                                <Col md={6}>
                                    <motion.ul
                                        className="list-unstyled check-list"
                                        variants={containerVariants}
                                        initial="hidden"
                                        animate="visible"
                                    >
                                        {col2.map((item, idx) => (
                                            <motion.li key={idx} variants={itemVariants} className="mb-2 d-flex align-items-start">
                                                <i className="bi bi-check-circle-fill text-danger me-2 mt-1"></i>
                                                <span>{item}</span>
                                            </motion.li>
                                        ))}
                                    </motion.ul>
                                </Col>
                            )}
                        </Row>
                    </div>
                );
            case "scope":
                return (
                    <div className="tab-pane-content">
                        <motion.div variants={containerVariants} initial="hidden" animate="visible">
                            <div className="mask-container">
                                <motion.h4 variants={itemVariants} className="section-heading mb-3">Scope & Career Opportunities</motion.h4>
                            </div>
                            <motion.p variants={itemVariants} className="description-text mb-4">
                                {course.scope || "No scope details provided."}
                            </motion.p>
                        </motion.div>
                    </div>
                );
            case "projects":
                const projects = Array.isArray(course.projects) ? course.projects : [];
                return (
                    <div className="tab-pane-content">
                        <div className="mask-container">
                            <motion.h4 variants={itemVariants} className="section-heading mb-3">Real-Time Projects</motion.h4>
                        </div>
                        {projects.length === 0 ? <p>No projects listed.</p> : (
                            <motion.ul
                                className="list-unstyled check-list"
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                            >
                                {projects.map((item, idx) => (
                                    <motion.li key={idx} variants={itemVariants} className="mb-2 d-flex align-items-start">
                                        <i className="bi bi-laptop text-danger me-2 mt-1"></i>
                                        <span>{item}</span>
                                    </motion.li>
                                ))}
                            </motion.ul>
                        )}
                    </div>
                );
            default:
                return null;
        }
    };

    // Helper to get full image URL
    const getImageUrl = (imagePath) => {
        if (!imagePath) return null;
        if (imagePath.startsWith('http')) return imagePath;
        return `http://localhost:8000${imagePath}`;
    };

    // Calculate Scroll Progress if needed, or remove
    // For simplicity keeping it minimal, reusing your structure

    return (
        <motion.div
            className="course-details-page bg-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
        >
            {/* Background Blobs reused */}
            <div className="blob blob-1" />
            <div className="blob blob-2" />

            <Container className="py-4">
                {/* TOP NAVIGATION BUTTONS */}
               

                <Row>
                    <Col lg={8}>
                        {/* COURSE TITLE - Below navigation */}
                        <div className="mask-container mb-4">
                            <motion.h1
                                className="course-title-main"
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ duration: 0.5 }}
                            >
                                {course.title}
                            </motion.h1>
                        </div>

                        {/* Styled Tabs Container */}
                        <div className="modern-tabs-box mb-4">
                            <div className="tabs-flex">
                                <motion.button
                                    className={`modern-tab-btn ${activeTab === 'description' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('description')}
                                >
                                    Course Description
                                </motion.button>
                                <motion.button
                                    className={`modern-tab-btn ${activeTab === 'topics' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('topics')}
                                >
                                    Key Topics Covered
                                </motion.button>
                                <motion.button
                                    className={`modern-tab-btn ${activeTab === 'scope' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('scope')}
                                >
                                    Scope & Career Opportunities
                                </motion.button>
                                <motion.button
                                    className={`modern-tab-btn ${activeTab === 'projects' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('projects')}
                                >
                                    Real Time Projects
                                </motion.button>
                            </div>
                        </div>

                        {/* Tab Content */}
                        <div className="course-content-body">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeTab}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    {renderTabContent()}
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </Col>

                    <Col lg={4}>
                        <motion.div
                            variants={sidebarVariants}
                            initial="hidden"
                            animate="visible"
                        >
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                            >
                                <Card className="modern-sidebar-card border-0 shadow-sm mb-4 overflow-hidden">
                                    <Card.Body className="p-4">
                                        <h3 className="sidebar-header">Course Features</h3>
                                        <div className="header-divider mb-4"></div>

                                        <div className="feature-item mb-3">
                                            <div className="d-flex justify-content-between align-items-center">
                                                <span className="feature-label">Duration:</span>
                                                <span className="feature-value">{course.duration || "60 Hours"}</span>
                                            </div>
                                        </div>

                                        <div className="feature-item mb-3">
                                            <div className="d-flex justify-content-between align-items-start">
                                                <span className="feature-label">Flexible<br />Learning:</span>
                                                <span className="feature-value text-end">In-Center And<br />Online</span>
                                            </div>
                                        </div>

                                        <div className="feature-item mb-3">
                                            <div className="d-flex justify-content-between align-items-start">
                                                <span className="feature-label">Practical<br />Learning:</span>
                                                <span className="feature-value text-end">Real-world<br />Projects</span>
                                            </div>
                                        </div>

                                        <div className="feature-item mb-4">
                                            <div className="d-flex justify-content-between align-items-start">
                                                <span className="feature-label">Learn<br />From:</span>
                                                <span className="feature-value text-end">Certified<br />Professionals</span>
                                            </div>
                                        </div>

                                        <motion.button
                                            className="btn enquire-now-btn w-100"
                                            onClick={() => navigate('/enroll')}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            Enquire Now <span className="arrow">→</span>
                                        </motion.button>
                                    </Card.Body>
                                </Card>
                            </motion.div>

                            <motion.div
                                whileHover={{ scale: 1.01 }}
                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                            >
                                <Card className="modern-sidebar-card border-0 shadow-sm overflow-hidden">
                                    <Card.Body className="p-4">
                                        <h3 className="sidebar-header">Latest Course</h3>
                                        <div className="header-divider mb-4 blue"></div>
                                        <div>
                                            {latestCourses.filter(c => c.id !== course.id).map((c, i) => (
                                                <motion.div
                                                    key={i}
                                                    className="latest-course-item mb-3 cursor-pointer"
                                                    onClick={() => navigate(`/course-details/${c.id}`)}
                                                    whileHover={{ x: 5 }}
                                                >
                                                    <div className="d-flex align-items-center gap-3">
                                                        <div className="latest-course-icon">
                                                            {c.image ? (
                                                                <img src={getImageUrl(c.image)} alt={c.title} />
                                                            ) : (
                                                                <i className="bi bi-code-square"></i>
                                                            )}
                                                        </div>
                                                        <div className="flex-grow-1">
                                                            <div className="by-special-programs">BY SPECIAL PROGRAMS</div>
                                                            <h6 className="latest-course-title mb-0">{c.title}</h6>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </Card.Body>
                                </Card>
                            </motion.div>
                        </motion.div>
                    </Col>
                </Row>
            </Container>
        </motion.div>
    );
};

export default CourseDetails;
