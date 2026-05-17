import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, SkipForward, SkipBack, Shuffle, Repeat } from 'lucide-react';

// Helper to format time from seconds to MM:SS
const formatTime = (timeInSeconds: number): string => {
  if (isNaN(timeInSeconds)) return '00:00';
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = Math.floor(timeInSeconds % 60);
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

// Interface for the component props
interface MusicPlayerProps {
  albumArt: string;
  songTitle: string;
  artistName: string;
  audioSrc: string;
  onTimeUpdate?: (currentTime: number) => void;
}

// The main MusicPlayer component
export const MusicPlayer: React.FC<MusicPlayerProps> = ({ albumArt, songTitle, artistName, audioSrc, onTimeUpdate }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isShuffle, setIsShuffle] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(null);
  const progressBarRef = useRef<HTMLInputElement>(null);

  // Effect to handle audio playback and updates
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const setAudioData = () => {
      setDuration(audio.duration);
      setCurrentTime(audio.currentTime);
    }

    const setAudioTime = () => {
        setCurrentTime(audio.currentTime);
        if (onTimeUpdate) onTimeUpdate(audio.currentTime);
        
        if (progressBarRef.current) {
            const progress = audio.duration > 0 ? (audio.currentTime / audio.duration) * 100 : 0;
            progressBarRef.current.style.setProperty('--progress', `${progress}%`);
        }
    };

    audio.addEventListener('loadeddata', setAudioData);
    audio.addEventListener('timeupdate', setAudioTime);

    if (isPlaying) {
      audio.play().catch(error => console.error("Error playing audio:", error));
    } else {
      audio.pause();
    }
    
    // Cleanup event listeners
    return () => {
      audio.removeEventListener('loadeddata', setAudioData);
      audio.removeEventListener('timeupdate', setAudioTime);
    }
  }, [isPlaying, audioSrc, onTimeUpdate]);

  // Handle seeking through the song
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (audioRef.current) {
      audioRef.current.currentTime = Number(e.target.value);
    }
  };

  const togglePlayPause = () => setIsPlaying(!isPlaying);
  const toggleShuffle = () => setIsShuffle(!isShuffle);
  const toggleRepeat = () => setIsRepeat(!isRepeat);

  return (
    <div className="w-full max-w-sm mx-auto bg-black/60 backdrop-blur-xl text-white border border-white/10 rounded-2xl shadow-2xl p-6 flex flex-col items-center font-sans relative z-10">
       <style>{`
        .progress-bar {
            --progress: 0%;
            -webkit-appearance: none;
            appearance: none;
            width: 100%;
            height: 4px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 4px;
            outline: none;
            cursor: pointer;
            background-image: linear-gradient(#b91c1c, #b91c1c);
            background-size: var(--progress) 100%;
            background-repeat: no-repeat;
        }

        .progress-bar::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 12px;
            height: 12px;
            background: white;
            border-radius: 50%;
            cursor: pointer;
            box-shadow: 0 0 10px rgba(185, 28, 28, 0.5);
        }
       `}</style>
      <audio ref={audioRef} src={audioSrc} loop={isRepeat} preload="metadata" />
      
      {/* Album Art */}
      <motion.div
        className="relative mb-6"
        animate={{ rotate: isPlaying ? 360 : 0 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      >
        <div className="w-48 h-48 md:w-56 md:h-56 rounded-full p-1 bg-gradient-to-tr from-red-600 to-transparent overflow-hidden border border-white/10">
          <img
            src={albumArt}
            alt={`${songTitle} album art`}
            className="w-full h-full rounded-full object-cover shadow-2xl"
            onError={(e) => { e.currentTarget.src = 'https://placehold.co/224x224/1a1a1a/ffffff?text=Music'; }}
          />
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-black rounded-full border-4 border-gray-800 z-10 shadow-inner"></div>
      </motion.div>

      {/* Song Info */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold tracking-wider uppercase text-red-50">{songTitle}</h2>
        <p className="text-sm text-red-200/60 font-light tracking-widest">{artistName}</p>
      </div>

      {/* Progress Bar and Timestamps */}
      <div className="w-full flex items-center gap-x-3 mb-4">
        <span className="text-[10px] font-mono text-white/40 w-12 text-left">{formatTime(currentTime)}</span>
        <input
          ref={progressBarRef}
          type="range"
          min="0"
          max={duration || 100}
          value={currentTime}
          onChange={handleSeek}
          className="progress-bar flex-grow"
        />
        <span className="text-[10px] font-mono text-white/40 w-12 text-right">{formatTime(duration)}</span>
      </div>


      {/* Controls */}
      <div className="flex items-center justify-center space-x-6 w-full">
        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={toggleShuffle} className={`transition-colors ${isShuffle ? 'text-red-500' : 'text-white/40'}`}>
          <Shuffle size={18} />
        </motion.button>
        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="text-white hover:text-red-400 transition-colors">
          <SkipBack size={24} />
        </motion.button>
        
        <motion.button
          onClick={togglePlayPause}
          className="bg-red-700 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(185,28,28,0.3)] hover:shadow-[0_0_30px_rgba(185,28,28,0.5)] transition-shadow"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={isPlaying ? 'pause' : 'play'}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.2 }}
            >
              {isPlaying ? <Pause size={28} /> : <Play size={28} className="ml-1" />}
            </motion.div>
          </AnimatePresence>
        </motion.button>

        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="text-white hover:text-red-400 transition-colors">
          <SkipForward size={24} />
        </motion.button>
        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={toggleRepeat} className={`transition-colors ${isRepeat ? 'text-red-500' : 'text-white/40'}`}>
          <Repeat size={18} />
        </motion.button>
      </div>
    </div>
  );
};
