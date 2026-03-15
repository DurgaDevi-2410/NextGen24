import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Navbar as BootstrapNavbar, Nav, Container, NavDropdown, Button } from 'react-bootstrap';
import { motion } from 'framer-motion';
import logoImg from '../assets/e3-logo.png';
import './Navbar.css';

const Navbar = () => {
    const [expanded, setExpanded] = useState(false);
    const location = useLocation();

    return (
        <BootstrapNavbar
            expanded={expanded}
            onToggle={() => setExpanded(!expanded)}
            expand="xl"
            className="main-navbar bg-white shadow-sm py-2 sticky-top"
        >
            <Container>
                <BootstrapNavbar.Brand as={Link} to="/" className="d-flex align-items-center me-4">
                    <div className="logo-wrapper d-flex align-items-center">
                        <h2 className="logo-main mb-0" style={{ fontWeight: '800', fontStyle: 'italic' }}>NEXTGEN</h2>
                    </div>
                </BootstrapNavbar.Brand>

                <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />

                <BootstrapNavbar.Collapse id="basic-navbar-nav">
                    <Nav className="mx-auto nav-links" onSelect={() => setExpanded(false)}>
                        <Nav.Link as={Link} to="/" onClick={() => setExpanded(false)}>Home</Nav.Link>
                        <Nav.Link as={Link} to="/about-us" onClick={() => setExpanded(false)}>About Us</Nav.Link>
                        <Nav.Link as={Link} to="/courses" onClick={() => setExpanded(false)}>Courses</Nav.Link>
                        <Nav.Link as={Link} to="/placements" onClick={() => setExpanded(false)}>Placements</Nav.Link>
                        <Nav.Link as={Link} to="/trainers" onClick={() => setExpanded(false)}>Trainers</Nav.Link>
                        <Nav.Link as={Link} to="/gallery" onClick={() => setExpanded(false)}>Gallery</Nav.Link>
                        <Nav.Link as={Link} to="/contact-us" onClick={() => setExpanded(false)}>Contact</Nav.Link>
                    </Nav>

                    {/* Action Buttons */}
                    <Nav className="nav-actions align-items-center">
                        {/* Pill Login Button */}
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button href="http://localhost:5174/login" variant="light" className="login-btn" onClick={() => setExpanded(false)}>
                                Login
                            </Button>
                        </motion.div>

                        {/* Enroll Button */}
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button as={Link} to="/enroll" variant="info" className="enroll-btn text-white fw-bold" onClick={() => setExpanded(false)}>
                                Enroll Now
                            </Button>
                        </motion.div>
                    </Nav>
                </BootstrapNavbar.Collapse>
            </Container>
        </BootstrapNavbar>
    );
};

export default Navbar;
