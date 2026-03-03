import React, { useEffect, useRef } from 'react';
import { ArrowLeft, ArrowRight, Code2, Database, Sparkles } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link } from 'react-router-dom';
import Achievements from './Achievements';

gsap.registerPlugin(ScrollTrigger);

export default function PostHeroSections() {
    const carouselWrapperRef = useRef(null);
    const trackRef = useRef(null);
    const cardsRef = useRef([]);

    const projects = [
        { title: "Virtual Try-On App", desc: "An AI-powered virtual try-on application.", tech: "React • GSAP • AI", img: "/assets/ai-tryon.png" },
        { title: "Rainwater System", desc: "A dashboard for environmental metrics.", tech: "React • GSAP • AI", img: "/assets/ai-rainwater.png" }
    ];

    useEffect(() => {
        const wrapper = carouselWrapperRef.current;
        const track = trackRef.current;
        if (!wrapper || !track) return;

        // We calculate horizontal scroll length
        const getScrollAmount = () => -(track.scrollWidth - window.innerWidth + 100);

        // Setup the main horizontal scroll driven by vertical pin
        const slideTween = gsap.to(track, {
            x: getScrollAmount,
            ease: "none",
            scrollTrigger: {
                trigger: wrapper,
                start: "top top",
                end: () => `+=${track.scrollWidth}`, // Scroll amount proportional to content length
                pin: true,
                scrub: 1,
                invalidateOnRefresh: true,
            }
        });

        // 3D twist entering for each card powered by containerAnimation
        cardsRef.current.forEach((card, i) => {
            gsap.fromTo(card,
                { rotationY: 45, opacity: 0, scale: 0.8, x: window.innerWidth / 2 },
                {
                    rotationY: 0, opacity: 1, scale: 1, x: 0,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: card,
                        containerAnimation: slideTween, // GSAP ties this deeply to the horizontal timeline motion
                        start: "left 85%",
                        end: "left 30%",
                        scrub: true,
                        id: `card-${i}`
                    }
                }
            );
        });

        return () => {
            cardsRef.current.forEach((card, i) => {
                const triggers = ScrollTrigger.getById(`card-${i}`);
                if (triggers) triggers.kill();
            });
            if (slideTween.scrollTrigger) slideTween.scrollTrigger.kill();
            slideTween.kill();
        };
    }, []);

    const scrollRight = () => { /* GSAP handles layout override */ };
    const scrollLeft = () => { };

    return (
        <div className="post-hero">

            {/* P1: Portfolio Intro */}
            <section className="section-padding p1-intro">
                <div className="container">
                    <p className="eyebrow">Who I Am</p>
                    <h2 className="intro-title">SABIH UR REHMAN</h2>
                    <p className="intro-subtitle">AI-Augmented Frontend Developer</p>
                    <p className="intro-desc">
                        Specializing in performant, pixel-perfect, and highly interactive user interfaces.
                        Blending cutting-edge web technologies with creative design intuition to engineer scalable digital experiences.
                    </p>
                    <div className="intro-actions">
                        <button className="btn btn-primary">View Projects</button>
                        <Link to="/contact" className="btn btn-secondary">Contact Me</Link>
                    </div>
                </div>
            </section>

            {/* P2: Featured Projects Carousel */}
            <section className="section-padding p2-projects" ref={carouselWrapperRef}>
                <div className="carousel-header">
                    <h3 className="heading" style={{ fontSize: '3rem', margin: 0 }}>Selected Work</h3>
                    <div className="carousel-nav">
                        <button className="nav-btn" onClick={scrollLeft} aria-label="Scroll left" style={{ opacity: 0.5, cursor: 'not-allowed' }}>
                            <ArrowLeft size={24} />
                        </button>
                        <button className="nav-btn" onClick={scrollRight} aria-label="Scroll right" style={{ opacity: 0.5, cursor: 'not-allowed' }}>
                            <ArrowRight size={24} />
                        </button>
                    </div>
                </div>

                <div className="carousel-track-wrapper">
                    <div className="carousel-track" ref={trackRef}>
                        {projects.map((item, index) => (
                            <div
                                key={index}
                                className="project-card"
                                ref={(el) => (cardsRef.current[index] = el)}
                            >
                                <img
                                    src={item.img}
                                    alt={item.title}
                                    className="project-img"
                                />
                                <h4 className="project-title">{item.title}</h4>
                                <p className="project-desc">{item.desc}</p>
                                <span className="tech-label">{item.tech}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* P3: Cinematic Capability Banner */}
            <section className="p3-banner">
                <div className="banner-content">
                    <h2 className="heading banner-title">BUILDING DIGITAL MOMENTUM</h2>
                </div>
            </section>

            {/* P4: Core Expertise Grid */}
            <section className="section-padding p4-expertise">
                <div className="container">
                    <div className="expertise-card">
                        <div className="expertise-icon">
                            <Code2 size={32} />
                        </div>
                        <h3 className="expertise-title heading">Frontend Engineering</h3>
                        <p className="expertise-desc">
                            Crafting responsive, accessible, and highly optimized interfaces using React, Next.js, and modern CSS principles.
                        </p>
                        <a href="#explore" className="btn btn-white expertise-btn">Explore</a>
                    </div>

                    <div className="expertise-card">
                        <div className="expertise-icon">
                            <Database size={32} />
                        </div>
                        <h3 className="expertise-title heading">Backend & Supabase</h3>
                        <p className="expertise-desc">
                            Structuring robust database architectures, authentication flows, and secure API endpoints to power headless frontends.
                        </p>
                        <a href="#explore" className="btn btn-white expertise-btn">Explore</a>
                    </div>

                    <div className="expertise-card">
                        <div className="expertise-icon">
                            <Sparkles size={32} />
                        </div>
                        <h3 className="expertise-title heading">AI-Augmented Workflow</h3>
                        <p className="expertise-desc">
                            Leveraging advanced LLM tooling and generative AI to accelerate development, debugging, and creative ideation.
                        </p>
                        <a href="#explore" className="btn btn-white expertise-btn">Explore</a>
                    </div>
                </div>
            </section>

            {/* P5: Achievements */}
            <Achievements />

            {/* Footer */}
            <footer className="site-footer">
                <div className="footer-grid">
                    <div className="footer-col">
                        <h4 className="heading">S.U.R</h4>
                        <p style={{ color: '#999', fontSize: '0.9rem', lineHeight: 1.6 }}>
                            Crafting immersive digital experiences with modern web technologies.
                        </p>
                    </div>
                    <div className="footer-col">
                        <h4 className="heading">Projects</h4>
                        <a href="#1" className="footer-link">Fintech Dashboard</a>
                        <a href="#2" className="footer-link">E-commerce Headless</a>
                        <a href="#3" className="footer-link">AI SaaS Tooling</a>
                        <a href="#4" className="footer-link">Creative Portfolio</a>
                    </div>
                    <div className="footer-col">
                        <h4 className="heading">Skills</h4>
                        <a href="#skills" className="footer-link">React / Next.js</a>
                        <a href="#skills" className="footer-link">TypeScript</a>
                        <a href="#skills" className="footer-link">CSS / GSAP / WebGL</a>
                        <a href="#skills" className="footer-link">Supabase / Node.js</a>
                    </div>
                    <div className="footer-col">
                        <h4 className="heading">Social</h4>
                        <a href="https://github.com/sabih-source/" target="_blank" rel="noopener noreferrer" className="footer-link">GitHub</a>
                        <a href="#li" className="footer-link">LinkedIn</a>
                        <a href="#tw" className="footer-link">Twitter</a>
                        <Link to="/contact" className="footer-link">Contact Page</Link>
                    </div>
                </div>
                <div className="footer-bottom">
                    &copy; {new Date().getFullYear()} Sabih Ur Rehman. All rights reserved.
                </div>
            </footer>
        </div>
    );
}
