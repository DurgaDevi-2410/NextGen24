import { useState, useEffect } from 'react'; // Added useEffect
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import Placement from './components/Placement';
import Course from './components/Course';
import CourseDetails from './components/CourseDetails';
import Enroll from './components/Enroll';
import Gallery from './components/Gallery';
import AboutUs from './components/AboutUs';
import Contact from './components/Contact';
import Trainer from './components/Trainer';
import Login from './components/Login'; // Import Login
import './components/Gallery.css';
import './components/AboutUs.css';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check local storage for auth status on load
    const authStatus = localStorage.getItem('isAuthenticated');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    setIsAuthenticated(false);
  };

  // Protected Route Wrapper could be used, but simple conditional rendering works here too
  const Layout = ({ children }) => (
    <div className={`app-container ${sidebarOpen ? 'sidebar-open' : ''}`}>
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="main-content">
        <Navbar toggleSidebar={toggleSidebar} onLogout={handleLogout} /> {/* Pass logout to Navbar if needed later */}
        <div className="content-body">
          <div className="content-card">
            {children}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <Router>
      <Routes>
        {/* Public Route */}
        <Route path="/login" element={
          isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login onLogin={handleLogin} />
        } />

        {/* Protected Routes */}
        {isAuthenticated ? (
          <>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
            <Route path="/placement" element={<Layout><Placement /></Layout>} />
            <Route path="/course" element={<Layout><Course /></Layout>} />
            <Route path="/course-details/:id" element={<Layout><CourseDetails /></Layout>} />
            <Route path="/enroll" element={<Layout><Enroll /></Layout>} />
            <Route path="/gallery" element={<Layout><Gallery /></Layout>} />
            <Route path="/about" element={<Layout><AboutUs /></Layout>} />
            <Route path="/contact" element={<Layout><Contact /></Layout>} />
            <Route path="/trainer" element={<Layout><Trainer /></Layout>} />
            <Route path="*" element={<Layout><div>Page Not Found</div></Layout>} />
          </>
        ) : (
          <Route path="*" element={<Navigate to="/login" replace />} />
        )}
      </Routes>
    </Router>
  );
}

export default App
