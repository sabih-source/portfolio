import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ArrowLeft, Github, Linkedin, Twitter, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ContactPage() {
    const containerRef = useRef(null);
    const bgRef = useRef(null);
    const formRef = useRef(null);

    // Background shapes configuration
    const shapesData = Array.from({ length: 15 }).map((_, i) => {
        const size = Math.random() * 200 + 50;
        return {
            id: i,
            size,
            x: Math.random() * 100, // stored as vw
            y: Math.random() * 100, // stored as vh
            type: i % 3 === 0 ? 'ring' : i % 3 === 1 ? 'orb' : 'triangle',
            depth: Math.random() * 2 + 0.5, // Parallax depth multiplier
            rotationSpeed: (Math.random() - 0.5) * 5,
        };
    });

    const shapeRefs = useRef([]);

    useEffect(() => {
        // 1. Entry Warp Transition
        const tl = gsap.timeline();
        tl.fromTo(containerRef.current,
            { opacity: 0, scale: 0.9, z: -500, rotationX: 10 },
            { opacity: 1, scale: 1, z: 0, rotationX: 0, duration: 1.2, ease: "power4.out" }
        );

        tl.fromTo(formRef.current.children,
            { opacity: 0, y: 50, rotationY: 15 },
            { opacity: 1, y: 0, rotationY: 0, stagger: 0.1, duration: 0.8, ease: "back.out(1.2)" },
            "-=0.6"
        );

        // 2. Continuous floating animation for shapes
        shapeRefs.current.forEach((shape, i) => {
            if (!shape) return;

            const data = shapesData[i];

            // Infinite rotate mapping based on type
            gsap.to(shape, {
                rotation: 360 * (data.rotationSpeed > 0 ? 1 : -1),
                duration: 20 + Math.random() * 20,
                repeat: -1,
                ease: "none"
            });

            // Infinite drift mapping
            gsap.to(shape, {
                x: `+=${(Math.random() - 0.5) * 100}`,
                y: `+=${(Math.random() - 0.5) * 100}`,
                duration: 15 + Math.random() * 10,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut"
            });
        });

        // 3. Mouse positional mapping for gravity pull (Parallax)
        const onMouseMove = (e) => {
            if (!bgRef.current) return;
            const xObj = (e.clientX / window.innerWidth - 0.5) * 2; // -1 to 1
            const yObj = (e.clientY / window.innerHeight - 0.5) * 2;

            shapeRefs.current.forEach((shape, i) => {
                if (!shape) return;
                const depth = shapesData[i].depth;

                gsap.to(shape, {
                    x: xObj * 50 * depth,
                    y: yObj * 50 * depth,
                    duration: 1,
                    ease: "power2.out",
                    overwrite: "auto"
                });
            });
        };

        window.addEventListener("mousemove", onMouseMove);
        return () => window.removeEventListener("mousemove", onMouseMove);
    }, []);

    return (
        <div
            ref={containerRef}
            style={{
                position: 'relative',
                minHeight: '100vh',
                backgroundColor: 'var(--color-black)',
                color: 'var(--color-white)',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                perspective: '1200px',
                padding: '2rem'
            }}
        >
            {/* Animated Background Layer */}
            <div
                ref={bgRef}
                style={{
                    position: 'absolute',
                    top: 0, left: 0, width: '100%', height: '100%',
                    pointerEvents: 'none',
                    zIndex: 0
                }}
            >
                {shapesData.map((data, i) => {
                    let clipPath = 'none';
                    let border = 'none';
                    let bg = 'none';

                    if (data.type === 'ring') {
                        border = '2px solid rgba(255,255,255,0.05)';
                        bg = 'transparent';
                    } else if (data.type === 'orb') {
                        bg = 'radial-gradient(circle, rgba(255,255,255,0.08) 0%, rgba(0,0,0,0) 70%)';
                    } else if (data.type === 'triangle') {
                        bg = 'rgba(255,255,255,0.03)';
                        clipPath = 'polygon(50% 0%, 0% 100%, 100% 100%)';
                    }

                    return (
                        <div
                            key={data.id}
                            ref={el => shapeRefs.current[i] = el}
                            style={{
                                position: 'absolute',
                                top: `${data.y}vh`,
                                left: `${data.x}vw`,
                                width: `${data.size}px`,
                                height: `${data.size}px`,
                                borderRadius: data.type === 'orb' || data.type === 'ring' ? '50%' : '0',
                                border: border,
                                background: bg,
                                clipPath: clipPath,
                                transformStyle: 'preserve-3d',
                                backdropFilter: 'blur(4px)',
                            }}
                        />
                    );
                })}
            </div>

            <div style={{ position: 'absolute', top: '2rem', left: '2rem', zIndex: 10 }}>
                <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', color: '#fff', textDecoration: 'none', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>
                    <ArrowLeft size={20} style={{ marginRight: '8px' }} /> Return
                </Link>
            </div>

            <div
                ref={formRef}
                style={{
                    position: 'relative',
                    zIndex: 5,
                    maxWidth: '600px',
                    width: '100%',
                    backgroundColor: 'rgba(17, 17, 17, 0.4)',
                    border: '1px solid rgba(255,255,255,0.05)',
                    backdropFilter: 'blur(20px)',
                    padding: '4rem',
                    borderRadius: '24px',
                    boxShadow: '0 40px 100px rgba(0,0,0,0.5)',
                    transformStyle: 'preserve-3d'
                }}
            >
                <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <h1 className="heading" style={{ fontSize: 'clamp(3rem, 6vw, 4.5rem)' }}>Let's Build Something</h1>
                    <p className="text-body" style={{ color: '#aaa', marginTop: '1rem', fontSize: '1.1rem' }}>
                        Open to opportunities &bull; AI and Frontend Development
                    </p>
                </div>

                <form onSubmit={e => e.preventDefault()} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div>
                        <input
                            type="text"
                            placeholder="Your Name"
                            style={{
                                width: '100%', padding: '1rem 1.5rem', borderRadius: '12px',
                                border: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'rgba(255,255,255,0.03)',
                                color: '#fff', fontSize: '1rem', outline: 'none', fontFamily: 'inherit'
                            }}
                        />
                    </div>
                    <div>
                        <input
                            type="email"
                            placeholder="Your Email"
                            style={{
                                width: '100%', padding: '1rem 1.5rem', borderRadius: '12px',
                                border: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'rgba(255,255,255,0.03)',
                                color: '#fff', fontSize: '1rem', outline: 'none', fontFamily: 'inherit'
                            }}
                        />
                    </div>
                    <div>
                        <textarea
                            placeholder="Your Message..."
                            rows={5}
                            style={{
                                width: '100%', padding: '1rem 1.5rem', borderRadius: '12px',
                                border: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'rgba(255,255,255,0.03)',
                                color: '#fff', fontSize: '1rem', outline: 'none', fontFamily: 'inherit', resize: 'vertical'
                            }}
                        />
                    </div>
                    <button
                        type="submit"
                        className="btn btn-white"
                        style={{ width: '100%', marginTop: '1rem', padding: '1.2rem', fontSize: '1rem' }}
                    >
                        Send Message
                    </button>
                </form>

                <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginTop: '3rem' }}>
                    <a href="https://github.com/sabih-source/" target="_blank" rel="noopener noreferrer" style={{ color: '#fff', transition: 'color 0.3s' }}><Github size={24} /></a>
                    <a href="#linkedin" style={{ color: '#fff', transition: 'color 0.3s' }}><Linkedin size={24} /></a>
                    <a href="#twitter" style={{ color: '#fff', transition: 'color 0.3s' }}><Twitter size={24} /></a>
                    <a href="#email" style={{ color: '#fff', transition: 'color 0.3s' }}><Mail size={24} /></a>
                </div>
            </div>
        </div>
    );
}
