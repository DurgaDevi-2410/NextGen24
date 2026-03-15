import React, { useState } from 'react';
import './Login.css';
import monkeyOpen from '../assets/monkey_open.png';
import monkeyClosed from '../assets/monkey_closed.png';
import careerGrowthStar from '../assets/steps_to_star.png';
import { FiEye, FiEyeOff, FiUser, FiMail, FiLock } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const Login = () => {
    // Animation Variants
    const slideUpSlow = {
        hidden: { y: 100, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { duration: 1.2, ease: "easeOut" } }
    };
    const fadeInZoom = {
        hidden: { opacity: 0, scale: 0.8 },
        visible: { opacity: 1, scale: 1, transition: { duration: 1.3, ease: [0.4, 0, 0.2, 1] } }
    };

    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isPasswordFocused, setIsPasswordFocused] = useState(false);

    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isFormFocused, setIsFormFocused] = useState(false);
    const [hasAnimated, setHasAnimated] = useState(false);

    // Disable scroll on body when login is active
    React.useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    const handlePasswordFocus = () => {
        setIsPasswordFocused(true);
        setIsFormFocused(true);
    };
    const handlePasswordBlur = () => {
        setIsPasswordFocused(false);
        setIsFormFocused(false);
    };

    const handleInputFocus = () => setIsFormFocused(true);
    const handleInputBlur = () => setIsFormFocused(false);

    // 3D Tilt Effect
    const handleMouseMove = (e) => {
        const { innerWidth, innerHeight } = window;
        const x = (e.clientX - innerWidth / 2) / 45; // Subtle movement
        const y = (e.clientY - innerHeight / 2) / 45;
        setMousePosition({ x, y });
    };

    return (
        <div className="login-page-wrapper" onMouseMove={handleMouseMove}>
            <motion.div
                className="login-split-container"
                style={{
                    rotateY: mousePosition.x,
                    rotateX: -mousePosition.y,
                    transformStyle: "preserve-3d",
                }}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
            >
                {/* Left Side: Illustration */}
                <motion.div
                    className="illustration-section"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{
                        opacity: 1,
                        scale: 1
                    }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                    style={{ position: 'relative' }}
                >
                    <div className="illustration-content">
                        <img
                            src={careerGrowthStar}
                            alt="Career Growth to Star"
                            className="side-illustration-image"
                        />
                        <h1 className="illustration-heading">Elevate Your Career</h1>
                        <p className="illustration-subtext">Climb the steps to success.</p>
                    </div>
                </motion.div>

                {/* Right Side: Login Form */}
                <motion.div
                    className="form-section"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{
                        y: 0,
                        opacity: 1
                    }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                    style={{ position: 'relative' }}
                >
                    <div className="login-card">
                        <div className="illustration-container">
                            <img
                                src={isPasswordFocused ? monkeyClosed : monkeyOpen}
                                alt="Monkey Illustration"
                                className={`monkey-image ${isPasswordFocused ? 'hidden-eyes' : ''}`}
                            />
                        </div>

                        <AnimatePresence mode='wait'>
                            <motion.div
                                key={isLogin ? 'login' : 'signup'}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                                className="form-content"
                            >
                                <div className="text-content">
                                    <h1 className="heading">{isLogin ? "Welcome Back" : "Join Us"}</h1>
                                    <p className="subtext">{isLogin ? "Enter your credentials to access your account" : "Create a new account to get started"}</p>
                                </div>

                                <form className="login-form" onSubmit={(e) => e.preventDefault()}>
                                    {!isLogin && (
                                        <div className="input-group">
                                            <FiMail className="input-icon" />
                                            <input
                                                type="email"
                                                placeholder="Email Address"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                onFocus={handleInputFocus}
                                                onBlur={handleInputBlur}
                                                spellCheck={false}
                                                className="input-field"
                                            />
                                        </div>
                                    )}

                                    <div className="input-group">
                                        <FiUser className="input-icon" />
                                        <input
                                            type="text"
                                            placeholder="Username"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                            onFocus={handleInputFocus}
                                            onBlur={handleInputBlur}
                                            spellCheck={false}
                                            className="input-field"
                                        />
                                    </div>

                                    <div className="input-group">
                                        <div className="password-wrapper">
                                            <FiLock className="input-icon" />
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                placeholder="Password"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                onFocus={handlePasswordFocus}
                                                onBlur={handlePasswordBlur}
                                                spellCheck={false}
                                                className="input-field password-input"
                                            />
                                            <button
                                                type="button"
                                                className="toggle-password-btn"
                                                onClick={() => setShowPassword(!showPassword)}
                                                tabIndex="-1"
                                            >
                                                {showPassword ? <FiEyeOff /> : <FiEye />}
                                            </button>
                                        </div>
                                    </div>

                                    {isLogin && (
                                        <div className="forgot-password-link">
                                            <a href="#forgot">Forgot Password?</a>
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        className="submit-btn"
                                    >
                                        {isLogin ? "Login" : "Sign Up"}
                                    </button>
                                </form>
                            </motion.div>
                        </AnimatePresence>

                        <div className="toggle-auth-mode">
                            <p>
                                {isLogin ? "Don't have an account? " : "Already have an account? "}
                                <button
                                    type="button"
                                    className="toggle-link"
                                    onClick={() => setIsLogin(!isLogin)}
                                >
                                    {isLogin ? "Sign Up" : "Login"}
                                </button>
                            </p>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default Login;
