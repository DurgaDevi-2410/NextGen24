import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import 'bootstrap/dist/css/bootstrap.min.css';
import CourseCards from './components/CourseCards';
import CourseDetails from './components/CourseDetails';
import Navbar from './components/Navbar';

import Admin from './components/Admin';
import { SlideProvider } from './context/SlideContext'

import LandingPage from './components/LandingPage';
import AboutUs from './components/AboutUs';
import Placements from './components/Placements';
import Gallery from './components/Gallery';
import ContactUs from './components/ContactUs';
import Trainers from './components/Trainers';
import Login from './components/Login';
import Enroll from './components/Enroll';

// Separate component for Routes to use useLocation
const AnimatedRoutes = () => {
  const location = useLocation();

  // Add robust scroll to hash effect
  React.useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      const scrollToElement = () => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
          return true;
        }
        return false;
      };

      // Try immediately
      if (!scrollToElement()) {
        // If not found, wait for it to appear in the DOM
        const observer = new MutationObserver(() => {
          if (scrollToElement()) {
            observer.disconnect();
          }
        });

        observer.observe(document.body, {
          childList: true,
          subtree: true
        });

        // Timeout as a fallback
        const timeoutId = setTimeout(() => observer.disconnect(), 2000);

        return () => {
          observer.disconnect();
          clearTimeout(timeoutId);
        };
      }
    }
  }, [location]);

  return (
    <SlideProvider>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/placements" element={<Placements />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/courses" element={<CourseCards />} />
          <Route path="/course-details/:id" element={<CourseDetails />} />

          <Route path="/admin" element={<Admin />} />
          <Route path="/login" element={<Login />} />
          <Route path="/contact-us" element={<ContactUs />} />
          <Route path="/trainers" element={<Trainers />} />

          <Route path="/enroll" element={<Enroll />} />

        </Routes>
      </AnimatePresence>
    </SlideProvider>
  );
};

const AppContent = () => {
  const location = useLocation();
  const hideNavbar = location.pathname === '/login';

  return (
    <div className="app-container">
      {!hideNavbar && <Navbar />}
      <AnimatedRoutes />
    </div>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
