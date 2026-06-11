import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ArrowRight, Play, Check, CircleAlert, Globe, HelpCircle, ChevronLeft, ChevronRight, Video, Copy, ExternalLink } from 'lucide-react';
import CardCarousel3D from './components/CardCarousel3D';

interface VideoScrubberProps {
  src: string;
  className?: string;
  scrubMode?: 'mouse' | 'scroll';
}

function VideoScrubber({ src, className, scrubMode = 'mouse' }: VideoScrubberProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const prevXRef = useRef<number | null>(null);
  const targetTimeRef = useRef<number>(0);
  const isSeekingRef = useRef<boolean>(false);

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      targetTimeRef.current = videoRef.current.currentTime || 0;
    }
  };

  const handleSeeked = () => {
    isSeekingRef.current = false;
    const video = videoRef.current;
    if (!video) return;

    if (Math.abs(video.currentTime - targetTimeRef.current) > 0.01) {
      isSeekingRef.current = true;
      video.currentTime = targetTimeRef.current;
    }
  };

  useEffect(() => {
    if (scrubMode === 'scroll') {
      const handleScroll = () => {
        const video = videoRef.current;
        if (!video) return;

        const duration = video.duration;
        if (!duration || isNaN(duration)) return;

        // Calculate scroll progress across the document or viewport
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        if (scrollHeight <= 0) return;

        const scrollFraction = scrollTop / scrollHeight;
        const newTargetTime = scrollFraction * duration;
        
        targetTimeRef.current = Math.max(0, Math.min(duration, newTargetTime));

        if (!isSeekingRef.current) {
          isSeekingRef.current = true;
          video.currentTime = targetTimeRef.current;
        }
      };

      window.addEventListener('scroll', handleScroll, { passive: true });
      // Initial trigger to sync with scroll position
      handleScroll();

      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
    } else {
      const handleMouseMove = (e: MouseEvent) => {
        const video = videoRef.current;
        if (!video) return;

        const duration = video.duration;
        if (!duration || isNaN(duration)) return;

        const currentX = e.clientX;
        if (prevXRef.current === null) {
          prevXRef.current = currentX;
          return;
        }

        const delta = currentX - prevXRef.current;
        prevXRef.current = currentX;

        const SENSITIVITY = 0.8;
        const timeOffset = -(delta / window.innerWidth) * SENSITIVITY * duration;

        let newTargetTime = targetTimeRef.current + timeOffset;
        newTargetTime = Math.max(0, Math.min(duration, newTargetTime));
        targetTimeRef.current = newTargetTime;

        if (!isSeekingRef.current) {
          isSeekingRef.current = true;
          video.currentTime = targetTimeRef.current;
        }
      };

      window.addEventListener('mousemove', handleMouseMove);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
      };
    }
  }, [scrubMode]);

  return (
    <video
      ref={videoRef}
      src={src}
      muted
      playsInline
      preload="auto"
      onLoadedMetadata={handleLoadedMetadata}
      onSeeked={handleSeeked}
      className={className}
    />
  );
}

