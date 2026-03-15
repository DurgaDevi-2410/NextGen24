import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import teamImg from '../assets/team.jpg';
import { FaInstagram, FaYoutube, FaDatabase } from 'react-icons/fa';
import './AboutUs.css';
import './StatsSection.css';

import api from '../api/axios';

const AboutUs = () => {
    // carousel state
    const [carouselImages, setCarouselImages] = useState([
        "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1771&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=1770&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1556761175-b413da4baf72?q=80&w=1774&auto=format&fit=crop",
    ]);

    const [aboutData, setAboutData] = useState({
        hero: {
            heading: "Keeps Going And<br /><span style='color: #d11e1e'>Going And Going</span>",
            quote: "Success is not the key to happiness. Happiness is the key to success. If you love what you are doing, you will be successful.",
            author: "Albert Schweitzer",
            carouselImages: []
        },
        who_we_are: {
            subtitle: "Who We Are",
            heading: "Driven by <span class='highlight-maroon'>Purpose</span>",
            description: "We are a team of visionaries dedicated to redefining standards. Our journey is fueled by passion and a relentless pursuit of excellence. Every project is a canvas, and we paint it with innovation.",
            images: []
        },
        stats: {
            heading: "Number that<br />Guarantee Success",
            description: "The success of an influencer marketing campaign ultimately depends on the brand's specific goals and how well the campaign aligns with those goals",
            stats: []
        },
        mission: {
            subtitle: "Our Mission",
            heading: "Crafting the <span class='highlight-maroon'>Future</span>",
            description: "We don't just follow trends; we set them. Our mission is to empower businesses with tools that stand the test of time. Join us in building a legacy of quality and integrity.",
            image: ""
        }
    });

    useEffect(() => {
        const fetchAboutContent = async () => {
            try {
                const response = await api.get('about-content/');
                console.log('About content API response:', response.data);

                const dataMap = {};
                response.data.forEach(item => {
                    dataMap[item.section_name] = item.data;
                });

                console.log('Parsed data map:', dataMap);

                if (Object.keys(dataMap).length > 0) {
                    setAboutData(prev => ({
                        hero: dataMap.hero || prev.hero,
                        who_we_are: dataMap['who-we-are'] || prev.who_we_are,
                        stats: dataMap.stats || prev.stats,
                        mission: dataMap.mission || prev.mission
                    }));

                    console.log('Who We Are images:', dataMap['who-we-are']?.images);

                    if (dataMap.hero?.carouselImages && dataMap.hero.carouselImages.length > 0) {
                        setCarouselImages(dataMap.hero.carouselImages);
                    }
                }
            } catch (error) {
                console.error("Error fetching about content:", error);
            }
        };
        fetchAboutContent();
    }, []);

    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [transitionType, setTransitionType] = useState(0);

    // Auto-change image every 4 seconds with different transitions
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((prevIndex) => (prevIndex + 1) % carouselImages.length);
            setTransitionType((prevType) => (prevType + 1) % 4); // Cycle through 4 transition types
        }, 4000);

        return () => clearInterval(interval);
    }, [carouselImages.length]);

    // Different transition variants for carousel
    const getImageTransition = () => {
        switch (transitionType) {
            case 0: // Fade + Slide from right
                return {
                    initial: { opacity: 0, x: 100 },
                    animate: { opacity: 1, x: 0 },
                    exit: { opacity: 0, x: -100 },
                    transition: { duration: 1, ease: "easeInOut" }
                };
            case 1: // Zoom in
                return {
                    initial: { opacity: 0, scale: 0.8 },
                    animate: { opacity: 1, scale: 1 },
                    exit: { opacity: 0, scale: 1.2 },
                    transition: { duration: 1, ease: "easeInOut" }
                };
            case 2: // Fade + Slide from left
                return {
                    initial: { opacity: 0, x: -100 },
                    animate: { opacity: 1, x: 0 },
                    exit: { opacity: 0, x: 100 },
                    transition: { duration: 1, ease: "easeInOut" }
                };
            case 3: // Fade + Rotate
                return {
                    initial: { opacity: 0, scale: 0.9, rotate: -5 },
                    animate: { opacity: 1, scale: 1, rotate: 0 },
                    exit: { opacity: 0, scale: 0.9, rotate: 5 },
                    transition: { duration: 1, ease: "easeInOut" }
                };
            default:
                return {
                    initial: { opacity: 0 },
                    animate: { opacity: 1 },
                    exit: { opacity: 0 },
                    transition: { duration: 1 }
                };
        }
    };

    // Theme Color (Maroon)
    const THEME_COLOR = "#e31e24";
    const THEME_ACCENT = "#c4191f";

    // Animation Variants
    const slideInLeft = {
        hidden: { x: -100, opacity: 0 },
        visible: { x: 0, opacity: 1, transition: { duration: 1, ease: "easeOut" } }
    };
    const fadeInZoom = {
        hidden: { opacity: 0, scale: 0.7 },
        visible: { opacity: 1, scale: 1, transition: { duration: 1.5, ease: [0.4, 0, 0.2, 1] } }
    };
    const slideInRight = {
        hidden: { x: 50, opacity: 0 },
        visible: { x: 0, opacity: 1, transition: { duration: 1, ease: "easeOut", delay: 0.2 } }
    };
    const slideUpSlow = {
        hidden: { y: 100, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { duration: 1.5, ease: "easeOut", delay: 0.2 } }
    };
    const fadeInUp = {
        hidden: { y: 30, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { duration: 0.8, delay: 0.4 } }
    };

    // Standard Variants for lower sections
    const sectionContainerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.2, delayChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 }, // Reduced distance for subtle slide
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.8,
                ease: [0.4, 0, 0.2, 1] // Smooth ease-in-out curve
            }
        }
    };

    const imageVariants = {
        hidden: { opacity: 0, scale: 0.95, y: 20 },
        visible: {
            opacity: 1,
            scale: 1,
            y: 0,
            transition: { duration: 0.8, ease: "easeOut" }
        }
    };

    // 3D Button Variants
    const button3DVariant = {
        rest: {
            scale: 1,
            rotateX: 0,
            rotateY: 0,
            boxShadow: "0px 0px 0px rgba(0,0,0,0)"
        },
        hover: {
            scale: 1.1,
            rotateX: 10,
            rotateY: 10,
            y: -5,
            boxShadow: "10px 10px 20px rgba(0,0,0,0.4), -2px -2px 5px rgba(255,255,255,0.1)",
            transition: { type: "spring", stiffness: 300, damping: 20 }
        },
        tap: {
            scale: 0.95,
            rotateX: 0,
            rotateY: 0,
            y: 0,
            boxShadow: "inset 0px 0px 10px rgba(0,0,0,0.3)"
        }
    };

    return (
        <div className="about-wrapper" style={{ overflowX: 'hidden', paddingTop: '0', margin: 0 }}>

            {/* 
                Dark Hero Section - Maroon Theme Adapted
                Alignment Fixed: Reduced height, tighter spacing.
            */}
            <div className="hero-wrapper">

                {/* 1. Background Decor: Animated Gear/Cog Watermark */}
                <motion.div
                    animate={{
                        rotate: 360,
                        scale: [1, 1.05, 1]
                    }}
                    transition={{
                        rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                        scale: { duration: 3, repeat: Infinity, ease: "easeInOut" }
                    }}
                    style={{
                        position: 'absolute', top: '10%', left: '45%',
                        width: '350px', height: '350px',
                        border: '35px dashed #222',
                        borderRadius: '50%',
                        opacity: 0.08,
                        zIndex: 0
                    }}
                ></motion.div>

                {/* 2. Background Decor: Arrow (Bottom Right) */}
                <svg style={{ position: 'absolute', bottom: '0', right: '0', width: '200px', zIndex: 0 }} viewBox="0 0 200 100">
                    <path d="M0,100 Q100,50 200,0" fill="none" stroke={THEME_COLOR} strokeWidth="15" strokeLinecap="round" opacity="0.4" />
                    <path d="M180,20 L200,0 L170,0" fill={THEME_COLOR} opacity="0.4" />
                </svg>

                <div className="hero-container">

                    {/* LEFT: Image with Curve */}
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={fadeInZoom}
                        className="hero-image-section"
                        style={{}} // Empty style to override any defaults if needed, but classes handle it now
                    >
                        {/* Heading Decor Shapes */}
                        <div style={{ position: 'absolute', bottom: '40px', left: '40px', zIndex: 20, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <div style={{ width: '50px', height: '60px', background: THEME_COLOR, clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)', boxShadow: '0 10px 20px rgba(0,0,0,0.3)' }}></div>
                            <div style={{ width: '35px', height: '40px', background: '#333', marginLeft: '25px', clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}></div>
                        </div>

                        {/* Fixed Container with Shape - stays constant */}
                        <div style={{
                            width: '100%',
                            height: '100%',
                            position: 'relative',
                            borderRadius: '0 250px 250px 0',
                            border: '4px solid #2d2d2d',
                            boxShadow: '25px 0 60px rgba(0,0,0,0.6)',
                            overflow: 'hidden'
                        }}>
                            {/* Image Carousel - dynamic transitions */}
                            <AnimatePresence initial={false}>
                                <motion.img
                                    key={currentImageIndex}
                                    src={carouselImages[currentImageIndex]}
                                    alt="Team Working"
                                    {...getImageTransition()}
                                    style={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover'
                                    }}
                                />
                            </AnimatePresence>
                        </div>
                    </motion.div>

                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={slideUpSlow}
                        className="hero-text-section"
                    >
                        <h1 className="hero-heading" dangerouslySetInnerHTML={{ __html: aboutData.hero.heading }}>
                        </h1>

                        <p className="hero-quote">
                            "{aboutData.hero.quote}"
                        </p>

                        <p className="hero-author">
                            - {aboutData.hero.author}
                        </p>

                        <motion.div
                            variants={fadeInUp}
                            className="hero-buttons"
                        >
                            {/* 3D Button 1: Join Now (Solid) */}
                            <motion.button
                                variants={button3DVariant}
                                initial="rest"
                                whileHover="hover"
                                whileTap="tap"
                                className="hero-btn-primary"
                            >
                                Join now
                            </motion.button>

                            {/* 3D Button 2: Learn More (Outline/Glass) */}
                            <motion.button
                                variants={button3DVariant}
                                initial="rest"
                                whileHover={{ ...button3DVariant.hover, backgroundColor: 'rgba(255,255,255,0.05)' }}
                                whileTap="tap"
                                className="hero-btn-outline"
                            >
                                Learn More
                            </motion.button>
                        </motion.div>

                    </motion.div>

                </div>
            </div>

            {/* Rest of Page Content */}
            <section className="content-section">
                <div className="container">
                    <motion.div
                        className="text-column box-3d"
                        variants={sectionContainerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                    >
                        <motion.h4 className="sub-heading" variants={itemVariants}>{aboutData.who_we_are.subtitle}</motion.h4>
                        <motion.h1 className="main-heading" variants={itemVariants} dangerouslySetInnerHTML={{ __html: aboutData.who_we_are.heading }}>
                        </motion.h1>
                        <motion.p className="description" variants={itemVariants}>
                            {aboutData.who_we_are.description}
                        </motion.p>
                        <motion.button
                            className="maroon-btn"
                            variants={itemVariants}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Read More
                        </motion.button>
                    </motion.div>

                    <motion.div
                        className="image-column"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={imageVariants}
                    >
                        <div className="image-wrapper">
                            <div className="image-bg-shape"></div>
                            <div className="image-card">
                                <img
                                    src={aboutData.who_we_are.images && aboutData.who_we_are.images.length > 0 ? aboutData.who_we_are.images[0] : teamImg}
                                    alt="Our Team"
                                    className="feature-image"
                                    onLoad={() => console.log('Who We Are image loaded successfully:', aboutData.who_we_are.images?.[0])}
                                    onError={(e) => {
                                        console.error('Failed to load Who We Are image:', aboutData.who_we_are.images?.[0]);
                                        console.error('Error event:', e);
                                        e.target.src = teamImg; // Fallback to default image
                                    }}
                                />
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            <section className="content-section">
                <div className="container">
                    <motion.div
                        className="image-column"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={imageVariants}
                    >
                        <div className="image-wrapper">
                            <div className="image-bg-shape"></div>
                            <div className="image-card">
                                <img
                                    src={aboutData.mission.image || "https://picsum.photos/seed/maroon/800/600"}
                                    alt="Our Mission"
                                    className="feature-image"
                                    onLoad={() => console.log('Mission image loaded successfully:', aboutData.mission.image)}
                                    onError={(e) => {
                                        console.error('Failed to load Mission image:', aboutData.mission.image);
                                        e.target.src = "https://picsum.photos/seed/maroon/800/600";
                                    }}
                                />
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        className="text-column box-3d"
                        variants={sectionContainerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                    >
                        <motion.h4 className="sub-heading" variants={itemVariants}>{aboutData.mission.subtitle}</motion.h4>
                        <motion.h1 className="main-heading" variants={itemVariants} dangerouslySetInnerHTML={{ __html: aboutData.mission.heading }}>
                        </motion.h1>
                        <motion.p className="description" variants={itemVariants}>
                            {aboutData.mission.description}
                        </motion.p>
                        <motion.button
                            className="maroon-btn"
                            variants={itemVariants}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Our Vision
                        </motion.button>
                    </motion.div>
                </div>
            </section>

            {/* NEW STATS SECTION */}
            <section className="stats-section-dark">
                <div className="stats-container">

                    {/* Left: Text Content */}
                    <motion.div
                        className="stats-text-content"
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="icon-badge">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2Z" fill="#FFD700" />
                            </svg>
                        </div>
                        <h2 className="stats-heading" dangerouslySetInnerHTML={{ __html: aboutData.stats.heading }}>
                        </h2>
                        <p className="stats-description">
                            {aboutData.stats.description}
                        </p>
                    </motion.div>

                    {/* Right: Floating Cards */}
                    <div className="stats-cards-wrapper">

                        {aboutData.stats.stats && aboutData.stats.stats.map((stat, idx) => (
                            <motion.div
                                key={stat.id || idx}
                                className={`stat-card card-${idx % 3 === 0 ? 'instagram' : idx % 3 === 1 ? 'database' : 'youtube'}`}
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: 0.2 * (idx + 1) }}
                                whileHover={{ scale: 1.05, translateY: -10 }}
                            >
                                <div className="stat-icon-wrapper" style={{ backgroundColor: stat.iconColor }}>
                                    {idx % 3 === 0 ? <FaInstagram /> : idx % 3 === 1 ? <FaDatabase /> : <FaYoutube />}
                                </div>
                                <h3 className="stat-number">{stat.value}</h3>
                                <p className="stat-label" dangerouslySetInnerHTML={{ __html: stat.label }}></p>
                                <div className="card-glow-effect"></div>
                            </motion.div>
                        ))}



                    </div>
                </div>
            </section>
        </div>
    );
};

export default AboutUs;
