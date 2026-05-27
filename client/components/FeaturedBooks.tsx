import { motion } from "framer-motion";
import { Play, Star } from "lucide-react";
import { audiobooks } from "../data/audiobooks";
import { useMemo, useState } from "react";
import { AudioPlayer } from "./AudioPlayer";
import { useNavigate } from "react-router-dom";

export function FeaturedBooks() {
  const [selectedBook, setSelectedBook] = useState<typeof audiobooks[0] | null>(null);
  const navigate = useNavigate();
  const featured = useMemo(() => {
    return [...audiobooks]
      .sort(() => Math.random() - 0.5)
      .slice(0, 6);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <section className="relative py-20 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-grotesk font-bold mb-4">
            <span className="text-white">Featured</span>
            <br />
            <span className="bg-gradient-to-r from-neon-blue to-purple-500 bg-clip-text text-transparent">
              Audiobooks
            </span>
          </h2>
          <p className="text-gray-400 font-poppins text-lg max-w-2xl mx-auto">
            Discover our handpicked collection of premium audiobooks across all genres
          </p>
        </motion.div>

        {/* Books Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {featured.map((book) => (
            <motion.div
              key={book.id}
              variants={itemVariants}
              className="group relative"
              whileHover={{ y: -10 }}
            >
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900 to-black border border-white/10 p-4 h-full backdrop-blur-sm hover:border-neon-blue/50 transition-colors cursor-pointer"
                onClick={() => setSelectedBook(book)}>
                {/* Hover glow */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-neon-blue/20 to-purple-500/20 rounded-2xl opacity-0 group-hover:opacity-100"
                  transition={{ duration: 0.3 }}
                />

                {/* Book Thumbnail */}
                <div className="relative mb-4 overflow-hidden rounded-xl aspect-square bg-gradient-to-br from-purple-500 to-cyan-500">
                  <motion.img
                    src={book.thumbnail}
                    alt={book.title}
                    className="w-full h-full object-cover"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                    onError={(e) => {
                      e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 300 300'%3E%3Cdefs%3E%3ClinearGradient id='grad' x1='0%' y1='0%' x2='100%' y2='100%'%3E%3Cstop offset='0%' style='stop-color:rgb(168,107,250);stop-opacity:1' /%3E%3Cstop offset='100%' style='stop-color:rgb(0,217,255);stop-opacity:1' /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='300' height='300' fill='url(%23grad)'/%3E%3Ctext x='50%' y='50%' font-size='24' fill='white' text-anchor='middle' dominant-baseline='middle' font-family='Arial'%3EAudiobook%3C/text%3E%3C/svg%3E";
                    }}
                  />

                  {/* Play button overlay */}
                  <motion.div
                    className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    whileHover={{ background: "rgba(0, 0, 0, 0.6)" }}
                  >
                    <motion.button
                      className="p-4 rounded-full bg-gradient-to-r from-neon-blue to-cyan-500 text-black"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedBook(book);
                      }}
                    >
                      <Play size={24} fill="currentColor" />
                    </motion.button>
                  </motion.div>
                </div>

                {/* Content */}
                <div className="relative z-10 space-y-3">
                  <h3 className="text-lg font-grotesk font-bold text-white line-clamp-2">
                    {book.title}
                  </h3>
                  <p className="text-sm text-gray-400 font-poppins">{book.author}</p>

                  {/* Rating and Duration */}
                  <div className="flex items-center justify-between pt-3 border-t border-white/10">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          className={i < Math.floor(book.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-600"}
                        />
                      ))}
                      <span className="text-xs text-gray-400 ml-2">{book.rating}</span>
                    </div>
                    <span className="text-xs text-gray-400 font-poppins">
                      {book.duration}
                    </span>
                  </div>

                  {/* Category badge */}
                  <motion.div
                    className="pt-2 inline-block px-3 py-1 rounded-full bg-gradient-to-r from-neon-blue/20 to-purple-500/20 border border-neon-blue/30"
                  >
                    <span className="text-xs text-neon-blue font-poppins font-medium">
                      {book.category}
                    </span>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* View All Button */}
        <motion.div
          className="mt-16 flex justify-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <motion.button
            className="px-8 py-4 rounded-lg border-2 border-neon-blue/50 text-neon-blue font-poppins font-bold hover:bg-neon-blue/10 transition-colors"
            whileHover={{ scale: 1.05, borderColor: "rgba(0, 217, 255, 1)" }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/library")}
          >
            View All Audiobooks
          </motion.button>
        </motion.div>
      </div>

      {/* Audio Player Modal */}
      {selectedBook && (
        <AudioPlayer
          book={selectedBook}
          onClose={() => setSelectedBook(null)}
        />
      )}
    </section>
  );
}
