import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence, useSpring, useMotionValue, useScroll, useTransform } from 'framer-motion'
import { MusicPlayer } from '@/components/ui/music-player'
import { GetStartedButton } from '@/components/ui/get-started-button'

const STORY_DATA = [
  { text: "Ryo, a samurai from the Tokugawa era, is suddenly thrown into modern Tokyo after walking through a mysterious torii gate during a storm. Lost in a world of neon lights, technology, and crowded streets, he accidentally saves a schoolgirl named Aiko from a speeding bike. Alongside her friend Kenji, who is obsessed with history and science, they slowly realize Ryo is not a cosplayer, but a real samurai displaced through time." },
  { text: "Kenji discovers ancient records about a “vanishing samurai” connected to a strange torii gate that appears during moments when history is about to change. The same shrine still exists in modern Japan, and recent lightning activity suggests the gate may open again. While Kenji researches the mystery, Aiko helps Ryo adjust to modern life. Ryo learns trains, ramen, convenience stores, and the strange peace of a world without war. Over time, he becomes deeply attached to both Aiko and the life he never imagined possible." },
  { text: "Aiko, meanwhile, feels trapped by the expectations of modern life and dreams of escaping somewhere she truly belongs. She and Ryo grow emotionally closer, bonding over their shared feeling of being lost between worlds. Kenji becomes increasingly obsessed with the torii gate, uncovering evidence that it doesn’t simply move people through time, but appears whenever history itself is unstable. He begins to suspect Ryo was brought to the future for a reason." },
  { text: "One stormy night, an old priest arrives at their apartment and reveals the truth: the gate is opening again, but this time it has become unstable because of Kenji’s attempts to study it. If it breaks completely, time itself could collapse, erasing memories, people, and entire histories. The priest explains that Ryo now faces two choices. First, he can return to his original era and continue the life he was meant to live, though it will leave emotional scars on Aiko and Kenji. Second, he can remain in the modern world, but at the cost of losing all memories of his past life as a samurai." },
  { text: "Before Ryo can decide, the gate drags all of them into a strange space outside time itself. There, two gates appear: the original red gate representing duty and sacrifice, and a new unstable blue gate accidentally created by Kenji’s experiments. The blue gate shows glimpses of a future where all three of them live together peacefully. However, using it could completely rewrite reality. The priest warns them that this “third path” should not exist and could destroy everything." },
  { text: "Ryo realizes he cannot choose between abandoning his past or erasing who he once was. Instead, he grabs both gates at once, refusing to let time decide his fate for him. Aiko and Kenji hold onto him as the gates collapse together. Memories, timelines, and identities begin breaking apart as the three of them fight against the rules controlling their lives. Ryo declares that if time is a circle, then they should draw that circle themselves instead of blindly following destiny." },
  { text: "When Ryo wakes up, reality has changed. He is no longer a samurai living in modern Japan. Instead, he has always existed there as an ordinary student and friend of Aiko and Kenji. However, fragments of the old timeline remain buried inside their memories like dreams they cannot fully explain. Aiko remembers visions of Ryo standing beneath a red torii gate in the rain, always leaving her behind. Kenji discovers an old photograph showing three figures beneath the shrine gate with a note calling them “The three who defied the gate.”" },
  { text: "The three slowly realize they succeeded in doing the impossible. Rather than choosing between fate and sacrifice, they rewrote time itself together. Though the memories of their previous lives are fading, the emotional bond between them remains. Ryo understands that even without remembering every detail of who he once was, he still found his way back to the people who mattered most. The story ends with the three walking into modern Tokyo together while the old torii gate quietly waits in the distance, ready for the next person daring enough to challenge destiny." }
];

