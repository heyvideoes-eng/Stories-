import React, { useState, useMemo, useEffect } from 'react'
import { motion, AnimatePresence, useSpring, useMotionValue, useScroll, useTransform } from 'framer-motion'
import { MusicPlayer } from '@/components/ui/music-player'
import { GetStartedButton } from '@/components/ui/get-started-button'

// --- Temporal Anomaly Database ---
interface AnomalyDetails {
  title: string;
  subtitle: string;
  era: string;
  stability: string;
  quote: string;
  description: string;
  theme: 'past' | 'present' | 'future' | 'glitch';
}

const ANOMALY_DATABASE: Record<string, AnomalyDetails> = {
  'tokugawa': {
    title: 'The Tokugawa Feudal Anchor',
    subtitle: '17th Century Edo Period',
    era: '1640 AD (Kanei Era)',
    stability: '94% Historic Anchor',
    quote: '"A samurai exists for his lord, and dies in silence. That is the order of heaven. Why does a world with no lords feel so much warmer?"',
    description: 'Ryo’s home era. A time of rigid societal hierarchies, strict honor codes, and ultimate isolation. The anchor represents duty, sacrifice, and the inevitability of Ryo’s original demise in battle under the pouring rain.',
    theme: 'past'
  },
  'torii': {
    title: 'The Crimson Torii Boundary',
    subtitle: 'The Chronological Threshold',
    era: 'Non-Linear Continuum',
    stability: '42% Stable (Shattering)',
    quote: '"A gateway is not a door to another place, but a mirror to another self. Step through, and watch your reflection dissolve into the void."',
    description: 'An ancient shrine gate stained in deep vermillion. It stands as a bridge between the physical and the metaphysical, appearing when history is in flux to drag displaced souls to where they are needed.',
    theme: 'glitch'
  },
  'tokyo': {
    title: 'The Neon Convergence',
    subtitle: '21st Century Metropolis',
    era: '2026 AD (Modern Tokyo)',
    stability: '88% Convergence Level',
    quote: '"Millions of souls sharing a tiny island of concrete, walking in silence beneath artificial stars. It is terrifyingly crowded, yet beautifully free."',
    description: 'A city built on speed, information, and neon illumination. It stands in stark contrast to the quiet, natural rhythm of feudal Japan, representing the freedom to choose your own identity outside of ancient class structures.',
    theme: 'present'
  },
  'samurai': {
    title: 'The Lone Shadow',
    subtitle: 'The Relic of Kanei',
    era: '1640 AD ⇄ 2026 AD',
    stability: '68% Temporal Fracture',
    quote: '"My sword is my soul, yet here it is but a piece of cold iron on display. Perhaps a soul does not need a blade to survive."',
    description: 'The archetype of the warrior. Ryo brings the strict moral code, absolute dedication, and combat arts of the samurai into a world that has replaced the sword with the spreadsheet, rendering him a beautifully tragic anomaly.',
    theme: 'past'
  },
  'aiko': {
    title: 'Aiko: The Temporal Tether',
    subtitle: 'The Boundless Dreamer',
    era: '2026 AD (Modern Tokyo)',
    stability: '90% Resonance Level',
    quote: '"My parents have my next thirty years mapped out. Ryo doesn’t even know what tomorrow is. When I am with him, the future actually feels unwritten."',
    description: 'A modern schoolgirl who feels suffocated by the rigid social expectations of modern Japan. She serves as Ryo’s primary emotional anchor to the present, showing him the simple joys of convenience stores, ramen, and choice.',
    theme: 'present'
  },
  'kenji': {
    title: 'Kenji: The Temporal Observer',
    subtitle: 'The Chrono-Architect',
    era: '2026 AD (Modern Tokyo)',
    stability: '75% Quantum Influence',
    quote: '"History isn’t a sacred script written by the gods. It’s a series of physics calculations, and I am going to find the master equation."',
    description: 'An academic prodigy obsessed with history and physics. His research into the shrine’s lightning anomalies accidentally triggers the gate’s instability, forcing the group to confront their final choices.',
    theme: 'present'
  },
  'red-gate': {
    title: 'The Vermillion Path of Duty',
    subtitle: 'The Path of Sacrifice',
    era: '1640 AD Restored',
    stability: '100% Traditional Order',
    quote: '"Accept your fate, samurai. Return to your grave, so that the world may continue to spin in the order it was meant to."',
    description: 'Choosing this gate means Ryo returns to his original era to fulfill his destiny, preserving the integrity of history. The modern characters will wake up with only an empty, phantom ache where Ryo’s memory used to be.',
    theme: 'past'
  },
  'blue-gate': {
    title: 'The Cerulean Path of Choice',
    subtitle: 'The Path of the Modern Soul',
    era: '2026 AD Divergent',
    stability: '55% Paradox Chance',
    quote: '"Forget the sword. Forget the battle. Live here with us. But remember, a shadow cannot exist without the body that cast it."',
    description: 'Choosing this gate allows Ryo to stay in modern Tokyo as an ordinary student, but the gate extracts a toll: he must surrender all memories of his past life as a samurai, effectively erasing who he was.',
    theme: 'future'
  },
  'third-path': {
    title: 'The Paradox of the Third Path',
    subtitle: 'The Defiance of the Gate',
    era: 'Combined Modern Continuum',
    stability: '??? Quantum Superposition',
    quote: '"If the rules of time say we must choose between erasure and exile, then we will tear up the rules. We will draw our own circle."',
    description: 'By refusing to let go of either his past or his friends, Ryo grabs both gates. Reality splinters and reformulates. In this timeline, he has always been a modern student, but deep dream-fragments of the sword remain.',
    theme: 'glitch'
  },
  'destiny': {
    title: 'The Chronological Restitution',
    subtitle: 'Destiny’s Gravity',
    era: 'All Timelines',
    stability: '99% Corrective Pull',
    quote: '"Time is an ocean. You can throw a stone to ripple the water, but the tide will always drag the shore back to where it belongs."',
    description: 'The natural correcting force of the universe that attempts to eliminate temporal anomalies like Ryo. Defying it requires a perfect union of historical memory and modern desire.',
    theme: 'glitch'
  },
  'memories': {
    title: 'The Dream-Shattered Whispers',
    subtitle: 'Subconscious Chronology',
    era: 'Trans-Temporal Echoes',
    stability: '30% Intact Memory',
    quote: '"I close my eyes and see rain on a straw coat, and the smell of cherry blossoms mixed with exhaust fumes. Which one of me is dreaming?"',
    description: 'The residual memory fragments that linger after a timeline shift. Even when the past is rewritten, the emotional echoes remain buried in the subconscious like faded photographs in a dark room.',
    theme: 'glitch'
  }
};

