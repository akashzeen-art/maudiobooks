import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, Volume2, X, SkipBack, SkipForward } from "lucide-react";
import { Audiobook } from "../data/audiobooks";

interface AudioPlayerProps {
  book: Audiobook;
  onClose: () => void;
}

export function AudioPlayer({ book, onClose }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      audioRef.current.play().catch(() => {
        setIsPlaying(false);
      });
    }
  }, []);

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(() => {
          // Handle play errors
        });
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
      audioRef.current.muted = newVolume === 0;
    }
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    if (isMuted) {
      const restored = volume === 0 ? 1 : volume;
      audioRef.current.volume = restored;
      audioRef.current.muted = false;
      setVolume(restored);
      setIsMuted(false);
    } else {
      audioRef.current.muted = true;
      setIsMuted(true);
    }
  };

  const formatTime = (time: number) => {
    if (!Number.isFinite(time) || time < 0) return "0:00";
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = Math.floor(time % 60);
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="relative w-full max-w-md bg-gradient-to-b from-gray-900 to-black rounded-3xl p-8 border border-white/10 shadow-2xl"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <motion.button
            className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full transition-colors"
            onClick={onClose}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <X size={24} className="text-white" />
          </motion.button>

          {/* Book Cover */}
          <div className="relative w-32 h-32 mx-auto rounded-2xl overflow-hidden mb-6 bg-gradient-to-br from-purple-500 to-cyan-500 shadow-2xl flex-shrink-0">
            <img
              src={book.thumbnail}
              alt={book.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 300 300'%3E%3Cdefs%3E%3ClinearGradient id='grad' x1='0%' y1='0%' x2='100%' y2='100%'%3E%3Cstop offset='0%' style='stop-color:rgb(168,107,250);stop-opacity:1' /%3E%3Cstop offset='100%' style='stop-color:rgb(0,217,255);stop-opacity:1' /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='300' height='300' fill='url(%23grad)'/%3E%3Ctext x='50%' y='50%' font-size='24' fill='white' text-anchor='middle' dominant-baseline='middle' font-family='Arial'%3EAudiobook%3C/text%3E%3C/svg%3E";
              }}
            />
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-neon-blue/20 to-purple-500/20"
              animate={{ opacity: [0.4, 0.8, 0.4] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>

          {/* Book Info */}
          <div className="text-center mb-6">
            <h3 className="text-2xl font-grotesk font-bold text-white mb-2 line-clamp-2">
              {book.title}
            </h3>
            <p className="text-gray-400 font-poppins">{book.author}</p>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2 mb-8">
            <input
              ref={(input) => {
                if (input && audioRef.current) {
                  input.max = duration.toString();
                }
              }}
              type="range"
              min="0"
              max={duration || 0}
              value={currentTime}
              onChange={handleProgressChange}
              className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-neon-blue"
              style={{
                background: `linear-gradient(to right, rgb(0, 217, 255) 0%, rgb(0, 217, 255) ${(currentTime / duration) * 100}%, rgb(31, 41, 55) ${(currentTime / duration) * 100}%, rgb(31, 41, 55) 100%)`,
              }}
            />
            <div className="flex justify-between text-xs text-gray-400 font-poppins">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Audio element */}
          <audio
            ref={audioRef}
            src={book.audio}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
          />

          {/* Controls */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <motion.button
              className="p-3 hover:bg-white/10 rounded-full transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <SkipBack size={24} className="text-gray-400" />
            </motion.button>

            <motion.button
              className="p-4 rounded-full bg-gradient-to-r from-neon-blue to-cyan-500 text-black shadow-lg shadow-neon-blue/50 hover:shadow-neon-blue/80"
              onClick={handlePlayPause}
              whileHover={{ scale: 1.1, boxShadow: "0 0 40px rgba(0, 217, 255, 0.8)" }}
              whileTap={{ scale: 0.95 }}
            >
              {isPlaying ? (
                <Pause size={28} fill="currentColor" />
              ) : (
                <Play size={28} fill="currentColor" />
              )}
            </motion.button>

            <motion.button
              className="p-3 hover:bg-white/10 rounded-full transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <SkipForward size={24} className="text-gray-400" />
            </motion.button>
          </div>

          {/* Volume Control */}
          <div className="flex items-center gap-3 pt-6 border-t border-white/10">
            <motion.button
              onClick={toggleMute}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="flex-shrink-0"
            >
              {isMuted || volume === 0 ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
                  <line x1="23" y1="9" x2="17" y2="15"/>
                  <line x1="17" y1="9" x2="23" y2="15"/>
                </svg>
              ) : (
                <Volume2 size={20} className="text-gray-400" />
              )}
            </motion.button>
            <div className="relative flex-1 h-2 bg-gray-800 rounded-full overflow-hidden">
              <div
                className="absolute left-0 top-0 h-full rounded-full transition-all"
                style={{
                  width: `${isMuted ? 0 : volume * 100}%`,
                  background: "linear-gradient(to right, #00D9FF, #a855f7)",
                }}
              />
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
            <span className="text-xs text-gray-400 font-poppins w-8 text-right flex-shrink-0">
              {isMuted ? "0" : Math.round(volume * 100)}%
            </span>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
