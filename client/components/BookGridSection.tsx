import { motion } from "framer-motion";
import { Play } from "lucide-react";
import { Audiobook } from "../data/audiobooks";
import { AudioPlayer } from "./AudioPlayer";
import { AudioDurationLabel } from "./AudioDurationLabel";
import { useGatedPlay } from "../hooks/useGatedPlay";

interface BookGridSectionProps {
  titleLine1: string;
  titleLine2: string;
  subtitle: string;
  books: Audiobook[];
  accent?: "purple" | "pink";
}

export function BookGridSection({
  titleLine1,
  titleLine2,
  subtitle,
  books,
  accent = "purple",
}: BookGridSectionProps) {
  const { selectedBook, playBook, closePlayer } = useGatedPlay();
  const gradient =
    accent === "pink"
      ? "from-neon-blue to-neon-pink"
      : "from-neon-blue to-purple-500";

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <section className="relative py-20 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-grotesk font-bold mb-4">
            <span className="text-white">{titleLine1}</span>
            <br />
            <span className={`bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}>
              {titleLine2}
            </span>
          </h2>
          <p className="text-gray-400 font-poppins text-lg max-w-2xl mx-auto">
            {subtitle}
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {books.map((book) => (
            <motion.div
              key={book.id}
              variants={itemVariants}
              className="group relative"
              whileHover={{ y: -10 }}
            >
              <div
                className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900 to-black border border-white/10 p-4 h-full backdrop-blur-sm hover:border-neon-blue/50 transition-colors cursor-pointer"
                onClick={() => void playBook(book)}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-neon-blue/20 to-purple-500/20 rounded-2xl opacity-0 group-hover:opacity-100"
                  transition={{ duration: 0.3 }}
                />

                <div className="relative mb-4 overflow-hidden rounded-xl aspect-square bg-gradient-to-br from-purple-500 to-cyan-500">
                  <motion.img
                    src={book.thumbnail}
                    alt={book.title}
                    className="w-full h-full object-cover"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                  />

                  <motion.div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <motion.button
                      className="p-4 rounded-full bg-gradient-to-r from-neon-blue to-cyan-500 text-black"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        void playBook(book);
                      }}
                    >
                      <Play size={24} fill="currentColor" />
                    </motion.button>
                  </motion.div>
                </div>

                <div className="relative z-10 space-y-3">
                  <h3 className="text-sm sm:text-lg font-grotesk font-bold text-white line-clamp-2">
                    {book.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-400 font-poppins">{book.author}</p>

                  <div className="flex items-center justify-between pt-3 border-t border-white/10">
                    <span className="text-xs text-gray-400 font-poppins">Duration</span>
                    <AudioDurationLabel
                      src={book.audio}
                      className="text-xs text-neon-blue font-poppins font-medium"
                    />
                  </div>

                  <div className="pt-2 inline-block px-3 py-1 rounded-full bg-gradient-to-r from-neon-blue/20 to-purple-500/20 border border-neon-blue/30">
                    <span className="text-xs text-neon-blue font-poppins font-medium">
                      {book.category}
                    </span>
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
