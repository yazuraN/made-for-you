import { useState, useEffect, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Heart, Music, Play, Pause, ExternalLink, Star, RotateCcw, ChevronDown } from "lucide-react";

// ============================================================
// 🎨 FONT IMPORTS
// ============================================================
const FontImport = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@400;600;700&family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=Kalam:wght@300;400;700&display=swap');

    * { box-sizing: border-box; }
    body { margin: 0; background: #fdf6e3; overflow-x: hidden; }

    .font-caveat { font-family: 'Caveat', cursive; }
    .font-playfair { font-family: 'Playfair Display', serif; }
    .font-kalam { font-family: 'Kalam', cursive; }

    /* Paper texture overlay */
    .paper-texture {
      position: relative;
    }
    .paper-texture::before {
      content: '';
      position: absolute;
      inset: 0;
      background-image: 
        url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
      pointer-events: none;
      z-index: 1;
      border-radius: inherit;
    }

    /* Checkered pattern */
    .checkered {
      background-image: repeating-conic-gradient(#e8352a22 0% 25%, transparent 0% 50%);
      background-size: 16px 16px;
    }

    /* Washi tape */
    .tape {
      background: repeating-linear-gradient(
        45deg,
        #f6d365cc,
        #f6d365cc 5px,
        #fda08588 5px,
        #fda08588 10px
      );
    }

    .tape-blue {
      background: repeating-linear-gradient(
        45deg,
        #a8d8ea99,
        #a8d8ea99 5px,
        #88c0d099 5px,
        #88c0d099 10px
      );
    }

    /* Torn paper edge */
    .torn-top {
      clip-path: polygon(0% 8%, 2% 0%, 4% 6%, 6% 1%, 8% 7%, 10% 0%, 12% 5%, 14% 1%, 16% 8%, 18% 2%, 20% 7%, 22% 0%, 24% 6%, 26% 2%, 28% 8%, 30% 1%, 32% 6%, 34% 0%, 36% 7%, 38% 2%, 40% 8%, 42% 1%, 44% 5%, 46% 0%, 48% 7%, 50% 2%, 52% 8%, 54% 1%, 56% 6%, 58% 0%, 60% 7%, 62% 2%, 64% 8%, 66% 1%, 68% 5%, 70% 0%, 72% 7%, 74% 2%, 76% 8%, 78% 1%, 80% 6%, 82% 0%, 84% 7%, 86% 2%, 88% 8%, 90% 1%, 92% 5%, 94% 0%, 96% 7%, 98% 2%, 100% 8%, 100% 100%, 0% 100%);
    }

    .torn-bottom {
      clip-path: polygon(0% 0%, 100% 0%, 100% 92%, 98% 100%, 96% 94%, 94% 99%, 92% 93%, 90% 100%, 88% 94%, 86% 99%, 84% 93%, 82% 100%, 80% 94%, 78% 98%, 76% 93%, 74% 100%, 72% 94%, 70% 99%, 68% 93%, 66% 100%, 64% 93%, 62% 98%, 60% 93%, 58% 100%, 56% 93%, 54% 99%, 52% 93%, 50% 100%, 48% 93%, 46% 98%, 44% 93%, 42% 100%, 40% 93%, 38% 98%, 36% 93%, 34% 100%, 32% 93%, 30% 99%, 28% 93%, 26% 100%, 24% 93%, 22% 98%, 20% 93%, 18% 100%, 16% 93%, 14% 98%, 12% 93%, 10% 100%, 8% 93%, 6% 98%, 4% 93%, 2% 100%, 0% 93%);
    }

    @keyframes float {
      0%, 100% { transform: translateY(0px) rotate(var(--rot, 0deg)); }
      50% { transform: translateY(-8px) rotate(var(--rot, 0deg)); }
    }
    @keyframes firefly {
      0%, 100% { opacity: 0; transform: translate(0,0) scale(1); }
      50% { opacity: 1; transform: translate(var(--tx, 10px), var(--ty, -10px)) scale(1.5); }
    }
    @keyframes spin-slow {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    @keyframes eq {
      0%, 100% { height: 4px; }
      50% { height: 16px; }
    }

    .float-anim { animation: float 4s ease-in-out infinite; }
    .spin-slow { animation: spin-slow 8s linear infinite; }

    .eq-bar { 
      width: 3px; 
      background: #c0392b;
      border-radius: 2px;
      animation: eq 0.6s ease-in-out infinite;
    }
    .eq-bar:nth-child(2) { animation-delay: 0.1s; }
    .eq-bar:nth-child(3) { animation-delay: 0.2s; }
    .eq-bar:nth-child(4) { animation-delay: 0.15s; }
    .eq-bar:nth-child(5) { animation-delay: 0.05s; }

    .wax-seal {
      background: radial-gradient(circle at 35% 35%, #e8352a, #8b1a1a);
      box-shadow: 0 2px 8px rgba(139,26,26,0.5), inset 0 1px 2px rgba(255,255,255,0.2);
    }

    .sunflower-doodle {
      font-size: 1.5rem;
      display: inline-block;
      line-height: 1;
    }

    .progress-bar {
      background: linear-gradient(90deg, #c0392b, #e67e22);
      transition: width 0.3s ease;
    }
  `}</style>
);

// ============================================================
// 🌻 DECORATIVE DOODLES
// ============================================================
const SunflowerDoodle = ({ size = "text-2xl", style = {} }) => (
  <span className="sunflower-doodle" style={{ fontSize: size, ...style }}>🌻</span>
);

const StarDoodle = ({ style = {} }) => (
  <span style={{ display: "inline-block", ...style }}>✦</span>
);

// Tape piece component
const Tape = ({ className = "", style = {}, variant = "default" }) => (
  <div
    className={`${variant === "blue" ? "tape-blue" : "tape"} ${className}`}
    style={{ height: 18, opacity: 0.85, ...style }}
  />
);

// ============================================================
// SECTION 1 — HERO
// ============================================================
const HeroSection = () => {
  return (
    <section
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-4 py-12"
      style={{ background: "linear-gradient(160deg, #fdf6e3 0%, #fef3c7 50%, #fde8c8 100%)" }}
    >
      {/* Checkered border strip at top */}
      <div className="checkered absolute top-0 left-0 right-0 h-5 opacity-60" />

      {/* Background floating doodles */}
      {[
        { top: "8%", left: "6%", rot: "-15deg", delay: "0s", size: "1.8rem" },
        { top: "12%", right: "8%", rot: "20deg", delay: "1s", size: "1.3rem" },
        { top: "72%", left: "4%", rot: "10deg", delay: "0.5s", size: "1.1rem" },
        { top: "80%", right: "5%", rot: "-8deg", delay: "1.5s", size: "1.6rem" },
        { top: "55%", right: "3%", rot: "25deg", delay: "2s", size: "1rem" },
      ].map((d, i) => (
        <motion.span
          key={i}
          className="absolute pointer-events-none"
          style={{ top: d.top, left: d.left, right: d.right, fontSize: d.size, rotate: d.rot }}
          animate={{ y: [0, -10, 0], rotate: [d.rot, `calc(${d.rot} + 5deg)`, d.rot] }}
          transition={{ duration: 4 + i * 0.5, repeat: Infinity, ease: "easeInOut", delay: parseFloat(d.delay) }}
        >
          🌻
        </motion.span>
      ))}

      {/* Small star doodles */}
      {["top-[20%] left-[20%]", "top-[35%] right-[18%]", "top-[65%] left-[15%]"].map((pos, i) => (
        <motion.span
          key={i}
          className={`absolute text-yellow-400 font-caveat ${pos}`}
          style={{ fontSize: "0.9rem" }}
          animate={{ opacity: [0.4, 1, 0.4], scale: [1, 1.3, 1] }}
          transition={{ duration: 2 + i, repeat: Infinity, delay: i * 0.7 }}
        >✦</motion.span>
      ))}

      {/* Sunlight glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 rounded-full opacity-20 pointer-events-none"
        style={{
          width: 320, height: 320,
          background: "radial-gradient(circle, #fbbf24 0%, transparent 70%)",
          filter: "blur(40px)",
          top: "-60px"
        }}
      />

      {/* Main Polaroid */}
      <motion.div
        initial={{ opacity: 0, y: 40, rotate: -3 }}
        animate={{ opacity: 1, y: 0, rotate: -6 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="relative mb-6"
        style={{ maxWidth: 240 }}
      >
        {/* Tape on polaroid */}
        <div
          className="tape absolute -top-3 left-1/2 -translate-x-1/2 rounded-sm z-10"
          style={{ width: 60, height: 18, opacity: 0.9 }}
        />

        {/* Polaroid card */}
        <div
          className="paper-texture bg-white rounded-sm shadow-2xl"
          style={{
            padding: "14px 14px 40px 14px",
            boxShadow: "4px 6px 20px rgba(0,0,0,0.25), 0 2px 4px rgba(0,0,0,0.1)"
          }}
        >
          {/* Photo area */}
          <div
            className="relative overflow-hidden"
            style={{
              width: 210,
              height: 220,
              background: "linear-gradient(135deg, #fef3c7, #fde8c8)",
              borderRadius: 2,
            }}
          >
            {/* ✏️ REPLACE THIS with an <img> tag for a real photo */}
            <div className="absolute inset-0 flex flex-col items-center justify-center opacity-40">
              <span style={{ fontSize: "3rem" }}>📷</span>
              <p className="font-caveat text-amber-700 text-sm mt-2">your photo here</p>
            </div>

            {/* Warm light overlay */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{ background: "linear-gradient(135deg, rgba(255,200,100,0.15) 0%, transparent 60%)" }}
            />
          </div>

          {/* Polaroid caption */}
          <div className="mt-3 text-center">
            <p className="font-kalam text-amber-800 text-sm" style={{ letterSpacing: "0.03em" }}>
              {/* ✏️ CHANGE THIS caption */}
             
            </p>
          </div>
        </div>
      </motion.div>

      {/* Happy Birthday text */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="text-center px-4 relative z-10"
      >
        {/* Small handwritten label above */}
        <p className="font-caveat text-amber-600 text-lg mb-1" style={{ letterSpacing: "0.05em" }}>
          — for you, always —
        </p>

        <h1
          className="font-playfair italic text-amber-900 leading-tight mb-4"
          style={{ fontSize: "clamp(2.4rem, 10vw, 3rem)", fontWeight: 600 }}
        >
          Happy Birthday
        </h1>

        {/* Decorative underline */}
        <div className="flex items-center justify-center gap-2 mb-5">
          <div style={{ height: 1.5, width: 40, background: "#c0392b", borderRadius: 2 }} />
          <span style={{ color: "#c0392b", fontSize: "1rem" }}>♥</span>
          <div style={{ height: 1.5, width: 40, background: "#c0392b", borderRadius: 2 }} />
        </div>

        {/* Emotional paragraph */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="font-kalam text-amber-800 leading-relaxed"
          style={{ fontSize: "1.05rem", maxWidth: 300, margin: "0 auto" }}
        >
          {/* ✏️ CHANGE THIS to your personal birthday message */}
          Today is all about you — your laugh, your warmth, the quiet way you make everything feel a little more like home. I made this just for you.
        </motion.p>
      </motion.div>

      {/* Scroll hint */}
      <motion.div
        className="absolute bottom-8 flex flex-col items-center gap-1"
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <span className="font-caveat text-amber-600 text-sm">scroll down</span>
        <ChevronDown size={16} className="text-amber-500" />
      </motion.div>

      {/* Bottom checkered strip */}
      <div className="checkered absolute bottom-0 left-0 right-0 h-5 opacity-60" />
    </section>
  );
};

// ============================================================
// SECTION 2 — ENVELOPE LOVE LETTER
// ============================================================
const EnvelopeSection = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showLetter, setShowLetter] = useState(false);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const openEnvelope = () => {
    setIsOpen(true);
    setTimeout(() => setShowLetter(true), 600);
  };

  const closeLetter = () => {
    setShowLetter(false);
    setTimeout(() => setIsOpen(false), 300);
  };

  return (
    <section
      ref={ref}
      className="relative py-16 px-4 overflow-hidden"
      style={{ background: "linear-gradient(180deg, #fef3c7 0%, #fdf6e3 100%)" }}
    >
      {/* Section label */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="text-center mb-10"
      >
        <span className="font-caveat text-amber-600 text-lg">— a little something —</span>
        <h2 className="font-playfair italic text-amber-900 text-3xl mt-1">For Your Eyes Only</h2>
      </motion.div>

      {/* Envelope container */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="flex justify-center"
      >
        <div className="relative cursor-pointer" onClick={!isOpen ? openEnvelope : undefined} style={{ width: 280 }}>

          {/* Tape on envelope */}
          <div className="tape absolute -top-2 left-1/2 -translate-x-1/2 rounded-sm z-10" style={{ width: 50, height: 16 }} />

          {/* Envelope body */}
          <motion.div
            className="relative rounded-lg overflow-hidden shadow-xl"
            style={{
              background: "linear-gradient(135deg, #fef9ee, #fdf0d5)",
              border: "1px solid #e6c98a",
              minHeight: 180,
            }}
            whileHover={!isOpen ? { scale: 1.02, rotate: 1 } : {}}
            transition={{ duration: 0.3 }}
          >
            {/* Envelope flap (top triangle) */}
            <motion.div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: 90,
                background: "linear-gradient(135deg, #fde8c8, #f6d365)",
                clipPath: "polygon(0 0, 100% 0, 50% 60%)",
                transformOrigin: "top center",
                zIndex: 3,
              }}
              animate={isOpen ? { rotateX: -180, opacity: 0.5 } : { rotateX: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
            />

            {/* Envelope V-fold lines */}
            <div style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: 90,
              background: "linear-gradient(225deg, #fde8c8 50%, transparent 50%)",
              zIndex: 1,
            }} />
            <div style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: 90,
              background: "linear-gradient(315deg, #f0d090 50%, transparent 50%)",
              zIndex: 1,
            }} />

            {/* Wax seal */}
            <motion.div
              className="wax-seal absolute z-10 flex items-center justify-center"
              style={{
                width: 48,
                height: 48,
                borderRadius: "50%",
                left: "50%",
                transform: "translateX(-50%)",
                top: 46,
              }}
              animate={isOpen ? { scale: 0.8, opacity: 0.6 } : { scale: 1, opacity: 1 }}
            >
              <Heart size={20} fill="white" color="white" />
            </motion.div>

            {/* Envelope front text */}
            <div className="relative z-2 flex flex-col items-center justify-center" style={{ paddingTop: 110, paddingBottom: 28 }}>
              <p className="font-kalam text-amber-800 text-sm opacity-70">To: my love</p>
              {!isOpen && (
                <motion.p
                  className="font-caveat text-amber-600 text-xs mt-2 opacity-60"
                  animate={{ opacity: [0.4, 0.8, 0.4] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  tap to open ♥
                </motion.p>
              )}
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Letter Modal */}
      <AnimatePresence>
        {showLetter && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-5"
            style={{ background: "rgba(80,40,10,0.5)", backdropFilter: "blur(4px)" }}
            onClick={closeLetter}
          >
            <motion.div
              initial={{ opacity: 0, y: 60, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.95 }}
              transition={{ type: "spring", damping: 18 }}
              className="relative rounded-lg paper-texture overflow-hidden"
              style={{
                background: "linear-gradient(160deg, #fffdf0, #fef8dc, #fdf3cc)",
                maxWidth: 340,
                width: "100%",
                maxHeight: "80vh",
                overflowY: "auto",
                border: "1px solid #e6c98a",
                boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
              }}
              onClick={e => e.stopPropagation()}
            >
              {/* Tape decoration at top */}
              <div className="tape-blue absolute top-4 left-1/2 -translate-x-1/2 rounded-sm" style={{ width: 56, height: 16, opacity: 0.8 }} />

              <div className="p-7 pt-10">
                {/* Letter header */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="font-kalam text-amber-700 text-xs opacity-70">
                      {/* ✏️ CHANGE this date */}
                      May 2025
                    </p>
                  </div>
                  <span style={{ fontSize: "1.3rem" }}>🌻</span>
                </div>

                <p className="font-kalam text-amber-800 text-base mb-4" style={{ lineHeight: 1.4 }}>
                  {/* ✏️ CHANGE salutation */}
                  My dearest,
                </p>

                {/* ✏️ CHANGE the letter content below */}
                <div className="font-kalam text-amber-900 space-y-4" style={{ fontSize: "1rem", lineHeight: 1.8 }}>
                  <p>
                    I've been trying to write this letter for weeks, and I keep running out of words that feel big enough for how I feel about you.
                  </p>
                  <p>
                    You came into my life so quietly, and somehow made everything louder — in the best way. The colors are brighter, the jokes are funnier, the hard days are softer.
                  </p>
                  <p>
                    I love the way you laugh at your own jokes. I love how you get excited about small things. I love that you exist in this world, and that I get to know you.
                  </p>
                  <p>
                    Happy birthday. This day is yours, and so am I.
                  </p>
                </div>

                {/* Signature */}
                <div className="mt-6 text-right">
                  <p className="font-caveat text-amber-700 text-xl">
                    {/* ✏️ CHANGE your name */}
                    always yours ♥
                  </p>
                </div>

                {/* Close hint */}
                <div className="mt-5 text-center">
                  <button
                    onClick={closeLetter}
                    className="font-caveat text-amber-500 text-sm underline"
                  >
                    fold letter back
                  </button>
                </div>
              </div>

              {/* Lined paper effect */}
              <div className="absolute inset-0 pointer-events-none" style={{
                backgroundImage: "repeating-linear-gradient(transparent, transparent 31px, #e6c98a33 31px, #e6c98a33 32px)",
                backgroundPositionY: "48px",
              }} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating sunflowers */}
      <motion.span
        className="absolute text-2xl pointer-events-none"
        style={{ bottom: "15%", left: "8%", opacity: 0.5 }}
        animate={{ rotate: [0, 10, 0], y: [0, -5, 0] }}
        transition={{ duration: 5, repeat: Infinity }}
      >🌻</motion.span>
    </section>
  );
};

// ============================================================
// SECTION 3 — FAVORITE SONGS
// ============================================================

// ✏️ ADD YOUR SONGS HERE
const SONGS = [
  {
    title: "Your Favorite Song",
    artist: "Artist Name",
    spotifyUrl: "https://open.spotify.com/track/YOUR_TRACK_ID",
    color: "#c0392b",
  },
  {
    title: "Another Beautiful Song",
    artist: "Another Artist",
    spotifyUrl: "https://open.spotify.com/track/YOUR_TRACK_ID",
    color: "#e67e22",
  },
  {
    title: "Our Song",
    artist: "That Band We Both Love",
    spotifyUrl: "https://open.spotify.com/track/YOUR_TRACK_ID",
    color: "#8e6b3e",
  },
  {
    title: "Late Night Melody",
    artist: "Indie Artist",
    spotifyUrl: "https://open.spotify.com/track/YOUR_TRACK_ID",
    color: "#6b8e5e",
  },
];

const SongCard = ({ song, index }) => {
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(Math.random() * 60 + 10);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="relative rounded-2xl overflow-hidden shadow-md mb-4"
      style={{
        background: "linear-gradient(135deg, #fffdf0, #fef8dc)",
        border: "1px solid #e6c98a",
      }}
    >
      {/* Tape corner */}
      <div
        className="tape absolute -top-1 -right-1 rounded-sm"
        style={{ width: 30, height: 12, transform: "rotate(45deg)", opacity: 0.8 }}
      />

      <div className="p-4 flex items-center gap-4">
        {/* Cassette reel */}
        <div
          className="relative flex-shrink-0 rounded-full flex items-center justify-center"
          style={{
            width: 54,
            height: 54,
            background: `linear-gradient(135deg, ${song.color}22, ${song.color}44)`,
            border: `2px solid ${song.color}66`,
          }}
        >
          <motion.div
            className="rounded-full"
            style={{
              width: 38,
              height: 38,
              background: `conic-gradient(${song.color} 0deg, #2d1a0e 120deg, ${song.color} 240deg, #2d1a0e 360deg)`,
            }}
            animate={playing ? { rotate: 360 } : { rotate: 0 }}
            transition={playing ? { duration: 2, repeat: Infinity, ease: "linear" } : {}}
          />
          {/* Center hole */}
          <div className="absolute rounded-full bg-amber-50" style={{ width: 12, height: 12 }} />
        </div>

        {/* Song info */}
        <div className="flex-1 min-w-0">
          <p className="font-playfair font-semibold text-amber-900 text-sm truncate">{song.title}</p>
          <p className="font-caveat text-amber-600 text-sm">{song.artist}</p>

          {/* Progress bar */}
          <div className="mt-2 flex items-center gap-2">
            <div className="flex-1 rounded-full overflow-hidden" style={{ height: 4, background: "#e6c98a55" }}>
              <div
                className="progress-bar h-full rounded-full"
                style={{ width: `${playing ? 100 : progress}%`, transition: playing ? "width 30s linear" : "none" }}
              />
            </div>
          </div>

          {/* EQ bars + controls */}
          <div className="mt-2 flex items-center gap-3">
            {playing && (
              <div className="flex items-end gap-0.5" style={{ height: 16 }}>
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="eq-bar" style={{ animationDelay: `${i * 0.1}s` }} />
                ))}
              </div>
            )}
            <div className="flex items-center gap-2 ml-auto">
              <button
                onClick={() => setPlaying(!playing)}
                className="rounded-full flex items-center justify-center"
                style={{
                  width: 28,
                  height: 28,
                  background: song.color,
                  border: "none",
                  cursor: "pointer",
                }}
              >
                {playing
                  ? <Pause size={12} fill="white" color="white" />
                  : <Play size={12} fill="white" color="white" style={{ marginLeft: 1 }} />
                }
              </button>
              <a
                href={song.spotifyUrl}
                target="_blank"
                rel="noreferrer"
                onClick={e => e.stopPropagation()}
              >
                <ExternalLink size={14} color={song.color} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const MusicSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      ref={ref}
      className="relative py-16 px-4 overflow-hidden"
      style={{ background: "#fdf6e3" }}
    >
      {/* Torn top */}
      <div
        className="absolute top-0 left-0 right-0 h-8 torn-top"
        style={{ background: "linear-gradient(180deg, #fef3c7, #fdf6e3)" }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="text-center mb-8 pt-4"
      >
        <span className="font-caveat text-amber-600 text-lg">— songs for you —</span>
        <h2 className="font-playfair italic text-amber-900 text-3xl mt-1">Our Playlist ♪</h2>
        <p className="font-kalam text-amber-700 text-sm mt-2 opacity-70">songs that remind me of you</p>
      </motion.div>

      {/* Cassette player header */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={inView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="rounded-2xl p-4 mb-6 relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #2d1a0e, #3d2310)",
          border: "2px solid #8e6b3e",
          boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
        }}
      >
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <div className="rounded-full" style={{ width: 8, height: 8, background: "#c0392b" }} />
            <div className="rounded-full" style={{ width: 8, height: 8, background: "#e67e22" }} />
            <div className="rounded-full" style={{ width: 8, height: 8, background: "#f6d365" }} />
          </div>
          <p className="font-caveat text-amber-300 flex-1 text-center text-sm">
            {/* ✏️ CHANGE this label */}
            ✦ birthday mix tape ✦
          </p>
          <Music size={14} color="#e6c98a" />
        </div>
        <div className="mt-2 rounded-lg flex items-center justify-center" style={{
          height: 32,
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.1)",
        }}>
          <div className="flex items-end gap-1" style={{ height: 20 }}>
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                style={{
                  width: 3,
                  borderRadius: 2,
                  background: "#f6d365",
                  opacity: 0.7,
                  animation: `eq 0.${5 + (i % 4)}s ease-in-out infinite`,
                  animationDelay: `${i * 0.07}s`,
                }}
                className="eq-bar"
              />
            ))}
          </div>
        </div>
      </motion.div>

      {/* Song cards */}
      {SONGS.map((song, i) => (
        <SongCard key={i} song={song} index={i} />
      ))}
    </section>
  );
};

