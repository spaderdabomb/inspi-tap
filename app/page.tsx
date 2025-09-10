"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Moon, Sun, ShoppingBag } from "lucide-react";

import {
  todayLocalKey,
  readDaily,
  writeDaily,
  clearDaily,
  nextLocalMidnight,
  readLanguage,
  writeLanguage,
  readTheme,
  writeTheme,
} from "@/lib/cookieStorage";

import quotes from "@/data/quotes";

const SHOP_URL = "https://inspitap.com"; // ← replace with your real link

export default function QuoteGenerator() {
  const [quote, setQuote] = useState({ text: "", author: "" });
  const [showLogo, setShowLogo] = useState(false);
  const [fontSize, setFontSize] = useState("text-xl");
  const [darkMode, setDarkMode] = useState(true);
  const [language, setLanguage] = useState<"english" | "spanish">("english");
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [imagesPreloaded, setImagesPreloaded] = useState(false);
  const [isPortrait, setIsPortrait] = useState(false);

  // Guard to avoid double-running initialization in React Strict Mode
  const didInit = useRef(false);

  useEffect(() => {
    if (didInit.current) return;
    didInit.current = true;

    // 1) Load persisted preferences
    const themePref = readTheme();
    const langPref = readLanguage();
    setDarkMode(themePref === "dark");
    setLanguage(langPref);

    // 2) Daily quote (cookie-only, resets at next local midnight)
    const today = todayLocalKey();
    const saved = readDaily();
    let idx: number;

    if (saved && saved.date === today && Number.isInteger(saved.index)) {
      idx = saved.index;
    } else {
      idx = Math.floor(Math.random() * quotes.length);
      writeDaily({ date: today, index: idx, language: langPref });
    }

    setQuoteIndex(idx);
    setQuote(quotes[idx][langPref]);

    // 3) Show logo after delay
    const logoTimer = window.setTimeout(() => setShowLogo(true), 2000);

    // 4) Orientation + responsive font sizing
    const handleResize = () => {
      const isCurrentlyPortrait = window.innerHeight > window.innerWidth;
      setIsPortrait(isCurrentlyPortrait);
      const screenHeight = window.innerHeight;
      const newFontSize = `${Math.min(24, screenHeight * 0.03)}px`;
      setFontSize(newFontSize);
    };
    handleResize();
    window.addEventListener("resize", handleResize);

    // 5) Preload images
    const imagePaths = [
      "/images/inspi-tap_white.png",
      "/images/inspi-tap_black.png",
      "/images/usa_flag.png",
      "/images/spain_flag.png",
      "/images/black_bg_phone.png",
      "/images/white_bg_phone.png",
      "/images/black_bg.png",
      "/images/white_bg.png",
    ];
    const preloadImages = async () => {
      try {
        await Promise.all(
          imagePaths.map(
            (path) =>
              new Promise<void>((resolve, reject) => {
                const img = new Image();
                img.src = path;
                img.onload = () => resolve();
                img.onerror = () => reject();
              })
          )
        );
        setImagesPreloaded(true);
      } catch (e) {
        console.error("Error preloading images:", e);
        // still let the app render
        setImagesPreloaded(true);
      }
    };
    preloadImages();

    // 6) Prevent body scrolling while this screen is mounted
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // 7) Schedule cookie reset at next local midnight (also updates UI)
    const msUntilMidnight = nextLocalMidnight().getTime() - Date.now();
    const midnightTimer = window.setTimeout(() => {
      clearDaily();
      const newIdx = Math.floor(Math.random() * quotes.length);
      const newToday = todayLocalKey();
      setQuoteIndex(newIdx);
      const currentLang = readLanguage();
      setQuote(quotes[newIdx][currentLang]);
      writeDaily({ date: newToday, index: newIdx, language: currentLang });
    }, Math.max(0, msUntilMidnight));

    return () => {
      window.removeEventListener("resize", handleResize);
      window.clearTimeout(logoTimer);
      window.clearTimeout(midnightTimer);
      document.body.style.overflow = prevOverflow;
    };
  }, []);

  // Update quote text when language or selected index changes
  useEffect(() => {
    setQuote(quotes[quoteIndex][language]);
  }, [language, quoteIndex]);

  // Toggle theme + persist
  const toggleTheme = () => {
    const next = !darkMode;
    setDarkMode(next);
    writeTheme(next ? "dark" : "light");
  };

  // Toggle language + persist (and update daily cookie's language for today)
  const toggleLanguage = () => {
    const next = language === "english" ? "spanish" : "english";
    setLanguage(next);
    writeLanguage(next);

    const current = readDaily();
    const today = todayLocalKey();
    if (current && current.date === today) {
      writeDaily({ ...current, language: next });
    }
  };

  const backgroundImage = isPortrait
    ? `/images/${darkMode ? "black_bg_phone.png" : "white_bg_phone.png"}`
    : `/images/${darkMode ? "black_bg.png" : "white_bg.png"}`;

  if (!imagesPreloaded) return <div>Loading...</div>;

  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-between p-4"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        color: darkMode ? "white" : "black",
        transition: "background-image 0.5s ease",
      }}
    >
      {/* Theme toggle in top left */}
      <div className="self-start">
        <button
          onClick={toggleTheme}
          className="flex items-center space-x-2 rounded-full p-2 shadow-md"
          style={{
            backgroundColor: darkMode
              ? "rgba(255, 255, 255, 0.2)"
              : "rgba(0, 0, 0, 0.1)",
          }}
        >
          <div
            className="relative w-12 h-6 rounded-full transition-colors duration-300"
            style={{ backgroundColor: darkMode ? "#222222" : "#e2e8f0" }}
          >
            <div
              className="absolute top-1 left-1 w-4 h-4 rounded-full transition-transform duration-300"
              style={{
                backgroundColor: "#fff",
                transform: darkMode ? "translateX(0)" : "translateX(24px)",
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
            backgroundColor: darkMode
              ? "rgba(0, 0, 0, 0)"
              : "rgba(255, 255, 255, 0)",
            borderRadius: "12px",
          }}
        >
          <p
            style={{
              fontSize,
              textShadow: darkMode ? "2px 2px 4px black" : "2px 2px 4px white",
            }}
            className="font-semibold italic"
          >
            {quote.text}
            <br />
            <span className="font-normal not-italic mt-2 block">
              — {quote.author}
            </span>
          </p>
        </motion.div>
      </div>

      {/* Bottom section with logo and language toggle */}
      <div className="flex justify-between items-end w-full pb-8">
        {/* Top-right: Language toggle */}
        <div className="absolute top-4 right-4 flex items-center space-x-3">
          <span className="text-sm font-bold">EN</span>
          <div
            className="p-2 rounded-full shadow-md flex items-center justify-center"
            style={{
              backgroundColor: darkMode
                ? "rgba(255, 255, 255, 0.2)"
                : "rgba(0, 0, 0, 0.1)",
            }}
          >
            <button
              onClick={toggleLanguage}
              className="relative w-12 h-6 flex items-center rounded-full transition-colors duration-300"
              style={{ backgroundColor: darkMode ? "#222222" : "#e2e8f0" }}
              aria-label="Toggle language"
            >
              <div
                className="absolute top-0 left-0 w-6 h-6 rounded-full transition-transform duration-300"
                style={{
                  backgroundImage: `url(${
                    language === "english"
                      ? "/images/usa_flag.png"
                      : "/images/spain_flag.png"
                  })`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  transform:
                    language === "english"
                      ? "translateX(0px)"
                      : "translateX(24px)",
                }}
              />
            </button>
          </div>
          <span className="text-sm font-bold">ES</span>
        </div>

        {/* Bottom-left: Logo */}
        {/* Logo centered */}
        <div className="flex-1 flex justify-center">
          {showLogo && (
            <motion.img
              src={
                darkMode
                  ? "/images/inspi-tap_white.png"
                  : "/images/inspi-tap_black.png"
              }
              alt="Logo"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 2 }}
              className="absolute bottom-10 h-1/7 w-auto"
            />
          )}
        </div>

        {/* Bottom-right: Shop link */}
        <a
          href={SHOP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute right-8 bottom-8 p-2 rounded-full shadow-md"
          style={{
            backgroundColor: darkMode
              ? "rgba(255, 255, 255, 0.2)"
              : "rgba(0, 0, 0, 0.1)",
          }}
          aria-label="Open shop"
          title="Open shop"
        >
          <ShoppingBag size={20} color={darkMode ? "#fff" : "#000"} />
        </a>
      </div>
    </div>
  );
}
