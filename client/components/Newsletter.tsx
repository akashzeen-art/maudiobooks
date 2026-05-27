import { motion } from "framer-motion";
import { Mail, ArrowRight } from "lucide-react";
import { useState } from "react";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      setEmail("");
      setTimeout(() => setSubmitted(false), 3000);
    }
  };

  return (
    <section className="relative py-20 bg-black overflow-hidden">
      {/* Background elements */}
      <motion.div
        className="absolute top-1/2 left-1/3 w-96 h-96 bg-gradient-to-br from-neon-blue/30 to-purple-500/30 rounded-full mix-blend-screen filter blur-3xl opacity-30 pointer-events-none"
        animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-tl from-neon-pink/30 to-transparent rounded-full mix-blend-screen filter blur-3xl opacity-20 pointer-events-none"
        animate={{ scale: [1.2, 1, 1.2] }}
        transition={{ duration: 6, repeat: Infinity }}
      />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Content */}
        <motion.div
          className="text-center space-y-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="space-y-4">
            <motion.div
              className="flex justify-center"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <div className="p-3 rounded-full bg-gradient-to-r from-neon-blue/20 to-purple-500/20 border border-neon-blue/30">
                <Mail className="w-6 h-6 text-neon-blue" />
              </div>
            </motion.div>

            <h2 className="text-4xl md:text-5xl font-grotesk font-bold">
              <span className="text-white">Stay Updated</span>
              <br />
              <span className="bg-gradient-to-r from-neon-blue to-neon-pink bg-clip-text text-transparent">
                Get Exclusive Content
              </span>
            </h2>

            <p className="text-lg text-gray-400 font-poppins max-w-2xl mx-auto">
              Subscribe to our newsletter and get instant access to exclusive audiobooks, early releases, and special offers.
            </p>
          </div>

          {/* Newsletter Form */}
          <motion.form
            onSubmit={handleSubmit}
            className="relative max-w-md mx-auto"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <div className="relative group">
              {/* Background glow */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-neon-blue/30 to-purple-500/30 rounded-xl blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-300"
              />

              {/* Input container */}
              <div className="relative flex items-center bg-gradient-to-r from-gray-900/80 to-black border border-white/10 rounded-xl overflow-hidden focus-within:border-neon-blue/50 transition-colors">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 px-6 py-4 bg-transparent text-white font-poppins placeholder-gray-500 focus:outline-none"
                  required
                />

                <motion.button
                  type="submit"
                  className="px-6 py-4 bg-gradient-to-r from-neon-blue to-cyan-500 text-black font-poppins font-bold flex items-center gap-2 hover:shadow-lg hover:shadow-neon-blue/50 transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="hidden sm:inline">Subscribe</span>
                  <ArrowRight size={20} />
                </motion.button>
              </div>
            </div>

            {/* Success message */}
            <motion.div
              className="mt-4 text-center"
              initial={{ opacity: 0, y: -10 }}
              animate={{
                opacity: submitted ? 1 : 0,
                y: submitted ? 0 : -10,
              }}
              transition={{ duration: 0.3 }}
            >
              <p className="text-neon-blue font-poppins font-medium">
                ✓ Successfully subscribed!
              </p>
            </motion.div>
          </motion.form>

          {/* Social proof */}
          <motion.div
            className="pt-8 border-t border-white/10"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            <p className="text-sm text-gray-500 font-poppins mb-4">
              Trusted by 2.5 million listeners worldwide
            </p>
            <div className="flex justify-center gap-4">
              {[1, 2, 3].map((idx) => (
                <motion.div
                  key={idx}
                  className="w-10 h-10 rounded-full bg-gradient-to-br from-neon-blue to-purple-500 flex items-center justify-center text-white font-grotesk font-bold"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, delay: idx * 0.2, repeat: Infinity }}
                >
                  👤
                </motion.div>
              ))}
              <div className="text-gray-400 font-poppins text-sm flex items-center">
                +2.5M more
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