// ============================================================
// SECTION 4 — SPECIAL MEMORIES
// ============================================================

// ✏️ ADD YOUR MEMORIES HERE
const MEMORIES = [
  {
    date: "Day One",
    emoji: "💬",
    title: "The First Conversation",
    text: "I still remember the first thing you ever said to me. It was nothing profound, just small talk — but something about your words made me want to keep talking forever.",
    color: "#fde8c8",
    rotate: "-1deg",
    type: "sticky",
  },
  {
    date: "Late Nights",
    emoji: "🌙",
    title: "3am Talks",
    text: "Those nights we stayed up way too late talking about nothing and everything. I'd be exhausted the next day and completely okay with it.",
    color: "#fef3c7",
    rotate: "1.5deg",
    type: "journal",
  },
  {
    date: "That Random Day",
    emoji: "😂",
    title: "When We Couldn't Stop Laughing",
    text: "Something completely stupid had us in tears. I can't even explain what was funny anymore — I just remember your laugh and how much I wanted to hear it again.",
    color: "#fdf0d5",
    rotate: "-0.5deg",
    type: "sticky",
  },
  {
    date: "A Harder Day",
    emoji: "🤝",
    title: "When Things Felt Heavy",
    text: "You didn't try to fix anything. You just stayed. Sometimes that's the whole thing — just having someone who stays.",
    color: "#fef9ee",
    rotate: "2deg",
    type: "journal",
  },
  {
    date: "Always",
    emoji: "☀️",
    title: "The Quiet Comfort",
    text: "The way you make ordinary moments feel safe. The silence between us that never feels awkward. Just you, just me, just this.",
    color: "#fde8c8",
    rotate: "-1.5deg",
    type: "sticky",
  },
];

