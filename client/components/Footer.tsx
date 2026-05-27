import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="relative bg-black border-t border-white/10 overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-neon-blue/10 to-transparent rounded-full filter blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          className="py-10 flex flex-col md:flex-row items-center justify-between gap-4"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <Link to="/">
            <img src="/37.png" alt="GlobalAudio" className="h-9 w-auto" />
          </Link>

          <div className="flex gap-6">
            <Link to="/" className="text-gray-400 hover:text-neon-blue font-poppins text-sm transition-colors">Home</Link>
            <Link to="/library" className="text-gray-400 hover:text-neon-blue font-poppins text-sm transition-colors">Library</Link>
          </div>

          <p className="text-gray-600 font-poppins text-sm">
            © 2026 GlobalAudio. All rights reserved.
          </p>
        </motion.div>
      </div>
    </footer>
  );
}
