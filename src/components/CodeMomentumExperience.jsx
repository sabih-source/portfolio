import React, { useEffect, useRef, useState, useMemo } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const TOTAL_FRAMES = 240;

export default function CodeMomentumExperience() {
    const containerRef = useRef(null);
    const ambientCanvasRef = useRef(null);
    const foregroundCanvasRef = useRef(null);

    const [loadedFrames, setLoadedFrames] = useState(0);
    const [isReady, setIsReady] = useState(false);

    const frames = useRef([]);
    const currentFrameIndex = useRef(0);

    // Pad numbers with leading zeros (e.g., 001, 045, 240)
    const getFramePath = (index) => {
        const num = index.toString().padStart(3, '0');
        return `/assets/ezgif-frame-${num}.png`;
    };

    useEffect(() => {
        // 1. Preload frames
        let loaded = 0;
        for (let i = 1; i <= TOTAL_FRAMES; i++) {
            const img = new Image();
            img.src = getFramePath(i);
            img.onload = () => {
                loaded++;
                setLoadedFrames(loaded);
                if (loaded === TOTAL_FRAMES) {
                    setIsReady(true);
                }
            };
            // To handle errors without breaking UI:
            img.onerror = () => {
                loaded++;
                setLoadedFrames(loaded);
                if (loaded === TOTAL_FRAMES) setIsReady(true);
            };
            frames.current[i - 1] = img;
        }
    }, []);

    useEffect(() => {
        if (!isReady) return;

        const ambientCanvas = ambientCanvasRef.current;
        const fgCanvas = foregroundCanvasRef.current;
        if (!ambientCanvas || !fgCanvas) return;

        const ambientCtx = ambientCanvas.getContext('2d', { alpha: false });
        const fgCtx = fgCanvas.getContext('2d');

        // 2. Responsive Canvas Sizing
        const resizeCanvas = () => {
            // In a dual canvas approach with CSS object-fit, we just need to render at natural image resolution to memory, 
            // or to match the window for the best effect. Using natural image size keeps text crisp since CSS handles scaling.
            const firstImg = frames.current[0];
            if (firstImg && firstImg.width) {
                ambientCanvas.width = firstImg.width;
                ambientCanvas.height = firstImg.height;
                fgCanvas.width = firstImg.width;
                fgCanvas.height = firstImg.height;
            } else {
                // Fallback
                ambientCanvas.width = window.innerWidth;
                ambientCanvas.height = window.innerHeight;
                fgCanvas.width = window.innerWidth;
                fgCanvas.height = window.innerHeight;
            }
            renderFrame(currentFrameIndex.current);
        };

        window.addEventListener('resize', resizeCanvas);
        // Initial resize after a tick to make sure DOM is painted
        setTimeout(resizeCanvas, 0);

        const renderFrame = (index) => {
            if (!frames.current[index]) return;
            const img = frames.current[index];

            // Draw ambient (clears implicitly because alpha:false but let's be safe)
            if (ambientCanvas.width !== img.width && img.width > 0) {
                // If first set failed/width changed
                resizeCanvas();
            }

            ambientCtx.clearRect(0, 0, ambientCanvas.width, ambientCanvas.height);
            ambientCtx.drawImage(img, 0, 0, ambientCanvas.width, ambientCanvas.height);

            // Draw foreground
            fgCtx.clearRect(0, 0, fgCanvas.width, fgCanvas.height);
            fgCtx.drawImage(img, 0, 0, fgCanvas.width, fgCanvas.height);
        };

        // Render baseline frame
        renderFrame(0);

        // 3. Setup ScrollTrigger for pin and scrub sequence!
        let ctx = gsap.context(() => {
            const frameObj = { frame: 0 };

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: containerRef.current, // The 100vh wrapper
                    start: 'top top',
                    end: '+=4000', // Scroll for 4000px natively tied directly 
                    pin: true,     // GSAP creates pin-spacer perfectly sealing the 1000px gap
                    scrub: 1.5,    // Fluid smoothing scrub links scroll precisely to animation
                    anticipatePin: 1
                }
            });

            // Animate frames through the sequence smoothly tied to scroll
            tl.to(frameObj, {
                frame: TOTAL_FRAMES - 1,
                snap: 'frame',
                ease: 'none',
                onUpdate: () => renderFrame(frameObj.frame)
            });

            // Add depth/zoom to the astronaut canvas directly linked to scroll depth
            tl.fromTo(foregroundCanvasRef.current,
                { scale: 1 },
                { scale: 1.15, ease: 'none' },
                0
            );

            // CRITICAL BUG FIX: Asynchronous setup throws off calculation offsets downstream.
            // Recalculating immediately fixes the 2000px gap and incorrect flow sequence!
            requestAnimationFrame(() => {
                ScrollTrigger.sort();
                ScrollTrigger.refresh();
            });
        }, containerRef);

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            ctx.revert();
        };
    }, [isReady]);

    return (
        <>
            {!isReady && (
                <div className="loading-overlay">
                    <h2 className="heading" style={{ color: 'white', letterSpacing: '4px' }}>INITIALIZING ENGINE</h2>
                    <p style={{ marginTop: '1rem', opacity: 0.6 }}>{Math.floor((loadedFrames / TOTAL_FRAMES) * 100)}%</p>
                </div>
            )}

            {/* 800vh wrapper triggers scroll scrub */}
            <section className="momentum-wrapper" ref={containerRef}>
                {/* Sticky viewport frame */}
                <div className="momentum-sticky">
                    <div className="canvas-container">
                        <canvas ref={ambientCanvasRef} className="ambient-canvas"></canvas>
                        <canvas ref={foregroundCanvasRef} className="foreground-canvas"></canvas>
                    </div>

                    <div className="hero-overlay">
                        <h1 className="hero-title">SABIH UR REHMAN</h1>
                    </div>
                </div>
            </section>
        </>
    );
}
