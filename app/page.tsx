"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const quotes = [
  "The only limit to our realization of tomorrow is our doubts of today.",
  "Do what you can, with what you have, where you are.",
  "Happiness depends upon ourselves.",
  "Change your thoughts and you change your world.",
  "Success is not final, failure is not fatal: it is the courage to continue that counts.",
  "Believe you can and you're halfway there.",
  "Act as if what you do makes a difference. It does.",
  "It is not length of life, but depth of life.",
  "The best way to predict the future is to create it.",
  "Keep your face always toward the sunshine—and shadows will fall behind you."
];

export default function QuoteGenerator() {
  const [quote, setQuote] = useState("");
  const [showLogo, setShowLogo] = useState(false);
  const [fontSize, setFontSize] = useState("text-xl");

  useEffect(() => {
    setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
    const timer = setTimeout(() => {
      setShowLogo(true);
    }, 2000);

    const handleResize = () => {
      const screenHeight = window.innerHeight;
      // Calculate font size as a percentage of the screen height, adjusting the multiplier as needed
      const newFontSize = `${Math.min(24, screenHeight * 0.03)}px`; // Adjust 0.05 multiplier as necessary
      setFontSize(newFontSize);
    };

    handleResize(); // Set initial font size based on current screen height
    window.addEventListener("resize", handleResize); // Update font size on window resize

    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-between min-h-screen bg-black p-4 py-10 overflow-hidden">
      <div className="flex-grow" /> {/* Spacer at top */}
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
        className="bg-transparent p-6 text-center max-w-lg"
      >
        <p style={{ fontSize }} className="font-semibold text-white italic">{quote}</p>
      </motion.div>
      
      <div className="flex-grow flex items-end justify-center w-full mt-6">
        {showLogo && (
          <motion.img
            src="/images/inspi-tap_logo.png"
            alt="Logo"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2 }}
            className="h-12 w-auto mb-6"
          />
        )}
      </div>
    </div>
  );
}