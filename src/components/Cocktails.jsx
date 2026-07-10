import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { cocktailLists, mockTailLists } from "../../constants";
import { useRef } from "react";

const Cocktails = () => {

    const cupRef = useRef();
    const latteRef = useRef();

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

        const coffeeCupTl = gsap.timeline({
            scrollTrigger: {
                trigger: '#cocktails',
                start: 'top 20%',
                end: 'bottom 90%',
                scrub: true,
                once: true,
            }
        })

        coffeeCupTl
            .to([cupRef.current, latteRef.current], {
                y: 300,
                ease: "none",
            })

        gsap.timeline({
            scrollTrigger: {
                trigger: "#cocktails",
                start: "bottom 80%",      // tune this point
                toggleActions: "play none none none",
                once: true,
            },
            defaults: { overwrite: "auto" },
        })
            .to(cupRef.current, { opacity: 0, duration: 0.2, ease: "none" })
            .to(latteRef.current, { opacity: 1, duration: 0.2, ease: "none" }, "<");
    }, []);

    return (
        <section id="cocktails" className='noisy'>
            <img src="/images/cocktail-left-leaf.png" alt="l-leaf" id="c-left-leaf" />
            <img src="/images/cocktail-right-leaf.png" alt="r-leaf" id="c-right-leaf" />

            <img
                ref={cupRef}
                src="/images/coffee-mug.png"
                className="cocktail-cup"
            />

            <img
                ref={latteRef}
                src="/images/coffee-mug-art.png"
                className="cocktail-cup latte"
            />

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