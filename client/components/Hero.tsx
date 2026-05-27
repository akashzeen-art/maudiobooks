import { motion } from "framer-motion";
import { Play, Sparkles } from "lucide-react";
import { useMousePosition } from "../hooks/useMousePosition";
import { useNavigate } from "react-router-dom";
import { audiobooks } from "../data/audiobooks";

export function Hero() {
  const { x, y } = useMousePosition();
  const navigate = useNavigate();
  const heroBooks = audiobooks.slice(0, 3);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8 },
    },
  };

  return (
    <section className="relative min-h-screen pt-32 pb-20 flex items-center overflow-hidden bg-black">
      {/* Animated background orbs */}
      <motion.div
        className="absolute top-20 left-10 w-80 h-80 bg-gradient-to-br from-purple-500 to-transparent rounded-full mix-blend-screen filter blur-3xl opacity-30"
        animate={{
          x: x * 0.05,
          y: y * 0.05,
        }}
        transition={{ type: "spring", damping: 30, stiffness: 100 }}
      />
      <motion.div
        className="absolute bottom-20 right-10 w-80 h-80 bg-gradient-to-tl from-neon-blue to-transparent rounded-full mix-blend-screen filter blur-3xl opacity-30"
        animate={{
          x: -x * 0.05,
          y: -y * 0.05,
        }}
        transition={{ type: "spring", damping: 30, stiffness: 100 }}
      />

      {/* Floating particles */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={`hero-particle-${i}`}
          className="absolute w-1.5 h-1.5 bg-neon-blue rounded-full opacity-50"
          animate={{
            x: [0, Math.random() * 200 - 100],
            y: [0, Math.random() * 200 - 100],
            opacity: [0.5, 0],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: i * 0.1,
          }}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
        />
      ))}

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <motion.div
          className="grid lg:grid-cols-2 gap-12 items-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Left Content */}
          <div className="space-y-8">
            {/* Badge */}
            <motion.div
              variants={itemVariants}
              className="flex items-center gap-2 w-fit"
            >
              <div className="p-2 rounded-full bg-gradient-to-r from-neon-blue/20 to-purple-500/20 border border-neon-blue/30">
                <Sparkles className="w-5 h-5 text-neon-blue" />
              </div>
              <span className="text-sm font-poppins text-neon-blue font-medium">
                Premium Audio Experience
              </span>
            </motion.div>

            {/* Heading */}
            <motion.div variants={itemVariants} className="space-y-4">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-grotesk font-bold leading-tight">
                <span className="text-white">Listen Stories</span>
                <br />
                <span className="bg-gradient-to-r from-neon-blue via-purple-500 to-neon-pink bg-clip-text text-transparent">
                  Beyond Imagination
                </span>
              </h1>
              <p className="text-xl text-gray-400 font-poppins max-w-md">
                Immerse yourself in thousands of premium audiobooks. Stream, download, and enjoy unlimited entertainment.
              </p>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 pt-4"
            >
              <motion.button
                className="px-8 py-4 rounded-lg bg-gradient-to-r from-neon-blue to-cyan-500 text-black font-poppins font-bold flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-neon-blue/50"
                whileHover={{ scale: 1.05, boxShadow: "0 0 40px rgba(0, 217, 255, 0.6)" }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/library")}
              >
                <Play size={20} />
                Start Listening
              </motion.button>
              <motion.button
                className="px-8 py-4 rounded-lg border-2 border-neon-blue/50 text-neon-blue font-poppins font-bold hover:bg-neon-blue/10 hover:border-neon-blue transition-colors"
                whileHover={{ scale: 1.05, borderColor: "rgba(0, 217, 255, 1)" }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/library")}
              >
                Explore Library
              </motion.button>
            </motion.div>
          </div>

          {/* Right Content - Featured Audiobooks */}
          <motion.div
            variants={itemVariants}
            className="relative h-96 md:h-[500px]"
          >
            {/* Animated book cards */}
            {heroBooks.map((book, idx) => (
              <motion.div
                key={idx}
                className="absolute w-40 h-56 rounded-xl overflow-hidden shadow-2xl"
                animate={{
                  x: [0, -30, 0],
                  y: [0, -20, 0],
                  rotate: [-5 + idx * 5, -3 + idx * 3, -5 + idx * 5],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  delay: idx * 0.3,
                  ease: "easeInOut",
                }}
                style={{
                  left: `${idx * 120}px`,
                  top: `${idx * 40}px`,
                  zIndex: 3 - idx,
                }}
                whileHover={{
                  scale: 1.1,
                  boxShadow: "0 0 40px rgba(0, 217, 255, 0.6)",
                }}
              >
                <div className="w-full h-full bg-gradient-to-br from-purple-500 via-blue-500 to-cyan-500">
                  <img src={book.thumbnail} alt={book.title} className="w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                </div>
              </motion.div>
            ))}

            {/* Mini equalizer */}
            <motion.div
              className="absolute bottom-0 right-0 flex items-end gap-1"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {[...Array(4)].map((_, i) => (
                <motion.div
                  key={i}
                  className="w-1.5 bg-gradient-to-t from-neon-blue to-neon-pink rounded-full"
                  animate={{
                    height: [8, 24, 8],
                  }}
                  transition={{
                    duration: 0.6,
                    repeat: Infinity,
                    delay: i * 0.1,
                  }}
                />
              ))}
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
