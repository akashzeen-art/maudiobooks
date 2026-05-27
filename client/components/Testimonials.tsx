import { motion } from "framer-motion";
import { testimonials } from "../data/audiobooks";
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";

export function Testimonials() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    setCurrent((prev) => (prev + newDirection + testimonials.length) % testimonials.length);
  };

  const visibleTestimonials = [
    testimonials[current],
    testimonials[(current + 1) % testimonials.length],
    testimonials[(current + 2) % testimonials.length],
  ];

  return (
    <section className="relative py-20 bg-gradient-to-b from-black via-purple-950/20 to-black overflow-hidden">
      {/* Background decorations */}
      <motion.div
        className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-tl from-neon-blue/20 to-transparent rounded-full filter blur-3xl pointer-events-none"
        animate={{ y: [0, -30, 0] }}
        transition={{ duration: 4, repeat: Infinity }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-grotesk font-bold mb-4">
            <span className="text-white">What Our Users</span>
            <br />
            <span className="bg-gradient-to-r from-neon-blue to-neon-pink bg-clip-text text-transparent">
              Say About Us
            </span>
          </h2>
          <p className="text-gray-400 font-poppins text-lg max-w-2xl mx-auto">
            Real reviews from our amazing community of listeners
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="relative mb-12">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {visibleTestimonials.map((testimonial, idx) => (
              <motion.div
                key={testimonial.id}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.5 },
                }}
                custom={direction}
                className="relative"
              >
                <div className="p-8 rounded-2xl bg-gradient-to-br from-gray-900/50 to-black border border-white/10 backdrop-blur-sm h-full">
                  {/* Stars */}
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} size={16} fill="#FFD700" className="text-yellow-400" />
                    ))}
                  </div>

                  {/* Quote */}
                  <p className="text-gray-300 font-poppins mb-6 text-lg leading-relaxed">
                    "{testimonial.content}"
                  </p>

                  {/* Author */}
                  <div className="flex items-center gap-4 pt-6 border-t border-white/10">
                    <div className="text-3xl">{testimonial.avatar}</div>
                    <div>
                      <p className="text-white font-grotesk font-bold">
                        {testimonial.name}
                      </p>
                      <p className="text-gray-400 font-poppins text-sm">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>

                  {/* Glow effect */}
                  <motion.div
                    className="absolute inset-0 rounded-2xl pointer-events-none"
                    animate={{
                      boxShadow: [
                        "0 0 0 1px rgba(0, 217, 255, 0)",
                        "0 0 30px 1px rgba(0, 217, 255, 0.2)",
                        "0 0 0 1px rgba(0, 217, 255, 0)",
                      ],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Navigation Controls */}
        <div className="flex items-center justify-center gap-4">
          <motion.button
            onClick={() => paginate(-1)}
            className="p-3 rounded-full border border-neon-blue/50 text-neon-blue hover:bg-neon-blue/10 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ChevronLeft size={24} />
          </motion.button>

          {/* Dots */}
          <div className="flex gap-2">
            {testimonials.map((_, idx) => (
              <motion.button
                key={idx}
                onClick={() => {
                  setDirection(idx > current ? 1 : -1);
                  setCurrent(idx);
                }}
                className={`h-2 rounded-full transition-all ${
                  idx === current
                    ? "w-8 bg-gradient-to-r from-neon-blue to-purple-500"
                    : "w-2 bg-gray-600 hover:bg-gray-400"
                }`}
              />
            ))}
          </div>

          <motion.button
            onClick={() => paginate(1)}
            className="p-3 rounded-full border border-neon-blue/50 text-neon-blue hover:bg-neon-blue/10 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ChevronRight size={24} />
          </motion.button>
        </div>
      </div>
    </section>
  );
}
