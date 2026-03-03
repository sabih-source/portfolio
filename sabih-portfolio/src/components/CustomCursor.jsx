import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function CustomCursor() {
    const cursorRef = useRef(null);
    const ringRef = useRef(null);

    useEffect(() => {
        const cursor = cursorRef.current;
        const ring = ringRef.current;
        if (!cursor || !ring) return;

        // Use QuickTo for latency-free mapping to mouse
        const xToCursor = gsap.quickTo(cursor, "x", { duration: 0.1, ease: "power3" });
        const yToCursor = gsap.quickTo(cursor, "y", { duration: 0.1, ease: "power3" });

        // Smooth trailing ring (magnetic feel)
        const xToRing = gsap.quickTo(ring, "x", { duration: 0.5, ease: "power3" });
        const yToRing = gsap.quickTo(ring, "y", { duration: 0.5, ease: "power3" });

        // Center alignment manually off client pos
        const moveCursor = (e) => {
            xToCursor(e.clientX - 4); // half dot width
            yToCursor(e.clientY - 4);

            xToRing(e.clientX - 20); // half ring width
            yToRing(e.clientY - 20);
        };

        window.addEventListener('mousemove', moveCursor);

        // Scaling effects on interactive elements
        const handleMouseOver = (e) => {
            if (e.target.closest('a') || e.target.closest('button')) {
                gsap.to(ring, {
                    scale: 1.8,
                    backgroundColor: 'rgba(59, 130, 246, 0.15)', // Accent glow 
                    borderColor: 'rgba(59, 130, 246, 0.8)',
                    duration: 0.3
                });
                gsap.to(cursor, { opacity: 0, duration: 0.2 });
            }
        };

        const handleMouseOut = (e) => {
            if (e.target.closest('a') || e.target.closest('button')) {
                gsap.to(ring, {
                    scale: 1,
                    backgroundColor: 'transparent',
                    borderColor: 'rgba(255, 255, 255, 0.5)',
                    duration: 0.3
                });
                gsap.to(cursor, { opacity: 1, duration: 0.2 });
            }
        };

        window.addEventListener('mouseover', handleMouseOver);
        window.addEventListener('mouseout', handleMouseOut);

        return () => {
            window.removeEventListener('mousemove', moveCursor);
            window.removeEventListener('mouseover', handleMouseOver);
            window.removeEventListener('mouseout', handleMouseOut);
        };
    }, []);

    return (
        <>
            <div
                ref={cursorRef}
                style={{
                    position: 'fixed', top: 0, left: 0,
                    width: '8px', height: '8px',
                    backgroundColor: '#fff',
                    borderRadius: '50%',
                    pointerEvents: 'none',
                    zIndex: 10000,
                    mixBlendMode: 'difference'
                }}
            />
            <div
                ref={ringRef}
                style={{
                    position: 'fixed', top: 0, left: 0,
                    width: '40px', height: '40px',
                    borderRadius: '50%',
                    border: '1px solid rgba(255,255,255,0.5)',
                    pointerEvents: 'none',
                    zIndex: 9999,
                    mixBlendMode: 'difference',
                    transformOrigin: 'center'
                }}
            />
        </>
    );
}
