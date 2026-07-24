import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { categories } from "../data/audiobooks";

export function Categories() {
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 },
  };

  return (
    <section className="relative py-20 bg-gradient-to-b from-black via-purple-950/10 to-black overflow-hidden">
      <motion.div
        className="absolute top-1/2 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-screen filter blur-3xl opacity-20 pointer-events-none"
        animate={{ y: [0, 50, 0] }}
        transition={{ duration: 6, repeat: Infinity }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-grotesk font-bold mb-4">
            <span className="text-white">Explore</span>
            <br />
            <span className="bg-gradient-to-r from-neon-blue to-neon-pink bg-clip-text text-transparent">
              Categories
            </span>
          </h2>
          <p className="text-gray-400 font-poppins text-lg max-w-2xl mx-auto">
            Browse through our diverse collection organized by genre
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {categories.map((category) => {
            return (
              <motion.div
                key={category.id}
                variants={itemVariants}
                className="group relative overflow-hidden rounded-2xl cursor-pointer"
                whileHover={{ y: -5 }}
                onClick={() => navigate(`/library?category=${category.id}`)}
              >
                <div className={`relative p-4 sm:p-8 rounded-2xl h-36 sm:h-48 bg-gradient-to-br ${category.color} overflow-hidden border border-white/10`}>
                  <motion.div
                    className="absolute inset-0 opacity-30"
                    animate={{ backgroundPosition: ["0% 0%", "100% 100%"] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                    style={{
                      backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
                      backgroundSize: "50px 50px",
                    }}
                  />
                  <motion.div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  <div className="relative z-10 h-full flex flex-col justify-between">
                    <div className="text-3xl sm:text-5xl">{category.icon}</div>
                    <div>
                      <h3 className="text-base sm:text-2xl font-grotesk font-bold text-white mb-1">{category.name}</h3>
                      <motion.div
                        className="h-1 w-12 bg-white rounded-full mt-2"
                        initial={{ width: 0 }}
                        whileInView={{ width: 48 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                      />
                    </div>
                  </div>

                  <motion.div
                    className="absolute inset-0 rounded-2xl pointer-events-none"
                    animate={{
                      boxShadow: [
                        "0 0 0 1px rgba(255, 255, 255, 0)",
                        "0 0 40px 2px rgba(0, 217, 255, 0.3)",
                        "0 0 0 1px rgba(255, 255, 255, 0)",
                      ],
                    }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  />
                </div>

                <motion.div className="absolute bottom-6 right-6 p-3 rounded-full bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </motion.div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
