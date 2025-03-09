"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";

const quotes = [
  { 
    english: { text: "\"The only limit to our realization of tomorrow is our doubts of today.\"", author: "Franklin D. Roosevelt" },
    spanish: { text: "\"El único límite para nuestra realización del mañana son nuestras dudas de hoy.\"", author: "Franklin D. Roosevelt" }
  },
  { 
    english: { text: "\"Do what you can, with what you have, where you are.\"", author: "Theodore Roosevelt" },
    spanish: { text: "\"Haz lo que puedas, con lo que tengas, donde estés.\"", author: "Theodore Roosevelt" }
  },
  { 
    english: { text: "\"Happiness depends upon ourselves.\"", author: "Aristotle" },
    spanish: { text: "\"La felicidad depende de nosotros mismos.\"", author: "Aristóteles" }
  },
  { 
    english: { text: "\"Change your thoughts and you change your world.\"", author: "Norman Vincent Peale" },
    spanish: { text: "\"Cambia tus pensamientos y cambiarás tu mundo.\"", author: "Norman Vincent Peale" }
  },
  { 
    english: { text: "\"Success is not final, failure is not fatal: it is the courage to continue that counts.\"", author: "Winston Churchill" },
    spanish: { text: "\"El éxito no es definitivo, el fracaso no es fatal: es el coraje para continuar lo que cuenta.\"", author: "Winston Churchill" }
  },
  { 
    english: { text: "\"Believe you can and you're halfway there.\"", author: "Theodore Roosevelt" },
    spanish: { text: "\"Cree que puedes y ya estás a medio camino.\"", author: "Theodore Roosevelt" }
  },
  { 
    english: { text: "\"Act as if what you do makes a difference. It does.\"", author: "William James" },
    spanish: { text: "\"Actúa como si lo que haces marca la diferencia. Lo hace.\"", author: "William James" }
  },
  { 
    english: { text: "\"It is not length of life, but depth of life.\"", author: "Ralph Waldo Emerson" },
    spanish: { text: "\"No es la longitud de la vida, sino la profundidad de la vida.\"", author: "Ralph Waldo Emerson" }
  },
  { 
    english: { text: "\"The best way to predict the future is to create it.\"", author: "Abraham Lincoln" },
    spanish: { text: "\"La mejor manera de predecir el futuro es creándolo.\"", author: "Abraham Lincoln" }
  },
  { 
    english: { text: "\"Keep your face always toward the sunshine—and shadows will fall behind you.\"", author: "Walt Whitman" },
    spanish: { text: "\"Mantén tu rostro siempre hacia el sol y las sombras caerán detrás de ti.\"", author: "Walt Whitman" }
  }
];

