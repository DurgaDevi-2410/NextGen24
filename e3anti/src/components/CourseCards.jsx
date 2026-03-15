import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { motion, useScroll, useSpring } from 'framer-motion';
import coursesData from '../coursesData';
import api from '../api/axios';
import './CourseCards.css';

const CourseCard = ({ course, index, isActive }) => {
    const navigate = useNavigate();

    const handleTitleClick = () => {
        navigate(`/course-details/${course.id}`); // Navigate with ID
    };

    const imageUrl = course.image && course.image.startsWith('http') ? course.image : `http://localhost:8000${course.image}`;

    return (
        <motion.div
            className={`course-card-wrapper ${isActive ? 'active' : ''}`}
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
        >
            <motion.div
                className="course-card-3d"
                whileHover={{ rotateY: 5, rotateX: -2, translateZ: 10 }}
            >
                {/* Shimmer Mask */}
                <div className="shimmer-mask"></div>

                {/* Floating Icon */}
                <div className="floating-icon-container">
                    {course.image ? (
                        <img src={imageUrl} alt={course.title} className="course-icon-img" />
                    ) : (
                        <span className="course-icon-placeholder" style={{ color: course.icon_color }}>{course.icon_text}</span>
                    )}
                </div>

                {/* Badge Reveal - Blue pill from image */}
                <motion.div initial={{ x: -10, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }} transition={{ delay: (index * 0.1) + 0.2 }}>
                    <span className="badge-duration-pill">{course.duration}</span>
                </motion.div>

                {/* Stars Staggered Pop - Red stars from image */}
                <div className="rating-stars">
                    {[...Array(parseInt(course.rating || 5))].map((_, i) => (
                        <span key={i} style={{ animationDelay: `${(index * 0.1) + (i * 0.1) + 0.3}s` }}>★</span>
                    ))}
                </div>

                <h3 className="course-title-3d" onClick={handleTitleClick} style={{ cursor: 'pointer' }}>
                    {course.title}
                </h3>

                <div className="card-footer-block">
                    <span className="footer-text-primary">{course.mode_text || "In-center & Online"}</span>
                    <span className="footer-text-primary" style={{ marginTop: '2px' }}>{course.placement_text || "100% Placement Support"}</span>
                </div>
            </motion.div>
        </motion.div>
    );
};