// --- Dynamic Text Parser ---
interface TextSegment {
  text: string;
  isAnomaly: boolean;
  anomalyKey?: string;
}

const parseText = (text: string): TextSegment[] => {
  const anomalies = [
    { pattern: /Tokugawa era/gi, key: 'tokugawa' },
    { pattern: /modern Tokyo/gi, key: 'tokyo' },
    { pattern: /torii gate/gi, key: 'torii' },
    { pattern: /shrine gate/gi, key: 'torii' },
    { pattern: /red gate/gi, key: 'red-gate' },
    { pattern: /blue gate/gi, key: 'blue-gate' },
    { pattern: /third path/gi, key: 'third-path' },
    { pattern: /defied the gate/gi, key: 'third-path' },
    { pattern: /rewrote time itself/gi, key: 'third-path' },
    { pattern: /rewrote time/gi, key: 'third-path' },
    { pattern: /Tokugawa/gi, key: 'tokugawa' },
    { pattern: /Tokyo/gi, key: 'tokyo' },
    { pattern: /Aiko/g, key: 'aiko' },
    { pattern: /Kenji/g, key: 'kenji' },
    { pattern: /samurai/gi, key: 'samurai' },
    { pattern: /destiny/gi, key: 'destiny' },
    { pattern: /fate/gi, key: 'destiny' },
    { pattern: /memories/gi, key: 'memories' },
    { pattern: /past life/gi, key: 'memories' }
  ];

  let segments: TextSegment[] = [{ text, isAnomaly: false }];

  for (const anomaly of anomalies) {
    const nextSegments: TextSegment[] = [];
    for (const segment of segments) {
      if (segment.isAnomaly) {
        nextSegments.push(segment);
        continue;
      }

      const parts = segment.text.split(anomaly.pattern);
      const matches = segment.text.match(anomaly.pattern) || [];

      if (parts.length > 1) {
        for (let i = 0; i < parts.length; i++) {
          if (parts[i]) {
            nextSegments.push({ text: parts[i], isAnomaly: false });
          }
          if (i < matches.length) {
            nextSegments.push({ text: matches[i], isAnomaly: true, anomalyKey: anomaly.key });
          }
        }
      } else {
        nextSegments.push(segment);
      }
    }
    segments = nextSegments;
  }

  return segments;
};

// --- Story Segment Data (Buildup) ---
const BUILDUP_PARAGRAPHS = [
  "Ryo, a samurai from the Tokugawa era, is suddenly thrown into modern Tokyo after walking through a mysterious torii gate during a storm. Lost in a world of neon lights, technology, and crowded streets, he accidentally saves a schoolgirl named Aiko from a speeding bike. Alongside her friend Kenji, who is obsessed with history and science, they slowly realize Ryo is not a cosplayer, but a real samurai displaced through time.",
  "Kenji discovers ancient records about a “vanishing samurai” connected to a strange torii gate that appears during moments when history is about to change. The same shrine still exists in modern Japan, and recent lightning activity suggests the gate may open again. While Kenji researches the mystery, Aiko helps Ryo adjust to modern life. Ryo learns trains, ramen, convenience stores, and the strange peace of a world without war. Over time, he becomes deeply attached to both Aiko and the life he never imagined possible.",
  "Aiko, meanwhile, feels trapped by the expectations of modern life and dreams of escaping somewhere she truly belongs. She and Ryo grow emotionally closer, bonding over their shared feeling of being lost between worlds. Kenji becomes increasingly obsessed with the torii gate, uncovering evidence that it doesn’t simply move people through time, but appears whenever history itself is unstable. He begins to suspect Ryo was brought to the future for a reason.",
  "One stormy night, an old priest arrives at their apartment and reveals the truth: the gate is opening again, but this time it has become unstable because of Kenji’s attempts to study it. If it breaks completely, time itself could collapse, erasing memories, people, and entire histories. The priest explains that Ryo now faces two choices. First, he can return to his original era and continue the life he was meant to live, though it will leave emotional scars on Aiko and Kenji. Second, he can remain in the modern world, but at the cost of losing all memories of his past life as a samurai.",
  "Before Ryo can decide, the gate drags all of them into a strange space outside time itself. There, two gates appear: the original red gate representing duty and sacrifice, and a new unstable blue gate accidentally created by Kenji’s experiments. The blue gate shows glimpses of a future where all three of them live together peacefully. However, using it could completely rewrite reality. The priest warns them that this “third path” should not exist and could destroy everything.",
  "Ryo realizes he cannot choose between abandoning his past or erasing who he once was. Instead, he grabs both gates at once, refusing to let time decide his fate for him. Aiko and Kenji hold onto him as the gates collapse together. Memories, timelines, and identities begin breaking apart as the three of them fight against the rules controlling their lives. Ryo declares that if time is a circle, then they should draw that circle themselves instead of blindly following destiny.",
  "When Ryo wakes up, reality has changed. He is no longer a samurai living in modern Japan. Instead, he has always existed there as an ordinary student and friend of Aiko and Kenji. However, fragments of the old timeline remain buried inside their memories like dreams they cannot fully explain. Aiko remembers visions of Ryo standing beneath a red torii gate in the rain, always leaving her behind. Kenji discovers an old photograph showing three figures beneath the shrine gate with a note calling them “The three who defied the gate.”",
  "The three slowly realize they succeeded in doing the impossible. Rather than choosing between fate and sacrifice, they rewrote time itself together. Though the memories of their previous lives are fading, the emotional bond between them remains. Ryo understands that even without remembering every detail of who he once was, he still found his way back to the people who mattered most. The story ends with the three walking into modern Tokyo together while the old torii gate quietly waits in the distance, ready for the next person daring enough to challenge destiny."
];

