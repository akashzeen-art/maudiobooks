import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Play, X } from "lucide-react";
import { audiobooks, categories } from "../data/audiobooks";
import { cdnAudiobooks } from "../data/cdnAudiobooks";
import { AudioPlayer } from "../components/AudioPlayer";
import { AudioDurationLabel } from "../components/AudioDurationLabel";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { useSearchParams } from "react-router-dom";
import { useGatedPlay } from "../hooks/useGatedPlay";

export default function Library() {
  const [searchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState<string>(searchParams.get("category") || "all");
  const [searchQuery, setSearchQuery] = useState("");
  const { selectedBook, playBook, closePlayer } = useGatedPlay();
  const allBooks = useMemo(() => [...audiobooks, ...cdnAudiobooks], []);
  const shuffledBooks = useMemo(() => [...allBooks].sort(() => Math.random() - 0.5), [allBooks]);

  useEffect(() => {
    const cat = searchParams.get("category");
    if (cat) setSelectedCategory(cat);
  }, [searchParams]);

  const filtered = useMemo(() => {
    return shuffledBooks.filter((book) => {
      const matchCat = selectedCategory === "all" || book.category.toLowerCase() === selectedCategory;
      const matchSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [selectedCategory, searchQuery, shuffledBooks]);

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <div className="pt-24 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-5xl md:text-6xl font-grotesk font-bold mb-4">
            <span className="text-white">Audio</span>
            <span className="bg-gradient-to-r from-neon-blue to-purple-500 bg-clip-text text-transparent"> Library</span>
          </h1>
          <p className="text-gray-400 font-poppins text-lg">Browse our collection across {categories.length} categories</p>
        </motion.div>

        {/* Search */}
        <motion.div
          className="relative max-w-xl mx-auto mb-10"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search by title or author..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-12 py-4 bg-white/5 border border-white/10 rounded-xl text-white font-poppins placeholder-gray-500 focus:outline-none focus:border-neon-blue/50 transition-colors"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white">
              <X size={18} />
            </button>
          )}
        </motion.div>

        {/* Category Filters */}
        <motion.div
          className="flex flex-wrap gap-3 justify-center mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <button
            onClick={() => setSelectedCategory("all")}
            className={`px-5 py-2 rounded-full font-poppins font-medium text-sm transition-all ${
              selectedCategory === "all"
                ? "bg-gradient-to-r from-neon-blue to-purple-500 text-black"
                : "bg-white/5 border border-white/10 text-gray-400 hover:border-neon-blue/50 hover:text-white"
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-5 py-2 rounded-full font-poppins font-medium text-sm transition-all ${
                  selectedCategory === cat.id
                    ? "bg-gradient-to-r from-neon-blue to-purple-500 text-black"
                    : "bg-white/5 border border-white/10 text-gray-400 hover:border-neon-blue/50 hover:text-white"
                }`}
              >
                {cat.icon} {cat.name}
              </button>
          ))}
        </motion.div>

{/* Books Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedCategory + searchQuery}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {filtered.map((book, idx) => (
              <motion.div
                key={book.id}
                className="group cursor-pointer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.03 }}
                onClick={() => void playBook(book)}
                whileHover={{ y: -5 }}
              >
                <div className="relative overflow-hidden rounded-xl bg-gray-900 border border-white/5 hover:border-neon-blue/40 transition-colors h-full flex flex-col">
                  <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-purple-500 to-cyan-500">
                    <img
                      src={book.thumbnail}
                      alt={book.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 300 300'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:rgb(168,107,250)'/%3E%3Cstop offset='100%25' style='stop-color:rgb(0,217,255)'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='300' height='300' fill='url(%23g)'/%3E%3Ctext x='50%25' y='50%25' font-size='20' fill='white' text-anchor='middle' dominant-baseline='middle' font-family='Arial'%3EAudiobook%3C/text%3E%3C/svg%3E";
                      }}
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="p-3 rounded-full bg-gradient-to-r from-neon-blue to-cyan-500 text-black">
                        <Play size={18} fill="currentColor" />
                      </div>
                    </div>
                  </div>
                  <div className="p-3 flex flex-col flex-1">
                    <h3 className="text-white font-grotesk font-bold text-xs line-clamp-2 leading-snug min-h-[2.5rem] mb-1">{book.title}</h3>
                    <p className="text-gray-500 font-poppins text-xs line-clamp-1 min-h-[1rem]">{book.author}</p>
                    <div className="flex items-center mt-auto pt-2">
                      <AudioDurationLabel
                        src={book.audio}
                        fallback={book.duration}
                        className="text-xs text-neon-blue font-poppins"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {filtered.length === 0 && (
          <motion.div className="text-center py-20" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <p className="text-gray-500 font-poppins text-lg">No audiobooks found. Try a different search.</p>
          </motion.div>
        )}
      </div>

      <Footer />

      {selectedBook && (
        <AudioPlayer book={selectedBook} onClose={closePlayer} />
      )}
    </div>
  );
}
