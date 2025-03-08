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
    // Set random quote
    setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
    
    // Show logo after delay
    const timer = setTimeout(() => {
      setShowLogo(true);
    }, 2000);

    // Handle viewport sizing
    const handleResize = () => {
      const screenHeight = window.innerHeight;
      const newFontSize = `${Math.min(24, screenHeight * 0.03)}px`;
      setFontSize(newFontSize);
    };

    // Initial setup
    handleResize();
    
    // Prevent body scrolling
    document.body.style.overflow = "hidden";
    
    // Update on resize
    window.addEventListener("resize", handleResize);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", handleResize);
      // Restore scrolling when component unmounts
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-between bg-black p-4">
      {/* Top spacer */}
      <div className="flex-1" />
      
      {/* Quote */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
        className="bg-transparent p-6 text-center max-w-lg"
      >
        <p style={{ fontSize }} className="font-semibold text-white italic">{quote}</p>
      </motion.div>
      
      {/* Bottom section with logo */}
      <div className="flex-1 flex flex-col justify-end items-center w-full pb-8">
        {showLogo && (
          <motion.img
            src="/images/inspi-tap_logo.png"
            alt="Logo"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2 }}
            className="h-10 w-auto"
          />
        )}
      </div>
    </div>
  );
}