export default function QuoteGenerator() {
  const [quote, setQuote] = useState({ text: "", author: "" });
  const [showLogo, setShowLogo] = useState(false);
  const [fontSize, setFontSize] = useState("text-xl");
  const [darkMode, setDarkMode] = useState(true);
  const [language, setLanguage] = useState<"english" | "spanish">("english");  // Explicitly typing language as 'english' | 'spanish'
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [imagesPreloaded, setImagesPreloaded] = useState(false);
  const [isPortrait, setIsPortrait] = useState(false); // New state for orientation

  useEffect(() => {
    // Set random quote
    const randomIndex = Math.floor(Math.random() * quotes.length);
    setQuoteIndex(randomIndex);
    setQuote(quotes[randomIndex][language]);
    
    // Show logo after delay
    const timer = setTimeout(() => {
      setShowLogo(true);
    }, 2000);

    const handleResize = () => {
      const isCurrentlyPortrait = window.innerHeight > window.innerWidth;
      setIsPortrait(isCurrentlyPortrait); // Update orientation state
      const screenHeight = window.innerHeight;
      const newFontSize = `${Math.min(24, screenHeight * 0.03)}px`;
      setFontSize(newFontSize);
    };

    // Preload images
    const preloadImages = async () => {
      const imagePaths = [
        "/images/inspi-tap_white.png",
        "/images/inspi-tap_black.png",
        "/images/usa_flag.png",
        "/images/spain_flag.png",
        "/images/black_bg_phone.png", // New phone image
        "/images/white_bg_phone.png", // New phone image
      ];

      try {
        await Promise.all(
          imagePaths.map((path) => {
            return new Promise((resolve, reject) => {
              const img = new Image();
              img.src = path;
              img.onload = resolve;
              img.onerror = reject; // Handle errors if needed
            });
          })
        );
        setImagesPreloaded(true); // Set state after successful preloading
      } catch (error) {
        console.error("Error preloading images:", error);
        // Consider a fallback, like displaying placeholder images
      }
    };


    preloadImages(); // Call the preloading function

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

  // Update quote when language changes
  useEffect(() => {
    setQuote(quotes[quoteIndex][language]);
  }, [language, quoteIndex]);

  // Toggle theme function
  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  // Toggle language function
  const toggleLanguage = () => {
    setLanguage(language === "english" ? "spanish" : "english");
  };

  const backgroundImage = isPortrait
  ? `/images/${darkMode ? "black_bg_phone.png" : "white_bg_phone.png"}`
  : `/images/${darkMode ? "black_bg.png" : "white_bg.png"}`;

  console.log(isPortrait)
  
  if (!imagesPreloaded) {
    return <div>Loading...</div>; // Or a more sophisticated loading indicator
  }

  return (
    <div 
      className="fixed inset-0 flex flex-col items-center justify-between p-4"
      style={{
        backgroundImage: `url(${backgroundImage})`, // Use dynamic image path
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: darkMode ? 'white' : 'black',
        transition: 'background-image 0.5s ease'
      }}
    >
      {/* Theme toggle in top left */}
      <div className="self-start">
        <button 
          onClick={toggleTheme}
          className="flex items-center space-x-2 rounded-full p-2 shadow-md"
          style={{
            backgroundColor: darkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)'
          }}
        >
          <div className="relative w-12 h-6 rounded-full transition-colors duration-300"
               style={{ backgroundColor: darkMode ? '#222222' : '#e2e8f0' }}>
            <div 
              className="absolute top-1 left-1 w-4 h-4 rounded-full transition-transform duration-300"
              style={{ 
                backgroundColor: '#fff',
                transform: darkMode ? 'translateX(0)' : 'translateX(24px)'
              }}
            />
            <div className="absolute top-0.5 left-0.5 w-5 h-5 flex items-center justify-center">
              {darkMode && <Moon size={12} color="#000" />}
            </div>
            <div className="absolute top-0.5 right-0.5 w-5 h-5 flex items-center justify-center">
              {!darkMode && <Sun size={12} color="#000" />}
            </div>
          </div>
        </button>
      </div>
      
      {/* Quote */}
      <div className="flex items-center justify-center h-screen w-full">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2 }}
          className="bg-transparent p-6 text-center max-w-lg"
          style={{
            backgroundColor: darkMode ? 'rgba(0, 0, 0, 0)' : 'rgba(255, 255, 255, 0)',
            borderRadius: '12px'
          }}
        >
          <p 
            style={{ 
              fontSize, 
              textShadow: darkMode 
                ? "2px 2px 4px black" 
                : "2px 2px 4px white"
            }} 
            className="font-semibold italic"
          >
            {quote.text}
            <br />
            <span className="font-normal not-italic mt-2 block">— {quote.author}</span>
          </p>
        </motion.div>
      </div>
      
      {/* Bottom section with logo and language toggle */}
      <div className="flex justify-between items-end w-full pb-8">
        {/* Logo centered */}
        <div className="flex-1 flex justify-center">
          {showLogo && (
            <motion.img
              src={darkMode ? "/images/inspi-tap_white.png" : "/images/inspi-tap_black.png"}
              alt="Logo"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 2 }}
              className="absolute bottom-10 h-1/7 w-auto"
              />
          )}
        </div>

        {/* Language Toggle on right side */}
        <div className="flex items-center space-x-3 absolute right-8 bottom-8">
          <span className="text-sm font-bold">EN</span>
          <div 
            className="p-2 rounded-full shadow-md flex items-center justify-center"
            style={{
              backgroundColor: darkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)',
            }}
          >
            <button 
              onClick={toggleLanguage}
              className="relative w-12 h-6 flex items-center rounded-full transition-colors duration-300"
              style={{ backgroundColor: darkMode ? '#222222' : '#e2e8f0' }}
            >
              <div 
                className="absolute top-0 left-0 w-6 h-6 rounded-full transition-transform duration-300"
                style={{ 
                  backgroundImage: `url(${language === 'english' ? '/images/usa_flag.png' : '/images/spain_flag.png'})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  transform: language === 'english' ? 'translateX(0px)' : 'translateX(24px)'
                }}
              />
            </button>
          </div>
          <span className="text-sm font-bold">ES</span>
        </div>
      </div>

    </div>
  );
}