const MemoryCard = ({ memory, index }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  const isJournal = memory.type === "journal";

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30, rotate: memory.rotate }}
      animate={inView ? { opacity: 1, y: 0, rotate: memory.rotate } : {}}
      transition={{ duration: 0.7, delay: index * 0.1, type: "spring", damping: 15 }}
      className="relative mb-6"
      style={{ transform: `rotate(${memory.rotate})` }}
    >
      {/* Pin dot for journal style */}
      {isJournal && (
        <div
          className="absolute -top-2 left-1/2 -translate-x-1/2 rounded-full z-10 shadow-md"
          style={{ width: 12, height: 12, background: "#c0392b" }}
        />
      )}

      {/* Tape for sticky style */}
      {!isJournal && (
        <div className="tape absolute -top-2 left-8 rounded-sm z-10" style={{ width: 44, height: 14, opacity: 0.9 }} />
      )}

      <div
        className="relative rounded-lg shadow-lg overflow-hidden"
        style={{
          background: memory.color,
          border: isJournal ? "1px solid #e6c98a" : "none",
          padding: isJournal ? "20px 20px 24px" : "16px 16px 20px",
          boxShadow: "3px 4px 12px rgba(0,0,0,0.15)",
        }}
      >
        {/* Journal lined background */}
        {isJournal && (
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: "repeating-linear-gradient(transparent, transparent 27px, #c89b4433 27px, #c89b4433 28px)",
              backgroundPositionY: "44px",
            }}
          />
        )}

        <div className="relative z-10">
          {/* Date + emoji header */}
          <div className="flex items-center justify-between mb-2">
            <span className="font-caveat text-amber-600 text-sm opacity-80">{memory.date}</span>
            <span style={{ fontSize: "1.2rem" }}>{memory.emoji}</span>
          </div>

          {/* Title */}
          <h3
            className="font-playfair italic text-amber-900 mb-2"
            style={{ fontSize: "1.1rem", fontWeight: 600 }}
          >
            {memory.title}
          </h3>

          {/* Memory text */}
          <p className="font-kalam text-amber-800" style={{ fontSize: "0.95rem", lineHeight: 1.7 }}>
            {memory.text}
          </p>
        </div>
      </div>

      {/* Doodle arrow occasionally */}
      {index % 3 === 0 && (
        <div
          className="absolute -bottom-4 -right-2 font-caveat text-amber-400 opacity-50"
          style={{ fontSize: "1.5rem", transform: "rotate(30deg)" }}
        >
          ↝
        </div>
      )}
    </motion.div>
  );
};

const MemoriesSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      ref={ref}
      className="relative py-16 px-5 overflow-hidden"
      style={{ background: "linear-gradient(160deg, #fef3c7 0%, #fdf6e3 100%)" }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="text-center mb-10"
      >
        <span className="font-caveat text-amber-600 text-lg">— written in memory —</span>
        <h2 className="font-playfair italic text-amber-900 text-3xl mt-1">Our Moments</h2>
        <div className="flex items-center justify-center gap-2 mt-2">
          <SunflowerDoodle size="1rem" />
          <span className="font-kalam text-amber-600 text-sm">pages from our story</span>
          <SunflowerDoodle size="1rem" />
        </div>
      </motion.div>

      {MEMORIES.map((memory, i) => (
        <MemoryCard key={i} memory={memory} index={i} />
      ))}
    </section>
  );
};

// ============================================================
// SECTION 5 — FINAL EMOTIONAL ENDING
// ============================================================
const Firefly = ({ style }) => (
  <motion.div
    className="absolute rounded-full pointer-events-none"
    style={{
      width: 4,
      height: 4,
      background: "#fbbf24",
      boxShadow: "0 0 6px 2px #fbbf2466",
      ...style,
    }}
    animate={{
      opacity: [0, 1, 0],
      x: [0, (Math.random() - 0.5) * 30, 0],
      y: [0, -20 - Math.random() * 20, 0],
      scale: [1, 1.5, 1],
    }}
    transition={{
      duration: 2 + Math.random() * 2,
      repeat: Infinity,
      delay: Math.random() * 3,
      ease: "easeInOut",
    }}
  />
);

