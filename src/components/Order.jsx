import React, { useState, useRef, useEffect } from "react";
import { Plus, Minus, X, ChevronUp } from "lucide-react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

const CATEGORIES = ["All", "Espresso", "Milk & Cream", "Cold Brew", "Specialty"];

const MENU_ITEMS = [
    { id: "midnight-espresso", name: "Midnight Espresso", category: "Espresso", price: 4.5, img: "/images/menu/midnight-espresso.jpg", shape: "tall" },
    { id: "iron-americano", name: "Iron Americano", category: "Espresso", price: 4.0, img: "/images/menu/iron-americano.jpg", shape: "small" },
    { id: "obsidian-doppio", name: "Obsidian Doppio", category: "Espresso", price: 4.25, img: "/images/menu/obsidian-doppio.jpg", shape: "small" },
    { id: "velvet-latte", name: "Velvet Latte", category: "Milk & Cream", price: 5.5, img: "/images/menu/velvet-latte.jpg", shape: "wide" },
    { id: "smoked-vanilla-flat-white", name: "Smoked Vanilla Flat White", category: "Milk & Cream", price: 5.75, img: "/images/menu/smoked-vanilla.jpg", shape: "extraTall" },
    { id: "hazel-nocturne-mocha", name: "Hazel Nocturne Mocha", category: "Milk & Cream", price: 5.9, img: "/images/menu/hazel-nocturne.jpg", shape: "small" },
    { id: "noir-cold-brew", name: "Noir Cold Brew", category: "Cold Brew", price: 5.0, img: "/images/menu/noir-cold-brew.jpg", shape: "small" },
    { id: "charcoal-nitro", name: "Charcoal Nitro", category: "Cold Brew", price: 5.5, img: "/images/menu/charcoal-nitro.jpg", shape: "tall" },
    { id: "caramel-eclipse", name: "Caramel Eclipse Macchiato", category: "Specialty", price: 6.0, img: "/images/menu/caramel-eclipse.jpg", shape: "wide" },
    { id: "cardamom-affogato", name: "Cardamom Affogato", category: "Specialty", price: 6.5, img: "/images/menu/cardamom-affogato.jpg", shape: "small" },
];

// Collage spans — cycles per item so the grid reads as an intentional
// mosaic rather than a uniform product grid.
const SHAPE_CLASS = {
    tall: "row-span-2",
    extraTall: "row-span-3",
    wide: "col-span-2 row-span-1",
    small: "row-span-1",
};

