import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Preloader } from "../components/Preloader";
import { Navbar } from "../components/Navbar";
import { Hero } from "../components/Hero";
import { FeaturedBooks } from "../components/FeaturedBooks";
import { Categories } from "../components/Categories";
import { Trending } from "../components/Trending";
import { BookGridSection } from "../components/BookGridSection";
import { Footer } from "../components/Footer";
import { travelAdventureBooks, homeWellnessBooks } from "../data/cdnAudiobooks";

const SEEN_KEY = "maudiobooks_preloader_seen";

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
          <BookGridSection
            titleLine1="Travel &"
            titleLine2="Adventure"
            subtitle="Explore backpacking, culture guides, and journeys around the world"
            books={travelAdventureBooks}
            accent="purple"
          />
          <BookGridSection
            titleLine1="Home &"
            titleLine2="Wellness"
            subtitle="Declutter, heal, and build a healthier lifestyle at home"
            books={homeWellnessBooks}
            accent="pink"
          />
          <Footer />
        </div>
      )}
    </>
  );
}
