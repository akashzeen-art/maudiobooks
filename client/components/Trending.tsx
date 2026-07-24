import { motion } from "framer-motion";
import { audiobooks } from "../data/audiobooks";
import { useMemo } from "react";
import { AudioPlayer } from "./AudioPlayer";
import { AudioDurationLabel } from "./AudioDurationLabel";
import { useGatedPlay } from "../hooks/useGatedPlay";

export function Trending() {
  const { selectedBook, playBook, closePlayer } = useGatedPlay();
  // Shuffle once per page load, keep stable during component lifecycle.
  const trendingBooks = useMemo(() => [...audiobooks].sort(() => Math.random() - 0.5), []);
  const doubled = [...trendingBooks, ...trendingBooks];

  return (
    <section className="relative py-20 bg-gradient-to-r from-black via-purple-950/20 to-black overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-grotesk font-bold mb-4">
            <span className="text-white">Trending Now</span>
            <br />
            <span className="bg-gradient-to-r from-neon-blue to-neon-pink bg-clip-text text-transparent">
              Most Popular Audiobooks
            </span>
          </h2>
          <p className="text-gray-400 font-poppins text-lg">
            Curated selection of bestsellers everyone is listening to
          </p>
        </motion.div>
      </div>

      {/* Full-width scroll container */}
      <div className="relative overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-black to-transparent z-20 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-black to-transparent z-20 pointer-events-none" />

        <motion.div
          className="flex gap-4 w-max"
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            duration: trendingBooks.length * 3,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          {doubled.map((book, idx) => (
            <motion.div
              key={`trending-${idx}`}
              className="flex-shrink-0 w-44 group cursor-pointer"
              onClick={() => void playBook(book)}
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <div className="relative overflow-hidden rounded-xl shadow-2xl">
                <div className="relative w-full h-60 bg-gradient-to-br from-purple-500 to-cyan-500 overflow-hidden">
                  <img
                    src={book.thumbnail}
                    alt={book.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    onError={(e) => {
                      e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 300 300'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:rgb(168,107,250)'/%3E%3Cstop offset='100%25' style='stop-color:rgb(0,217,255)'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='300' height='300' fill='url(%23g)'/%3E%3Ctext x='50%25' y='50%25' font-size='20' fill='white' text-anchor='middle' dominant-baseline='middle' font-family='Arial'%3EAudiobook%3C/text%3E%3C/svg%3E";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                    <div>
                      <p className="text-white font-grotesk font-bold text-xs line-clamp-2">{book.title}</p>
                      <p className="text-gray-300 font-poppins text-xs mt-0.5">{book.author}</p>
                      <div className="flex items-center mt-1">
                        <AudioDurationLabel
                          src={book.audio}
                          className="text-neon-blue font-poppins text-xs"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {selectedBook && (
        <AudioPlayer book={selectedBook} onClose={closePlayer} />
      )}
    </section>
  );
}