const TextReveal = ({ text }: { text: string }) => {
    const words = text.split(" ");
    
    return (
        <motion.p 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-xl sm:text-2xl md:text-3xl lg:text-4xl 2xl:text-5xl leading-[2] 2xl:leading-[2.2] text-[#4a1a1a] cursor-default tracking-[0.05em] text-center font-medium mb-32 md:mb-48"
            style={{ fontFamily: "'Open Sans', sans-serif" }}
        >
            {words.map((word, wIdx) => (
                <motion.span
                    key={wIdx}
                    initial={{ opacity: 0.1, filter: 'blur(8px)' }}
                    whileInView={{ opacity: 1, filter: 'blur(0px)' }}
                    viewport={{ once: false, margin: "-15%" }}
                    transition={{ duration: 0.5, delay: wIdx * 0.02, ease: "easeOut" }}
                    className="inline-block mr-[0.3em] hover:text-[#8a2525] hover:scale-105 transition-all duration-300"
                >
                    {word}
                </motion.span>
            ))}
        </motion.p>
    );
};



// 3D Spectral Torii Gate Filler
const SpectralTorii = () => {
    const { scrollYProgress } = useScroll();
    const rotate = useTransform(scrollYProgress, [0, 0.3], [0, 360]);
    const rotateDeg = useTransform(rotate, (v: any) => `${v}deg`);
    const scale = useTransform(scrollYProgress, [0, 0.2, 0.4], [0.5, 1.2, 0.8]);
    const opacity = useTransform(scrollYProgress, [0.05, 0.2, 0.35], [0, 0.15, 0]);

    return (
        <motion.div 
            style={{ rotateY: rotateDeg, scale, opacity }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] pointer-events-none z-0 flex items-center justify-center"
        >
            <div className="relative w-full h-full border-[1px] border-red-900/20 rounded-full animate-pulse shadow-[0_0_100px_rgba(153,27,27,0.1)]">
                {/* Abstract 3D Torii Geometry */}
                <div className="absolute top-1/4 left-0 w-full h-4 bg-red-900/10 blur-sm" />
                <div className="absolute top-1/3 left-0 w-full h-2 bg-red-950/20" />
                <div className="absolute top-1/4 left-1/4 w-4 h-full bg-red-900/10 blur-sm" />
                <div className="absolute top-1/4 right-1/4 w-4 h-full bg-red-900/10 blur-sm" />
            </div>
        </motion.div>
    )
}



const Particle = ({ delay }: { delay: number }) => {
  const x = useMemo(() => Math.random() * 100, []);
  const duration = useMemo(() => 15 + Math.random() * 20, []);
  const size = useMemo(() => 2 + Math.random() * 4, []);
  
  return (
    <motion.div
      animate={{ 
        y: ['-10vh', '30vh', '70vh', '110vh'], 
        x: [`${x}vw`, `${x + 5}vw`, `${x - 5}vw`, `${x}vw`],
        opacity: [0, 0.6, 0.6, 0],
        rotate: [0, 120, 240, 360] 
      }}
      transition={{ duration, repeat: Infinity, delay, ease: "linear" }}
      style={{ width: size, height: size }}
      className="absolute bg-red-100/30 rounded-full blur-[2px] pointer-events-none z-0"
    />
  )
}



// --- Ancient Japan Sakura Animation ---
const SakuraPetal = () => {
    const startX = useMemo(() => Math.random() * 100, []);
    const delay = useMemo(() => Math.random() * 20, []); // Positive delay to avoid Framer Motion WAAPI crash
    const duration = useMemo(() => Math.random() * 12 + 18, []); // 18-30s
    const size = useMemo(() => Math.random() * 8 + 8, []); // 8-16px
    const direction = useMemo(() => Math.random() > 0.5 ? 1 : -1, []);
    
    return (
        <motion.div
            animate={{ 
                y: ['-10vh', '30vh', '70vh', '110vh'],
                x: [`${startX}vw`, `${startX + (direction * 10)}vw`, `${startX + (direction * 15)}vw`, `${startX + (direction * 5)}vw`],
                opacity: [0, 0.7, 0.7, 0],
                rotateX: [0, 240, 480, 720],
                rotateY: [0, 120, 240, 360],
                rotateZ: [0, direction * 240, direction * 480, direction * 720]
            }}
            transition={{ 
                duration, 
                repeat: Infinity, 
                delay, 
                ease: "linear" 
            }}
            className="absolute bg-pink-300/40 shadow-[0_0_15px_rgba(244,114,182,0.2)]"
            style={{ 
                width: size, 
                height: size * 1.5,
                borderTopLeftRadius: '100%',
                borderBottomRightRadius: '100%',
                borderBottomLeftRadius: '2px',
                borderTopRightRadius: '2px'
            }}
        />
    )
}

const SakuraFall = () => {
    return (
        <div className="fixed inset-0 pointer-events-none z-[1] overflow-hidden">
             {Array.from({ length: 35 }).map((_, i) => (
                 <SakuraPetal key={i} />
             ))}
        </div>
    )
}

// --- Modern Storytelling Elements ---

const ReadingProgress = () => {
    const { scrollYProgress } = useScroll();
    return (
        <motion.div 
            className="fixed top-0 left-0 right-0 h-1 bg-[#6e2c2c] z-[110] origin-left"
            style={{ scaleX: scrollYProgress }}
        />
    )
}

const ParallaxBackground = ({ tiltX, tiltY }: { tiltX: any, tiltY: any }) => {
    const { scrollY } = useScroll();
    const y1 = useTransform(scrollY, [0, 3000], [0, -400]);
    const y2 = useTransform(scrollY, [0, 3000], [0, -800]);
    const y3 = useTransform(scrollY, [0, 3000], [0, -250]);
    
    const x1 = useTransform(tiltY, [-20, 20], [-40, 40]);
    const x2 = useTransform(tiltY, [-20, 20], [60, -60]);
    const x3 = useTransform(tiltY, [-20, 20], [-30, 30]);

    const rotateX = useTransform(tiltX, (v: any) => `${v}deg`);
    const rotateY = useTransform(tiltY, (v: any) => `${v}deg`);

    return (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden perspective-1000">
            <motion.div 
                style={{ y: y1, x: x1, rotateX, rotateY }} 
                whileHover={{ scale: 1.05, color: "rgba(110, 44, 44, 0.4)" }}
                transition={{ duration: 0.3 }}
                className="absolute top-[30%] left-[5%] text-[8rem] md:text-[15rem] lg:text-[20rem] 2xl:text-[30rem] font-serif text-slate-200/40 select-none pointer-events-auto cursor-default origin-center"
            >
                時
            </motion.div>
            <motion.div 
                style={{ y: y2, x: x2, rotateX, rotateY }} 
                whileHover={{ scale: 1.05, color: "rgba(110, 44, 44, 0.4)" }}
                transition={{ duration: 0.3 }}
                className="absolute top-[70%] right-[5%] text-[12rem] md:text-[20rem] lg:text-[25rem] 2xl:text-[35rem] font-serif text-slate-200/30 select-none pointer-events-auto cursor-default origin-center"
            >
                運
            </motion.div>
            <motion.div 
                style={{ y: y3, x: x3, rotateX, rotateY }} 
                whileHover={{ scale: 1.05, color: "rgba(110, 44, 44, 0.4)" }}
                transition={{ duration: 0.3 }}
                className="absolute top-[120%] left-[15%] text-[6rem] md:text-[12rem] lg:text-[18rem] 2xl:text-[25rem] font-serif text-slate-200/50 select-none pointer-events-auto cursor-default origin-center"
            >
                命
            </motion.div>
        </div>
    )
}

const CustomCursor = ({ mouseX, mouseY, smoothMouseX, smoothMouseY }: any) => {
    const x1 = useTransform(mouseX, (val: number) => val - 4);
    const y1 = useTransform(mouseY, (val: number) => val - 4);
    const x2 = useTransform(smoothMouseX, (val: number) => val - 20);
    const y2 = useTransform(smoothMouseY, (val: number) => val - 20);
    
    return (
        <div className="pointer-events-none fixed inset-0 z-[999] hidden lg:block">
            <motion.div 
                className="absolute w-2 h-2 bg-[#6e2c2c] rounded-full"
                style={{ x: x1, y: y1 }}
            />
            <motion.div 
                className="absolute w-10 h-10 border border-[#6e2c2c]/40 rounded-full"
                style={{ x: x2, y: y2 }}
            />
        </div>
    )
}

const ChapterNavItem = ({ chapter, i, scrollYProgress }: any) => {
    // Ensure all range values are strictly within [0.0, 1.0] and strictly increasing
    // to satisfy the browser's scroll-timeline keyframe offset validator under WAAPI
    let range: [number, number, number];
    if (i === 0) {
        range = [0, 0.05, 0.3];
    } else if (i === 1) {
        range = [0.1, 0.33, 0.6];
    } else if (i === 2) {
        range = [0.4, 0.66, 0.9];
    } else {
        range = [0.7, 0.99, 1.0];
    }
    
    const heightVal = useTransform(scrollYProgress, range, [8, 32, 8]);
    const height = useTransform(heightVal, (v: any) => `${v}px`);
    const opacity = useTransform(scrollYProgress, range, [0.2, 1, 0.2]);

    return (
        <motion.div 
            className="group relative flex items-center justify-end cursor-pointer"
            whileHover={{ scale: 1.05 }}
            onClick={() => {
                window.scrollTo({ top: window.innerHeight + (i * window.innerHeight * 0.8), behavior: 'smooth' })
            }}
        >
            <span className="text-[10px] uppercase tracking-widest text-[#4a1a1a]/0 group-hover:text-[#4a1a1a]/60 transition-colors mr-4 font-bold">{chapter}</span>
            <motion.div 
                className="w-[2px] bg-[#6e2c2c] rounded-full"
                style={{ height, opacity }}
            />
        </motion.div>
    )
}

const ChapterNav = () => {
    const { scrollYProgress } = useScroll();
    
    return (
        <div className="fixed right-6 top-1/2 -translate-y-1/2 flex flex-col items-end gap-6 z-50 hidden md:flex">
            {['Origin', 'Arrival', 'Connection', 'Legacy'].map((chapter, i) => (
                <ChapterNavItem key={i} chapter={chapter} i={i} scrollYProgress={scrollYProgress} />
            ))}
        </div>
    )
}

const App: React.FC = () => {
  const [hasStarted, setHasStarted] = useState(false);
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const tiltX = useMotionValue(0);
  const tiltY = useMotionValue(0);

  const smoothMouseX = useSpring(mouseX, { damping: 50, stiffness: 400 });
  const smoothMouseY = useSpring(mouseY, { damping: 50, stiffness: 400 });
  const smoothTiltX = useSpring(tiltX, { damping: 30, stiffness: 100 });
  const smoothTiltY = useSpring(tiltY, { damping: 30, stiffness: 100 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const { innerWidth, innerHeight } = window;
    mouseX.set(e.clientX);
    mouseY.set(e.clientY);
    
    // For 3D poster tilt
    const x = ((e.clientY - innerHeight / 2) / innerHeight) * 20;
    const y = ((e.clientX - innerWidth / 2) / innerWidth) * -20;
    tiltX.set(x);
    tiltY.set(y);
  };

  const handleMouseLeave = () => {
    tiltX.set(0);
    tiltY.set(0);
  };

  return (
    <div className="min-h-screen bg-[#f9f9f9] text-black selection:bg-red-200 overflow-x-hidden font-sans relative cursor-none md:cursor-auto">
      <CustomCursor mouseX={mouseX} mouseY={mouseY} smoothMouseX={smoothMouseX} smoothMouseY={smoothMouseY} />
      <ChapterNav />
      <ReadingProgress />
      <ParallaxBackground tiltX={smoothTiltX} tiltY={smoothTiltY} />
      <SakuraFall />
      <SpectralTorii />

      <AnimatePresence mode="wait">
        {!hasStarted ? (
          <motion.div
            key="entry"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.2, filter: 'blur(20px)' }}
            transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden bg-white/95"
          >
            <motion.div 
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                transition={{ duration: 10, repeat: Infinity, repeatType: 'reverse' }}
                className="absolute inset-0 bg-cover bg-center opacity-10 grayscale blur-[2px]"
                style={{ backgroundImage: "url('/hero-bg.jpg')", imageRendering: 'auto' }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#f9f9f9]/80 via-transparent to-[#f9f9f9]/80" />
            
            <motion.div 
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.8, duration: 1.2, ease: "easeOut" }}
                className="relative z-10 text-center px-4"
            >
                <h1 className="text-5xl md:text-8xl font-serif mb-6 tracking-[0.3em] text-black italic uppercase drop-shadow-[0_0_40px_rgba(185,28,28,0.2)]">
                    Gate of <span className="text-[#6e2c2c]">Two Hearts</span>
                </h1>
                <p className="text-xs md:text-sm tracking-[0.8em] text-black/60 mb-20 uppercase font-light">The Timeline Awaits Your Defiance</p>
                <div className="flex justify-center scale-110">
                    <GetStartedButton onClick={() => setHasStarted(true)} />
                </div>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="main"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2.5, ease: 'easeOut' }}
          >
            <header className="fixed top-0 left-0 w-full z-50 p-6 md:p-10 flex justify-between items-center bg-gradient-to-b from-[#f9f9f9]/90 to-transparent">
              <div className="text-[10px] font-bold tracking-[0.8em] text-black/50 font-serif hover:text-black transition-all duration-500 cursor-default uppercase">GATE OF TWO HEARTS</div>
            </header>

            <main>
              {/* Ultra-High Definition Hero Section - Desktop Side Image Layout */}
              <section 
                className="relative min-h-screen pt-24 pb-16 overflow-hidden flex items-center justify-center bg-transparent"
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
              >

                <div className="absolute inset-0 z-0 pointer-events-none">
                  {Array.from({ length: 50 }).map((_, i) => (
                    <Particle key={i} delay={i * 0.3} />
                  ))}
                </div>
                
                <div className="relative z-30 container mx-auto px-6 md:px-12 2xl:max-w-7xl h-full flex flex-col md:flex-row items-center justify-between gap-12 lg:gap-24">
                  
                  {/* Left Content Side */}
                  <div className="flex-1 text-center md:text-left z-30 order-2 md:order-1">
                    <motion.div 
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 2.2, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-[9rem] xl:text-[10rem] 2xl:text-[14rem] font-serif mb-8 leading-[0.9] tracking-tighter drop-shadow-[0_0_50px_rgba(185,28,28,0.3)]">
                        Gate of <br className="hidden md:block"/><span className="text-[#6e2c2c] italic">two hearts</span>
                      </h1>
                      <p className="text-xs md:text-sm text-black/60 font-light mb-16 max-w-xl mx-auto md:mx-0 leading-relaxed tracking-[0.4em] uppercase">
                        Beyond Time. Beyond Destiny. Beyondless.
                      </p>
                      <div className="flex flex-col sm:flex-row justify-center md:justify-start gap-6 lg:gap-10">
                        <motion.button 
                          whileHover={{ scale: 1.05, backgroundColor: 'rgba(127, 29, 29, 0.9)' }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => document.getElementById('story-section')?.scrollIntoView({ behavior: 'smooth' })}
                          className="group relative px-10 py-5 lg:px-14 lg:py-6 overflow-hidden bg-red-950/90 border border-red-800/40 rounded-sm"
                        >
                          <span className="relative z-10 text-slate-100 tracking-[0.3em] text-[10px] uppercase font-bold whitespace-nowrap">Open the Gate</span>
                        </motion.button>
                      </div>
                    </motion.div>
                  </div>

                  {/* Right Image Side (Popping up with smooth zoom out) */}
                  <div className="flex-1 w-full max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl z-20 perspective-1000 order-1 md:order-2 mt-12 md:mt-0">
                    <motion.div
                      initial={{ scale: 1.4, opacity: 0, filter: 'blur(20px)' }}
                      animate={{ scale: 1, opacity: 1, filter: 'blur(0px)' }}
                      transition={{ duration: 2.5, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
                      style={{
                        rotateX: smoothTiltX,
                        rotateY: smoothTiltY,
                      }}
                      className="relative w-full aspect-[2/3] rounded-sm overflow-hidden shadow-[0_30px_100px_rgba(0,0,0,0.8),_0_0_80px_rgba(185,28,28,0.2)] border border-red-900/20 bg-zinc-900"
                    >
                      <img 
                        src="/hero-bg.jpg" 
                        alt="Gate of Two Hearts" 
                        className="w-full h-full object-cover"
                        style={{ imageRendering: 'auto' }}
                      />
                      {/* Inner shadow/vignette for the poster */}
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,rgba(0,0,0,0.6)_100%)] pointer-events-none" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                    </motion.div>
                  </div>

                </div>

                <motion.div 
                  animate={{ y: [0, 15, 0], opacity: [0.2, 0.5, 0.2] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="absolute bottom-10 md:bottom-16 left-1/2 -translate-x-1/2 flex flex-col items-center gap-6 z-30"
                >
                  <div className="w-[1px] h-24 bg-gradient-to-b from-white/40 via-red-900/40 to-transparent" />
                  <span className="text-[10px] tracking-[1em] uppercase text-white/20">Descend</span>
                </motion.div>
              </section>

              {/* High-Definition Narrative Section */}
              <section id="story-section" className="pt-48 pb-10 md:pt-64 md:pb-16 px-6 md:px-12 bg-transparent relative overflow-hidden flex flex-col items-center">
                <div className="container mx-auto max-w-4xl lg:max-w-5xl 2xl:max-w-screen-xl relative z-10 flex flex-col items-center">
                  
                  {/* Centered Atmospheric Score */}
                  <div className="mb-24 flex flex-col items-center text-center">
                      <div className="mb-10">
                          <h3 className="text-red-900 text-[11px] font-bold tracking-[0.6em] uppercase mb-6">Atmospheric Score</h3>
                          <p className="text-slate-900/60 text-base font-light max-w-sm italic leading-relaxed">Let the sounds of old Japan and modern neon guide your journey as you read.</p>
                      </div>
                      <div className="scale-100 md:scale-110">
                        <MusicPlayer 
                          albumArt="/hero-bg.jpg"
                          songTitle="Gate of two hearts"
                          artistName="Original Score"
                          audioSrc="/narration.mp3"
                        />
                      </div>
                  </div>

                  <div className="space-y-16 md:space-y-24 py-10 md:py-20 w-full flex flex-col items-center text-center">
                      <div className="mb-20 md:mb-32">
                          <h2 className="text-5xl md:text-6xl lg:text-8xl font-serif text-black mb-8 md:mb-10 italic tracking-tighter">The Chronicle</h2>
                          <div className="w-24 md:w-32 h-[3px] bg-red-900/30 mx-auto shadow-lg" />
                      </div>
                      {STORY_DATA.map((item, index) => (
                        <TextReveal key={index} text={item.text} />
                      ))}
                      <div className="pt-24 md:pt-32">
                           <p className="text-red-900/60 font-serif italic text-2xl md:text-3xl tracking-wide">The choice is yours. The timeline is yours.</p>
                      </div>
                  </div>
                </div>
              </section>
            </main>

            <footer className="py-10 md:py-16 bg-transparent text-center border-t border-black/[0.05]">
              <p className="text-[10px] tracking-[0.8em] text-black/40 uppercase">A Cinematic Storytelling Engine</p>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default App
