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

const DUST_IMAGES = [
    "/images/coffee-dust-1.png",
    "/images/coffee-dust-2.png",
    "/images/coffee-dust-3.png",
]

const BEAN_COUNT = 20;

const Hero = () => {
    const mugRef = useRef();
    const overlayRef = useRef();
    const beansRef = useRef([]);
    const beanStageRef = useRef();
    const dustRefs = useRef([]);
    const flashRef = useRef();
    const dropRef = useRef();

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
        const run = async () => {

            const waitForLayout = async () => {
                if (document.fonts?.ready) {
                    await document.fonts.ready;
                }

                await new Promise((resolve) => requestAnimationFrame(() => resolve()));
                await new Promise((resolve) => requestAnimationFrame(() => resolve()));
            };

            await waitForLayout();

            const heroSplit = new SplitText('.title', { type: 'chars, words' });
            const paragraphSplit = new SplitText('.subtitle', { type: 'lines' });

            heroSplit.chars.forEach((char) => char.classList.add('text-gradient'));

            const targetChar = heroSplit.chars.filter(
                (c) => c.textContent === 'O'
            ).pop();

            const targetRect = targetChar.getBoundingClientRect();
            const mugRect = mugRef.current.getBoundingClientRect();

            const targetX =
                (targetRect.left + targetRect.width / 2) -
                (mugRect.left + mugRect.width / 2);

            const targetY =
                (targetRect.top + targetRect.height / 2) -
                (mugRect.top + mugRect.height / 2);
            const targetScale = targetRect.width / mugRect.width;

            gsap.set(targetChar, { opacity: 0 });
            gsap.set(heroSplit.chars, { yPercent: 100 });
            gsap.set(paragraphSplit.lines, { opacity: 0, yPercent: 100 });

            gsap.set(beansRef.current, {
                x: (i) => beanData[i].x * window.innerWidth / 100,
                y: (i) => beanData[i].y * window.innerHeight / 100,
                opacity: 0,
                scale: (i) => beanData[i].scale * 0.5,
                xPercent: -50,
                yPercent: -50,
            });
            gsap.set(dustRefs.current, {
                opacity: 0,
                scale: .2,
                rotation: 0,
            });
            gsap.set(flashRef.current, {
                opacity: 0,
                scale: .3,
            });
            gsap.set(dropRef.current, {
                opacity: 0,
                scale: 0,
            })


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
                    ease: 'back.inOut',
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
                    stagger: { each: 0.04, from: 'random' },
                }, INTRO_DURATION);

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

            const convergeTl = gsap.timeline({
                scrollTrigger: {
                    trigger: "#hero",
                    start: "top",
                    end: "+=90%",
                    scrub: true,
                    once: true,
                }
            })


            beansRef.current.forEach((bean) => {
                convergeTl.to(bean, {
                    scale: (i) => beanData[i].scale * 0.15,
                    x: 0,
                    y: +100,
                    rotation: "+=360",
                    ease: "power2.in"
                }, 0);
            });

            // IMPACT FLASH
            convergeTl.fromTo(
                flashRef.current,
                {
                    opacity: 0,
                    scale: .2,
                },
                {
                    opacity: .45,
                    scale: 2.8,
                    duration: .50,
                    ease: "power2.out",
                },
                .55
            );

            convergeTl.to(
                flashRef.current,
                {
                    opacity: 0,
                    duration: .75,
                    ease: "power2.out",
                },
                .73
            );

            // HIDE BEANS
            convergeTl.to(
                beansRef.current,
                {
                    autoAlpha: 0,
                    scale: 0.01,
                    duration: 0.08,
                    ease: "power2.out",
                    overwrite: "auto",
                    stagger: 0,
                },
                0.5
            );

            // DUST 1
            convergeTl.fromTo(
                dustRefs.current[0],
                {
                    opacity: 0,
                    scale: .15,
                    rotation: -20,
                },
                {
                    opacity: .9,
                    scale: .9,
                    rotation: 15,
                    duration: .18,
                    ease: "power2.out",
                },
                .55
            );

            convergeTl.to(
                dustRefs.current[0],
                {
                    opacity: 0,
                    scale: 1.4,
                    rotation: 30,
                    duration: .30,
                    filter: "blur(6px)",
                    ease: "power1.out",
                },
                .73
            );

            // DUST 2
            convergeTl.fromTo(
                dustRefs.current[1],
                {
                    opacity: 0,
                    scale: .25,
                    rotation: 18,
                },
                {
                    opacity: .95,
                    scale: 1.15,
                    rotation: -15,
                    duration: .22,
                    ease: "power3.out",
                },
                .63
            );

            convergeTl.to(
                dustRefs.current[1],
                {
                    opacity: 0,
                    scale: 1.7,
                    rotation: -35,
                    duration: .35,
                    ease: "power1.out",
                },
                .87
            );

            // FINAL EXPLOSION
            convergeTl.fromTo(
                dustRefs.current[2],
                {
                    opacity: 0,
                    scale: .45,
                    rotation: -12,
                },
                {
                    opacity: 1,
                    scale: 1.7,
                    rotation: 12,
                    duration: .25,
                    ease: "power4.out",
                },
                .76
            );

            convergeTl.to(
                dustRefs.current[2],
                {
                    opacity: 0,
                    scale: 2.6,
                    rotation: 45,
                    duration: .95,
                    ease: "power1.out",
                },
                1.02
            );

            convergeTl.to(
                dropRef.current,{
                    opacity: 1,
                    scale: 0.5,
                    duration: 0.3,
                },
                0.7
            )
            convergeTl.to(
                dropRef.current,
                {
                    scale: 1,
                    duration: 3,
                    y: "580px",
                    ease: 'none',
                },
                0.7
            )
            convergeTl.to(dropRef.current, {
                opacity: 0,
                ease: 'none',
            },
        )

        };

        run();

    }, []);


    return (
        <>

            <section id="hero" className="noisy">
                <div ref={overlayRef} className="intro-overlay" />

                <img
                    ref={mugRef}
                    src="/images/coffee-mug-complete.png"
                    alt="coffee mug"
                    className="intro-mug"
                />
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
                                left: "50%",
                                top: "62%",
                                transform: `translate(-50%, -50%) rotate(${bean.rotation}deg)`,
                            }}
                        />
                    ))}

                    {/* Flash */}

                    <div
                        ref={flashRef}
                        className="collision-flash"
                    />

                    {/* Dust */}

                    {DUST_IMAGES.map((src, i) => (
                        <img
                            key={src}
                            ref={(el) => (dustRefs.current[i] = el)}
                            src={src}
                            className="coffee-dust"
                            alt=""
                        />
                    ))}

                </div>

                <div className ="drop-stage" ref={dropRef}>
                    <img 
                        src="/images/coffee-drop.png" 
                    />
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
    )
};

export default Hero;