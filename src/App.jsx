import React from 'react'

import { ScrollTrigger, SplitText } from 'gsap/all';
import gsap from 'gsap';
import  Home  from "./pages/Home"
import  OrderPage  from "./pages/OrderPage"
import { BrowserRouter, Routes, Route } from "react-router-dom";

gsap.registerPlugin(ScrollTrigger, SplitText);


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/order" element={<OrderPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;