const Order = () => {
    const [activeCategory, setActiveCategory] = useState("All");
    const [cart, setCart] = useState([]); // [{ id, name, price, qty }]
    const [expanded, setExpanded] = useState(false);
    const [placed, setPlaced] = useState(false);
    const barRef = useRef(null);

    const filteredItems =
        activeCategory === "All"
            ? MENU_ITEMS
            : MENU_ITEMS.filter((item) => item.category === activeCategory);

    const addToCart = (item) => {
        setPlaced(false);
        setCart((prev) => {
            const existing = prev.find((c) => c.id === item.id);
            if (existing) {
                return prev.map((c) => (c.id === item.id ? { ...c, qty: c.qty + 1 } : c));
            }
            return [...prev, { id: item.id, name: item.name, price: item.price, qty: 1 }];
        });

        // brief pulse on the bar so the add registers even when collapsed
        if (barRef.current) {
            barRef.current.classList.remove("scale-[1.03]");
            void barRef.current.offsetWidth; // restart animation
            barRef.current.classList.add("scale-[1.03]");
            setTimeout(() => barRef.current?.classList.remove("scale-[1.03]"), 180);
        }
    };

    const changeQty = (id, delta) => {
        setCart((prev) =>
            prev
                .map((c) => (c.id === id ? { ...c, qty: c.qty + delta } : c))
                .filter((c) => c.qty > 0)
        );
    };

    const removeItem = (id) => setCart((prev) => prev.filter((c) => c.id !== id));

    const totalCount = cart.reduce((sum, c) => sum + c.qty, 0);
    const totalPrice = cart.reduce((sum, c) => sum + c.qty * c.price, 0);

    const placeOrder = () => {
        setPlaced(true);
        setTimeout(() => {
            setCart([]);
            setExpanded(false);
            setPlaced(false);
        }, 1400);
    };

    useEffect(() => {
        if (cart.length === 0) setExpanded(false);
    }, [cart.length]);

    useGSAP(()=>{
        gsap.timeline({
            scrollTrigger:{
                trigger: "#order",
                start: "top 40%"
            }
        })
        .from(".collage",{
            opacity: 0, yPercent: 50, duration: 1, ease: 'power1.inOut',
            stagger: 0.06,
        },'0.5')


    })

    return (
        <section id="order" className="relative w-full min-h-dvh py-28 2xl:px-0 px-5 radial-gradient">
            <div className="container mx-auto">
                <span className="badge">Order Online</span>
                <h2 className="font-modern-negra text-5xl md:text-7xl mb-14 max-w-2xl">
                    Build your <span className="text-yellow">order</span>
                </h2>

                {/* ── Horizontal filter bar ───────────────────────────── */}
                <div className="flex gap-3 overflow-x-auto pb-4 mb-10 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                    {CATEGORIES.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`shrink-0 px-6 py-2.5 rounded-full text-sm md:text-base font-medium transition-colors cursor-pointer border ${
                                activeCategory === cat
                                    ? "bg-yellow text-black border-yellow"
                                    : "border-white/20 text-white/70 hover:border-yellow hover:text-yellow"
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* ── Collage grid ─────────────────────────────────────── */}
                <div className="grid  grid-cols-2 md:grid-cols-3 lg:grid-cols-4 grid-flow-dense auto-rows-[150px] md:auto-rows-[170px] gap-4 md:gap-5 pb-32">
                    {filteredItems.map((item) => {
                        const inCart = cart.find((c) => c.id === item.id);
                        return (
                            <div
                                key={item.id}
                                className={`collage group relative rounded-3xl overflow-hidden bg-white/5 ${SHAPE_CLASS[item.shape]}`}
                            >
                                <img
                                    src={item.img}
                                    alt={item.name}
                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent" />

                                <button
                                    onClick={() => addToCart(item)}
                                    aria-label={`Add ${item.name} to cart`}
                                    className="absolute top-3 right-3 flex-center size-10 rounded-full bg-yellow text-black cursor-pointer hover:scale-110 active:scale-95 transition-transform"
                                >
                                    <Plus size={18} strokeWidth={2.5} />
                                </button>

                                {inCart && (
                                    <span className="absolute top-3 left-3 flex-center size-7 rounded-full bg-white text-black text-xs font-bold">
                                        {inCart.qty}
                                    </span>
                                )}

                                <div className="absolute bottom-0 left-0 right-0 p-4">
                                    <h3 className="font-modern-negra text-xl md:text-2xl text-yellow leading-none mb-1">
                                        {item.name}
                                    </h3>
                                    <span className="text-sm font-medium text-white/90">
                                        ${item.price.toFixed(2)}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* ── Floating cart bar / expanding order panel ───────────── */}
            {cart.length > 0 && (
                <div className="fixed bottom-6 inset-x-0 z-50 flex justify-center px-4 pointer-events-none">
                    <div
                        ref={barRef}
                        className="w-full md:w-1/2 pointer-events-auto bg-black border border-white/15 rounded-[28px] shadow-2xl shadow-black/50 overflow-hidden transition-transform duration-150 animate-[slideUp_.4s_ease]"
                    >
                        {/* expanded item list */}
                        <div
                            className="overflow-y-auto transition-[max-height] duration-500 ease-in-out divide-y divide-white/10"
                            style={{ maxHeight: expanded ? "45vh" : "0px" }}
                        >
                            {cart.map((c) => (
                                <div key={c.id} className="flex items-center justify-between gap-3 px-6 py-4">
                                    <div className="min-w-0">
                                        <p className="text-sm md:text-base font-medium truncate">{c.name}</p>
                                        <p className="text-xs text-white/50">${c.price.toFixed(2)} each</p>
                                    </div>

                                    <div className="flex items-center gap-3 shrink-0">
                                        <div className="flex items-center gap-2 border border-white/20 rounded-full px-1 py-1">
                                            <button
                                                onClick={() => changeQty(c.id, -1)}
                                                className="flex-center size-6 rounded-full hover:bg-white/10 cursor-pointer"
                                                aria-label={`Remove one ${c.name}`}
                                            >
                                                <Minus size={13} />
                                            </button>
                                            <span className="w-4 text-center text-sm">{c.qty}</span>
                                            <button
                                                onClick={() => changeQty(c.id, 1)}
                                                className="flex-center size-6 rounded-full hover:bg-white/10 cursor-pointer"
                                                aria-label={`Add one ${c.name}`}
                                            >
                                                <Plus size={13} />
                                            </button>
                                        </div>
                                        <button
                                            onClick={() => removeItem(c.id)}
                                            className="text-white/40 hover:text-yellow cursor-pointer"
                                            aria-label={`Delete ${c.name}`}
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {expanded && (
                            <div className="px-6 pt-2 pb-4">
                                <button
                                    onClick={placeOrder}
                                    disabled={placed}
                                    className="w-full py-3 rounded-full bg-yellow text-black font-semibold cursor-pointer hover:opacity-90 transition-opacity disabled:opacity-60"
                                >
                                    {placed ? "Order placed" : "Place order"}
                                </button>
                            </div>
                        )}

                        {/* always-visible summary row, toggles expand */}
                        <button
                            onClick={() => setExpanded((e) => !e)}
                            className="w-full flex items-center justify-between px-6 py-4 border-t border-white/10 cursor-pointer"
                        >
                            <span className="text-sm md:text-base font-medium">
                                {totalCount} item{totalCount !== 1 ? "s" : ""}
                            </span>
                            <ChevronUp
                                size={18}
                                className={`transition-transform duration-300 ${expanded ? "rotate-180" : ""}`}
                            />
                            <span className="text-yellow font-semibold text-sm md:text-base">
                                ${totalPrice.toFixed(2)}
                            </span>
                        </button>
                    </div>
                </div>
            )}
        </section>
    );
};

export default Order;