import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface PreloaderProps {
  onComplete: () => void;
}

export function Preloader({ onComplete }: PreloaderProps) {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<"loading" | "reveal" | "exit">("loading");

  useEffect(() => {
    const duration = 3200;
    const startTime = Date.now();

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const p = Math.min((elapsed / duration) * 100, 100);
      setProgress(p);

      if (p >= 100) {
        clearInterval(interval);
        setPhase("reveal");
        setTimeout(() => {
          setPhase("exit");
          setTimeout(onComplete, 700);
        }, 900);
      }
    }, 30);

    return () => clearInterval(interval);
  }, [onComplete]);

  const bars = [1, 1.8, 2.4, 1.6, 2.8, 1.4, 2.2, 1.9, 2.6, 1.3, 2.0, 1.7];

  return (
    <AnimatePresence>
      {phase !== "exit" && (
        <motion.div
          className="fixed inset-0 z-[100] bg-black flex items-center justify-center overflow-hidden"
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
        >
          {/* Ambient glow blobs */}
          <motion.div
            className="absolute w-[600px] h-[600px] rounded-full pointer-events-none"
            style={{
              background: "radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)",
              top: "50%", left: "50%", x: "-50%", y: "-50%",
            }}
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute w-[400px] h-[400px] rounded-full pointer-events-none"
            style={{
              background: "radial-gradient(circle, rgba(0,217,255,0.1) 0%, transparent 70%)",
              top: "30%", left: "60%",
            }}
            animate={{ scale: [1, 1.3, 1], x: [0, 30, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          />

          {/* Floating particles */}
          {[...Array(16)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full pointer-events-none"
              style={{
                width: i % 3 === 0 ? 3 : 2,
                height: i % 3 === 0 ? 3 : 2,
                background: i % 2 === 0 ? "#00D9FF" : "#a855f7",
                left: `${5 + (i * 6.2) % 90}%`,
                top: `${10 + (i * 7.3) % 80}%`,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0.2, 0.8, 0.2],
              }}
              transition={{
                duration: 2 + (i % 4) * 0.5,
                repeat: Infinity,
                delay: i * 0.15,
                ease: "easeInOut",
              }}
            />
          ))}

          <div className="relative z-10 flex flex-col items-center gap-10">

            {/* Vinyl Record */}
            <div className="relative w-32 h-32">
              {/* Outer ring */}
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-white/5"
                style={{ background: "conic-gradient(from 0deg, #1a1a2e, #16213e, #0f3460, #1a1a2e)" }}
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                {/* Grooves */}
                {[20, 30, 40, 50].map((r) => (
                  <div
                    key={r}
                    className="absolute rounded-full border border-white/5"
                    style={{
                      inset: `${r}%`,
                    }}
                  />
                ))}
              </motion.div>

              {/* Center label */}
              <motion.div
                className="absolute inset-0 m-auto w-12 h-12 rounded-full flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, #7c3aed, #00D9FF)" }}
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                <div className="w-2 h-2 rounded-full bg-black" />
              </motion.div>

              {/* Glow ring */}
              <motion.div
                className="absolute inset-0 rounded-full pointer-events-none"
                animate={{
                  boxShadow: [
                    "0 0 20px 2px rgba(0,217,255,0.2)",
                    "0 0 40px 8px rgba(139,92,246,0.4)",
                    "0 0 20px 2px rgba(0,217,255,0.2)",
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>

            {/* Logo */}
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              <motion.img
                src="/37.png"
                alt="AudioVerse"
                className="h-16 w-auto mx-auto"
                animate={phase === "reveal" ? { scale: [1, 1.06, 1] } : {}}
                transition={{ duration: 0.5 }}
              />
            </motion.div>

            {/* Waveform equalizer */}
            <div className="flex items-end gap-1 h-12">
              {bars.map((scale, i) => (
                <motion.div
                  key={i}
                  className="w-1.5 rounded-full"
                  style={{
                    background: i % 2 === 0
                      ? "linear-gradient(to top, #00D9FF, #7c3aed)"
                      : "linear-gradient(to top, #a855f7, #ec4899)",
                  }}
                  animate={{
                    height: [`${8 * scale}px`, `${24 * scale}px`, `${8 * scale}px`],
                  }}
                  transition={{
                    duration: 0.5 + (i % 4) * 0.1,
                    repeat: Infinity,
                    delay: i * 0.06,
                    ease: "easeInOut",
                  }}
                />
              ))}
            </div>

            {/* Progress bar */}
            <div className="w-56 space-y-2">
              <div className="w-full h-[2px] bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{
                    background: "linear-gradient(to right, #00D9FF, #a855f7, #ec4899)",
                    width: `${progress}%`,
                  }}
                  transition={{ duration: 0.1 }}
                />
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 font-poppins text-xs tracking-widest uppercase">
                  {phase === "reveal" ? "Ready" : "Loading"}
                </span>
                <motion.span
                  className="font-poppins text-xs font-bold"
                  style={{ color: "#00D9FF" }}
                >
                  {Math.floor(progress)}%
                </motion.span>
              </div>
            </div>

            {/* Reveal flash */}
            <AnimatePresence>
              {phase === "reveal" && (
                <motion.div
                  className="absolute inset-0 pointer-events-none"
                  style={{ background: "radial-gradient(circle at center, rgba(0,217,255,0.08) 0%, transparent 70%)" }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ duration: 0.8 }}
                />
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
