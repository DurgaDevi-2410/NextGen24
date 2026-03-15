import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaLinkedinIn, FaTwitter, FaInstagram, FaGlobe } from 'react-icons/fa';
import './Trainers.css';
import api from '../api/axios';

// Framer Motion Variants
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.08,
            delayChildren: 0.05
        }
    }
};

const cardVariants = {
    hidden: {
        opacity: 0,
        y: 20,
        scale: 0.98
    },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            duration: 0.5,
            ease: "easeOut"
        }
    },
    exit: {
        opacity: 0,
        scale: 0.95,
        transition: { duration: 0.3 }
    }
};

const pageVariants = {
    initial: { opacity: 0 },
    animate: {
        opacity: 1,
        transition: { duration: 0.4, ease: "linear" }
    },
    exit: {
        opacity: 0,
        transition: { duration: 0.3, ease: "linear" }
    }
};

const fanContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.05,
            delayChildren: 0.1
        }
    }
};

const fanItemVariants = {
    hidden: {
        y: 50,
        opacity: 0,
        rotate: 0,
        scale: 0.8
    },
    visible: (i) => ({
        y: 0,
        opacity: 1,
        rotate: (i - 2.5) * 10,
        scale: 1,
        transition: {
            type: "spring",
            stiffness: 120,
            damping: 12
        }
    })
};

const Trainers = () => {
    const categories = ["All", "Leadership", "Technical", "Design", "Marketing"];
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [trainers, setTrainers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTrainers();
    }, []);

    const fetchTrainers = async () => {
        try {
            const response = await api.get('trainers/');
            setTrainers(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching trainers:", error);
            setLoading(false);
        }
    };

    // Filter Logic
    const filteredTrainers = trainers.filter(trainer => {
        if (selectedCategory === "All") return true;
        const role = trainer.role.toLowerCase();
        // Since backend category is a string, we might want to check that too if available
        // But assuming we filter by keywords in role for now as per original code logic,
        // OR we can match trainer.category if your model has it.
        // Let's stick to the prompt's role-based logic but extended to check backend 'category' field if it matches

        // Check exact category match from backend data first
        if (trainer.category && trainer.category.toLowerCase().includes(selectedCategory.toLowerCase())) return true;

        if (selectedCategory === "Leadership") return ["lead", "head", "cto", "coo", "manager", "ceo"].some(k => role.includes(k));
        if (selectedCategory === "Technical") return ["developer", "engineer", "guru", "data", "architect"].some(k => role.includes(k));
        if (selectedCategory === "Design") return ["designer", "ux", "ui", "creative"].some(k => role.includes(k));
        if (selectedCategory === "Marketing") return ["marketing", "success", "sales", "brand"].some(k => role.includes(k));
        return false;
    });

    // Top 6 trainers for the Fan/Arc header
    const topTrainers = trainers.slice(0, 6);

    return (
        <motion.div
            className="trainers-page"
            initial="initial"
            animate="animate"
            exit="exit"
            variants={pageVariants}
        >
            {/* Hero Section with Fan Effect - Themed */}
            <div className="trainers-hero-themed">
                <div className="hero-content">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="hero-title-themed"
                    >
                        Meet Our <span className="text-highlight">Team</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.8 }}
                        transition={{ delay: 0.3 }}
                        className="hero-subtitle-themed"
                    >
                        A diverse team of passionate professionals with unique skills driving innovation and excellence.
                    </motion.p>
                </div>

                {/* Fan of Cards */}
                {topTrainers.length > 0 && (
                    <motion.div
                        className="fan-container"
                        variants={fanContainerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        {topTrainers.map((t, i) => (
                            <motion.div
                                key={`fan-${t.id}`}
                                custom={i}
                                variants={fanItemVariants}
                                className="fan-card"
                                style={{ zIndex: topTrainers.length - Math.abs(2.5 - i) }}
                            >
                                <img src={t.image} alt={t.name} />
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </div>

            <div className="main-content-wrapper">
                {/* Filter Section within Main Content */}
                <div className="section-header">
                    <h2>Our Experts</h2>
                    <div className="filter-container">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                className={`filter-btn ${selectedCategory === cat ? 'active' : ''}`}
                                onClick={() => setSelectedCategory(cat)}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Grid Section */}
                {loading ? (
                    <div className="text-center p-5">Loading experts...</div>
                ) : (
                    <motion.div
                        layout
                        className="trainers-grid-container"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        {filteredTrainers.map((trainer) => (
                            <motion.div
                                layout
                                key={trainer.id}
                                className="trainer-card"
                                variants={cardVariants}
                                initial="hidden"
                                animate="visible"
                                exit="hidden"
                            >
                                {/* Image */}
                                <div className="trainer-image-wrapper">
                                    <img src={trainer.image} alt={trainer.name} className="trainer-img" />

                                    {/* Overlay with Socials */}
                                    <div className="trainer-overlay">
                                        <div className="trainer-socials">
                                            {trainer.linkedin && (
                                                <motion.a href={trainer.linkedin} target="_blank" rel="noopener noreferrer" whileHover={{ y: -5, scale: 1.1 }} className="social-icon">
                                                    <FaLinkedinIn />
                                                </motion.a>
                                            )}
                                            {trainer.twitter && (
                                                <motion.a href={trainer.twitter} target="_blank" rel="noopener noreferrer" whileHover={{ y: -5, scale: 1.1 }} className="social-icon">
                                                    <FaTwitter />
                                                </motion.a>
                                            )}
                                            {trainer.github && ( // Using github field as Globe/Website placeholder if needed, or check logic
                                                <motion.a href={trainer.github} target="_blank" rel="noopener noreferrer" whileHover={{ y: -5, scale: 1.1 }} className="social-icon">
                                                    <FaGlobe />
                                                </motion.a>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Text Content */}
                                <div className="trainer-info">
                                    <h3 className="trainer-name">{trainer.name}</h3>
                                    <span className="trainer-role">{trainer.role}</span>
                                    <div className="trainer-divider"></div>
                                    <p className="trainer-bio">{trainer.biography || trainer.bio}</p>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </div>
        </motion.div>
    );
};

export default Trainers;
