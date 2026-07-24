import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const navItems = [
    { label: "Home", href: "/" },
    { label: "Library", href: "/library" },
    { label: "My Account", href: "/account" },
  ];

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-40 backdrop-blur-md bg-black/30 border-b border-white/10"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/">
            <motion.div
              className="flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <img src="/logo.png" alt="maudiobooks" className="h-10 w-auto" />
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item, idx) => (
              <Link key={item.label} to={item.href}>
                <motion.span
                  className="text-gray-300 hover:text-white font-poppins font-medium transition-colors relative cursor-pointer"
                  whileHover={{ scale: 1.05 }}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  {item.label}
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-neon-blue to-neon-pink"
                    initial={{ scaleX: 0 }}
                    whileHover={{ scaleX: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.span>
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            className="md:hidden text-white"
            onClick={() => setIsOpen(!isOpen)}
            whileTap={{ scale: 0.9 }}
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </motion.button>
        </div>

        {/* Mobile Menu */}
        <motion.div
          className="md:hidden overflow-hidden"
          initial={{ height: 0 }}
          animate={{ height: isOpen ? "auto" : 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navItems.map((item) => (
              <Link key={item.label} to={item.href} onClick={() => setIsOpen(false)}>
                <motion.div
                  className="block w-full text-left px-3 py-2 text-gray-300 hover:text-white hover:bg-white/5 rounded-md font-poppins font-medium transition-colors"
                  whileHover={{ x: 5 }}
                >
                  {item.label}
                </motion.div>
              </Link>
            ))}
            <motion.button
              className="w-full px-3 py-2 mt-4 rounded-lg bg-gradient-to-r from-neon-blue to-purple-500 text-black font-poppins font-bold"
              whileTap={{ scale: 0.95 }}
              onClick={() => { navigate("/library"); setIsOpen(false); }}
            >
              Explore Library
            </motion.button>
          </div>
        </motion.div>
      </div>
    </motion.nav>
  );
}