const EndingSection = ({ onReplay }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const fireflies = Array.from({ length: 14 }, (_, i) => ({
    top: `${10 + Math.random() * 70}%`,
    left: `${5 + Math.random() * 90}%`,
  }));

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-5 py-20"
      style={{
        background: "linear-gradient(180deg, #fdf6e3 0%, #fef0c4 30%, #fde8a8 60%, #fcd57a 100%)",
      }}
    >
      {/* Sunset glow */}
      <div
        className="absolute bottom-0 left-0 right-0 pointer-events-none"
        style={{
          height: "50%",
          background: "linear-gradient(0deg, rgba(249,115,22,0.2) 0%, transparent 100%)",
        }}
      />

      {/* Sunflower field illustration */}
      <div className="absolute bottom-0 left-0 right-0 flex justify-around items-end pointer-events-none px-2" style={{ height: 100 }}>
        {["2.5rem", "3rem", "2rem", "3.5rem", "2rem", "2.8rem"].map((size, i) => (
          <motion.span
            key={i}
            style={{ fontSize: size, lineHeight: 1 }}
            animate={{ y: [0, -4, 0], rotate: ["-3deg", "3deg", "-3deg"] }}
            transition={{ duration: 3 + i * 0.3, repeat: Infinity, ease: "easeInOut", delay: i * 0.2 }}
          >
            🌻
          </motion.span>
        ))}
      </div>

      {/* Fireflies */}
      {fireflies.map((f, i) => (
        <Firefly key={i} style={f} />
      ))}

      {/* Stars */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            top: `${5 + Math.random() * 40}%`,
            left: `${5 + Math.random() * 90}%`,
          }}
          animate={{ opacity: [0.2, 1, 0.2], scale: [1, 1.4, 1] }}
          transition={{ duration: 2 + Math.random() * 2, repeat: Infinity, delay: Math.random() * 2 }}
        >
          <Star size={8} fill="#f6d365" color="#f6d365" />
        </motion.div>
      ))}

      {/* Main content */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.9 }}
        className="relative z-10 text-center"
        style={{ maxWidth: 320, marginBottom: 120 }}
      >
        {/* Big heart */}
        <motion.div
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="mb-5"
        >
          <span style={{ fontSize: "3rem" }}>🌻</span>
        </motion.div>

        <h2
          className="font-playfair italic text-amber-900 mb-2"
          style={{ fontSize: "2rem", fontWeight: 600 }}
        >
          {/* ✏️ CHANGE this headline */}
          Thank you for existing.
        </h2>

        <div className="flex items-center justify-center gap-2 mb-5">
          <div style={{ height: 1, width: 30, background: "#c0392b" }} />
          <Heart size={12} fill="#c0392b" color="#c0392b" />
          <div style={{ height: 1, width: 30, background: "#c0392b" }} />
        </div>

        {/* Closing handwritten note */}
        <div
          className="relative rounded-lg paper-texture text-left"
          style={{
            background: "linear-gradient(160deg, #fffdf0, #fef8dc)",
            border: "1px solid #e6c98a",
            padding: "20px 22px",
            boxShadow: "3px 4px 14px rgba(0,0,0,0.12)",
            transform: "rotate(-1deg)",
          }}
        >
          {/* Tape */}
          <div className="tape absolute -top-2 left-1/2 -translate-x-1/2 rounded-sm" style={{ width: 48, height: 14 }} />

          {/* Lines */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: "repeating-linear-gradient(transparent, transparent 27px, #e6c98a33 27px, #e6c98a33 28px)",
              backgroundPositionY: "40px",
            }}
          />

          <p className="font-kalam text-amber-900 relative z-10" style={{ fontSize: "1rem", lineHeight: 1.8 }}>
            {/* ✏️ CHANGE this closing note */}
            You are one of the best things that has happened to me. Not because everything's been perfect — but because going through it with you makes all of it worth it.
            <br /><br />
            Here's to you, today and every day after.
          </p>

          <p className="font-caveat text-amber-700 text-xl mt-3 text-right relative z-10">
            {/* ✏️ CHANGE your sign-off */}
            — yours, always ♥
          </p>
        </div>

        {/* Replay button */}
        <motion.button
          onClick={onReplay}
          className="mt-8 flex items-center gap-2 mx-auto font-caveat text-amber-700 rounded-full px-5 py-2"
          style={{
            background: "rgba(255,255,255,0.7)",
            border: "1.5px solid #e6c98a",
            cursor: "pointer",
            fontSize: "1rem",
            backdropFilter: "blur(4px)",
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
        >
          <RotateCcw size={14} />
          relive from the beginning
        </motion.button>
      </motion.div>
    </section>
  );
};

// ============================================================
// 🎂 MAIN APP
// ============================================================
export default function App() {
  const handleReplay = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <FontImport />
      <div
        className="min-h-screen"
        style={{ maxWidth: 430, margin: "0 auto", overflowX: "hidden" }}
      >
        <HeroSection />
        <EnvelopeSection />
        <MusicSection />
        <MemoriesSection />
        <EndingSection onReplay={handleReplay} />
      </div>
    </>
  );
}