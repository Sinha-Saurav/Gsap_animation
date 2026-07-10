import { useGSAP } from "@gsap/react";
import { openingHours, socials } from "../../constants";

const Contact = () => {

    return(
        <footer id="contact">
            <img src="/images/footer-right-leaf.png" alt="leaf-right" id="f-right-leaf" />
            <img src="/images/footer-left-leaf.png" alt="leaf-left" id="f-left-leaf" />

            <div className="content">
                <h2>Where to Find Us</h2>

                <div>
                    <h3>Visit Our Cafe</h3>
                    <p>Dhan Mill Compound, 100 Feet Rd, Chhatarpur, New Delhi, Delhi 110074</p>
                </div>

                <div>
                    <h3>Contact us</h3>
                    <p>(+91) 8888888</p>
                    <p>hello@jscafe.com</p>
                </div>

                <div>
                    <h3>Open Every Day</h3>
                    {openingHours.map((time) => (
                        <p key={time.day}>
                            {time.day} : {time.time}
                        </p>
                    ))}
                </div>

                <div>
                    <h3>Socials</h3>

                    <div className="flex-center gap-5">
                        {socials.map((social) => (
                            <a key={social.name} href={social.url} target="_blank" rel="noopener noreferrer">
                                <img src={social.icon} />
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Contact;