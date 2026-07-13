import { useGSAP } from "@gsap/react";
import { navLinks } from "../../constants";
import gsap from "gsap";
import { useNavigate } from "react-router-dom";
import { HashLink } from "react-router-hash-link";
import { useState } from "react";
import { Menu, X } from "lucide-react";


const Navbar = () => {
    const navigate = useNavigate();

    const [isOpen, setIsOpen] = useState(false);

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
    // Navbar.jsx

    return (
        <nav>
            <div>
                <a href="#home" className="flex items-center gap-2">
                    <img src="/images/logo.png" alt="logo" />
                    <p>Velvet Pour</p>
                </a>

                <ul className="hidden md:flex items-center lg:gap-12 gap-7">
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

                    <li
                        onClick={() => {
                            navigate("/order");
                            window.scrollTo(0, 0);
                        }}
                        className="border-2 border-[#E7D393] px-2 py-1 rounded-xl text-[#E7D393] hover:scale-105 transition-all duration-300 ease-out cursor-pointer"
                    >
                        Order Now
                    </li>
                </ul>

                <button
                    className="md:hidden text-white"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? <X size={30} /> : <Menu size={30} />}
                </button>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden absolute left-0 top-full w-full bg-black/60 backdrop-blur-xl border-t border-white/10">
                    <ul className="flex flex-col items-center justify-center gap-6 py-6 w-full text-center">
                        {navLinks.map((link) => (
                            <li key={link.id} className="w-full">
                                <HashLink
                                    smooth
                                    to={`/#${link.id}`}
                                    onClick={() => setIsOpen(false)}
                                    className="block w-full text-center"
                                >
                                    {link.title}
                                </HashLink>
                            </li>
                        ))}

                        <li
                            onClick={() => {
                                setIsOpen(false);
                                navigate("/order");
                                window.scrollTo(0, 0);
                            }}
                            className="border-2 border-[#E7D393] px-4 py-2 rounded-xl text-[#E7D393] cursor-pointer"
                        >
                            Order Now
                        </li>
                    </ul>
                </div>
            )}
        </nav>
    );
}

export default Navbar;