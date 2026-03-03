import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Trophy, Medal } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function Achievements() {
    const containerRef = useRef(null);
    const cardsRef = useRef([]);

    const achievements = [
        {
            title: "Aptech High Achiever",
            desc: "Awarded prestigious High Achiever status in the advanced ACCP-AI program at Aptech.",
            icon: <Trophy size={48} />,
            color: "var(--color-accent)"
        },
        {
            title: "Project of the Month",
            desc: "Won Project of the Month outperforming the cohort while serving as Team Leader of the batch.",
            icon: <Medal size={48} />,
            color: "#f59e0b" // Subtlly gold-toned but keeping it within modern dark UI limits
        }
    ];

    useEffect(() => {
        const cards = cardsRef.current;

        // Animate cards bursting/rotating into view sequentially when the section enters viewport
        const entryAnimation = gsap.fromTo(cards,
            {
                y: 150,
                rotationX: -45,
                rotationY: -15,
                scale: 0.8,
                opacity: 0,
                transformOrigin: "50% 100% -200"
            },
            {
                y: 0,
                rotationX: 0,
                rotationY: 0,
                scale: 1,
                opacity: 1,
                duration: 1.2,
                stagger: 0.2,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top 80%",
                    end: "bottom 80%",
                    toggleActions: "play none none reverse",
                }
            }
        );

        // Continuous floating/hover effect for the icons inside cards to add 3D depth post-load
        const floatingTweens = [];
        cards.forEach((card, i) => {
            const iconWrap = card.querySelector('.ach-icon-wrap');
            if (iconWrap) {
                floatingTweens.push(
                    gsap.to(iconWrap, {
                        y: -10,
                        rotationY: 10,
                        duration: 2 + i * 0.5,
                        repeat: -1,
                        yoyo: true,
                        ease: "sine.inOut"
                    })
                );
            }
        });

        return () => {
            if (entryAnimation.scrollTrigger) entryAnimation.scrollTrigger.kill();
            entryAnimation.kill();
            floatingTweens.forEach(t => t.kill());
        };
    }, []);

    return (
        <section className="section-padding p5-achievements" ref={containerRef} style={{ perspective: "1500px" }}>
            <div className="container">
                <div style={{ textAlign: 'center', marginBottom: '6rem' }}>
                    <h2 className="heading" style={{ fontSize: '3.5rem', marginBottom: '2.5rem', color: 'var(--color-deep-black)', letterSpacing: '4px' }}>Hall of Fame</h2>
                    <p className="expertise-desc" style={{ maxWidth: '600px', margin: '0 auto', lineHeight: '1.8' }}>
                        Recognitions and milestones achieved through dedicated technical leadership and algorithmic excellence.
                    </p>
                </div>

                <div className="achievements-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '5rem' }}>
                    {achievements.map((ach, idx) => (
                        <div
                            key={idx}
                            className="achievement-card"
                            ref={el => cardsRef.current[idx] = el}
                            style={{
                                backgroundColor: 'var(--color-white)',
                                padding: '3rem',
                                borderRadius: '20px',
                                border: '1px solid #eaeaea',
                                boxShadow: '0 30px 60px rgba(0,0,0,0.06)',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                textAlign: 'center',
                                transformStyle: 'preserve-3d',
                                willChange: 'transform, opacity'
                            }}
                        >
                            <div
                                className="ach-icon-wrap"
                                style={{
                                    width: '90px',
                                    height: '90px',
                                    borderRadius: '50%',
                                    backgroundColor: 'var(--color-black)',
                                    color: 'var(--color-white)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginBottom: '2rem',
                                    boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
                                    transformStyle: 'preserve-3d'
                                }}
                            >
                                {ach.icon}
                            </div>
                            <h3 className="expertise-title heading" style={{ fontSize: '1.8rem', color: 'var(--color-deep-black)', marginTop: '1.5rem', marginBottom: '1.5rem' }}>{ach.title}</h3>
                            <p className="expertise-desc" style={{ marginTop: '1rem', lineHeight: '1.6' }}>{ach.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