// --- Custom Interactive Components ---

interface AnomalyWordProps {
  text: string;
  anomalyKey: string;
  onClick: (key: string) => void;
  isFound: boolean;
  themeType: string;
  onCursorChange: (mode: 'default' | 'anomaly' | 'button' | 'interactive', theme?: 'past' | 'present' | 'future' | 'glitch' | 'normal') => void;
}

const AnomalyWord: React.FC<AnomalyWordProps> = ({ 
  text, 
  anomalyKey, 
  onClick,
  isFound,
  onCursorChange
}) => {
  const [isGlitching, setIsGlitching] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [displayText, setDisplayText] = useState(text);

  const triggerGlitch = () => {
    if (isGlitching) return;
    setIsGlitching(true);
    let iterations = 0;
    const glitchChars = "時空門命侍影桜01ØΔ⚡";
    const interval = setInterval(() => {
      setDisplayText(
        text
          .split("")
          .map((char, index) => {
            if (char === " ") return " ";
            if (index < iterations) return text[index];
            return glitchChars[Math.floor(Math.random() * glitchChars.length)];
          })
          .join("")
      );
      iterations += 1;
      if (iterations >= text.length + 3) {
        clearInterval(interval);
        setIsGlitching(false);
        setDisplayText(text);
        onClick(anomalyKey);
      }
    }, 45);
  };

  const termDetails = ANOMALY_DATABASE[anomalyKey];
  const termTheme = termDetails?.theme || 'glitch';

  const colorClasses = 
    termTheme === 'past' 
      ? 'text-[#8a2525] border-[#8a2525]/60 hover:text-[#b91c1c] shadow-[0_0_10px_rgba(138,37,37,0.05)] border-b border-dashed' 
      : termTheme === 'present'
        ? 'text-cyan-700 border-cyan-500/60 hover:text-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.05)] border-b border-dashed'
        : termTheme === 'future'
          ? 'text-blue-700 border-blue-500/60 hover:text-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.05)] border-b border-dashed'
          : 'text-purple-800 border-purple-950/60 hover:text-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.05)] border-b border-dashed';

  return (
    <span className="relative inline-block select-none">
      <motion.span
        onMouseEnter={() => {
          setIsHovered(true);
          onCursorChange('anomaly', termTheme);
        }}
        onMouseLeave={() => {
          setIsHovered(false);
          onCursorChange('default');
        }}
        onClick={triggerGlitch}
        className={`relative inline-block font-serif font-bold cursor-pointer transition-all duration-300 ${colorClasses} ${
          isFound ? 'bg-red-50/20 px-1 rounded-sm' : ''
        }`}
        animate={isHovered ? {
          scale: 1.05,
          textShadow: termTheme === 'past' ? "0 0 10px rgba(138,37,37,0.6)" :
                      termTheme === 'present' ? "0 0 10px rgba(6,182,212,0.6)" :
                      termTheme === 'future' ? "0 0 10px rgba(59,130,246,0.6)" :
                      "0 0 10px rgba(168,85,247,0.6)"
        } : {
          scale: 1,
          textShadow: "0 0 0px rgba(0,0,0,0)"
        }}
        transition={{ duration: 0.3 }}
      >
        {displayText}

        {/* Local interactive sakura / glitch sparks on hover */}
        {isHovered && (
          <span className="absolute inset-0 pointer-events-none z-50">
            {Array.from({ length: 5 }).map((_, i) => {
              const angle = (i / 5) * Math.PI * 2 + Math.random() * 0.5;
              const distance = 20 + Math.random() * 20;
              const x = Math.cos(angle) * distance;
              const y = -10 - Math.random() * 25;
              
              return (
                <motion.span
                  key={i}
                  initial={{ opacity: 1, scale: 0.8, x: 0, y: 0 }}
                  animate={{ opacity: 0, scale: 0.1, x, y }}
                  transition={{ duration: 0.7, ease: "easeOut" }}
                  className={`absolute w-1.5 h-1.5 rounded-full ${
                    termTheme === 'past' ? 'bg-pink-400 shadow-[0_0_6px_#f472b6]' :
                    termTheme === 'present' ? 'bg-cyan-400 shadow-[0_0_6px_#22d3ee]' :
                    termTheme === 'future' ? 'bg-amber-400 shadow-[0_0_6px_#fbbf24]' :
                    'bg-purple-400 shadow-[0_0_6px_#c084fc]'
                  }`}
                  style={{ left: '50%', top: '50%' }}
                />
              );
            })}
          </span>
        )}
      </motion.span>
    </span>
  );
};

interface LegibleParagraphProps {
  text: string;
  onAnomalyClick: (key: string) => void;
  foundAnomalies: Set<string>;
  themeType: string;
  onCursorChange: (mode: 'default' | 'anomaly' | 'button' | 'interactive', theme?: 'past' | 'present' | 'future' | 'glitch' | 'normal') => void;
}

const LegibleParagraph: React.FC<LegibleParagraphProps> = ({ 
  text, 
  onAnomalyClick, 
  foundAnomalies,
  themeType,
  onCursorChange
}) => {
  const segments = useMemo(() => parseText(text), [text]);
  
  return (
    <motion.p 
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 1.0, ease: [0.22, 1, 0.36, 1] }}
      className="text-lg sm:text-xl md:text-2xl lg:text-3xl leading-[1.85] text-[#4a1a1a] cursor-default tracking-[0.03em] text-left mb-16 md:mb-24 px-6 md:px-8 max-w-4xl w-full mx-auto font-medium"
      style={{ fontFamily: "'Open Sans', sans-serif" }}
    >
      {segments.map((segment, sIdx) => {
        if (segment.isAnomaly && segment.anomalyKey) {
          return (
            <React.Fragment key={sIdx}>
              <AnomalyWord 
                text={segment.text} 
                anomalyKey={segment.anomalyKey} 
                onClick={onAnomalyClick}
                isFound={foundAnomalies.has(segment.anomalyKey)}
                themeType={themeType}
                onCursorChange={onCursorChange}
              />
              {/* Ensure clean spacing between tags and words */}
              {sIdx < segments.length - 1 && !segments[sIdx+1].text.startsWith(" ") && " "}
            </React.Fragment>
          );
        }
        
        return (
          <span 
            key={sIdx}
            className="hover:text-[#8a2525] transition-colors duration-300"
          >
            {segment.text}
          </span>
        );
      })}
    </motion.p>
  );
};

