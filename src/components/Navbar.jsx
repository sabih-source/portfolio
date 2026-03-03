import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import gsap from 'gsap';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const { pathname } = useLocation();

    useEffect(() => {
        setIsOpen(false);
    }, [pathname]);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <nav className="site-nav">
            <div className="nav-container">
                <Link to="/" className="nav-logo heading">S.U.R</Link>

                <div className="desktop-links">
                    <Link to="/" className="nav-link">Home</Link>
                    <Link to="/contact" className="nav-link">Contact</Link>
                </div>

                <button className="mobile-toggle" onClick={toggleMenu} aria-label="Toggle Menu">
                    {isOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
            </div>

            {/* Mobile Menu Overlay */}
            <div className={`mobile-menu ${isOpen ? 'active' : ''}`}>
                <div className="mobile-links">
                    <Link to="/" className="mobile-link" onClick={() => setIsOpen(false)}>Home</Link>
                    <Link to="/contact" className="mobile-link" onClick={() => setIsOpen(false)}>Contact</Link>
                </div>
            </div>
        </nav>
    );
}
