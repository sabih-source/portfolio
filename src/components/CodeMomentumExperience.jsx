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
        const baseUrl = import.meta.env.BASE_URL.replace(/\/$/, ''); // Remove trailing slash if exists
        return `${baseUrl}/assets/ezgif-frame-${num}.webp`;
    };

    useEffect(() => {
        // 1. Preload frames
        let loaded = 0;
        const startTime = performance.now();
        const PRIORITY_THRESHOLD = 10; // Load first 10 frames to start fast

        for (let i = 1; i <= TOTAL_FRAMES; i++) {
            const img = new Image();
            img.src = getFramePath(i);

            img.onload = () => {
                loaded++;
                setLoadedFrames(loaded);
                // Trigger "Ready" early so user isn't stuck waiting
                if (loaded === PRIORITY_THRESHOLD) {
                    setIsReady(true);
                }

                if (loaded === TOTAL_FRAMES) {
                    const duration = ((performance.now() - startTime) / 1000).toFixed(2);
                    console.log(`🚀 Performance: All ${TOTAL_FRAMES} frames loaded in ${duration}s`);
                }
            };

            img.onerror = () => {
                loaded++;
                setLoadedFrames(loaded);
                if (loaded === PRIORITY_THRESHOLD) setIsReady(true);

                if (loaded === TOTAL_FRAMES) {
                    const duration = ((performance.now() - startTime) / 1000).toFixed(2);
                    console.log(`🚀 Performance (with errors): All frames processed in ${duration}s`);
                }
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
            const img = frames.current[index];
            if (!img || !img.complete || img.naturalWidth === 0) return;

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
        const mm = gsap.matchMedia();

        mm.add({
            isDesktop: "(min-width: 768px)",
            isMobile: "(max-width: 767px)"
        }, (context) => {
            const { isDesktop } = context.conditions;
            const frameObj = { frame: 0 };

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: 'top top',
                    end: isDesktop ? '+=4000' : '+=2500', // Shorter scroll for mobile
                    pin: true,
                    scrub: isDesktop ? 1.5 : 1, // Tigher scrub for touch
                    anticipatePin: 1
                }
            });

            tl.to(frameObj, {
                frame: TOTAL_FRAMES - 1,
                snap: 'frame',
                ease: 'none',
                onUpdate: () => renderFrame(frameObj.frame)
            });

            tl.fromTo(foregroundCanvasRef.current,
                { scale: 1 },
                { scale: isDesktop ? 1.15 : 1.1, ease: 'none' },
                0
            );

            requestAnimationFrame(() => {
                ScrollTrigger.sort();
                ScrollTrigger.refresh();
            });
        }, containerRef);

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            mm.revert();
        };
    }, [isReady]);

    return (
        <>
            {!isReady && (
                <div className="loading-overlay">
                    <h2 className="heading" style={{ color: 'white', letterSpacing: '4px' }}>INITIALIZING ENGINE</h2>
                    <p style={{ marginTop: '1rem', opacity: 0.6, letterSpacing: '2px' }}>
                        PRELOADING PRIMARY ASSETS...
                    </p>
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