// --- Lore Drawer Component ---
interface ChronoDrawerProps {
  selectedKey: string | null;
  onClose: () => void;
  foundAnomalies: Set<string>;
  onCursorChange: (mode: 'default' | 'anomaly' | 'button' | 'interactive', theme?: 'past' | 'present' | 'future' | 'glitch' | 'normal') => void;
}

const ChronoDrawer: React.FC<ChronoDrawerProps> = ({ 
  selectedKey, 
  onClose, 
  foundAnomalies,
  onCursorChange
}) => {
  const details = selectedKey ? ANOMALY_DATABASE[selectedKey] : null;

  return (
    <AnimatePresence>
      {details && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[120] bg-black/30 backdrop-blur-sm pointer-events-auto"
          />
          
          {/* Drawer Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 w-full sm:w-[28rem] md:w-[32rem] z-[130] bg-[#f9f9f9]/95 backdrop-blur-md shadow-[-10px_0_40px_rgba(0,0,0,0.12)] border-l border-red-900/10 p-8 flex flex-col justify-between overflow-y-auto pointer-events-auto text-black"
            style={{ fontFamily: "'Open Sans', sans-serif" }}
          >
            <div>
              <div className="flex justify-between items-center mb-8">
                <span className={`text-[10px] font-bold tracking-[0.3em] uppercase ${
                  details.theme === 'past' ? 'text-red-900' :
                  details.theme === 'present' ? 'text-cyan-600' :
                  details.theme === 'future' ? 'text-blue-600' : 'text-purple-600'
                }`}>
                  Timeline Anomaly Resolved
                </span>
                <button 
                  onClick={onClose}
                  onMouseEnter={() => onCursorChange('button')}
                  onMouseLeave={() => onCursorChange('default')}
                  className="text-black/40 hover:text-black transition-colors text-xs uppercase tracking-[0.2em] font-bold"
                >
                  [ Close ]
                </button>
              </div>

              {/* Title & subtitle */}
              <h2 className="text-3xl md:text-4xl font-serif text-[#4a1a1a] mb-2 leading-tight">
                {details.title}
              </h2>
              <p className="text-xs text-black/40 uppercase tracking-[0.2em] font-light mb-6">
                {details.subtitle}
              </p>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-[#f0f0f0] p-4 rounded-sm border border-black/5">
                  <span className="block text-[9px] uppercase tracking-wider text-black/40 mb-1">Chronological Era</span>
                  <span className="font-serif text-sm font-semibold text-black/80">{details.era}</span>
                </div>
                <div className="bg-[#f0f0f0] p-4 rounded-sm border border-black/5">
                  <span className="block text-[9px] uppercase tracking-wider text-black/40 mb-1">Temporal Gravity</span>
                  <span className="font-mono text-sm font-semibold text-black/80">{details.stability}</span>
                </div>
              </div>

              {/* Memory Fragment Quote */}
              <div className="relative border-l-[3px] border-[#6e2c2c] pl-6 py-2 my-8 bg-[#6e2c2c]/5 rounded-r-md">
                <p className="font-serif italic text-lg leading-relaxed text-[#5c2424]">
                  {details.quote}
                </p>
              </div>

              {/* Chrono Analysis Description */}
              <div className="mb-8">
                <h4 className="text-[10px] uppercase tracking-[0.2em] font-bold text-black/60 mb-2">Chrono-Analysis</h4>
                <p className="text-sm md:text-base text-black/70 leading-relaxed font-light">
                  {details.description}
                </p>
              </div>
            </div>

            {/* Bottom Progress Tracker */}
            <div className="pt-6 border-t border-black/10">
              <div className="flex justify-between items-center mb-3">
                <span className="text-[10px] uppercase tracking-[0.15em] font-bold text-black/50">Discovered Echoes</span>
                <span className="text-[10px] font-mono font-bold text-[#6e2c2c]">{foundAnomalies.size} / 5</span>
              </div>
              <div className="flex gap-1.5 mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div 
                    key={i} 
                    className={`h-2 flex-1 rounded-full transition-all duration-500 ${
                      i < foundAnomalies.size 
                        ? 'bg-red-800 shadow-[0_0_8px_rgba(153,27,27,0.3)]' 
                        : 'bg-black/10'
                    }`}
                  />
                ))}
              </div>
              <button
                onClick={onClose}
                onMouseEnter={() => onCursorChange('button')}
                onMouseLeave={() => onCursorChange('default')}
                className="w-full py-4 bg-red-950 text-white tracking-[0.3em] text-[10px] uppercase font-bold hover:bg-red-900 transition-colors duration-300 rounded-sm"
              >
                Synchronize Timeline
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};


// --- Chrono Dynamic Particle Fall ---
interface ChronoParticleProps {
  index: number;
  theme: string;
}

