import React, { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import CodeMomentumExperience from './components/CodeMomentumExperience';
import PostHeroSections from './components/PostHeroSections';
import CustomCursor from './components/CustomCursor';
import ContactPage from './components/ContactPage';
import Navbar from './components/Navbar';
import ScrollToTopButton from './components/ScrollToTopButton';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

function ScrollToTop() {
    const { pathname } = useLocation();
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);
    return null;
}

function Home() {
    return (
        <>
            <CodeMomentumExperience />
            <PostHeroSections />
        </>
    );
}

function App() {
    const lenisRef = useRef(null);

    useEffect(() => {
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            direction: 'vertical',
            gestureDirection: 'vertical',
            smooth: true,
            mouseMultiplier: 1,
            smoothTouch: false,
            touchMultiplier: 2,
            infinite: false,
        });
        lenisRef.current = lenis;

        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);

        // Sync Lenis with GSAP ScrollTrigger
        // Technically only needed if you want Lenis to update GSAP before native scroll events
        lenis.on('scroll', ScrollTrigger.update);
        gsap.ticker.add((time) => {
            lenis.raf(time * 1000);
        });
        gsap.ticker.lagSmoothing(0, 0);

        return () => {
            lenis.destroy();
            gsap.ticker.remove((time) => {
                lenis.raf(time * 1000);
            });
        };
    }, []);

    return (
        <Router basename="/portfolio">
            <ScrollToTop />
            <div className="app-container">
                <Navbar />
                <CustomCursor />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/contact" element={<ContactPage />} />
                </Routes>
                <ScrollToTopButton />
            </div>
        </Router>
    );
}

export default App;
