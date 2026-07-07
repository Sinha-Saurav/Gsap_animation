import { useGSAP } from "@gsap/react";
import { SplitText } from "gsap/all";
import gsap from "gsap";
import { useMediaQuery } from "react-responsive";
import { useRef, useMemo } from "react";

const BEAN_IMAGES = [
    "/images/coffee-1.png",
    "/images/coffee-2.png",
    "/images/coffee-3.png",
    "/images/coffee-4.png",
];

const BEAN_COUNT = 12;

const Hero = () => {
    const mugRef = useRef();
    const overlayRef = useRef(); 
    const beansRef = useRef([]);
    const beanStageRef = useRef();
    const canvasRef = useRef();

    const isMobile = useMediaQuery({ maxWidth: 767 });

    const beanData = useMemo(() => {
        return Array.from({ length: BEAN_COUNT }, (_, i) => ({
            id: i,
            src: BEAN_IMAGES[i % BEAN_IMAGES.length],
            x: gsap.utils.random(-45, 45), // vw offset from center
            y: gsap.utils.random(-30, 30), // vh offset from center
            rotation: gsap.utils.random(-180, 180),
            scale: gsap.utils.random(0.7, 1.1),
        }));
    }, []);

    useGSAP(() => {
        const heroSplit = new SplitText('.title', { type: 'chars, words' });
        const paragraphSplit = new SplitText('.subtitle', { type: 'lines' });

        heroSplit.chars.forEach((char) => char.classList.add('text-gradient'));

        const targetChar = heroSplit.chars.filter(
            (c) => c.textContent === 'O'
        ).pop();
        
        const targetRect = targetChar.getBoundingClientRect();
        const mugRect = mugRef.current.getBoundingClientRect();

        const targetX = (targetRect.left + targetRect.width / 2) - (mugRect.left + mugRect.width / 2);
        const targetY = (targetRect.top + targetRect.height / 2) - (mugRect.top + mugRect.height / 2);
        const targetScale = targetRect.width / mugRect.width;

        gsap.set(targetChar, { opacity: 0 });
        gsap.set(heroSplit.chars, { yPercent: 100 });
        gsap.set(paragraphSplit.lines, { opacity: 0, yPercent: 100 });

        gsap.set(beansRef.current, {
            opacity: 0,
            scale: (i) => beanData[i].scale * 0.5,
            xPercent: -50,
            yPercent: -50,
        }); 

        const INTRO_DURATION = 1.4;
        const master = gsap.timeline({ delay: 0.3 });

        // Mug animation and title reveal run TOGETHER, same duration
        const yOffset = -25;

        master.to(mugRef.current, {
            duration: INTRO_DURATION,
            ease: 'power3.inOut',
            rotate: 360,
            scale: 0.4,
            x: targetX,
            y: targetY + yOffset,
        }, 0)
            .to(heroSplit.chars, {
                yPercent: 0,
                duration: INTRO_DURATION,
                ease: 'expo.out',
                stagger: 0.06,
            }, 0) 
            .to(overlayRef.current, {
                opacity: 0,
                duration: INTRO_DURATION * 0.6,
                pointerEvents: 'none',
            }, INTRO_DURATION * 0.3) 
            .to(paragraphSplit.lines, {
                opacity: 1,
                yPercent: 0,
                duration: 1.8,
                ease: 'expo.out',
                stagger: 0.06,
            }, INTRO_DURATION * 1)
            .to(beansRef.current, {
                opacity: 1,
                scale: (i) => beanData[i].scale,
                duration: 1,
                ease: 'back.out(1.4)',
                stagger: { each: 0.06, from: 'random' },
            }, `+=0.5`);

        // once landed, kill pointer events / mark mug as static
        master.set(mugRef.current, { pointerEvents: 'none' });

        // --- existing scroll animations unchanged ---
        gsap.timeline({
            scrollTrigger: {
                trigger: '#hero',
                start: 'top top',
                end: 'bottom top',
                scrub: true,
            }
        })
            .to('.right-leaf', { y: 200 }, 0)
            .to('.left-leaf', { y: -200 }, 0);

        const startValue = isMobile ? 'top 50%' : 'center 60%';
        const endValue = isMobile ? '120% top' : 'bottom top';

        // --- BEAN CONVERGENCE + DUST CLOUD, scroll-pinned ---
        const ctx = canvasRef.current.getContext('2d');
        let particles = [];

        const resizeCanvas = () => {
            canvasRef.current.width = beanStageRef.current.offsetWidth;
            canvasRef.current.height = beanStageRef.current.offsetHeight;
        };
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        const PARTICLE_COUNT = 150;
        particles = Array.from({ length: PARTICLE_COUNT }, () => ({
            angle: gsap.utils.random(0, Math.PI * 2),
            radius: gsap.utils.random(20, 140),
            size: gsap.utils.random(1.5, 4),
            speed: gsap.utils.random(0.3, 1),
        }));

        const drawDust = (progress) => {
            const w = canvasRef.current.width;
            const h = canvasRef.current.height;
            ctx.clearRect(0, 0, w, h);
            if (progress <= 0) return;

            ctx.fillStyle = `rgba(90, 55, 35, ${Math.min(progress * 1.2, 0.9)})`;
            particles.forEach((p) => {
                const spread = progress * p.radius * p.speed;
                const px = w / 2 + Math.cos(p.angle) * spread;
                const py = h / 2 + Math.sin(p.angle) * spread * 0.6;
                ctx.beginPath();
                ctx.arc(px, py, p.size * progress, 0, Math.PI * 2);
                ctx.fill();
            });
        };

        const convergeTl = gsap.timeline({
            scrollTrigger: {
                trigger: beanStageRef.current,
                start: 'top top',
                end: '+=150%',
                scrub: true,
                pin: true,
            }
        });

        beansRef.current.forEach((bean) => {
            convergeTl.to(bean, {
                x: 0,
                y: 0,
                scale: 0,
                rotation: `+=${gsap.utils.random(180, 540)}`,
                ease: 'power2.in',
                duration: 1,
            }, 0);
        });

        convergeTl.to(beansRef.current, { opacity: 0, duration: 0.3 }, 0.7);
        convergeTl.to({}, {
            duration: 1,
            onUpdate: function () {
                drawDust(this.progress());
            }
        }, 0.6);

        return () => window.removeEventListener('resize', resizeCanvas);

    }, []);

    return (
        <>
            {/* Black backdrop — fades away, does NOT contain the mug */}
            <div ref={overlayRef} className="intro-overlay" />

            {/* Mug — independent layer, stays fully visible, keeps final position */}
            <img
                ref={mugRef}
                src="/images/coffee-mug-complete.png"
                alt="coffee mug"
                className="intro-mug"
            />

            <section id="hero" className="noisy">
                <h1 className="title">ESPRESSO</h1>

                <img src="/images/hero-left-leaf.png" alt="left-leaf" className="left-leaf" />
                <img src="/images/hero-right-leaf.png" alt="right-leaf" className="right-leaf" />

                <div ref={beanStageRef} className="bean-stage">
                    {beanData.map((bean, i) => (
                        <img
                            key={bean.id}
                            ref={(el) => (beansRef.current[i] = el)}
                            src={bean.src}
                            alt=""
                            className="coffee-bean"
                            style={{
                                left: `calc(50% + ${bean.x}vw)`,
                                top: `calc(50% + ${bean.y}vh)`,
                                rotate: `translate(-50%, -50%) rotate(${bean.rotation}deg)`,
                            }}
                        />
                    ))}
                    <canvas ref={canvasRef} className="dust-canvas" />
                </div>

                <div className="body">
                    <div className="content">
                        <div className="space-y-5 hidden md:block">
                            <p>Cool. Crisp. Classic</p>
                            <p className="subtitle">
                                Sip the Spirit <br /> of Summer
                            </p>
                        </div>
                        <div className="view-cocktails">
                            <p className="subtitle">
                                Every cocktail on our menu is a blend of premium ingredients, creative flair, and timeless
                                recipes — designed to delight your senses.
                            </p>
                            <a href="#cocktails"> View Cocktails</a>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default Hero;