const ChronoParticle: React.FC<ChronoParticleProps> = ({ index, theme }) => {
  const startX = useMemo(() => Math.random() * 100, []);
  const delay = useMemo(() => Math.random() * 15, []);
  const duration = useMemo(() => 15 + Math.random() * 15, []);
  const size = useMemo(() => 4 + Math.random() * 8, []);
  const direction = useMemo(() => (Math.random() > 0.5 ? 1 : -1), []);

  let animateProps = {};
  let styleProps: React.CSSProperties = {};

  if (theme === 'present') {
    animateProps = {
      y: ['-10vh', '110vh'],
      x: [`${startX}vw`, `${startX + (direction * 3)}vw`],
      opacity: [0, 0.7, 0.7, 0],
    };
    styleProps = {
      width: '1px',
      height: `${size * 3}px`,
      background: 'linear-gradient(to bottom, transparent, #22d3ee, #a855f7)',
      boxShadow: '0 0 8px rgba(34, 211, 238, 0.5)',
    };
  } else if (theme === 'future') {
    animateProps = {
      y: ['110vh', '-10vh'],
      x: [`${startX}vw`, `${startX + (direction * 10)}vw`],
      opacity: [0, 0.6, 0.6, 0],
      scale: [0.5, 1.2, 0.7],
    };
    styleProps = {
      width: `${size}px`,
      height: `${size}px`,
      borderRadius: '50%',
      background: 'radial-gradient(circle, #f59e0b, #3b82f6)',
      boxShadow: '0 0 10px rgba(245, 158, 11, 0.4)',
    };
  } else if (theme === 'glitch') {
    animateProps = {
      y: ['-10vh', '30vh', '60vh', '110vh'],
      x: [`${startX}vw`, `${startX + (direction * 20)}vw`, `${startX - (direction * 8)}vw`, `${startX}vw`],
      opacity: [0, 0.8, 0, 0.8, 0],
      rotate: [0, 360, 720, 1080],
    };
    const randomColor = index % 3 === 0 ? '#ec4899' : index % 3 === 1 ? '#06b6d4' : '#f59e0b';
    styleProps = {
      width: `${size}px`,
      height: `${size}px`,
      background: randomColor,
      boxShadow: `0 0 10px ${randomColor}`,
      clipPath: index % 2 === 0 ? 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' : 'none',
    };
  } else {
    animateProps = {
      y: ['-10vh', '30vh', '70vh', '110vh'],
      x: [`${startX}vw`, `${startX + (direction * 8)}vw`, `${startX + (direction * 12)}vw`, `${startX + (direction * 4)}vw`],
      opacity: [0, 0.65, 0.65, 0],
      rotateX: [0, 240, 480, 720],
      rotateY: [0, 120, 240, 360],
      rotateZ: [0, direction * 240, direction * 480, direction * 720]
    };
    styleProps = {
      width: `${size}px`,
      height: `${size * 1.5}px`,
      backgroundColor: 'rgba(244, 180, 200, 0.45)',
      boxShadow: '0 0 15px rgba(244, 114, 182, 0.2)',
      borderTopLeftRadius: '100%',
      borderBottomRightRadius: '100%',
      borderBottomLeftRadius: '2px',
      borderTopRightRadius: '2px'
    };
  }

  return (
    <motion.div
      animate={animateProps}
      transition={{
        duration,
        repeat: Infinity,
        delay,
        ease: "linear"
      }}
      className="absolute pointer-events-none z-[1]"
      style={styleProps}
    />
  );
};

interface ChronoParticlesProps {
  theme: string;
}

const ChronoParticles: React.FC<ChronoParticlesProps> = ({ theme }) => {
  return (
    <div className="fixed inset-0 pointer-events-none z-[1] overflow-hidden">
      {Array.from({ length: 25 }).map((_, i) => (
        <ChronoParticle key={i} index={i} theme={theme} />
      ))}
    </div>
  );
};

// --- Story Elements (Standard) ---

const ReadingProgress = () => {
    const { scrollYProgress } = useScroll();
    return (
        <motion.div 
            className="fixed top-0 left-0 right-0 h-1 bg-[#6e2c2c] z-[110] origin-left"
            style={{ scaleX: scrollYProgress }}
        />
    )
}





interface ChapterNavItemProps {
  chapter: string;
  i: number;
  smoothScrollProgress: any;
  onCursorChange: (mode: 'default' | 'anomaly' | 'button' | 'interactive', theme?: 'past' | 'present' | 'future' | 'glitch' | 'normal') => void;
}