export default function App() {
  // Navigation active tab
  const tabs = ['Home', 'Inspiration', 'Videos', 'Production', 'Resources'];
  const [activeTab, setActiveTab] = useState('Home');

  // Graceful fallback lists for the Laptop Image to handle various git branch configurations
  const laptopImageCandidates = [
    "https://raw.githubusercontent.com/shanekfarrell/Forknite-III/main/assets/.aistudio/Laptop%20Image.png",
    "https://raw.githubusercontent.com/shanekfarrell/Forknite-III/master/assets/.aistudio/Laptop%20Image.png",
    "https://raw.githubusercontent.com/shanekfarrell/Forknite-II/main/assets/.aistudio/Laptop%20Image.png",
    "https://raw.githubusercontent.com/shanekfarrell/Forknite-II/master/assets/.aistudio/Laptop%20Image.png",
    "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80"
  ];
  const [laptopImgIndex, setLaptopImgIndex] = useState(0);

  // Cursor-driven parallax state
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Find coordinates relative to window center
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      const pctX = (e.clientX - centerX) / centerX;
      const pctY = (e.clientY - centerY) / centerY;
      
      // Shift limits: 25px max X, 15px max Y
      setMousePos({
        x: pctX * 25,
        y: pctY * 15
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Carousel Media Items (Matching screenshot style perfectly)
  const carouselItems = [
    {
      id: 1,
      title: 'How a reusable upper-stage program moved from thermal risk to stable qualification.',
      tag: 'Integration Review',
      image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
      video: 'https://d8j0ntlcm91z4.cloudfront.net/user_39hjpHRtdbwGsUr2vJ8EKY4rkvE/hf_20260601_120750_aab8806d-ef49-4055-81d2-32a482803ef1.mp4',
      duration: '04:20',
      category: 'Reusable systems',
    },
    {
      id: 2,
      title: 'Inside the test cell where telemetry, vibration, and injector response converge.',
      tag: 'Hot-Fire Campaign',
      image: 'https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?auto=format&fit=crop&w=1200&q=80',
      video: 'https://d8j0ntlcm91z4.cloudfront.net/user_39hjpHRtdbwGsUr2vJ8EKY4rkvE/hf_20260608_101316_f23416c8-9fd7-4564-9e44-065bccbbd56b.mp4',
      duration: '03:45',
      category: 'Validation',
    },
    {
      id: 3,
      title: 'Analyzing structural acoustics and modal resonance under high-stress entry phases.',
      tag: 'Structural Dynamics',
      image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80',
      video: 'https://d8j0ntlcm91z4.cloudfront.net/user_39hjpHRtdbwGsUr2vJ8EKY4rkvE/hf_20260611_121656_00824bdc-ec1a-4431-bb15-c83b19c83d52.mp4',
      duration: '05:12',
      category: 'Mechanical Studio',
    }
  ];

  const [carouselIndex, setCarouselIndex] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);

  // Boomerang effect video references & state tracking
  const videoRef = useRef<HTMLVideoElement>(null);
  const playDirectionRef = useRef<'forward' | 'reverse'>('forward');

  // Hook to handle the boomerang playback loop for the Inspiration tab video
  useEffect(() => {
    if (activeTab !== 'Inspiration') return;
    const video = videoRef.current;
    
    let rafId: number;
    let lastTime = performance.now();

    const updatePlay = (now: number) => {
      const currentVideo = videoRef.current;
      if (!currentVideo) {
        lastTime = now;
        rafId = requestAnimationFrame(updatePlay);
        return;
      }

      const duration = currentVideo.duration;
      const delta = (now - lastTime) / 1000;
      lastTime = now;

      if (duration && !isNaN(duration)) {
        if (playDirectionRef.current === 'reverse') {
          // Play backward
          if (!currentVideo.paused) {
            currentVideo.pause();
          }
          let newTime = currentVideo.currentTime - delta;
          if (newTime <= 0.05) {
            newTime = 0;
            playDirectionRef.current = 'forward';
            currentVideo.play().catch(() => {});
          }
          currentVideo.currentTime = newTime;
        } else {
          // Play forward
          if (currentVideo.paused) {
            currentVideo.play().catch(() => {});
          }
          if (currentVideo.currentTime >= duration - 0.08) {
            currentVideo.pause();
            playDirectionRef.current = 'reverse';
          }
        }
      }

      rafId = requestAnimationFrame(updatePlay);
    };

    if (video) {
      video.loop = false;
      video.play().catch(() => {});
    }
    
    rafId = requestAnimationFrame(updatePlay);

    return () => {
      cancelAnimationFrame(rafId);
      const currentVideo = videoRef.current;
      if (currentVideo) {
        currentVideo.pause();
      }
    };
  }, [activeTab]);

  const handleNext = () => {
    setCarouselIndex((prev) => (prev + 1) % carouselItems.length);
  };

  const handlePrev = () => {
    setCarouselIndex((prev) => (prev - 1 + carouselItems.length) % carouselItems.length);
  };



  // Modern high-end top navigation active state
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Testimonials Array
  const testimonials = [
    {
      id: 1,
      name: "Adrienne Youngman",
      quote: "Best Forknite since Forknite II",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&h=150&q=80",
      role: "Lead Systems Architect"
    },
    {
      id: 2,
      name: "Carolina Bastos",
      quote: "I came up with 'The Indie Web' - cool, eh?",
      avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=150&h=150&q=80",
      role: "Digital Concept Director"
    },
    {
      id: 3,
      name: "Shane Farrell",
      quote: "It's not lame to give a testimonial to yourself. You're lame.",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80",
      role: "Lead Platform Engineer"
    }
  ];

  // Tripling the list to ensure there's enough repetitive overflow content for a seamless, unbroken perpetual loop
  const marqueeItems = [...testimonials, ...testimonials, ...testimonials, ...testimonials];

  return (
    <div className="bg-white text-neutral-950 font-sans relative flex flex-col overflow-x-hidden select-none">
      
      {/* Toast Notification for premium feedback */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-neutral-900 text-white text-xs px-4 py-2.5 rounded-full shadow-lg flex items-center gap-2 border border-neutral-800"
          >
            <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HEADER RENDERING COMPONENT FUNCTION INLINE WITH LAYOUTS */}
      {/* We match navigation style exactly to screenshot 2 design */}
      {(() => {
        const renderHeader = (isDark: boolean) => (
          <header className="w-full py-6 px-6 md:px-12 lg:px-24 flex flex-col sm:flex-row items-center justify-between gap-4 z-40 relative">
            {/* Spacer replacing Myosin Logo to visually preserve header centering balance */}
            <div className="w-[120px] hidden sm:block" />

            {/* Dynamic Capsule Filter Toggle - Recreating screenshot style 2 exactly */}
            <nav className="relative">
              <div className={`p-1.5 rounded-full flex items-center gap-0.5 shadow-md liquid-glass ${isDark ? 'bg-black/30' : 'bg-white/30'}`}>
                {tabs.map((tab) => {
                  const isActive = activeTab === tab;
                  return (
                    <button
                      key={tab}
                      onClick={() => {
                        setActiveTab(tab);
                        triggerToast(`Navigated to ${tab}`);
                      }}
                      className="relative px-5 py-1.5 text-xs font-medium tracking-wide rounded-full transition-colors duration-200 cursor-pointer text-center whitespace-nowrap outline-none border-none liquid-glass"
                      style={{
                        color: isActive 
                          ? (isDark ? '#0a0a0c' : '#ffffff') 
                          : (isDark ? '#a3a3a3' : '#6b7280'),
                      }}
                      id={`nav-tab-${tab.toLowerCase()}`}
                    >
                      {/* Sliding pill container using Framer Motion */}
                      {isActive && (
                        <motion.div
                          layoutId="active-pill"
                          className={`absolute inset-0 rounded-full z-0 ${isDark ? 'bg-white' : 'bg-neutral-950'}`}
                          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                        />
                      )}
                      <span className="relative z-10 transition-colors">{tab}</span>
                    </button>
                  );
                })}
              </div>
            </nav>

            {/* Balance/alignment spacer replacing the status indicator */}
            <div className="w-10 hidden sm:block" />
          </header>
        );

        // Render Tab Routing Layout with absolute height alignments
        if (activeTab === 'Home') {
          return (
            <>
              {/* SECTION 1: HERO - Exactly 100vh (h-screen) */}
              <section className="w-full h-screen min-h-screen flex flex-col justify-between relative border-b border-neutral-100 bg-white">
                {renderHeader(false)}

                {/* Hero Main Body: Centered vertical content, aligned strictly in line with container grid */}
                <div className="flex-1 w-full max-w-7xl mx-auto px-6 md:px-16 lg:px-24 flex flex-col justify-center">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12 w-full items-center">
                    
                    {/* LEFT HALF SCREEN: Pristine Recreation of Screenshot 1 (Hero Section UI) */}
                    <div className="flex flex-col items-start text-left z-20 max-w-lg">
                      
                      {/* 1. Muted over-heading like "PUREFLOW ONE" in tiny spaced letters */}
                      <motion.span
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                        className="font-sans font-semibold tracking-[0.18em] text-neutral-400 text-[10px] md:text-xs uppercase mb-3.5 block"
                      >
                        Forknite II
                      </motion.span>

                      {/* 2. Hero Header Text: limited to left side, high weight, tracking-tight */}
                      <h1 className="font-display font-medium text-[40px] sm:text-[52px] md:text-[58px] lg:text-[68px] leading-[1.06] tracking-[-0.03em] text-neutral-900 mb-8 drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]">
                        The Indie Web:
                        <br />
                        High Quality AI Websites.
                      </h1>

                      {/* 3. Rebuilt dynamic action triggers aligned perfectly */}
                      <div className="flex flex-wrap items-center gap-4">
                        
                        {/* Discover Pill Button */}
                        <button
                          onClick={() => {
                            setActiveTab('Inspiration');
                            triggerToast('Navigated to Inspiration');
                          }}
                          className="px-8 py-3 text-neutral-950 text-xs font-semibold rounded-full shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer liquid-glass-strong bg-neutral-950/5 hover:bg-neutral-950/15"
                          id="btn-discover"
                        >
                          Discover
                        </button>

                      </div>

                    </div>

                    {/* RIGHT HALF SCREEN: Replaced with the user-provided Laptop image */}
                    <div className="hidden md:flex flex-col items-center justify-center p-4 h-full relative z-20 overflow-hidden">
                      <div className="w-full max-w-md aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border border-neutral-200/50 bg-[#c0c0c8]/20 flex items-center justify-center">
                        <img
                          src={laptopImageCandidates[laptopImgIndex]}
                          alt="Laptop Reference Layout"
                          className="w-full h-full object-cover select-none"
                          referrerPolicy="no-referrer"
                          onError={() => {
                            if (laptopImgIndex < laptopImageCandidates.length - 1) {
                              setLaptopImgIndex(prev => prev + 1);
                            }
                          }}
                        />
                      </div>
                    </div>

                  </div>
                </div>

                {/* Testimonials Marquee above the fold at the very bottom of Hero */}
                <div className="relative w-full overflow-hidden py-4 bg-neutral-50/40 border-t border-neutral-100/50 mt-auto select-none">
                  {/* Blur/Fade left & right */}
                  <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
                  <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

                  {/* Seamless horizontal sliding container track */}
                  <motion.div
                    className="flex gap-8 w-max pl-8"
                    animate={{ x: ["0%", "-50%"] }}
                    transition={{
                      repeat: Infinity,
                      repeatType: "loop",
                      duration: 27.5,
                      ease: "linear"
                    }}
                  >
                    {marqueeItems.map((item, idx) => (
                      <div
                        key={`${item.id}-${idx}`}
                        className="flex items-center gap-4 bg-white border border-neutral-100/90 rounded-xl p-4 shadow-xs max-w-sm shrink-0 select-none hover:shadow-xs"
                      >
                        {/* Circle avatar placeholder */}
                        <div className="w-10 h-10 rounded-full overflow-hidden bg-neutral-100 border border-neutral-150 shrink-0">
                          <img
                            src={item.avatar}
                            alt={item.name}
                            className="w-full h-full object-cover grayscale brightness-105"
                            referrerPolicy="no-referrer"
                          />
                        </div>

                        {/* Testimonial Quote and User Bio */}
                        <div className="flex flex-col text-left">
                          <p className="text-neutral-700 text-xs font-sans italic leading-relaxed mb-1 font-medium max-w-xs">
                            "{item.quote}"
                          </p>
                          <div className="flex items-center gap-1.5">
                            <h4 className="text-neutral-900 font-semibold text-[11px] tracking-wide">
                              {item.name}
                            </h4>
                          </div>
                        </div>
                      </div>
                    ))}
                  </motion.div>
                </div>
              </section>

              {/* SECTION 2: CAROUSEL - Exactly 100vh (h-screen), perfectly aligned and sitting completely below the fold */}
              <section ref={sectionRef} className="w-full h-screen min-h-screen flex flex-col justify-center bg-white relative">
                <div className="w-full max-w-7xl mx-auto px-6 md:px-16 lg:px-24">
                  
                  {/* Header block aligned to left grid alignment */}
                  <div className="w-full flex flex-col items-start">
                    
                    <div className="mb-8">
                      <span className="text-[10px] font-mono tracking-widest text-neutral-400 uppercase block mb-1">
                        PROTOTYPES
                      </span>
                      <h2 className="font-display font-medium text-xl sm:text-2xl tracking-tight text-neutral-900">
                        Interactive Systems Deck
                      </h2>
                    </div>

                    {/* Expands placeholder containers: We display 3 cards side-by-side with proportional scaling matching exactly 1.0, 2/3, and 1/3 width ratios. Height is identical, aligning perfectly. */}
                    <div className="w-full flex flex-col md:flex-row items-start gap-10 mb-8">
                      {[0, 1, 2].map((offset) => {
                        // On mobile, only render the first target item to avoid scaling/overflow issues
                        const itemIndex = (carouselIndex + offset) % carouselItems.length;
                        const item = carouselItems[itemIndex];
                        
                        // Only the first one in the series is in full colour, the others are greyed out
                        const isMain = offset === 0;

                        // Determine sizes, column proportions and styles dynamically based on offsets
                        let containerClass = "";
                        let fontTagClass = "";
                        let fontTitleClass = "";
                        let fontMetaClass = "";

                        if (offset === 0) {
                          containerClass = "flex w-full md:flex-[3_3_0%] min-w-0 flex-col text-left group transition-all duration-300";
                          fontTagClass = "text-[11px] font-semibold text-neutral-800 tracking-wider mb-2.5 uppercase";
                          fontTitleClass = "text-[14px] sm:text-[15.5px] font-sans leading-relaxed text-neutral-600 mb-2.5 pr-2";
                          fontMetaClass = "text-[11px] font-mono text-neutral-400";
                        } else if (offset === 1) {
                          containerClass = "hidden md:flex flex-[2_2_0%] min-w-0 flex-col text-left group transition-all duration-300 opacity-80 hover:opacity-100";
                          fontTagClass = "text-[10px] font-semibold text-neutral-400 tracking-wider mb-2 uppercase";
                          fontTitleClass = "text-[12px] font-sans leading-normal text-neutral-400 mb-2 pr-1 line-clamp-2";
                          fontMetaClass = "text-[10px] font-mono text-neutral-400";
                        } else {
                          containerClass = "hidden md:flex flex-[1_1_0%] min-w-0 flex-col text-left group transition-all duration-300 opacity-60 hover:opacity-100";
                          fontTagClass = "text-[9px] font-semibold text-neutral-400 tracking-wider mb-1.5 uppercase";
                          fontTitleClass = "text-[10.5px] font-sans leading-normal text-neutral-400 mb-1.5 line-clamp-2";
                          fontMetaClass = "text-[9px] font-mono text-neutral-450";
                        }
                        
                        return (
                          <div 
                            key={`${item.id}-${offset}`} 
                            className={containerClass}
                          >
                            {/* Rounded Image/Video Container - Identical height for all three cards means they line up perfectly at both top and bottom! */}
                            <div className="w-full h-[220px] sm:h-[260px] md:h-[280px] lg:h-[330px] rounded-2xl overflow-hidden bg-neutral-100 relative shadow-md border border-neutral-200/40 mb-5 cursor-pointer">
                              {item.video ? (
                                <video
                                  src={item.video}
                                  autoPlay
                                  loop
                                  muted
                                  playsInline
                                  className={`w-full h-full object-cover transition-all duration-750 ease-out group-hover:scale-[1.03] ${
                                    isMain ? 'grayscale-0 contrast-100 brightness-105' : 'grayscale brightness-[0.75] contrast-[0.95] saturate-50'
                                  }`}
                                />
                              ) : (
                                <img
                                  src={item.image}
                                  alt={item.title}
                                  className={`w-full h-full object-cover transition-all duration-750 ease-out group-hover:scale-[1.03] ${
                                    isMain ? 'grayscale-0 contrast-100 brightness-100' : 'grayscale brightness-[0.75] contrast-[0.95] saturate-50'
                                  }`}
                                  referrerPolicy="no-referrer"
                                />
                              )}
                              
                              {/* Grey Overlayer for non-active cards */}
                              {!isMain && (
                                <div className="absolute inset-0 bg-neutral-900/40 mix-blend-color-burn pointer-events-none transition-all duration-300" />
                              )}
                              
                              {/* Hover status/Play overlay */}
                              <div className="absolute inset-0 bg-neutral-950/0 group-hover:bg-neutral-950/10 transition-all flex items-center justify-center">
                                <span className="w-12 h-12 rounded-full bg-white text-neutral-950 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-lg transform scale-90 group-hover:scale-100">
                                  <Play className="w-4 h-4 fill-neutral-950 text-neutral-950 ml-0.5" />
                                </span>
                              </div>

                              {/* Video playback layout badge */}
                              <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-md border border-white/15 text-white text-[10px] font-mono px-2.5 py-1 rounded-xs tracking-wider">
                                MP4
                              </div>
                            </div>

                            {/* Tag Category below the image */}
                            <span className={fontTagClass}>
                              {item.tag}
                            </span>

                            {/* Title / Description matching elegant description style */}
                            <h3 className={fontTitleClass}>
                              {item.title}
                            </h3>

                            {/* Metadata line with Category & Duration */}
                            <span className={fontMetaClass}>
                              {item.category} • {item.duration}
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Bottom Controls Panel: Progress Tracker on left, Chevron Arrows on right */}
                    <div className="w-full flex items-center justify-between mt-6">
                      
                      {/* Left: Progress bar + Page Indicator matching screenshot */}
                      <div className="flex items-center gap-4 flex-1 max-w-[280px]">
                        {/* Custom Track (represented by thin gray line) */}
                        <div className="h-[2px] bg-neutral-100 flex-1 rounded-full overflow-hidden relative">
                          {/* Custom active progress line transitioning beautifully */}
                          <motion.div
                            className="absolute top-0 left-0 h-full bg-neutral-950 rounded-full"
                            animate={{ width: `${((carouselIndex + 1) / carouselItems.length) * 100}%` }}
                            transition={{ type: 'spring', stiffness: 200, damping: 25 }}
                          />
                        </div>

                        {/* Number/Page Count Label */}
                        <span className="text-xs font-mono text-neutral-500 whitespace-nowrap">
                          {String(carouselIndex + 1).padStart(2, '0')} / {String(carouselItems.length).padStart(2, '0')}
                        </span>
                      </div>

                      {/* Right: Thin Chevron navigation triggers */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={handlePrev}
                          className="w-10 h-10 rounded-full border border-neutral-200 hover:border-neutral-400 text-neutral-500 hover:text-neutral-900 bg-white hover:bg-neutral-50 flex items-center justify-center active:scale-95 transition-all duration-200 cursor-pointer shadow-xs"
                          title="Previous Template"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button
                          onClick={handleNext}
                          className="w-10 h-10 rounded-full border border-neutral-200 hover:border-neutral-400 text-neutral-500 hover:text-neutral-900 bg-white hover:bg-neutral-50 flex items-center justify-center active:scale-95 transition-all duration-200 cursor-pointer shadow-xs"
                          title="Next Template"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>

                    </div>

                  </div>
                </div>
              </section>


            </>
          );
        }

        if (activeTab === 'Inspiration') {
          return (
            <>
              {/* SECTION 1: INSPIRATION ABOVE THE FOLD - 100vh with pure HD background video */}
              <section className="w-full h-screen min-h-screen flex flex-col justify-between relative overflow-hidden bg-black text-white">
                {/* Autoplay HD background loop - Managed to boomerang back and forth via playDirectionRef */}
                <video
                  ref={videoRef}
                  src="https://d8j0ntlcm91z4.cloudfront.net/user_39hjpHRtdbwGsUr2vJ8EKY4rkvE/hf_20260608_101316_f23416c8-9fd7-4564-9e44-065bccbbd56b.mp4"
                  autoPlay
                  muted
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none opacity-[0.88]"
                />

                {/* Ambient dark bottom/top split gradient mask for reading navigation options smoothly */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/30 z-10 pointer-events-none" />

                {/* Same Nav Bar rendered beautifully */}
                {renderHeader(true)}

                {/* Absolutely clean space. Nothing else visible except background loop video */}
                <div className="flex-1 w-full max-w-7xl mx-auto px-6 md:px-16 lg:px-24 flex flex-col justify-center items-center z-20 relative select-none pointer-events-none">
                  {/* Intentionally left blank as requested to let HD footage play cleanly */}
                </div>

                {/* Subtle Scroll Down cue */}
                <div className="py-6 z-20 relative flex flex-col items-center justify-center pointer-events-none select-none">
                  <span className="text-[10px] font-mono tracking-widest text-neutral-450 uppercase animate-bounce mb-1">
                    SCROLL DOWN
                  </span>
                  <div className="w-[1px] h-6 bg-white/20" />
                </div>
              </section>

              {/* SECTION 2: Below the fold Content for Inspiration Page - Premium 3-Column Deck mimicking attached style exactly */}
              <section className="w-full min-h-screen py-24 sm:py-32 flex flex-col justify-center bg-[#fafafa] text-neutral-900 relative border-t border-neutral-100 px-6 md:px-16 lg:px-24">
                <div className="w-full max-w-7xl mx-auto">
                  
                  {/* Top section small header */}
                  <div className="mb-16 text-left">
                    <span className="text-[10px] font-mono tracking-[0.2em] text-neutral-400 uppercase block mb-2.5">
                      INSPIRATION COMPASS
                    </span>
                    <h2 className="font-display font-medium text-3xl sm:text-4xl md:text-5xl tracking-tight text-neutral-950">
                      Capture and Refine Visual Ideas
                    </h2>
                  </div>

                  {/* Main Grid: 2 Columns matching screenshot style */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10 items-start">
                    
                    {/* COLUMN 1: WHAT TO SCREENSHOT */}
                    <div className="flex flex-col text-left group">
                                         {/* Logo Container - Only Pinterest */}
                      <div className="flex items-center justify-center h-[230px] mb-5 w-full bg-transparent border-0">
                        
                        {/* PINTEREST */}
                        <a 
                          href="https://pinterest.com" 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="flex flex-col items-center justify-center transition-transform duration-300 hover:scale-105"
                          title="Pinterest"
                          id="hyperlink_pinterest"
                        >
                          <img 
                            src="https://upload.wikimedia.org/wikipedia/commons/0/08/Pinterest-logo.png"
                            alt="Pinterest"
                            className="w-[120px] h-auto object-contain select-none"
                            referrerPolicy="no-referrer"
                          />
                        </a>

                      </div>

                      {/* Descriptive Paragraph below card */}
                      <div className="text-[#52525b] text-xs sm:text-[13.5px] leading-relaxed space-y-3.5">
                        <p>
                          Find a page — or a section of one — that you want to draw inspiration from. Look for:
                        </p>
                        <ul className="space-y-2 pl-1.5 text-[13px]">
                          <li className="flex items-start gap-2">
                            <span className="text-neutral-400 select-none">•</span>
                            <span>The hero copy and layout</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-neutral-400 select-none">•</span>
                            <span>The navigation bar</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-neutral-400 select-none">•</span>
                            <span>Buttons, toggles, or interactive elements</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-neutral-400 select-none">•</span>
                            <span>Any imagery that catches your eye</span>
                          </li>
                        </ul>
                        <p className="pt-2.5 text-xs text-neutral-400 italic">
                          Not sure what these terms mean?{' '}
                          <a 
                            href="/cheatsheet.html" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-neutral-600 hover:text-black underline font-semibold transition-colors cursor-pointer"
                          >
                            See Layout Cheat Sheet.
                          </a>
                        </p>
                      </div>

                    </div>

                    {/* COLUMN 2: GETTING YOUR IMAGE & OPTION A */}
                    <div className="flex flex-col text-left group">
                      
                      {/* Grey Rounded Box Container with full-size clickable image linking to Pinterest */}
                      <a 
                        href="https://pt.pinterest.com/pin/70228075435570408/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block bg-[#f2f2f5] rounded-[24px] overflow-hidden border border-neutral-200/40 relative h-[230px] transition-all duration-300 hover:shadow-sm cursor-pointer mb-5"
                      >
                        <img 
                          src="https://i.pinimg.com/webp87/1200x/e7/8b/a1/e78ba10e525de292567122689512bf96.webp"
                          alt="Screenshot Reference"
                          className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700 select-none"
                          referrerPolicy="no-referrer"
                        />
                      </a>

                      {/* Descriptive Paragraph below card */}
                      <div className="text-[#52525b] text-xs sm:text-[13.5px] leading-relaxed">
                        <ul className="space-y-4 list-none pl-0 text-[13px] text-[#52525b]">
                          <li className="flex items-start gap-2.5">
                            <span className="text-neutral-400 select-none">•</span>
                            <span>Screenshot what inspires you.</span>
                          </li>
                          <li className="flex items-start gap-2.5">
                            <span className="text-neutral-400 select-none">•</span>
                            <span>Ask an AI image tool to recreate the style in <span className="font-semibold text-neutral-800">"highly detailed, sharp, high resolution."</span></span>
                          </li>
                          <li className="flex items-start gap-2.5">
                            <span className="text-neutral-400 select-none">•</span>
                            <span><span className="font-semibold text-neutral-800">Pro Tip:</span> You can ask the AI image tool to <span className="italic">"Remove everything from the foreground. Return only the background scene."</span> (or vica versa).</span>
                          </li>
                        </ul>
                      </div>

                    </div>

                  </div>

                </div>
              </section>
            </>
          );
        }

        if (activeTab === 'Videos') {
          return (
            <>
              {/* SECTION 1: VIDEOS ABOVE THE FOLD - 100vh with the same colour scheme as Home */}
              <section className="w-full h-screen min-h-screen flex flex-col justify-between relative border-b border-neutral-100 bg-white">
                {renderHeader(false)}

                {/* Hero Main Body: Centered vertical content, aligned strictly in line with container grid */}
                <div className="flex-1 w-full max-w-7xl mx-auto px-6 md:px-16 lg:px-24 flex flex-col justify-center">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12 w-full items-center">
                    
                    {/* LEFT HALF SCREEN: Title same style/font as on the home page */}
                    <div className="flex flex-col items-start text-left z-20 max-w-lg">
                      
                      <span className="font-sans font-semibold tracking-[0.18em] text-neutral-400 text-[10px] md:text-xs uppercase mb-3.5 block">
                        VIBRANT MOTION
                      </span>

                      <h1 className="font-display font-medium text-[40px] sm:text-[52px] md:text-[58px] lg:text-[68px] leading-[1.06] tracking-[-0.03em] text-neutral-900 mb-8 drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]">
                        Animating your image:
                      </h1>

                      <p className="text-neutral-500 text-sm max-w-lg leading-relaxed font-sans mb-8">
                        Upload the image to a video generation tool and instruct it to animate. Explore our curated techniques, copy the prompts, and check the tools below.
                      </p>

                    </div>

                    {/* RIGHT HALF SCREEN: High-fidelity cursor-driven parallax video player replacing 'Motion canvas' button */}
                    <div className="hidden md:flex flex-col items-center justify-center p-8 h-full relative overflow-hidden flex-1">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div 
                          className="relative w-full max-w-[320px] aspect-[9/16] rounded-2xl overflow-hidden shadow-2xl border border-neutral-200/50 bg-[#0c0c10]"
                          style={{
                            transform: `translate(${mousePos.x}px, ${mousePos.y}px) scale(1.05)`,
                            transition: 'transform 0.1s ease-out'
                          }}
                        >
                          <VideoScrubber
                            src="https://d8j0ntlcm91z4.cloudfront.net/user_39hjpHRtdbwGsUr2vJ8EKY4rkvE/hf_20260611_121656_00824bdc-ec1a-4431-bb15-c83b19c83d52.mp4"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                    </div>

                  </div>
                </div>

                {/* Subtle Scroll Down cue */}
                <div className="py-6 z-20 relative flex flex-col items-center justify-center pointer-events-none select-none">
                  <span className="text-[10px] font-mono tracking-widest text-neutral-400 uppercase animate-bounce mb-1">
                    SCROLL DOWN
                  </span>
                  <div className="w-[1px] h-6 bg-neutral-200" />
                </div>
              </section>

              {/* SECTION 2: VIDEOS BELOW THE FOLD - Clean aesthetic styling */}
              <section className="w-full min-h-screen py-24 sm:py-32 flex flex-col justify-center bg-[#fafafa] text-neutral-900 relative border-t border-neutral-100 px-6 md:px-16 lg:px-24">
                <div className="w-full max-w-7xl mx-auto">
                  
                  {/* Small header */}
                  <div className="mb-16 text-left">
                    <span className="text-[10px] font-mono tracking-[0.2em] text-neutral-400 uppercase block mb-2.5">
                      GENERATION GUIDE
                    </span>
                    <h2 className="font-display font-medium text-3xl sm:text-4xl md:text-5xl tracking-tight text-neutral-950">
                      Animating your image
                    </h2>
                  </div>

                  {/* Main content grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                    
                    {/* Left block - Tool Options (width-5/12 approx) */}
                    <div className="lg:col-span-5 space-y-8 text-left">
                      <h3 className="text-lg font-semibold text-neutral-950 tracking-tight border-b border-neutral-200 pb-3">
                        Tool options:
                      </h3>
                      
                      <div className="space-y-6">
                        {/* Meta AI */}
                        <div className="group">
                          <h4 className="text-sm font-semibold text-neutral-900 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-[#1877f2]" />
                            meta.ai
                          </h4>
                          <p className="text-[13px] text-[#52525b] mt-1.5 leading-relaxed">
                            <span className="font-medium text-neutral-800">free, no account required</span>, good starting point. Upload your image and describe the motion you want. <span className="text-neutral-400 italic text-xs">(Drawback: you’ll have to then upload the video to YouTube or Github before you can add it to AI Studio)</span>
                          </p>
                        </div>

                        {/* Kling */}
                        <div className="group">
                          <h4 className="text-sm font-semibold text-neutral-900 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-[#ff3366]" />
                            Kling
                          </h4>
                          <p className="text-[13px] text-[#52525b] mt-1.5 leading-relaxed">
                            <span className="font-medium text-neutral-800">free daily credits</span> on signup. Go to <a href="https://app.klingai.com/global" target="_blank" rel="noopener noreferrer" className="text-neutral-700 underline hover:text-black font-semibold">app.klingai.com/global</a>. Free tier outputs carry a watermark.
                          </p>
                        </div>

                        {/* Midjourney */}
                        <div className="group">
                          <h4 className="text-sm font-semibold text-neutral-900 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-[#34d399]" />
                            Midjourney
                          </h4>
                          <p className="text-[13px] text-[#52525b] mt-1.5 leading-relaxed">
                            <span className="font-medium text-neutral-800">premium cinematic assets</span>. Go to <a href="https://www.midjourney.com/explore?tab=video_top" target="_blank" rel="noopener noreferrer" className="text-neutral-700 underline hover:text-black font-semibold">midjourney.com</a>. The advantage here is you can right click on a video, open it and it is hosted by Midjourney. That means you can just copy the URL and insert it in your video.
                          </p>
                        </div>

                        {/* Higgsfield */}
                        <div className="group">
                          <h4 className="text-sm font-semibold text-neutral-900 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-[#8a2be2]" />
                            Higgsfield
                          </h4>
                          <p className="text-[13px] text-[#52525b] mt-1.5 leading-relaxed">
                            <span className="font-medium text-neutral-800">the premium option</span>. Gives you access to Kling, Seedance, and other models in one platform. Go to <a href="https://higgsfield.ai" target="_blank" rel="noopener noreferrer" className="text-neutral-700 underline hover:text-black font-semibold">higgsfield.ai</a>.
                          </p>
                        </div>
                      </div>

                      {/* Video File Guidance */}
                      <div className="bg-neutral-100/50 rounded-2xl p-6 border border-neutral-200/50 mt-8">
                        <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-800 mb-3 flex items-center gap-2">
                          <CircleAlert className="w-3.5 h-3.5 text-neutral-500" />
                          Video file guidance:
                        </h4>
                        <ul className="space-y-2 list-none pl-0 text-[12.5px] text-[#52525b]">
                          <li className="flex items-start gap-2">
                            <span className="text-neutral-400 select-none">•</span>
                            <span>Use <span className="font-bold text-neutral-800">MP4 (H.264)</span> as the primary format</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-neutral-400 select-none">•</span>
                            <span>Add <span className="font-bold text-neutral-800">WebM</span> as a fallback</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-neutral-400 select-none">•</span>
                            <span>Target <span className="font-bold text-neutral-800">under 8MB</span>. Under 5MB is better.</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-neutral-400 select-none">•</span>
                            <span><span className="font-bold text-neutral-800">Strip the audio track</span> — background videos don't need sound and removing it saves file size.</span>
                          </li>
                        </ul>
                      </div>
                    </div>

                    {/* Right block - Techniques & Prompts (width-7/12 approx) */}
                    <div className="lg:col-span-7 space-y-10 text-left">
                      <h3 className="text-lg font-semibold text-neutral-950 tracking-tight border-b border-neutral-200 pb-3">
                        Three video techniques to demonstrate:
                      </h3>

                      <div className="space-y-8">
                        {/* 1. Looping video */}
                        <div className="bg-white rounded-[20px] p-6 border border-neutral-200/40 shadow-xs">
                          <h4 className="text-[15px] font-bold text-neutral-950 mb-2">1. Looping video</h4>
                          <p className="text-[13px] text-[#52525b] leading-relaxed mb-4">
                            The video plays continuously. The key is making the end frame match the start so there is no jarring cut. Alternatively, use a boomerang effect: the video plays forward, then reverses back to the beginning. Prompt the AI:
                          </p>
                          <div className="bg-neutral-50 rounded-xl p-4 border border-neutral-200/40 text-[12.5px] font-mono text-neutral-800 relative group/copy">
                            <button 
                              onClick={() => {
                                navigator.clipboard.writeText('Reverse the video once it finishes so it loops smoothly from end to beginning.');
                                triggerToast('Copied Prompt 1');
                              }}
                              className="absolute right-3 top-3 text-[10px] font-mono font-medium text-neutral-500 hover:text-neutral-950 liquid-glass px-2 py-0.5 rounded cursor-pointer border border-neutral-200"
                            >
                              Copy
                            </button>
                            "Reverse the video once it finishes so it loops smoothly from end to beginning."
                          </div>
                        </div>

                        {/* 2. Scroll-controlled video */}
                        <div className="bg-white rounded-[20px] p-6 border border-neutral-200/40 shadow-xs">
                          <h4 className="text-[15px] font-bold text-neutral-950 mb-2">2. Scroll-controlled video</h4>
                          <p className="text-[13px] text-[#52525b] leading-relaxed mb-4">
                            Video playback is tied to the user's scroll position. Scroll down — video plays forward. Scroll up — it reverses. Works well for tunnel effects, doors opening, or an object spinning as you scroll.
                          </p>
                          <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-neutral-400 block mb-2">Prompt you can copy:</span>
                          <div className="bg-neutral-50 rounded-xl p-4 border border-neutral-200/40 text-[12px] font-mono text-neutral-800 relative group/copy leading-relaxed">
                            <button 
                              onClick={() => {
                                navigator.clipboard.writeText(`The video is set to muted, playsInline, preload="auto" and does NOT autoplay. Use a mousemove event listener on window. Track prevX, compute delta = currentX - prevX, convert to a time offset: (delta / window.innerWidth) * SENSITIVITY * video.duration where SENSITIVITY = 0.8. Clamp targetTime between 0 and video.duration. Use video.currentTime to seek, and an onSeeked handler to queue the next seek if targetTime has moved, to prevent seek-flooding.`);
                                triggerToast('Copied Prompt 2');
                              }}
                              className="absolute right-3 top-3 text-[10px] font-mono font-medium text-neutral-500 hover:text-neutral-950 liquid-glass px-2 py-0.5 rounded cursor-pointer border border-neutral-200"
                            >
                              Copy
                            </button>
                            The video is set to muted, playsInline, preload="auto" and does NOT autoplay. Use a mousemove event listener on window. Track prevX, compute delta = currentX - prevX, convert to a time offset: (delta / window.innerWidth) * SENSITIVITY * video.duration where SENSITIVITY = 0.8. Clamp targetTime between 0 and video.duration. Use video.currentTime to seek, and an onSeeked handler to queue the next seek if targetTime has moved, to prevent seek-flooding.
                          </div>
                        </div>

                        {/* 3. Cursor-driven image */}
                        <div className="bg-white rounded-[20px] p-6 border border-neutral-200/40 shadow-xs">
                          <h4 className="text-[15px] font-bold text-neutral-950 mb-2">3. Cursor-driven image</h4>
                          <p className="text-[13px] text-[#52525b] leading-relaxed mb-4">
                            The background image reacts to mouse movement. Move the cursor right — the image shifts right. Move it left — it shifts left. Works with a static image. No video required.
                          </p>
                          <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-neutral-400 block mb-2">Prompt you can copy:</span>
                          <div className="bg-neutral-50 rounded-xl p-4 border border-neutral-200/40 text-[12px] font-mono text-neutral-800 relative group/copy leading-relaxed">
                            <button 
                              onClick={() => {
                                navigator.clipboard.writeText(`The video is muted, playsInline, preload="auto". It does NOT autoplay.\nThe video scrubs forward/backward based on horizontal mouse movement. Use a mousemove event listener on window. Track prevX, compute delta = currentX - prevX, convert to a time offset: (delta / window.innerWidth) * SENSITIVITY * video.duration where SENSITIVITY = 0.8. Clamp targetTime between 0 and video.duration. Use video.currentTime to seek, and an onSeeked handler to queue the next seek if targetTime has moved, preventing seek-flooding.`);
                                triggerToast('Copied Prompt 3');
                              }}
                              className="absolute right-3 top-3 text-[10px] font-mono font-medium text-neutral-500 hover:text-neutral-950 liquid-glass px-2 py-0.5 rounded cursor-pointer border border-neutral-200"
                            >
                              Copy
                            </button>
                            The video is muted, playsInline, preload="auto". It does NOT autoplay.
                            The video scrubs forward/backward based on horizontal mouse movement. Use a mousemove event listener on window. Track prevX, compute delta = currentX - prevX, convert to a time offset: (delta / window.innerWidth) * SENSITIVITY * video.duration where SENSITIVITY = 0.8. Clamp targetTime between 0 and video.duration. Use video.currentTime to seek, and an onSeeked handler to queue the next seek if targetTime has moved, preventing seek-flooding.
                          </div>
                        </div>

                        {/* Important Overlay warning */}
                        <div className="bg-[#fff9db] border border-[#ffe066] rounded-2xl p-5 text-neutral-800">
                          <h5 className="font-semibold text-neutral-900 block mb-1.5 flex items-center gap-2 text-sm">
                            ⚠️ Important — remove the overlay:
                          </h5>
                          <p className="text-[12.5px] leading-relaxed mb-3">
                            AI builders default to adding a dark overlay on background videos so white text is readable. This kills the colour and vibrancy of the video. Always prompt:
                          </p>
                          <div className="bg-white/75 rounded-lg p-3 font-mono text-xs border border-[#ffe066]/60 relative">
                            <button 
                              onClick={() => {
                                navigator.clipboard.writeText('Remove all overlays. Set the video opacity to 100%. Adjust text colour for contrast instead of adding a dark overlay.');
                                triggerToast('Copied overlay prompt');
                              }}
                              className="absolute right-2 top-2 text-[9px] font-mono text-neutral-500 hover:text-neutral-950 liquid-glass px-1.5 py-0.5 rounded cursor-pointer border border-[#ffe066]/40"
                            >
                              Copy
                            </button>
                            "Remove all overlays. Set the video opacity to 100%. Adjust text colour for contrast instead of adding a dark overlay."
                          </div>
                        </div>

                      </div>

                    </div>

                  </div>

                </div>
              </section>
            </>
          );
        }

        if (activeTab === 'Production') {
          return (
            <>
              {/* SECTION 1: PRODUCTION ABOVE THE FOLD - bg-black with white typography */}
              <section className="w-full h-screen min-h-screen flex flex-col justify-between relative bg-black text-white">
                {renderHeader(true)}

                {/* Hero Main Body */}
                <div className="flex-1 w-full max-w-7xl mx-auto px-6 md:px-16 lg:px-24 flex flex-col justify-center">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12 w-full items-center">
                    
                    {/* LEFT HALF - Removing the background box card & padding, directly integrating flat layout */}
                    <div className="flex flex-col items-start text-left z-20 max-w-xl text-white">
                      <span className="font-sans font-semibold tracking-[0.18em] text-neutral-400 text-[10px] md:text-xs uppercase mb-3.5 block">
                        PRODUCTION ORCHESTRATION
                      </span>

                      <h1 className="font-display font-medium text-[36px] sm:text-[44px] md:text-[48px] lg:text-[52px] leading-[1.08] tracking-[-0.03em] text-white mb-6">
                        Build it in Google AI Studio or Claude Code.
                      </h1>

                      <p className="text-neutral-300 text-sm max-w-md leading-relaxed font-sans mb-7">
                        Go to <a href="https://aistudio.google.com" target="_blank" rel="noopener noreferrer" className="font-semibold text-white underline hover:text-neutral-200">aistudio.google.com</a> and click <span className="font-semibold text-white">Build</span> to configure custom visual experiences in an instant - or use a Pro Claude Code Account.
                      </p>

                      <a
                        href="https://aistudio.google.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-8 py-3 text-white text-xs font-semibold rounded-full shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer flex items-center gap-2 liquid-glass-strong hover:bg-white/10"
                        id="btn-goto-aistudio"
                      >
                        <span className="text-white">Go to aistudio.google.com</span>
                        <ArrowRight className="w-3.5 h-3.5 text-white" />
                      </a>
                    </div>

                    {/* RIGHT HALF - High-fidelity video block with scroll-driven interactive scrubbing */}
                    <div className="hidden md:flex flex-col items-center justify-center p-8 h-full relative overflow-hidden flex-1">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div 
                          className="relative w-full h-[60vh] max-h-[550px] rounded-3xl overflow-hidden shadow-[0_25px_50px_-12px_rgba(0,0,0,0.45)] border border-neutral-200/40 bg-[#0c0c10]"
                          style={{
                            transform: `translate(${mousePos.x}px, ${mousePos.y}px) scale(1.05)`,
                            transition: 'transform 0.1s ease-out'
                          }}
                        >
                          <VideoScrubber
                            src="https://cdn.midjourney.com/video/b9cbe0f6-7646-40e3-a5ba-40ceb8a64661/0.mp4"
                            className="w-full h-full object-cover"
                            scrubMode="scroll"
                          />
                        </div>
                      </div>
                    </div>

                  </div>
                </div>

                {/* Subtle Scroll Down cue */}
                <div className="py-6 z-20 relative flex flex-col items-center justify-center pointer-events-none select-none">
                  <span className="text-[10px] font-mono tracking-widest text-[#71717a] uppercase animate-bounce mb-1">
                    SCROLL DOWN
                  </span>
                  <div className="w-[1px] h-6 bg-neutral-800" />
                </div>
              </section>

              {/* SECTION 2: THE SEQUENCE STEP 1 & 2 - Pure White Background B&W */}
              <section className="w-full h-screen min-h-screen py-12 flex flex-col justify-center bg-white text-neutral-900 relative px-6 md:px-16 lg:px-24">
                <div className="w-full max-w-7xl mx-auto">
                  
                  {/* Small Header */}
                  <div className="mb-16 text-left">
                    <span className="text-[10px] font-mono tracking-[0.2em] text-[#71717a] uppercase block mb-2.5">
                      STEP-BY-STEP DESIGN • PHASE I
                    </span>
                    <h2 className="font-display font-medium text-3xl sm:text-4xl md:text-5xl tracking-tight text-neutral-950">
                      The Sequence: Inception
                    </h2>
                    <p className="text-neutral-500 text-xs sm:text-sm mt-3 max-w-md">
                      Initiating the workspace, uploading base assets, and projecting cinematic layers.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
                    
                    {/* Step 1 - Liquid Glass layout */}
                    <div className="liquid-glass text-neutral-900 rounded-2xl p-6 sm:p-8 bg-white/60 !border !border-neutral-300/80 shadow-[0_4px_24px_rgba(0,0,0,0.04)] space-y-4 relative">
                      <div className="flex items-center gap-2.5">
                        <span className="text-xs font-mono font-bold text-neutral-400">01</span>
                        <h3 className="text-base font-semibold text-neutral-950">Upload Reference & Base Layout</h3>
                      </div>
                      <p className="text-[13px] text-neutral-600 leading-relaxed">
                        Upload your reference screenshots. Add the nav bar, hero layout, and any elements you captured earlier. Prompt:
                      </p>
                      
                      <div className="bg-neutral-50/70 backdrop-blur-md rounded-xl p-4 border border-neutral-200/40 text-[12px] font-mono text-neutral-800 relative leading-relaxed">
                        <button 
                          onClick={() => {
                            navigator.clipboard.writeText('Build me a hero section exactly as in this image — same font weight, same positioning, same spacing hierarchy. Do not use your default layout.');
                            triggerToast('Copied Prompt 1');
                          }}
                          className="absolute right-3 top-3 text-[10px] font-mono font-medium text-neutral-500 hover:text-neutral-950 liquid-glass px-2 py-0.5 rounded cursor-pointer"
                        >
                          Copy
                        </button>
                        "Build me a hero section exactly as in this image — same font weight, same positioning, same spacing hierarchy. Do not use your default layout."
                      </div>

                      <div className="bg-neutral-50/50 backdrop-blur-md rounded-xl p-4 border border-neutral-200/40 text-xs text-neutral-500 leading-relaxed">
                        <span className="font-bold text-neutral-800 block mb-0.5">PRO TIP — THE 100VH RULE:</span>
                        Tell the AI to make every section <span className="font-mono text-neutral-950 font-semibold bg-neutral-200/50 px-1.5 py-0.5 rounded">100VH</span>. It gives the content breathing room.
                      </div>
                    </div>

                    {/* Step 2 - Liquid Glass layout */}
                    <div className="liquid-glass text-neutral-900 rounded-2xl p-6 sm:p-8 bg-white/60 !border !border-neutral-300/80 shadow-[0_4px_24px_rgba(0,0,0,0.04)] space-y-4 relative">
                      <div className="flex items-center gap-2.5">
                        <span className="text-xs font-mono font-bold text-neutral-400">02</span>
                        <h3 className="text-base font-semibold text-neutral-950">Add Video Background</h3>
                      </div>
                      <p className="text-[13px] text-neutral-600 leading-relaxed">
                        Add your video background. Right-click your video and open it in a new tab. Copy that URL. In AI Studio, prompt:
                      </p>

                      <div className="bg-neutral-50/70 backdrop-blur-md rounded-xl p-4 border border-neutral-200/40 text-[12px] font-mono text-neutral-800 relative leading-relaxed">
                        <button 
                          onClick={() => {
                            navigator.clipboard.writeText('Replace the background with this video: [URL].');
                            triggerToast('Copied Prompt 2');
                          }}
                          className="absolute right-3 top-3 text-[10px] font-mono font-medium text-neutral-500 hover:text-neutral-950 liquid-glass px-2 py-0.5 rounded cursor-pointer"
                        >
                          Copy
                        </button>
                        "Replace the background with this video: [URL]."
                      </div>

                      <p className="text-[12.5px] text-neutral-600 leading-relaxed">
                        Then specify the behaviour — loop, play once, or scroll-controlled.
                      </p>

                      <div className="bg-neutral-50/50 backdrop-blur-md rounded-xl p-4 border border-neutral-200/40 text-xs text-neutral-500 leading-relaxed">
                        <span className="font-bold text-neutral-800 block mb-0.5">SET EXPLICIT BEHAVIOR:</span>
                        The AI will default to looping with a dark overlay unless told otherwise. Be specific about which of the three techniques you want.
                      </div>
                    </div>

                  </div>

                </div>
              </section>

              {/* SECTION 3: THE SEQUENCE STEP 3 & 4 - Pure White Background B&W */}
              <section className="w-full h-screen min-h-screen py-12 flex flex-col justify-center bg-white text-neutral-900 relative px-6 md:px-16 lg:px-24">
                <div className="w-full max-w-7xl mx-auto">
                  
                  {/* Small Header */}
                  <div className="mb-16 text-left">
                    <span className="text-[10px] font-mono tracking-[0.2em] text-[#71717a] uppercase block mb-2.5">
                      STEP-BY-STEP DESIGN • PHASE II
                    </span>
                    <h2 className="font-display font-medium text-3xl sm:text-4xl md:text-5xl tracking-tight text-neutral-950">
                      The Sequence: Refinement
                    </h2>
                    <p className="text-neutral-500 text-xs sm:text-sm mt-3 max-w-md font-sans">
                      Correcting responsive layouts, checking breakpoint shifts, and polishing display typography.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
                    
                    {/* Step 3 - Liquid Glass layout */}
                    <div className="liquid-glass text-neutral-900 rounded-2xl p-6 sm:p-8 bg-white/60 !border !border-neutral-300/80 shadow-[0_4px_24px_rgba(0,0,0,0.04)] space-y-4 relative">
                      <div className="flex items-center gap-2.5">
                        <span className="text-xs font-mono font-bold text-neutral-400">03</span>
                        <h3 className="text-base font-semibold text-neutral-950">Check Mobile</h3>
                      </div>
                      <p className="text-[13px] text-neutral-600 leading-relaxed">
                        Resize your browser to 390px wide. If anything breaks, prompt:
                      </p>

                      <div className="bg-neutral-50/70 backdrop-blur-md rounded-xl p-4 border border-neutral-200/40 text-[12px] font-mono text-neutral-800 relative leading-relaxed">
                        <button 
                          onClick={() => {
                            navigator.clipboard.writeText('Optimise for mobile. Stack sections vertically. Make the headline font size 32px minimum. Ensure the CTA button is full width and thumb-reachable.');
                            triggerToast('Copied Prompt 3');
                          }}
                          className="absolute right-3 top-3 text-[10px] font-mono font-medium text-neutral-500 hover:text-neutral-950 liquid-glass px-2 py-0.5 rounded cursor-pointer"
                        >
                          Copy
                        </button>
                        "Optimise for mobile. Stack sections vertically. Make the headline font size 32px minimum. Ensure the CTA button is full width and thumb-reachable."
                      </div>
                    </div>

                    {/* Step 4 - Liquid Glass layout */}
                    <div className="liquid-glass text-neutral-900 rounded-2xl p-6 sm:p-8 bg-white/60 !border !border-neutral-300/80 shadow-[0_4px_24px_rgba(0,0,0,0.04)] space-y-4 relative">
                      <div className="flex items-center gap-2.5">
                        <span className="text-xs font-mono font-bold text-neutral-400">04</span>
                        <h3 className="text-base font-semibold text-neutral-950">Refine Typography</h3>
                      </div>
                      <p className="text-[13px] text-neutral-600 leading-relaxed">
                        AI defaults to Inter, Roboto, or Arial. These signal "generated." Download Helvetica Neue and prompt:
                      </p>

                      <div className="bg-neutral-50/70 backdrop-blur-md rounded-xl p-4 border border-neutral-200/40 text-[12px] font-mono text-neutral-800 relative leading-relaxed">
                        <button 
                          onClick={() => {
                            navigator.clipboard.writeText('Use Helvetica Neue for all sans-serif elements. Do not fall back to system fonts.');
                            triggerToast('Copied Prompt 4');
                          }}
                          className="absolute right-3 top-3 text-[10px] font-mono font-medium text-neutral-500 hover:text-neutral-950 liquid-glass px-2 py-0.5 rounded cursor-pointer"
                        >
                          Copy
                        </button>
                        "Use Helvetica Neue for all sans-serif elements. Do not fall back to system fonts."
                      </div>

                      <p className="text-[12.5px] text-neutral-550 leading-relaxed">
                        Or find a font you like on <a href="https://fontshare.com" target="_blank" rel="noopener noreferrer" className="font-semibold text-neutral-800 hover:text-black underline">fontshare.com</a>, 100% free & higher quality than most Google Fonts.
                      </p>
                    </div>

                  </div>

                </div>
              </section>

              {/* SECTION 4: THE MATRIX CRITERIA - Pure White Background B&W */}
              <section className="w-full h-screen min-h-screen py-12 flex flex-col justify-center bg-white text-neutral-900 relative px-6 md:px-16 lg:px-24">
                <div className="w-full max-w-7xl mx-auto flex items-center justify-center">
                  
                  <div className="w-full max-w-3xl liquid-glass text-neutral-900 rounded-[32px] p-8 sm:p-12 bg-white/40 border border-neutral-200/50 shadow-xl relative overflow-hidden">
                    
                    <div className="absolute top-0 right-0 w-32 h-32 bg-neutral-950/5 rounded-bl-full pointer-events-none flex items-center justify-center">
                      <Check className="w-10 h-10 text-neutral-400/20 transform translate-x-4 -translate-y-4" />
                    </div>

                    <span className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase block mb-2 font-semibold">
                      CRITERIA MATRIX
                    </span>
                    
                    <h3 className="text-2xl sm:text-3xl font-display font-semibold text-neutral-950 mb-6">
                      Know when to stop.
                    </h3>

                    <p className="text-sm text-neutral-600 leading-relaxed mb-8">
                      Ask yourself four questions before prompting again:
                    </p>

                    {/* Checklist items */}
                    <div className="space-y-6">
                      {[
                        { q: "Is the headline clear?", desc: "Perfect syntax, high weight and legibility." },
                        { q: "Is the CTA visible without scrolling?", desc: "Sits comfortably above the fold." },
                        { q: "Does it work on mobile?", desc: "Stops overlaps and scales typography down correctly." },
                        { q: "Does the background enhance rather than distract?", desc: "Harmonious balance without overpowering overlays." }
                      ].map((item, index) => (
                        <div key={index} className="flex gap-4 items-start border-b border-neutral-200/50 pb-4 last:border-0 last:pb-0">
                          <span className="w-6 h-6 rounded-full border border-neutral-300 bg-neutral-100 flex items-center justify-center flex-shrink-0 text-xs font-bold text-neutral-900 mt-0.5 select-none">
                            ✓
                          </span>
                          <div>
                            <h4 className="text-base font-semibold text-neutral-950">{item.q}</h4>
                            <p className="text-xs text-neutral-500 mt-0.5">{item.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <p className="text-sm text-neutral-600 leading-relaxed mt-8">
                      If yes to all <span className="font-semibold text-neutral-950">four</span> — you are done.
                    </p>

                    <div className="mt-8 pt-6 border-t border-neutral-200/50 flex items-center justify-between text-[10.5px] font-mono text-neutral-450 select-none">
                      <span>blueprint verified</span>
                      <span className="text-neutral-950 font-semibold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-neutral-950" />
                        OPTIMIZED
                      </span>
                    </div>

                  </div>
                </div>
              </section>
            </>
          );
        }

        // resources page!
        if (activeTab === 'Resources') {
          return (
            <>
              {/* SECTION 1: WEBSITES FOR INSPIRATION */}
              <section className="w-full min-h-screen py-16 flex flex-col justify-between bg-white text-neutral-900 relative">
                {renderHeader(false)}

                <div className="flex-1 w-full max-w-7xl mx-auto px-6 md:px-16 lg:px-24 flex flex-col justify-center">
                  <div className="mb-12 text-left">
                    <span className="font-sans font-semibold tracking-[0.18em] text-neutral-400 text-[10px] md:text-xs uppercase mb-3 block">
                      CREATIVE EXPLORATION
                    </span>
                    <h1 className="font-display font-medium text-[40px] sm:text-[52px] md:text-[58px] lg:text-[68px] leading-[1.06] tracking-[-0.03em] text-neutral-900 animate-[fadeIn_0.6s_ease-out]">
                      Websites for Inspiration
                    </h1>
                  </div>

                  {/* 3D Cylinder Carousel matching original visual guidelines */}
                  <a 
                    href="https://motionsites.ai" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="block relative w-full h-[60vh] min-h-[420px] bg-black rounded-3xl overflow-hidden border border-neutral-900 hover:border-neutral-700 transition-colors shadow-2xl z-20 mb-16 cursor-pointer"
                  >
                    <CardCarousel3D />
                  </a>

                  {/* High fidelity layout featuring carefully separated resources inside cards */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    
                    {/* LEFT PANEL: COMBINED MAIN PREMIUM CURATORS & CREATORS */}
                    <div className="lg:col-span-5 space-y-6">
                      <div className="mb-2">
                        <span className="text-[10px] font-mono tracking-widest text-[#52525b] uppercase font-semibold">
                          CREATOR SPOTLIGHTS
                        </span>
                      </div>

                      {/* Viktor Oddy Card */}
                      <div 
                        className="bg-neutral-950 text-white rounded-2xl p-7 border border-neutral-850 relative overflow-hidden shadow-sm flex flex-col justify-between"
                        id="creative-viktoroddy"
                      >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-bl-full pointer-events-none" />
                        <div>
                          <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center font-display font-medium text-white text-sm">
                              VO
                            </div>
                            <div>
                              <h2 className="text-lg font-display font-medium text-white leading-tight">Viktor Oddy</h2>
                              <span className="text-[9px] font-mono text-neutral-400 uppercase tracking-wider">Curator & Designer</span>
                            </div>
                          </div>
                          
                          <p className="text-xs text-neutral-300 leading-relaxed mb-6 max-w-sm">
                            Handpicks exceptional landing pages and web animations. Renowned for detailed design reviews, micro-animation showcases, and tactical layout inspiration on X.
                          </p>
                        </div>

                        <div className="flex flex-wrap gap-2 pt-2">
                          <a 
                            href="https://motionsites.ai/sections" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="bg-white/10 hover:bg-white/15 border border-white/10 rounded-xl px-3.5 py-2 text-xs font-semibold tracking-wide text-white transition-all duration-200 flex items-center justify-center gap-1.5 group"
                          >
                            <span>motionsites.ai</span>
                            <ExternalLink className="w-3 h-3 opacity-65 group-hover:opacity-100 transition-opacity" />
                          </a>
                          <a 
                            href="https://x.com/viktoroddy" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="bg-white/10 hover:bg-white/15 border border-white/10 rounded-xl px-3.5 py-2 text-xs font-semibold tracking-wide text-white transition-all duration-200 flex items-center justify-center gap-1.5 group"
                          >
                            <span>x.com/viktoroddy</span>
                            <ExternalLink className="w-3 h-3 opacity-65 group-hover:opacity-100 transition-opacity" />
                          </a>
                        </div>
                      </div>

                      {/* Bogdan Falin Card */}
                      <div 
                        className="bg-neutral-50 text-neutral-900 border border-neutral-200 rounded-2xl p-7 relative overflow-hidden flex flex-col justify-between"
                        id="creative-bogdanfalin"
                      >
                        <div>
                          <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-full bg-neutral-900 text-white flex items-center justify-center font-display font-medium text-sm">
                              BF
                            </div>
                            <div>
                              <h2 className="text-lg font-display font-medium text-neutral-900 leading-tight">Bogdan Falin</h2>
                              <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-wider">Creative Developer</span>
                            </div>
                          </div>

                          <p className="text-xs text-[#52525b] leading-relaxed mb-6 max-w-sm">
                            Expert in crafting rich interactive web tools and layout compilations. Developer and founder of Lafys, an outstanding repository for elegant structural interfaces.
                          </p>
                        </div>

                        <div className="flex pt-2">
                          <a 
                            href="https://lafys.com/" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="bg-neutral-950 text-white hover:bg-neutral-850 rounded-xl px-3.5 py-2 text-xs font-semibold tracking-wide transition-all duration-200 flex items-center justify-center gap-1.5 group"
                          >
                            <span>lafys.com</span>
                            <ExternalLink className="w-3 h-3 opacity-65 group-hover:opacity-100 transition-opacity" />
                          </a>
                        </div>
                      </div>

                    </div>

                    {/* RIGHT PANEL: RICHLY STRUCTURED DIRECTORIES */}
                    <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                      
                      {/* Curated Galleries */}
                      <div className="bg-white rounded-2xl p-6 border border-neutral-150 shadow-3xs">
                        <span className="text-[9px] font-mono tracking-wider text-neutral-400 uppercase block mb-3">
                          CURATED EXHIBITIONS
                        </span>
                        <h3 className="text-sm font-bold text-neutral-950 mb-3.5 border-b border-neutral-100 pb-2">
                          Curated galleries
                        </h3>
                        <ul className="space-y-3">
                          {[
                            { name: "Land-book", url: "https://landbook.com", display: "landbook.com" },
                            { name: "Awwwards", url: "https://awwwards.com", display: "awwwards.com" },
                            { name: "Siteinspire", url: "https://siteinspire.com", display: "siteinspire.com" },
                            { name: "Screenlane", url: "https://screenlane.com", display: "screenlane.com" }
                          ].map((item, idx) => (
                            <li key={idx}>
                              <a 
                                href={item.url} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="group/item flex items-center justify-between text-xs text-[#52525b] hover:text-neutral-950 transition-colors"
                              >
                                <span className="font-medium">{item.name}</span>
                                <span className="font-mono text-[10px] text-neutral-400 group-hover/item:text-neutral-900 flex items-center gap-1">
                                  {item.display}
                                  <ExternalLink className="w-2.5 h-2.5 opacity-0 group-hover/item:opacity-100 transition-all" />
                                </span>
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Specific UI Components */}
                      <div className="bg-white rounded-2xl p-6 border border-neutral-150 shadow-3xs">
                        <span className="text-[9px] font-mono tracking-wider text-neutral-400 uppercase block mb-3">
                          COMPONENT INDEX
                        </span>
                        <h3 className="text-sm font-bold text-neutral-950 mb-3.5 border-b border-neutral-100 pb-2">
                          For specific UI components
                        </h3>
                        <ul className="space-y-3">
                          {[
                            { name: "Mobbin", url: "https://mobbin.com", display: "mobbin.com" },
                            { name: "UI Sources", url: "https://uisources.com", display: "uisources.com" }
                          ].map((item, idx) => (
                            <li key={idx}>
                              <a 
                                href={item.url} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="group/item flex items-center justify-between text-xs text-[#52525b] hover:text-neutral-950 transition-colors"
                              >
                                <span className="font-medium">{item.name}</span>
                                <span className="font-mono text-[10px] text-neutral-400 group-hover/item:text-neutral-900 flex items-center gap-1">
                                  {item.display}
                                  <ExternalLink className="w-2.5 h-2.5 opacity-0 group-hover/item:opacity-100 transition-all" />
                                </span>
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Video-Heavy / Immersive Design */}
                      <div className="bg-white rounded-2xl p-6 border border-neutral-150 shadow-3xs">
                        <span className="text-[9px] font-mono tracking-wider text-neutral-400 uppercase block mb-3">
                          CINEMATIC EXPERIENCES
                        </span>
                        <h3 className="text-sm font-bold text-neutral-950 mb-3.5 border-b border-neutral-100 pb-2">
                          For video-heavy / immersive design
                        </h3>
                        <ul className="space-y-3">
                          {[
                            { name: "Hoverstates", url: "https://hoverstates.com", display: "hoverstates.com" },
                            { name: "Godly", url: "https://godly.website", display: "godly.website" }
                          ].map((item, idx) => (
                            <li key={idx}>
                              <a 
                                href={item.url} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="group/item flex items-center justify-between text-xs text-[#52525b] hover:text-neutral-950 transition-colors"
                              >
                                <span className="font-medium">{item.name}</span>
                                <span className="font-mono text-[10px] text-neutral-400 group-hover/item:text-neutral-900 flex items-center gap-1">
                                  {item.display}
                                  <ExternalLink className="w-2.5 h-2.5 opacity-0 group-hover/item:opacity-100 transition-all" />
                                </span>
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Honourable Mentions */}
                      <div className="bg-white rounded-2xl p-6 border border-neutral-150 shadow-3xs">
                        <span className="text-[9px] font-mono tracking-wider text-neutral-400 uppercase block mb-3">
                          DESIGN MICRO-DETAILS
                        </span>
                        <h3 className="text-sm font-bold text-neutral-950 mb-3.5 border-b border-neutral-100 pb-2">
                          Honourable mentions
                        </h3>
                        <ul className="space-y-3">
                          {[
                            { name: "Navbar.gallery", url: "https://navbar.gallery", display: "navbar.gallery" },
                            { name: "Footer.design", url: "https://footer.design", display: "footer.design" }
                          ].map((item, idx) => (
                            <li key={idx}>
                              <a 
                                href={item.url} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="group/item flex items-center justify-between text-xs text-[#52525b] hover:text-neutral-950 transition-colors"
                              >
                                <span className="font-medium">{item.name}</span>
                                <span className="font-mono text-[10px] text-neutral-400 group-hover/item:text-neutral-900 flex items-center gap-1">
                                  {item.display}
                                  <ExternalLink className="w-2.5 h-2.5 opacity-0 group-hover/item:opacity-100 transition-all" />
                                </span>
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>

                    </div>

                  </div>
                </div>

                {/* Vertical slider hint to guide user logically downward */}
                <div className="py-6 flex flex-col items-center justify-center pointer-events-none select-none">
                  <span className="text-[10px] font-mono tracking-widest text-neutral-400 uppercase animate-bounce mb-1">
                    SCROLL DOWN
                  </span>
                  <div className="w-[1px] h-6 bg-neutral-250" />
                </div>
              </section>

              {/* SECTION 2: PROMPTS AND LINKS */}
              <section className="w-full min-h-screen py-24 sm:py-32 flex flex-col justify-center bg-[#fafafa] text-neutral-900 relative border-t border-neutral-100 px-6 md:px-16 lg:px-24">
                <div className="w-full max-w-7xl mx-auto">
                  
                  {/* Dynamic Section Heading */}
                  <div className="mb-16 text-left">
                    <span className="text-[10px] font-mono tracking-[0.2em] text-[#52525b] uppercase block mb-2.5">
                      TACTICAL DIRECTIVES
                    </span>
                    <h2 className="font-display font-medium text-3xl sm:text-4xl md:text-5xl tracking-tight text-neutral-950">
                      Prompts and links. Click to copy.
                    </h2>
                    <p className="text-neutral-500 text-sm mt-3 max-w-xl leading-relaxed">
                      Deploy these pre-formatted directives directly in Google AI Studio to control aesthetics, layouts, videos, transitions and typographic settings instantly.
                    </p>
                  </div>

                  {/* High Quality Responsive Grid Layout for Prompts */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                    {promptTemplates.map((prompt) => (
                      <PromptCard
                        key={prompt.id}
                        id={prompt.id}
                        title={prompt.title}
                        label={prompt.label}
                        text={prompt.text}
                        onCopy={triggerToast}
                      />
                    ))}
                  </div>

                </div>
              </section>

              {/* SECTION 3: LAYOUT CHEAT SHEET CALL TO ACTION */}
              <section className="w-full py-20 bg-white border-t border-neutral-150 flex flex-col items-center justify-center px-6 md:px-16 lg:px-24 text-center">
                <div className="max-w-2xl mx-auto">
                  <span className="text-[10px] font-mono tracking-[0.2em] text-[#d97706] uppercase block mb-3 font-semibold">
                    VISUAL GLOSSARY REFERENCE
                  </span>
                  <h3 className="font-display font-medium text-3xl sm:text-4xl text-neutral-950 mb-4 tracking-tight">
                    Website Layout Terms for Non-Designers
                  </h3>
                  <p className="text-[#52525b] text-xs sm:text-sm leading-relaxed mb-8 max-w-lg mx-auto">
                    Confused by grid systems, hamburger menus, above-the-fold constraints, padding or container models? Access our custom interactive terminology visual reference sheet built in deep-space high fidelity.
                  </p>
                  <a 
                    href="/cheatsheet.html" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-neutral-950 hover:bg-neutral-900 hover:scale-[1.02] active:scale-[0.98] text-white font-sans text-xs sm:text-sm px-7 py-4 rounded-full font-semibold shadow-xs transition-all duration-200 cursor-pointer"
                  >
                    <span>Open Interactive Cheat Sheet</span>
                    <span className="text-lg font-mono">→</span>
                  </a>
                </div>
              </section>
            </>
          );
        }

        // Beautiful generic fallback
        return (
          <>
            <section className="w-full h-screen min-h-screen flex flex-col justify-between relative bg-white text-neutral-900">
              {renderHeader(false)}
              <div className="flex-1 w-full max-w-7xl mx-auto px-6 md:px-16 lg:px-24 flex flex-col justify-center text-left">
                <h1 className="font-display font-medium text-4xl sm:text-6xl tracking-tight max-w-3xl mb-6">
                  Page Not Found
                </h1>
              </div>
            </section>
          </>
        );
      })()}

      {/* Aesthetic Footer Area - Premium White-on-Black footer with custom owner links */}
      <footer className="w-full py-12 px-6 md:px-16 lg:px-24 flex flex-col sm:flex-row items-center justify-between gap-6 z-10 text-xs text-neutral-400 bg-neutral-950 border-t border-neutral-900">
        <div>
          <span className="font-mono tracking-[0.2em] text-neutral-300 font-bold text-sm uppercase">MYOSIN</span>
        </div>
        <div className="flex flex-wrap gap-x-6 gap-y-2 items-center justify-center">
          <a href="https://x.com/Shanekfarrell" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">X</a>
          <a href="https://www.linkedin.com/in/shanekevinfarrell/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">LI</a>
          <a href="/cheatsheet.html" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors font-medium text-amber-400">Layout Cheat Sheet</a>
          <a href="https://www.skool.com/myosin-learns/welcome" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Myosin Learns</a>
        </div>
      </footer>

    </div>
  );
}

// ==========================================
// PROMPT SHARING DATA AND HOOK COMPONENT
// ==========================================

const promptTemplates = [
  {
    id: 1,
    title: "Prompt 1 — Liquid Glass Style",
    label: "Style",
    text: `Apply a liquid glass style to all buttons and the navigation bar. Use the following CSS exactly:

.liquid-glass {
  background: rgba(255,255,255,0.01);
  background-blend-mode: luminosity;
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  border: none;
  box-shadow: inset 0 1px 1px rgba(255,255,255,0.1);
  position: relative;
  overflow: hidden;
}

.liquid-glass::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  padding: 1.4px;
  background: linear-gradient(180deg, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0.15) 20%, rgba(255,255,255,0) 40%, rgba(255,255,255,0) 60%, rgba(255,255,255,0.15) 80%, rgba(255,255,255,0.45) 100%);
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  pointer-events: none;
}

Apply .liquid-glass to nav chips and cards. Apply .liquid-glass-strong (backdrop-filter: blur(50px)) to primary CTA buttons.`
  },
  {
    id: 2,
    title: "Prompt 2 — 100VH Sections",
    label: "Layout",
    text: "Make every section on this page 100VH. Each section should have min-height: 100vh. Add generous internal padding — at least 10vh top and bottom within each section. Do not compress content to fit — let it breathe."
  },
  {
    id: 3,
    title: "Prompt 3 — Remove Video Overlay",
    label: "Video",
    text: "Remove all dark overlays from the background video. Set the video to 100% opacity. Do not add any colour overlay to improve text readability. Instead, change the text colour or reposition text to maintain contrast with the original video colours."
  },
  {
    id: 4,
    title: "Prompt 4 — Scroll-Bound Video",
    label: "Video",
    text: "Bind the hero video playback to page scroll position. The video should not autoplay. As the user scrolls down, advance the video forward proportionally. As the user scrolls up, reverse the video. The full video duration should map to the full scroll distance of the section."
  },
  {
    id: 5,
    title: "Prompt 5 — Cursor Parallax Image",
    label: "Interaction",
    text: "Add a subtle cursor-driven parallax effect to the hero background image. When the user moves their cursor right, the image shifts slightly right. When they move left, it shifts left. Maximum shift: 25px on the X axis, 15px on the Y axis. Scale the image to 105% to prevent edge gaps. Use smooth CSS transition of 0.1s ease-out."
  },
  {
    id: 6,
    title: "Prompt 6 — Screenshot Reference Build",
    label: "Layout",
    text: "Build a hero section that matches the layout in this screenshot exactly. Use the same font weight, vertical positioning, and spacing hierarchy shown in the image. Do not use your default layout. Follow this reference for all proportions."
  },
  {
    id: 7,
    title: "Prompt 7 — Premium Font",
    label: "Typography",
    text: "Use Helvetica Neue for all sans-serif elements across the entire page. Do not fall back to Inter, Roboto, Arial, or any system font. If Helvetica Neue is unavailable, use DM Sans or Plus Jakarta Sans as fallback only."
  },
  {
    id: 8,
    title: "Prompt 8 — Mobile Optimisation",
    label: "Mobile",
    text: "Optimise this page for mobile. Stack all sections vertically. Make the headline font size 32px minimum. Ensure the CTA button is full width and thumb-reachable. Check that no text overlaps the background video on a 390px wide screen."
  },
  {
    id: 9,
    title: "Prompt 9 — Typewriter Headline",
    label: "Animation",
    text: "Add a typewriter effect to the hero headline. Reveal one character at a time at 38ms per character with a 600ms start delay. Show a blinking cursor while typing — inline-block, 2px wide, 1.1em tall, same colour as the text, CSS animation blink 1s step-end infinite (opacity: 1 at 0% and 100%, opacity: 0 at 50%). Hide the cursor when the text is fully revealed."
  },
  {
    id: 10,
    title: "Prompt 10 — Looping Video (Boomerang)",
    label: "Video",
    text: "Set the background video to play forward, then reverse back to the start, then repeat. Do not use CSS animation for this — use JavaScript to reverse the video playback direction once it ends. The loop should be seamless with no visible cut between forward and reverse."
  }
];

interface PromptCardProps {
  key?: any;
  id: number;
  title: string;
  label: string;
  text: string;
  onCopy: (msg: string) => void;
}

function PromptCard({ id, title, label, text, onCopy }: PromptCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    onCopy(`Copied prompt: "${title}"`);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <div className="bg-white rounded-2xl p-6 sm:p-7 border border-neutral-200/80 shadow-3xs hover:shadow-xs hover:border-neutral-300 transition-all text-left flex flex-col justify-between h-full relative group">
      <div>
        <div className="flex items-center justify-between mb-4">
          <span className="text-[10px] font-mono tracking-wider text-neutral-500 bg-neutral-100/80 border border-neutral-200 px-2 py-0.5 rounded uppercase font-medium">
            {label}
          </span>
          <span className="text-xs font-mono font-medium text-neutral-400">
            {String(id).padStart(2, '0')}
          </span>
        </div>
        <h3 className="text-base font-bold text-neutral-900 mb-3 tracking-tight font-display">
          {title}
        </h3>
        <p className="text-[12.5px] text-[#52525b] leading-relaxed font-sans mb-6 whitespace-pre-line break-words max-h-56 overflow-y-auto pr-1">
          {text}
        </p>
      </div>
      
      <button
        onClick={handleCopy}
        className={`w-full py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 ${
          copied
            ? 'bg-emerald-600 text-white shadow-xs'
            : 'bg-neutral-950 text-white hover:bg-neutral-850 active:scale-98 shadow-2xs'
        }`}
      >
        {copied ? (
          <>
            <Check className="w-3.5 h-3.5" />
            <span>Copied ✓</span>
          </>
        ) : (
          <>
            <Copy className="w-3.5 h-3.5 opacity-80" />
            <span>Copy Prompt</span>
          </>
        )}
      </button>
    </div>
  );
}
