import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { cocktailLists, mockTailLists } from "../../constants";
import { useRef } from "react";

const Cocktails = () => {

    const cupRef = useRef();
    const latteRef = useRef();
    const steamRef = useRef();

    useGSAP(() => {
        const parallaxTimeline = gsap.timeline({
            scrollTrigger: {
                trigger: '#cocktails',
                start: 'top 30%',
                end: 'bottom 80%',
                scrub: true,
            }
        })

        parallaxTimeline
            .from('#c-left-leaf', {
                x: -100, y: 100
            })
            .from('#c-right-leaf', {
                x: 100, y: 100
            })

        gsap.set(cupRef.current, {
            opacity: 1
        });

        gsap.set(latteRef.current, {
            opacity: 0
        });

        gsap.set(steamRef.current, {
            opacity: 0,
            y: 20,
        });

        const coffeeCupTl = gsap.timeline({
            scrollTrigger: {
                trigger: '#cocktails',
                start: 'top 50%',
                end: 'bottom 90%',
                scrub: true,
                once: true,
            }
        })

        const steamTimeline = gsap.timeline({
            paused: true,
            repeat: -1,
            defaults: {
                ease: 'sine.out',
            },
        });

        steamTimeline
            .fromTo('.steam-1', { opacity: 0, y: 14, x: 0, scale: 0.9 }, { opacity: 0.95, y: -72, x: -4, scale: 1.02, duration: 1.35 }, 0)
            .to('.steam-1', { opacity: 0, y: -104, x: -10, scale: 1.08, duration: 0.8 }, 0.8)
            .fromTo('.steam-2', { opacity: 0, y: 14, x: 0, scale: 0.9 }, { opacity: 0.95, y: -72, x: 3, scale: 1.02, duration: 1.35 }, 0.55)
            .to('.steam-2', { opacity: 0, y: -104, x: 8, scale: 1.08, duration: 0.8 }, 1.35)
            .fromTo('.steam-3', { opacity: 0, y: 14, x: 0, scale: 0.9 }, { opacity: 0.95, y: -72, x: -2, scale: 1.02, duration: 1.35 }, 1.1)
            .to('.steam-3', { opacity: 0, y: -104, x: 6, scale: 1.08, duration: 0.8 }, 1.9);

        gsap.timeline({
            scrollTrigger: {
                trigger: "#cocktails",
                start: "bottom 110%",      // tune this point
                toggleActions: "play none none none",
                once: true,
            },
            defaults: { overwrite: "auto" },
        })
            .to(cupRef.current, { opacity: 0, duration: 0.2, ease: "none" })
            .to(latteRef.current, { opacity: 1, duration: 0.2, ease: "none" }, "<")
            .to(steamRef.current, { opacity: 1, duration: 0.05, ease: "none", onStart: () => steamTimeline.play(0) }, "<")

        return () => {
            steamTimeline.kill();
            coffeeCupTl.kill();
            parallaxTimeline.kill();
        };
    }, []);

    return (
        <section id="cocktails" className='noisy'>
            <img src="/images/cocktail-left-leaf.png" alt="l-leaf" id="c-left-leaf" />
            <img src="/images/cocktail-right-leaf.png" alt="r-leaf" id="c-right-leaf" />

            <div className="cocktail-cup-stage">
                <img
                    ref={cupRef}
                    src="/images/coffee-mug.png"
                    className="cocktail-cup"
                />

                <div ref={steamRef} className="steam-stage" aria-hidden="true">
                    <img src="/images/steam-1.png" alt="" className="steam-item steam-1" />
                    <img src="/images/steam-2.png" alt="" className="steam-item steam-2" />
                    <img src="/images/steam-3.png" alt="" className="steam-item steam-3" />
                </div>

                <img
                    ref={latteRef}
                    src="/images/coffee-mug-art.png"
                    className="cocktail-cup latte"
                />
            </div>

            <div className="list">
                <div className="popular">
                    <h2>Most popular cocktails:</h2>
                    <ul>
                        {cocktailLists.map((drink) => (
                            <li key={drink.name}>
                                <div className="md:me-28">
                                    <h3>{drink.name}</h3>
                                    <p>{drink.country} | {drink.detail}</p>
                                </div>
                                <span>- {drink.price}</span>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="loved">
                    <h2>Most loved mocktails:</h2>
                    <ul>
                        {mockTailLists.map((drink) => (
                            <li key={drink.name}>
                                <div className="md:me-28">
                                    <h3>{drink.name}</h3>
                                    <p>{drink.country} | {drink.detail}</p>
                                </div>
                                <span>- {drink.price}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </section>
    )
}

export default Cocktails;