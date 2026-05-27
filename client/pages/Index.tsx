import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Preloader } from "../components/Preloader";
import { Navbar } from "../components/Navbar";
import { Hero } from "../components/Hero";
import { FeaturedBooks } from "../components/FeaturedBooks";
import { Categories } from "../components/Categories";
import { Trending } from "../components/Trending";
import { Testimonials } from "../components/Testimonials";
import { Footer } from "../components/Footer";

const SEEN_KEY = "GlobalAudio_preloader_seen";

export default function Index() {
  const [showPreloader, setShowPreloader] = useState(() => {
    if (typeof window === "undefined") return false;
    return !sessionStorage.getItem(SEEN_KEY);
  });

  const handlePreloaderComplete = () => {
    sessionStorage.setItem(SEEN_KEY, "1");
    setShowPreloader(false);
  };

  return (
    <>
      <AnimatePresence>
        {showPreloader && (
          <Preloader onComplete={handlePreloaderComplete} />
        )}
      </AnimatePresence>

      {!showPreloader && (
        <div className="overflow-hidden">
          <Navbar />
          <Hero />
          <FeaturedBooks />
          <Categories />
          <Trending />
          <Testimonials />
          <Footer />
        </div>
      )}
    </>
  );
}
