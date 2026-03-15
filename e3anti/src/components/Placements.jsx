import React, { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api/axios';
import './Placements.css';

const PlacementCard = ({ item, index, offset, spreadX }) => {
    const logoUrl = item.logo?.startsWith('http') ? item.logo : `http://localhost:8000${item.logo}`;

    // offset 0 is the center of the arc.
    const rotate = offset * 12;
    const y = Math.pow(Math.abs(offset), 2) * 15;
    const x = offset * spreadX;
    const scale = 1 - Math.abs(offset) * 0.05;
    const opacity = 1 - Math.abs(offset) * 0.1;
    const zIndex = 100 - Math.abs(offset);

    return (
        <motion.div
            className="placement-card-arc"
            style={{ zIndex }}
            initial={false}
            animate={{
                x: `${x}px`,
                y: `${y}px`,
                rotate: `${rotate}deg`,
                scale,
                opacity,
            }}
            transition={{ type: 'spring', stiffness: 120, damping: 20 }}
        >
            <div className="card-corner-badge-red"></div>

            <div className="card-icon-wrapper-simple">
                {item.logo ? (
                    <img src={logoUrl} alt={item.company_name} className="company-icon-simple" />
                ) : (
                    <div className="company-initial">{item.company_name?.[0]}</div>
                )}
            </div>

            <h3 className="company-name-simple">{item.company_name}</h3>
            <p className="job-role-simple">{item.role}</p>
        </motion.div>
    );
};

const Placements = () => {
    const [placements, setPlacements] = useState([]);
    const [pageIndex, setPageIndex] = useState(0);
    const [config, setConfig] = useState({ cardsPerPage: 6, spreadX: 230 });

    const updateConfig = () => {
        const width = window.innerWidth;
        if (width < 480) {
            setConfig({ cardsPerPage: 1, spreadX: 0 });
        } else if (width < 768) {
            setConfig({ cardsPerPage: 2, spreadX: 180 });
        } else if (width < 992) {
            setConfig({ cardsPerPage: 3, spreadX: 200 });
        } else if (width < 1200) {
            setConfig({ cardsPerPage: 4, spreadX: 210 });
        } else {
            setConfig({ cardsPerPage: 6, spreadX: 230 });
        }
    };

    useEffect(() => {
        const fetchPlacements = async () => {
            try {
                const response = await api.get('placements/');
                if (response.data && response.data.length > 0) {
                    setPlacements(response.data);
                }
            } catch (error) {
                console.error("Error fetching placements:", error);
            }
        };
        fetchPlacements();
        updateConfig();
        window.addEventListener('resize', updateConfig);
        return () => window.removeEventListener('resize', updateConfig);
    }, []);

    const totalPages = Math.ceil(placements.length / config.cardsPerPage);

    // Auto-move logic: Change page every 4 seconds
    useEffect(() => {
        if (totalPages <= 1) return;

        const interval = setInterval(() => {
            setPageIndex((prev) => (prev + 1) % totalPages);
        }, 4000);

        return () => clearInterval(interval);
    }, [totalPages, config.cardsPerPage]);

    // Reset page index if totalPages changes (e.g. on resize)
    useEffect(() => {
        setPageIndex(0);
    }, [config.cardsPerPage]);

    // Get the subset of placements for the current page
    const currentPlacements = placements.slice(
        pageIndex * config.cardsPerPage,
        (pageIndex + 1) * config.cardsPerPage
    );

    return (
        <section className="placements-section-modern" id="placements">
            <Container className="d-flex flex-column align-items-center">
                <div className="placements-header-modern text-center">
                    <motion.h1
                        className="placements-title-red"
                        initial={{ y: 20, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        viewport={{ once: true }}
                    >
                        Our Placements
                    </motion.h1>
                    <div className="title-underline-red mx-auto mb-3"></div>
                    <motion.p
                        className="placements-subtitle-modern"
                        initial={{ y: 20, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                    >
                        Showcasing Excellence: Where Our Students Make an Impact
                    </motion.p>
                </div>

                <div className="placements-arc-container">
                    <div className="arc-wrapper">
                        {currentPlacements.map((item, index) => {
                            // Find the midpoint of the current visible set to center the arc
                            const midpoint = (currentPlacements.length - 1) / 2;
                            const offset = index - midpoint;

                            return (
                                <PlacementCard
                                    key={item.id || index}
                                    item={item}
                                    index={index}
                                    offset={offset}
                                    spreadX={config.spreadX}
                                />
                            );
                        })}
                    </div>
                </div>

                {/* Slider Dash/Dots */}
                {totalPages > 1 && (
                    <div className="slider-controls-custom">
                        {Array.from({ length: totalPages }).map((_, idx) => (
                            <div
                                key={idx}
                                className={`slider-dot-dash ${idx === pageIndex ? 'active' : ''}`}
                                onClick={() => setPageIndex(idx)}
                            />
                        ))}
                    </div>
                )}

                {placements.length === 0 && (
                    <p className="text-muted mt-5">No placements data found.</p>
                )}
            </Container>
        </section>
    );
};

export default Placements;
