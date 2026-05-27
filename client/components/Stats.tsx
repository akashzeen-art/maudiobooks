import { motion } from "framer-motion";
import { stats } from "../data/audiobooks";
import { useEffect, useState } from "react";

export function Stats() {
  const [counts, setCounts] = useState(stats.map(() => 0));

  useEffect(() => {
    const targets = [2500000, 50000, 100000000, 500000000];
    const durations = [3, 2.5, 3.5, 3.2];

    targets.forEach((target, idx) => {
      const startTime = Date.now();
      const duration = durations[idx] * 1000;

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);

        setCounts((prev) => {
          const newCounts = [...prev];
          newCounts[idx] = Math.floor(target * progress);
          return newCounts;
        });

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };

      requestAnimationFrame(animate);
    });
  }, []);

  const formatNumber = (num: number, idx: number) => {
    if (idx === 0) return (num / 1000000).toFixed(1) + "M+";
    if (idx === 1) return (num / 1000).toFixed(0) + "K+";
    if (idx === 2) return (num / 1000000).toFixed(0) + "M+";
    return (num / 1000000).toFixed(0) + "M+";
  };

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
    <section className="relative py-20 bg-black overflow-hidden">
      {/* Background gradient lines */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={`line-${i}`}
            className="absolute h-px bg-gradient-to-r from-transparent via-neon-blue to-transparent"
            style={{
              top: `${(i + 1) * 25}%`,
              width: "100%",
            }}
            animate={{
              x: [-1000, 1000],
            }}
            transition={{
              duration: 8 + i,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}
      </div>

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
            <span className="bg-gradient-to-r from-neon-blue to-neon-pink bg-clip-text text-transparent">
              Our Impact
            </span>
          </h2>
          <p className="text-gray-400 font-poppins text-lg max-w-2xl mx-auto">
            Join millions of listeners around the world
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {stats.map((stat, idx) => (
            <motion.div
              key={stat.label}
              variants={itemVariants}
              className="group relative"
              whileHover={{ y: -5 }}
            >
              <div className="relative p-8 rounded-2xl bg-gradient-to-br from-gray-900/50 to-black border border-white/10 backdrop-blur-sm overflow-hidden hover:border-neon-blue/50 transition-colors">
                {/* Animated border glow */}
                <motion.div
                  className="absolute inset-0 rounded-2xl pointer-events-none"
                  animate={{
                    boxShadow: [
                      "inset 0 0 0 1px rgba(0, 217, 255, 0)",
                      "inset 0 0 30px 1px rgba(0, 217, 255, 0.2)",
                      "inset 0 0 0 1px rgba(0, 217, 255, 0)",
                    ],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: idx * 0.3,
                  }}
                />

                {/* Background blur */}
                <motion.div
                  className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-neon-blue/20 to-purple-500/20 rounded-full mix-blend-screen filter blur-3xl opacity-0 group-hover:opacity-100 transition-opacity"
                  animate={{
                    x: [10, -10, 10],
                    y: [10, -10, 10],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />

                <div className="relative z-10 text-center space-y-4">
                  <div className="text-5xl">{stat.icon}</div>

                  <div>
                    <motion.div
                      className="text-5xl font-grotesk font-bold bg-gradient-to-r from-neon-blue to-purple-500 bg-clip-text text-transparent"
                    >
                      {formatNumber(counts[idx], idx)}
                    </motion.div>
                  </div>

                  <p className="text-gray-400 font-poppins font-medium">
                    {stat.label}
                  </p>

                  {/* Animated underline */}
                  <motion.div
                    className="h-1 bg-gradient-to-r from-neon-blue to-purple-500 rounded-full mx-auto"
                    initial={{ width: 0 }}
                    whileInView={{ width: 40 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: idx * 0.1 }}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