const ChapterNavItem: React.FC<ChapterNavItemProps> = ({ chapter, i, smoothScrollProgress, onCursorChange }) => {
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
    
    // Smooth height and opacity updates using spring progress
    const heightVal = useTransform(smoothScrollProgress, range, [8, 32, 8]);
    const height = useTransform(heightVal, (v: any) => `${v}px`);
    const opacity = useTransform(smoothScrollProgress, range, [0.2, 1, 0.2]);

    return (
        <motion.div 
            className="group relative flex items-center justify-end cursor-pointer"
            whileHover={{ scale: 1.05 }}
            onMouseEnter={() => onCursorChange('interactive')}
            onMouseLeave={() => onCursorChange('default')}
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

interface ChapterNavProps {
  smoothScrollProgress: any;
  onCursorChange: (mode: 'default' | 'anomaly' | 'button' | 'interactive', theme?: 'past' | 'present' | 'future' | 'glitch' | 'normal') => void;
}

const ChapterNav: React.FC<ChapterNavProps> = ({ smoothScrollProgress, onCursorChange }) => {
    return (
        <div className="fixed right-6 top-1/2 -translate-y-1/2 flex flex-col items-end gap-6 z-50 hidden md:flex">
            {['Origin', 'Arrival', 'Connection', 'Legacy'].map((chapter, i) => (
                <ChapterNavItem key={i} chapter={chapter} i={i} smoothScrollProgress={smoothScrollProgress} onCursorChange={onCursorChange} />
            ))}
        </div>
    )
}



// Ethereal static sakura falling (very slow)
const SakuraPetal = () => {
    const startX = useMemo(() => Math.random() * 100, []);
    const delay = useMemo(() => Math.random() * 15, []);
    const duration = useMemo(() => Math.random() * 10 + 20, []); // 20-30s - extremely slow and dreamlike!
    const size = useMemo(() => Math.random() * 6 + 6, []); // 6-12px
    const direction = useMemo(() => Math.random() > 0.5 ? 1 : -1, []);
    
    return (
        <motion.div
            animate={{ 
                y: ['-10vh', '110vh'],
                x: [`${startX}vw`, `${startX + (direction * 8)}vw`],
                opacity: [0, 0.5, 0.5, 0],
                rotateX: [0, 360],
                rotateY: [0, 180],
                rotateZ: [0, direction * 360]
            }}
            transition={{ 
                duration, 
                repeat: Infinity, 
                delay, 
                ease: "linear" 
            }}
            className="absolute bg-pink-300/30 shadow-[0_0_10px_rgba(244,114,182,0.15)] pointer-events-none"
            style={{ 
                width: size, 
                height: size * 1.4,
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
             {Array.from({ length: 20 }).map((_, i) => (
                 <SakuraPetal key={i} />
             ))}
        </div>
    )
}

const Particle = ({ delay }: { delay: number }) => {
  const x = useMemo(() => Math.random() * 100, []);
  const duration = useMemo(() => 20 + Math.random() * 20, []); // extremely slow particles
  const size = useMemo(() => 2 + Math.random() * 3, []);
  
  return (
    <motion.div
      animate={{ 
        y: ['-10vh', '110vh'], 
        x: [`${x}vw`, `${x + 3}vw`],
        opacity: [0, 0.5, 0.5, 0],
      }}
      transition={{ duration, repeat: Infinity, delay, ease: "linear" }}
      style={{ width: size, height: size }}
      className="absolute bg-red-100/20 rounded-full blur-[2px] pointer-events-none z-0"
    />
  )
}

// --- Japanese Background Typography ---
const JapaneseBackgroundTypography = () => {
  const kanjiList = [
    { text: "運命", top: "5%", left: "5%", delay: 0 },
    { text: "時間", top: "35%", right: "10%", delay: 3 },
    { text: "記憶", top: "65%", left: "15%", delay: 1.5 },
    { text: "永遠", top: "15%", right: "20%", delay: 4.5 },
    { text: "魂", top: "85%", right: "5%", delay: 2 },
  ];

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-[1] select-none flex items-center justify-center mix-blend-multiply opacity-60">
      {kanjiList.map((item, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ 
            opacity: [0, 0.03, 0.03, 0], 
            y: [50, -50],
            scale: [0.9, 1.1] 
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            delay: item.delay,
            ease: "linear"
          }}
          className="absolute font-serif text-[#3b1212] whitespace-nowrap tracking-[0.2em]"
          style={{ 
            top: item.top, 
            left: item.left,
            right: item.right,
            fontSize: 'clamp(8rem, 25vw, 25rem)', 
            writingMode: 'vertical-rl',
            lineHeight: 1 
          }}
        >
          {item.text}
        </motion.div>
      ))}
    </div>
  );
};

// --- Main App Component ---
const App: React.FC = () => {
  const [hasStarted, setHasStarted] = useState(false);
  const [activeTheme, setActiveTheme] = useState<'normal' | 'past' | 'present' | 'future' | 'glitch'>('normal');
  


  // Temporal Anomaly state
  const [foundAnomalies, setFoundAnomalies] = useState<Set<string>>(new Set());
  const [selectedAnomaly, setSelectedAnomaly] = useState<string | null>(null);

  // Crossroads choice state


  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const tiltX = useMotionValue(0);
  const tiltY = useMotionValue(0);


  const smoothTiltX = useSpring(tiltX, { damping: 30, stiffness: 100 });
  const smoothTiltY = useSpring(tiltY, { damping: 30, stiffness: 100 });

  // --- Smooth Scroll Spring Buffer (Damping out mousewheel ticks) ---
  const { scrollYProgress } = useScroll();
  const smoothScrollProgress = useSpring(scrollYProgress, { damping: 35, stiffness: 90 });

  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      
      const x = ((e.clientY - innerHeight / 2) / innerHeight) * 20;
      const y = ((e.clientX - innerWidth / 2) / innerWidth) * -20;
      tiltX.set(x);
      tiltY.set(y);
    };

    const handleGlobalMouseLeave = () => {
      tiltX.set(0);
      tiltY.set(0);
    };

    window.addEventListener('mousemove', handleGlobalMouseMove);
    document.body.addEventListener('mouseleave', handleGlobalMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleGlobalMouseMove);
      document.body.removeEventListener('mouseleave', handleGlobalMouseLeave);
    };
  }, [mouseX, mouseY, tiltX, tiltY]);

  // Cursor change trigger helper
  const handleCursorChange = (_mode: 'default' | 'anomaly' | 'button' | 'interactive', _theme?: 'past' | 'present' | 'future' | 'glitch' | 'normal') => {
    // No-op (Custom cursor disabled to use native OS pointer)
  };

  // Handle anomaly click
  const handleAnomalyClick = (key: string) => {
    setFoundAnomalies(prev => {
      const next = new Set(prev);
      next.add(key);
      return next;
    });
    setSelectedAnomaly(key);
    setActiveTheme(ANOMALY_DATABASE[key].theme);
  };


  return (
    <div className="min-h-screen bg-[#f9f9f9] text-black selection:bg-red-200 overflow-x-hidden font-sans relative transition-colors duration-1000">
      <JapaneseBackgroundTypography />
      
      <ChapterNav smoothScrollProgress={smoothScrollProgress} onCursorChange={handleCursorChange} />
      <ReadingProgress />

      
      {/* Immersive Chrono Particles */}
      <ChronoParticles theme={activeTheme} />
      
      {/* Ethereal Slow Sakura fall */}
      <SakuraFall />





      {/* Lore Anomaly Info Panel (Drawer) */}
      <ChronoDrawer 
        selectedKey={selectedAnomaly} 
        onClose={() => setSelectedAnomaly(null)}
        foundAnomalies={foundAnomalies}
        onCursorChange={handleCursorChange}
      />

      {/* Screen Glitch Flash Overlay */}
      <AnimatePresence>

      </AnimatePresence>

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
                <h1 className="text-4xl md:text-6xl font-serif mb-6 tracking-[0.15em] text-black uppercase drop-shadow-[0_0_40px_rgba(185,28,28,0.2)] font-light">
                    Gate of <span className="font-script text-[#6e2c2c] normal-case tracking-normal text-5xl md:text-7xl">Two Hearts</span>
                </h1>
                <p className="text-[10px] md:text-xs tracking-[0.8em] text-black/60 mb-20 uppercase font-light font-sans">The Timeline Awaits Your Defiance</p>
                <div 
                  className="flex justify-center scale-110"
                  onMouseEnter={() => handleCursorChange('button')}
                  onMouseLeave={() => handleCursorChange('default')}
                >
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
            <header className="fixed top-0 left-0 w-full z-50 p-6 md:p-10 flex justify-between items-center bg-gradient-to-b from-[#f9f9f9]/90 to-transparent pointer-events-none">
              <div 
                className="text-[10px] font-bold tracking-[0.8em] text-black/50 font-serif hover:text-black transition-all duration-500 cursor-default uppercase pointer-events-auto"
                onMouseEnter={() => handleCursorChange('interactive')}
                onMouseLeave={() => handleCursorChange('default')}
              >
                GATE OF TWO HEARTS
              </div>
            </header>

            <main>
              {/* Hero Section */}
              <section 
                className="relative min-h-screen pt-24 pb-16 overflow-hidden flex items-center justify-center bg-transparent"
              >
                <div className="absolute inset-0 z-0 pointer-events-none">
                  {Array.from({ length: 25 }).map((_, i) => (
                    <Particle key={i} delay={i * 0.5} />
                  ))}
                </div>
                
                <div className="relative z-30 container mx-auto px-6 md:px-12 2xl:max-w-7xl h-full flex flex-col md:flex-row items-center justify-between gap-12 lg:gap-24">
                  {/* Left Hero Title */}
                  <div className="flex-1 text-center md:text-left z-30 order-2 md:order-1">
                    <motion.div 
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 2.2, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[7rem] xl:text-[8rem] 2xl:text-[10rem] font-serif mb-8 leading-[0.9] tracking-tight drop-shadow-[0_0_50px_rgba(185,28,28,0.3)] font-light">
                        Gate of <br className="hidden md:block"/><span className="font-script text-[#6e2c2c] tracking-normal text-5xl sm:text-6xl md:text-7xl lg:text-[8rem] xl:text-[9rem] 2xl:text-[11rem]">two hearts</span>
                      </h1>
                      <p className="text-[10px] md:text-xs text-black/60 font-light mb-16 max-w-xl mx-auto md:mx-0 leading-relaxed tracking-[0.4em] uppercase font-sans">
                        Beyond Time. Beyond Destiny. Beyondless.
                      </p>
                      <div className="flex flex-col sm:flex-row justify-center md:justify-start gap-6 lg:gap-10">
                        <motion.button 
                          whileHover={{ scale: 1.05, backgroundColor: 'rgba(127, 29, 29, 0.9)' }}
                          whileTap={{ scale: 0.95 }}
                          onMouseEnter={() => handleCursorChange('button')}
                          onMouseLeave={() => handleCursorChange('default')}
                          onClick={() => document.getElementById('story-section')?.scrollIntoView({ behavior: 'smooth' })}
                          className="group relative px-10 py-5 lg:px-14 lg:py-6 overflow-hidden bg-red-950/90 border border-red-800/40 rounded-sm"
                        >
                          <span className="relative z-10 text-slate-100 tracking-[0.3em] text-[10px] uppercase font-bold whitespace-nowrap">Open the Gate</span>
                        </motion.button>
                      </div>
                    </motion.div>
                  </div>

                  {/* Right Hero Image Card */}
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
                  <span className="text-[10px] tracking-[1em] uppercase text-black/20">Descend</span>
                </motion.div>
              </section>

              {/* Main Narrative Chronicle Section */}
              <section id="story-section" className="pt-32 pb-10 md:pt-48 md:pb-16 px-6 md:px-12 bg-transparent relative overflow-hidden flex flex-col items-center">
                <div className="container mx-auto max-w-4xl lg:max-w-5xl 2xl:max-w-screen-xl relative z-10 flex flex-col items-center">
                  
                  {/* Atmospheric score widget */}
                  <div className="mb-24 flex flex-col items-center text-center">
                      <div className="mb-10">
                          <h3 className="text-red-900 text-[10px] font-bold tracking-[0.6em] uppercase mb-6 font-sans">Atmospheric Score</h3>
                          <p className="text-slate-900/60 text-sm font-light max-w-sm leading-relaxed font-serif italic">Let the sounds of old Japan and modern neon guide your journey as you read.</p>
                      </div>
                      <div 
                        className="scale-100 md:scale-110"
                        onMouseEnter={() => handleCursorChange('button')}
                        onMouseLeave={() => handleCursorChange('default')}
                      >
                        <MusicPlayer 
                          albumArt="/hero-bg.jpg"
                          songTitle="Gate of two hearts"
                          artistName="Original Score"
                          audioSrc="/narration.mp3"
                        />
                      </div>
                  </div>

                  {/* Chronicle title */}
                  <div className="space-y-16 md:space-y-24 py-10 md:py-20 w-full flex flex-col items-center text-center">
                      <div className="mb-12 md:mb-20">
                          <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-black mb-8 md:mb-10 tracking-tight font-light">The <span className="font-script text-[#6e2c2c] text-5xl md:text-6xl lg:text-7xl tracking-normal">Chronicle</span></h2>
                          <p className="text-[9px] tracking-[0.3em] uppercase text-black/40 font-bold mb-6 font-sans">Hover words to scan. Click timeline anchors to resolve anomalies.</p>
                          <div className="w-24 md:w-32 h-[3px] bg-red-900/30 mx-auto shadow-lg" />
                      </div>

                      {/* Buildup Paragraphs (0 to 5) - Legible & Highly interactive */}
                      {BUILDUP_PARAGRAPHS.map((text, index) => (
                        <LegibleParagraph 
                          key={index} 
                          text={text} 
                          onAnomalyClick={handleAnomalyClick}
                          foundAnomalies={foundAnomalies}
                          themeType={activeTheme}
                          onCursorChange={handleCursorChange}
                        />
                      ))}

                  </div>
                </div>
              </section>
            </main>

            {/* Dramatis Personae (Character Descriptions) Section */}
            <section className="py-24 border-t border-black/[0.05] bg-transparent flex flex-col items-center">
              <div className="container mx-auto max-w-5xl px-6 md:px-12 flex flex-col items-center">
                <div className="text-center mb-16">
                  <span className="text-[9px] font-bold tracking-[0.4em] text-red-900 uppercase block mb-3 font-sans">Historical Files</span>
                  <h3 className="text-2xl md:text-4xl font-serif text-black font-light">Dramatis <span className="font-script text-[#6e2c2c] text-3xl md:text-5xl tracking-normal">Personae</span></h3>
                  <div className="w-12 h-[2px] bg-red-900/30 mx-auto mt-4" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full mt-8">
                  {/* Ryo */}
                  <motion.div 
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.8, delay: 0.1 }}
                    whileHover={{ y: -10, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onMouseEnter={() => handleCursorChange('anomaly', 'past')}
                    onMouseLeave={() => handleCursorChange('default')}
                    className="bg-[#fcfcfc]/80 backdrop-blur-sm border border-black/[0.04] p-8 rounded-sm shadow-[0_10px_30px_rgba(0,0,0,0.02)] flex flex-col justify-between h-full min-h-[24rem] transition-all duration-500 hover:border-red-900/40 hover:shadow-[0_25px_60px_rgba(138,37,37,0.15)] bg-gradient-to-b hover:from-[#fcfcfc] hover:to-red-50/40 relative overflow-hidden group"
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-red-900/5 rounded-full blur-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div>
                      <div className="flex justify-between items-baseline mb-4">
                        <h4 className="text-2xl font-serif text-black font-medium">Ryo</h4>
                        <span className="text-[7px] font-mono tracking-wider text-[#8a2525] bg-red-50 border border-red-900/10 px-2 py-0.5 rounded-full font-bold">1640 AD</span>
                      </div>
                      <span className="text-[8px] font-bold tracking-[0.15em] text-[#8a2525] uppercase block mb-4 font-sans">The Displaced Samurai</span>
                      <p className="text-[11px] text-black/60 leading-relaxed font-light font-sans">
                        A Kanei-era warrior bound by silent honor, duty, and pre-ordained battle-death under the Edo rain. Thrust violently into Shibuya's concrete canyons, Ryo struggles to reconcile his historical identity with the simple peace of a modern world he never imagined possible.
                      </p>
                    </div>
                    <div className="font-script text-base text-red-950/50 border-l border-red-900/20 pl-3">
                      "History demands my path. Yet this modern sun is so warm."
                    </div>
                  </motion.div>

                  {/* Aiko */}
                  <motion.div 
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    whileHover={{ y: -10, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onMouseEnter={() => handleCursorChange('anomaly', 'present')}
                    onMouseLeave={() => handleCursorChange('default')}
                    className="bg-[#fcfcfc]/80 backdrop-blur-sm border border-black/[0.04] p-8 rounded-sm shadow-[0_10px_30px_rgba(0,0,0,0.02)] flex flex-col justify-between h-full min-h-[24rem] transition-all duration-500 hover:border-cyan-500/40 hover:shadow-[0_25px_60px_rgba(6,182,212,0.15)] bg-gradient-to-b hover:from-[#fcfcfc] hover:to-cyan-50/40 relative overflow-hidden group"
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-400/5 rounded-full blur-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div>
                      <div className="flex justify-between items-baseline mb-4">
                        <h4 className="text-2xl font-serif text-black font-medium">Aiko</h4>
                        <span className="text-[7px] font-mono tracking-wider text-cyan-600 bg-cyan-50 border border-cyan-500/10 px-2 py-0.5 rounded-full font-bold">2026 AD</span>
                      </div>
                      <span className="text-[8px] font-bold tracking-[0.15em] text-cyan-600 uppercase block mb-4 font-sans">The Tokyo Dreamer</span>
                      <p className="text-[11px] text-black/60 leading-relaxed font-light font-sans">
                        A modern city-dweller suffocated by the heavy expectations of school, family, and a mapped-out Tokyo future. In Ryo's displaced silence, she discovers a shared feeling of exile and finds the courage to treat her own future as an unwritten chronicle.
                      </p>
                    </div>
                    <div className="font-script text-base text-cyan-950/50 border-l border-cyan-500/20 pl-3">
                      "I close my eyes and realize our lives don't have to be pre-written."
                    </div>
                  </motion.div>

                  {/* Kenji */}
                  <motion.div 
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                    whileHover={{ y: -10, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onMouseEnter={() => handleCursorChange('anomaly', 'future')}
                    onMouseLeave={() => handleCursorChange('default')}
                    className="bg-[#fcfcfc]/80 backdrop-blur-sm border border-black/[0.04] p-8 rounded-sm shadow-[0_10px_30px_rgba(0,0,0,0.02)] flex flex-col justify-between h-full min-h-[24rem] transition-all duration-500 hover:border-amber-500/40 hover:shadow-[0_25px_60px_rgba(245,158,11,0.15)] bg-gradient-to-b hover:from-[#fcfcfc] hover:to-amber-50/40 relative overflow-hidden group"
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/5 rounded-full blur-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div>
                      <div className="flex justify-between items-baseline mb-4">
                        <h4 className="text-2xl font-serif text-black font-medium">Kenji</h4>
                        <span className="text-[7px] font-mono tracking-wider text-amber-600 bg-amber-50 border border-amber-500/10 px-2 py-0.5 rounded-full font-bold">2026 AD</span>
                      </div>
                      <span className="text-[8px] font-bold tracking-[0.15em] text-amber-600 uppercase block mb-4 font-sans">The Chrono-Architect</span>
                      <p className="text-[11px] text-black/60 leading-relaxed font-light font-sans">
                        A brilliant academic prodigy obsessed with bridging quantum physics and ancient lore. His experiments to isolate the shrine gate's energy triggers its temporal breakdown, forcing the group to choose their timeline.
                      </p>
                    </div>
                    <div className="font-script text-base text-amber-950/50 border-l border-amber-500/20 pl-3">
                      "Time is a series of calculations, and we just broke the equation."
                    </div>
                  </motion.div>
                </div>
              </div>
            </section>

            <footer className="py-16 md:py-24 bg-transparent text-center border-t border-black/[0.05]">
              <p className="text-[9px] tracking-[0.8em] text-black/40 uppercase font-sans">A Cinematic Storytelling Engine</p>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default App