const CourseCards = () => {
    const [courses, setCourses] = useState([]);
    const [activePageIndex, setActivePageIndex] = useState(0);
    const [activeCardIndex, setActiveCardIndex] = useState(0);
    const [cardsPerPage, setCardsPerPage] = useState(3);
    const scrollContainerRef = useRef(null);
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await api.get('courses/');
                setCourses(response.data);
            } catch (error) {
                console.error("Error fetching courses:", error);
                setCourses(coursesData); // Fallback
            }
        };
        fetchCourses();
    }, []);

    // Function to calculate cards per page based on window width
    const updateCardsPerPage = () => {
        const width = window.innerWidth;
        if (width <= 768) {
            setCardsPerPage(1);
        } else if (width <= 992) {
            setCardsPerPage(2);
        } else {
            setCardsPerPage(3);
        }
    };

    // Reset scroll position and check cards per page
    React.useEffect(() => {
        updateCardsPerPage();
        window.addEventListener('resize', updateCardsPerPage);

        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollLeft = 0;
            setActivePageIndex(0);
            setActiveCardIndex(0);
        }

        return () => window.removeEventListener('resize', updateCardsPerPage);
    }, []);

    const handleScroll = () => {
        if (scrollContainerRef.current) {
            const container = scrollContainerRef.current;
            const scrollLeft = container.scrollLeft;
            const containerWidth = container.offsetWidth;

            // Logic to find active card index
            const width = window.innerWidth;
            let currentCardWidth = 450;
            let currentGap = 20;
            if (width <= 768) { currentCardWidth = 300; currentGap = 15; }
            else if (width <= 992) { currentCardWidth = 380; currentGap = 20; }

            const index = Math.round(scrollLeft / (currentCardWidth + currentGap));
            setActiveCardIndex(index);

            // Update page index for dots (keeping previous logic but adjusted for gap)
            const pageIndex = Math.min(
                Math.round(scrollLeft / (containerWidth + currentGap)),
                Math.ceil(courses.length / cardsPerPage) - 1
            );
            setActivePageIndex(pageIndex);
        }
    };

    const scrollRight = () => {
        if (scrollContainerRef.current) {
            const container = scrollContainerRef.current;
            container.scrollBy({ left: container.offsetWidth, behavior: 'smooth' });
        }
    };

    const scrollLeftNav = () => {
        if (scrollContainerRef.current) {
            const container = scrollContainerRef.current;
            container.scrollBy({ left: -container.offsetWidth, behavior: 'smooth' });
        }
    };

    // Calculate total pages dynamically
    const totalPages = Math.ceil(courses.length / cardsPerPage);

    return (
        <motion.section
            className="course-section-container py-5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
        >
            {/* Scroll Progress Bar */}
            <motion.div className="scroll-progress-bar" style={{ scaleX }} />

            <Container fluid>
                {/* Header Text */}
                <div className="text-center mb-5" style={{ marginTop: '3rem' }}>
                    <h2 className="fw-bold mb-3" style={{ color: '#e31e24', fontSize: '2.5rem', fontWeight: '800' }}>
                        Learn Anytime. Learn Anywhere.
                    </h2>
                    <p className="mx-auto" style={{ color: '#64748b', fontSize: '1.2rem', maxWidth: '700px', lineHeight: '1.6' }}>
                        Join our online and offline courses designed to give you practical knowledge, expert guidance, and career-ready skills.
                    </p>
                </div>

                {/* Navigation Pills REMOVED as per request */}

                {/* Scrollable Cards Section */}
                <Container fluid>
                    <div className="courses-scroll-wrapper">
                        {/* Left Arrow */}
                        {courses.length > cardsPerPage && (
                            <button className="scroll-arrow-btn scroll-arrow-left" onClick={scrollLeftNav} aria-label="Scroll Left">
                                &#10094;
                            </button>
                        )}

                        {/* Scroll Container */}
                        <div
                            className="courses-scroll-container"
                            ref={scrollContainerRef}
                            onScroll={handleScroll}
                        >
                            {courses.length > 0 ? (
                                courses.map((course, index) => (
                                    <CourseCard
                                        key={index}
                                        course={course}
                                        index={index}
                                        isActive={activeCardIndex === index}
                                    />
                                ))
                            ) : (
                                <div className="text-center text-muted py-5 w-100">
                                    <h4>No courses found.</h4>
                                </div>
                            )}
                        </div>

                        {/* Right Arrow */}
                        {courses.length > cardsPerPage && (
                            <button className="scroll-arrow-btn scroll-arrow-right" onClick={scrollRight} aria-label="Scroll Right">
                                &#10095;
                            </button>
                        )}
                    </div>

                    {/* Pagination Dots */}
                    {totalPages > 1 && (
                        <div className="pagination-dots">
                            {Array.from({ length: totalPages }).map((_, idx) => (
                                <span
                                    key={idx}
                                    className={`dot ${activePageIndex === idx ? "active" : ""}`}
                                    onClick={() => {
                                        if (scrollContainerRef.current) {
                                            const container = scrollContainerRef.current;
                                            const width = window.innerWidth;
                                            let currentGap = width <= 768 ? 15 : 20;
                                            const scrollAmount = container.offsetWidth + currentGap;
                                            container.scrollTo({ left: scrollAmount * idx, behavior: 'smooth' });
                                        }
                                    }}
                                ></span>
                            ))}
                        </div>
                    )}
                </Container>

            </Container>
        </motion.section>
    );
};

export default CourseCards;
