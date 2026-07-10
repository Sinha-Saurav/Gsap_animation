import { useGSAP } from "@gsap/react";
import { navLinks } from "../../constants";
import gsap from "gsap";
import { useNavigate } from "react-router-dom";
import { HashLink } from "react-router-hash-link";


const Navbar = () => {
    const navigate = useNavigate();

    useGSAP(() => {
        const navTween = gsap.timeline({
            scrollTrigger: {
                trigger: 'nav',
                start: 'bottom top',
            }
        });

        navTween.fromTo('nav', { backgroundColor: 'transparent' }, {
            backgroundColor: '#00000050',
            backdropFilter: 'blur(10px)',
            duration: 1,
            ease: 'power1.inOut',
        })
    }, [])
    return (
        <nav>

            <div>
                <a href="#home" className="flex items-center gap-2">
                    <img src="/images/logo.png" alt="logo" />
                    <p>Velvet Pour</p>
                </a>

                <ul>
                    {navLinks.map((link) => (
                        <li
                            key={link.id}
                            className="hover:scale-110 transition-transform duration-300 ease-out"
                        >
                            <HashLink
                                smooth
                                to={`/#${link.id}`}
                                className="inline-block"
                            >
                                {link.title}
                            </HashLink>
                        </li>
                    ))}

                    <li onClick={() => { navigate("/order");  window.scrollTo(0, 0);}}
                        className="border-2 border-[#E7D393] px-2 py-1 rounded-xl text-[#E7D393] hover:scale-105 transition-all duration-300 ease-out
                         cursor-pointer">
                        Order Now

                    </li>
                </ul>
            </div>
        </nav>
    )
}

export default Navbar;