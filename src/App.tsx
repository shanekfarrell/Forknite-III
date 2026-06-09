import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ArrowRight, Play, Check, CircleAlert, Globe, HelpCircle, ChevronLeft, ChevronRight, Video, Copy, ExternalLink } from 'lucide-react';

export default function App() {
  // Navigation active tab
  const tabs = ['Home', 'Inspiration', 'Videos', 'Production', 'Resources'];
  const [activeTab, setActiveTab] = useState('Home');

  // Carousel Media Items (Matching screenshot style perfectly)
  const carouselItems = [
    {
      id: 1,
      title: 'How a reusable upper-stage program moved from thermal risk to stable qualification.',
      tag: 'Integration Review',
      image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
      duration: '04:20',
      category: 'Reusable systems',
    },
    {
      id: 2,
      title: 'Inside the test cell where telemetry, vibration, and injector response converge.',
      tag: 'Hot-Fire Campaign',
      image: 'https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?auto=format&fit=crop&w=1200&q=80',
      duration: '03:45',
      category: 'Validation',
    },
    {
      id: 3,
      title: 'Analyzing structural acoustics and modal resonance under high-stress entry phases.',
      tag: 'Structural Dynamics',
      image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80',
      duration: '05:12',
      category: 'Mechanical Studio',
    },
    {
      id: 4,
      title: 'Real-time telemetry networks streaming raw orbital sensor feeds onto modern canvas layers.',
      tag: 'Telemetry Matrix',
      image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=1200&q=80',
      duration: '02:40',
      category: 'Software Labs',
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

  // Scroll effect: as user scrolls section 2, move carousel images
  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      
      const rect = sectionRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      
      // Calculate how far into the viewport Section 2 is.
      const entry = viewportHeight - rect.top;
      const totalRange = rect.height + viewportHeight;
      const progress = Math.max(0, Math.min(0.99, entry / totalRange));
      
      // Map progress smoothly into the carousel index range
      const newIndex = Math.floor(progress * carouselItems.length);
      
      if (newIndex >= 0 && newIndex < carouselItems.length) {
        setCarouselIndex(newIndex);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [carouselItems.length]);

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
            <div className="w-10 hidden sm:block" />

            {/* Dynamic Capsule Filter Toggle - Recreating screenshot style 2 exactly */}
            <nav className="relative">
              <div className="bg-[#0c0c10] p-1.5 rounded-full flex items-center gap-0.5 shadow-md">
                {tabs.map((tab) => {
                  const isActive = activeTab === tab;
                  return (
                    <button
                      key={tab}
                      onClick={() => {
                        setActiveTab(tab);
                        triggerToast(`Navigated to ${tab}`);
                      }}
                      className="relative px-5 py-1.5 text-xs font-medium tracking-wide rounded-full transition-colors duration-200 cursor-pointer text-center whitespace-nowrap outline-none border-none"
                      style={{
                        color: isActive ? '#0a0a0c' : '#a3a3a3',
                      }}
                      id={`nav-tab-${tab.toLowerCase()}`}
                    >
                      {/* Sliding pill container using Framer Motion */}
                      {isActive && (
                        <motion.div
                          layoutId="active-pill"
                          className="absolute inset-0 bg-white rounded-full z-0"
                          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                        />
                      )}
                      <span className="relative z-10 transition-colors">{tab}</span>
                    </button>
                  );
                })}
              </div>
            </nav>

            {/* Minimal status indicator */}
            <div className="hidden sm:flex items-center gap-3">
              <div className={`flex items-center gap-2 text-xs py-1.5 px-3 rounded-md border font-mono transition-colors ${
                isDark 
                  ? 'text-neutral-400 bg-neutral-900 border-neutral-800' 
                  : 'text-neutral-500 bg-neutral-50 border-neutral-100'
              }`}>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>v1.0.4 Online</span>
              </div>
            </div>
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
                          onClick={() => triggerToast('Initiating visual studio platform setup...')}
                          className="px-8 py-3 bg-neutral-950 hover:bg-neutral-800 active:scale-95 text-white text-xs font-semibold rounded-full shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
                          id="btn-discover"
                        >
                          Discover
                        </button>

                        {/* View Specs Action (Glass Pill button layout) */}
                        <button
                          onClick={() => triggerToast('Opening code inspection panel (Specifications)...')}
                          className="flex items-center gap-2.5 px-6 py-3 bg-neutral-50/70 hover:bg-neutral-100/90 active:scale-95 text-neutral-800 text-xs font-semibold rounded-full border border-neutral-200/50 backdrop-blur-md transition-all duration-200 cursor-pointer shadow-xs hover:shadow-md"
                          id="btn-view-specs"
                        >
                          <span className="w-5 h-5 rounded-full bg-white/80 border border-neutral-200/40 flex items-center justify-center shadow-xs">
                            <Play className="w-2 h-2 text-neutral-950 fill-neutral-950 ml-0.5" />
                          </span>
                          <span>View Specs</span>
                        </button>

                      </div>

                    </div>

                    {/* RIGHT HALF SCREEN: Left completely empty and clean, as requested */}
                    <div className="hidden md:flex flex-col items-center justify-center p-8 h-full relative">
                      {/* Blank Space with very subtle aesthetic guidelines for subsequent components placeholder */}
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="relative w-full max-w-xs aspect-square rounded-2xl border border-dashed border-neutral-100 flex flex-col items-center justify-center p-6 text-center opacity-60">
                          <Globe className="w-6 h-6 text-neutral-200 mb-2" />
                          <span className="text-[11px] font-mono text-neutral-300 uppercase tracking-widest block mb-1">
                            Right Screen Half
                          </span>
                          <span className="text-[10px] text-neutral-400">
                            Intentionally left blank for your modular custom components
                          </span>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>

                {/* Space balancing spacer */}
                <div className="py-4" />
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
                            {/* Rounded Image Container - Identical height for all three cards means they line up perfectly at both top and bottom! */}
                            <div className="w-full h-[220px] sm:h-[260px] md:h-[280px] lg:h-[330px] rounded-2xl overflow-hidden bg-neutral-100 relative shadow-md border border-neutral-200/40 mb-5 cursor-pointer">
                              <img
                                src={item.image}
                                alt={item.title}
                                className={`w-full h-full object-cover transition-all duration-750 ease-out group-hover:scale-[1.03] ${
                                  isMain ? 'grayscale-0 contrast-100 brightness-100' : 'grayscale brightness-[0.75] contrast-[0.95] saturate-50'
                                }`}
                                referrerPolicy="no-referrer"
                              />
                              
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

              {/* SECTION 3: TESTIMONIALS - Exactly 100vh (h-screen) with loop bar */}
              <section className="w-full h-screen min-h-screen flex flex-col justify-center bg-white relative border-t border-neutral-100 overflow-hidden">
                <div className="w-full max-w-7xl mx-auto px-6 md:px-16 lg:px-24 mb-12">
                  <span className="text-[10px] font-mono tracking-widest text-neutral-400 uppercase block mb-1">
                    PEER CONFIRMATION
                  </span>
                  <h2 className="font-display font-medium text-xl sm:text-2xl tracking-tight text-neutral-900">
                    What They Say About The Indie Web
                  </h2>
                </div>

                {/* Outer marquee viewport with gradient masks */}
                <div className="relative w-full overflow-hidden py-8 bg-neutral-50/50 border-y border-neutral-100/60">
                  
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
                      duration: 25,
                      ease: "linear"
                    }}
                  >
                    {marqueeItems.map((item, idx) => (
                      <div
                        key={`${item.id}-${idx}`}
                        className="flex items-center gap-5 bg-white border border-neutral-100/90 rounded-2xl p-6 shadow-xs max-w-md shrink-0 select-none hover:shadow-xs"
                      >
                        {/* Circle avatar placeholder */}
                        <div className="w-14 h-14 rounded-full overflow-hidden bg-neutral-100 border border-neutral-155 shrink-0">
                          <img
                            src={item.avatar}
                            alt={item.name}
                            className="w-full h-full object-cover grayscale brightness-105"
                            referrerPolicy="no-referrer"
                          />
                        </div>

                        {/* Testimonial Quote and User Bio */}
                        <div className="flex flex-col text-left">
                          <p className="text-neutral-700 text-xs sm:text-sm font-sans italic leading-relaxed mb-1.5 font-medium max-w-xs">
                            "{item.quote}"
                          </p>
                          <div>
                            <h4 className="text-neutral-900 font-semibold text-xs tracking-wide">
                              {item.name}
                            </h4>
                            <span className="text-[10px] font-mono text-neutral-400">
                              {item.role}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </motion.div>
                </div>

                {/* Dynamic prompt space balance */}
                <div className="py-6" />
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
                      
                      {/* Three Logos Side by Side Container */}
                      <div className="flex items-center justify-around h-[230px] mb-5 w-full bg-transparent border-0">
                        
                        {/* PINTEREST */}
                        <a 
                          href="https://pinterest.com" 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="flex flex-col items-center justify-center transition-transform duration-300 hover:scale-105"
                          title="Pinterest"
                          id="hyperlink_pinterest"
                        >
                          {/* SVG for Pinterest */}
                          <svg className="w-16 h-16 text-[#bd081c] fill-current" viewBox="0 0 24 24">
                            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.08 3.16 9.4 7.63 11.16-.1-.95-.2-2.4.04-3.43.22-.93 1.4-5.93 1.4-5.93s-.36-.72-.36-1.77c0-1.66.96-2.9 2.12-2.9 1 0 1.48.75 1.48 1.65 0 1-.64 2.5-.97 3.9-.28 1.17.58 2.13 1.73 2.13 2.08 0 3.68-2.2 3.68-5.37 0-2.8-2-4.77-4.9-4.77-3.33 0-5.3 2.5-5.3 5.1 0 1 .4 2.1.9 2.7.1.1.1 0 .2-.2l.34-1.4c0-.1 0-.17-.12-.31-.5-.65-.77-1.57-.77-2.53 0-3.27 2.38-6.28 6.86-6.28 3.6 0 6.4 2.57 6.4 6 0 3.58-2.25 6.47-5.38 6.47-1.05 0-2.04-.55-2.38-1.2l-.65 2.47c-.24.9-.88 2.03-1.3 2.7 1.13.35 2.33.54 3.57.54 6.63 0 12-5.37 12-12S18.63 0 12 0z"/>
                          </svg>
                          <span className="text-xs font-mono tracking-wider font-semibold text-neutral-500 mt-2">
                            Pinterest
                          </span>
                        </a>

                        {/* LAND-BOOK */}
                        <a 
                          href="https://land-book.com" 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="flex flex-col items-center justify-center transition-transform duration-300 hover:scale-105"
                          title="Land-book"
                          id="hyperlink_landbook"
                        >
                          {/* SVG for Land-book Leaf/Web pattern */}
                          <svg className="w-16 h-16 text-[#11b262] fill-current" viewBox="0 0 24 24">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15.5c0 .83-.67 1.5-1.5 1.5s-1.5-.67-1.5-1.5 2.5-5.5 3-5.5c.28 0 .5.22.5.5v5zm1.18-5.35c.16.29.32.55.32.75 0 1-.95 1.6-1.5 1.6s-.5-.45-.5-.73c0-.18.15-.41.3-.67.45-.75 1.13-1.85 1.38-1.5 0 .15 0 .35 0 .55zM12 4c4.41 0 8 3.59 8 8 0 1.25-.29 2.43-.8 3.49C17.7 13.43 14.93 12 12 12s-5.7 1.43-7.2 3.49C4.29 14.43 4 13.25 4 12c0-4.41 3.59-8 8-8z"/>
                          </svg>
                          <span className="text-xs font-mono tracking-wider font-semibold text-neutral-500 mt-2 text-center truncate w-full">
                            Land-Book
                          </span>
                        </a>

                        {/* DRIBBBLE */}
                        <a 
                          href="https://dribbble.com" 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="flex flex-col items-center justify-center transition-transform duration-300 hover:scale-105"
                          title="Dribbble"
                          id="hyperlink_dribbble"
                        >
                          {/* SVG for Dribbble */}
                          <svg className="w-16 h-16 text-[#ea4c89] fill-current" viewBox="0 0 24 24">
                            <path d="M12 24C5.385 24 0 18.615 0 12S5.385 0 12 0s12 5.385 12 12-5.385 12-12 12zm10.12-10.64a9.692 9.692 0 0 0-3.32-.61 14.887 14.887 0 0 0-2.18.17 19.476 19.476 0 0 1 3.5 5.56 10.024 10.024 0 0 0 2-5.12zm-3.303 6.096a17.65 17.65 0 0 0-3.23-5.152 14.77 14.77 0 0 1-5.19 2.043 9.945 9.945 0 0 0 6.666 3.109l1.754-.001zm-15.35-6.696a12.186 12.186 0 0 1 5.4-1.28c.453 0 .898.026 1.336.077a16.035 16.035 0 0 0-2.45-4.45 9.92 9.92 0 0 0-4.286 5.653zm7.042-7.067c1.066 1.487 1.954 3.1 2.628 4.795a12.83 12.83 0 0 1 4.542-1.956 9.896 9.896 0 0 0-7.17-2.839zm8.563 4.238a14.717 14.717 0 0 0-4.14 1.764c.2.476.38.962.534 1.458a13.14 13.14 0 0 1 3.843.434 9.947 9.947 0 0 0-.237-3.656zm-17.202 5.069a10.038 10.038 0 0 0 4.14 7.21l.363-.787c.882-1.91 2.115-3.633 3.632-5.076a14.39 14.39 0 0 0-1.424-.094 13.91 13.91 0 0 0-6.711 1.747z"/>
                          </svg>
                          <span className="text-xs font-mono tracking-wider font-semibold text-neutral-500 mt-2">
                            Dribbble
                          </span>
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
                          <button 
                            onClick={() => {
                              setActiveTab('Resources');
                              triggerToast('Navigated to Resources definitions...');
                            }} 
                            className="text-neutral-600 hover:text-black underline font-semibold transition-colors cursor-pointer border-none bg-transparent p-0"
                          >
                            See the Resources page.
                          </button>
                        </p>
                      </div>

                    </div>

                    {/* COLUMN 2: GETTING YOUR IMAGE & OPTION A */}
                    <div className="flex flex-col text-left group">
                      
                      {/* Grey Rounded Box Container */}
                      <div className="bg-[#f2f2f5] rounded-[24px] p-6 pb-5 h-[230px] flex flex-col justify-between border border-neutral-200/40 relative overflow-hidden transition-all duration-300 hover:shadow-sm cursor-pointer mb-5">
                        
                        {/* Artwork: Twisted loop style ribbon */}
                        <div className="absolute top-0 inset-x-0 h-[140px] flex items-center justify-center overflow-hidden">
                          <svg viewBox="0 0 200 120" className="w-[180px] h-[110px] transform hover:scale-105 transition-transform duration-700 select-none">
                            <defs>
                              <linearGradient id="loopGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.85"/>
                                <stop offset="50%" stopColor="#ec4899" stopOpacity="0.8"/>
                                <stop offset="100%" stopColor="#a855f7" stopOpacity="0.9"/>
                              </linearGradient>
                              <linearGradient id="loopGrad2" x1="100%" y1="100%" x2="0%" y2="0%">
                                <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.75"/>
                                <stop offset="55%" stopColor="#d946ef" stopOpacity="0.8"/>
                                <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.9"/>
                              </linearGradient>
                            </defs>
                            <path 
                              d="M 50,70 C 65,30 115,30 130,70 C 145,30 155,30 160,50" 
                              fill="none" 
                              stroke="url(#loopGrad1)" 
                              strokeWidth="15" 
                              strokeLinecap="round"
                              opacity="0.9"
                            />
                            <path 
                              d="M 40,60 C 55,20 105,80 140,50 C 160,30 150,70 160,60" 
                              fill="none" 
                              stroke="url(#loopGrad2)" 
                              strokeWidth="11" 
                              strokeLinecap="round"
                              opacity="0.85"
                            />
                          </svg>
                        </div>

                        {/* Title & Arrow at footer of rounded grey card */}
                        <div className="flex items-center justify-between mt-auto w-full pt-4 border-t border-neutral-300/35 z-10">
                          <h3 className="text-[17px] font-semibold tracking-tight text-neutral-900 group-hover:text-black transition-colors font-display">
                            Screenshots
                          </h3>
                          <span className="text-xl text-neutral-400 group-hover:text-black group-hover:translate-x-1.5 transition-all duration-300 font-mono select-none">
                            →
                          </span>
                        </div>
                      </div>

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

                    {/* RIGHT HALF SCREEN: Left completely empty and clean, similar to Home */}
                    <div className="hidden md:flex flex-col items-center justify-center p-8 h-full relative">
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="relative w-full max-w-xs aspect-square rounded-2xl border border-dashed border-neutral-150 flex flex-col items-center justify-center p-6 text-center opacity-60">
                          <Video className="w-6 h-6 text-neutral-300 mb-2" />
                          <span className="text-[11px] font-mono text-neutral-400 uppercase tracking-widest block mb-1">
                            Motion Canvas
                          </span>
                          <span className="text-[10px] text-neutral-500">
                            Create fluid motion with video-driven interactions
                          </span>
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
                              className="absolute right-3 top-3 text-[10px] font-mono font-medium text-neutral-400 hover:text-black bg-white px-2 py-0.5 rounded border border-neutral-200 cursor-pointer"
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
                              className="absolute right-3 top-3 text-[10px] font-mono font-medium text-neutral-400 hover:text-black bg-white px-2 py-0.5 rounded border border-neutral-200 cursor-pointer"
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
                              className="absolute right-3 top-3 text-[10px] font-mono font-medium text-neutral-400 hover:text-black bg-white px-2 py-0.5 rounded border border-neutral-200 cursor-pointer"
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
                              className="absolute right-2 top-2 text-[9px] font-mono text-neutral-500 hover:text-neutral-900 bg-white px-1.5 py-0.5 rounded border border-neutral-200 cursor-pointer"
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
              {/* SECTION 1: PRODUCTION ABOVE THE FOLD - 100vh with white bg color scheme */}
              <section className="w-full h-screen min-h-screen flex flex-col justify-between relative border-b border-neutral-100 bg-white">
                {renderHeader(false)}

                {/* Hero Main Body */}
                <div className="flex-1 w-full max-w-7xl mx-auto px-6 md:px-16 lg:px-24 flex flex-col justify-center">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12 w-full items-center">
                    
                    {/* LEFT HALF */}
                    <div className="flex flex-col items-start text-left z-20 max-w-lg">
                      <span className="font-sans font-semibold tracking-[0.18em] text-neutral-400 text-[10px] md:text-xs uppercase mb-3.5 block">
                        PRODUCTION ORCHESTRATION
                      </span>

                      <h1 className="font-display font-medium text-[40px] sm:text-[52px] md:text-[58px] lg:text-[68px] leading-[1.06] tracking-[-0.03em] text-neutral-900 mb-8">
                        Build it in Google AI Studio. Faster than you think.
                      </h1>

                      <p className="text-neutral-500 text-sm max-w-md leading-relaxed font-sans mb-8">
                        Go to <a href="https://aistudio.google.com" target="_blank" rel="noopener noreferrer" className="font-semibold text-neutral-900 underline hover:text-neutral-700">aistudio.google.com</a> and click <span className="font-semibold text-neutral-900">Build</span> to configure custom visual experiences in an instant.
                      </p>

                      <a
                        href="https://aistudio.google.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-8 py-3 bg-neutral-950 hover:bg-neutral-800 active:scale-95 text-white text-xs font-semibold rounded-full shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer flex items-center gap-2"
                        id="btn-goto-aistudio"
                      >
                        <span>Go to aistudio.google.com</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </a>
                    </div>

                    {/* RIGHT HALF */}
                    <div className="hidden md:flex flex-col items-center justify-center p-8 h-full relative">
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="relative w-full max-w-sm aspect-[4/3] rounded-2xl bg-[#fcfcfd] border border-neutral-200 p-6 flex flex-col justify-between shadow-xs">
                          
                          <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
                            <div className="flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-[#ff5f56]" />
                              <span className="w-2 h-2 rounded-full bg-[#ffbd2e]" />
                              <span className="w-2 h-2 rounded-full bg-[#27c93f]" />
                            </div>
                            <span className="text-[9px] font-mono tracking-widest text-neutral-400 uppercase">
                              AI Studio Workspace
                            </span>
                          </div>
                          
                          <div className="flex-1 py-6 flex flex-col justify-center gap-3">
                            <div className="h-2 bg-neutral-200 rounded-full w-2/3" />
                            <div className="h-2 bg-neutral-200 rounded-full w-4/5" />
                            <div className="h-2 bg-neutral-100 rounded-full w-1/3" />
                          </div>

                          <div className="bg-white rounded-xl p-3 border border-neutral-150 flex items-center justify-between gap-3">
                            <span className="text-[10px] font-mono text-neutral-500 whitespace-nowrap overflow-hidden text-ellipsis max-w-[180px]">
                              "Build me a hero section..."
                            </span>
                            <span className="px-2 py-1 bg-neutral-905 text-[8.5px] text-white font-semibold rounded-md font-sans">
                              Prompt
                            </span>
                          </div>
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

              {/* SECTION 2: PRODUCTION BUILD SEQUENCE BELOW THE FOLD */}
              <section className="w-full min-h-screen py-24 sm:py-32 flex flex-col justify-center bg-[#fafafa] text-neutral-900 relative border-t border-neutral-100 px-6 md:px-16 lg:px-24">
                <div className="w-full max-w-7xl mx-auto">
                  
                  {/* Small Header */}
                  <div className="mb-16 text-left">
                    <span className="text-[10px] font-mono tracking-[0.2em] text-neutral-400 uppercase block mb-2.5">
                      STEP-BY-STEP DESIGN
                    </span>
                    <h2 className="font-display font-medium text-3xl sm:text-4xl md:text-5xl tracking-tight text-neutral-950">
                      The Sequence
                    </h2>
                  </div>

                  {/* Vertical Flow of the sequence stages */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                    
                    {/* Left Column - Detailed list/timeline of instructions */}
                    <div className="lg:col-span-7 space-y-12">
                      
                      {/* Step 1 */}
                      <div className="border-l-2 border-neutral-200 pl-6 space-y-4 text-left relative group">
                        <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-neutral-300 group-hover:bg-neutral-900 transition-colors" />
                        <div className="flex items-center gap-2.5">
                          <span className="text-xs font-mono font-bold text-neutral-400">01</span>
                          <h3 className="text-base font-semibold text-neutral-900">Upload Reference & Base Layout</h3>
                        </div>
                        <p className="text-[13px] text-[#52525b] leading-relaxed">
                          Upload your reference screenshots. Add the nav bar, hero layout, and any elements you captured earlier. Prompt:
                        </p>
                        
                        <div className="bg-white rounded-xl p-4 border border-neutral-200/50 text-[12px] font-mono text-neutral-800 relative leading-relaxed group/copy shadow-xs">
                          <button 
                            onClick={() => {
                              navigator.clipboard.writeText('Build me a hero section exactly as in this image — same font weight, same positioning, same spacing hierarchy. Do not use your default layout.');
                              triggerToast('Copied Prompt 1');
                            }}
                            className="absolute right-3 top-3 text-[10px] font-mono font-medium text-neutral-400 hover:text-black bg-white px-2 py-0.5 rounded border border-neutral-200 cursor-pointer shadow-xs"
                          >
                            Copy
                          </button>
                          "Build me a hero section exactly as in this image — same font weight, same positioning, same spacing hierarchy. Do not use your default layout."
                        </div>

                        <div className="bg-neutral-100/60 rounded-xl p-4 border border-neutral-200/40 text-xs text-neutral-600 leading-relaxed shadow-3xs">
                          <span className="font-bold text-neutral-800 block mb-1">PRO TIP — THE 100VH RULE:</span>
                          Tell the AI to make every section <span className="font-mono text-neutral-900 font-semibold bg-neutral-200/30 px-1.5 py-0.5 rounded">100VH</span>. It gives the content breathing room.
                        </div>
                      </div>

                      {/* Step 2 */}
                      <div className="border-l-2 border-neutral-200 pl-6 space-y-4 text-left relative group">
                        <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-neutral-300 group-hover:bg-neutral-900 transition-colors" />
                        <div className="flex items-center gap-2.5">
                          <span className="text-xs font-mono font-bold text-neutral-400">02</span>
                          <h3 className="text-base font-semibold text-neutral-900">Add Video Background</h3>
                        </div>
                        <p className="text-[13px] text-[#52525b] leading-relaxed">
                          Add your video background. Right-click your video and open it in a new tab. Copy that URL. In AI Studio, prompt:
                        </p>

                        <div className="bg-white rounded-xl p-4 border border-neutral-200/50 text-[12px] font-mono text-neutral-800 relative leading-relaxed group/copy shadow-xs">
                          <button 
                            onClick={() => {
                              navigator.clipboard.writeText('Replace the background with this video: [URL].');
                              triggerToast('Copied Prompt 2');
                            }}
                            className="absolute right-3 top-3 text-[10px] font-mono font-medium text-neutral-400 hover:text-black bg-white px-2 py-0.5 rounded border border-neutral-200 cursor-pointer shadow-xs"
                          >
                            Copy
                          </button>
                          "Replace the background with this video: [URL]."
                        </div>

                        <p className="text-[12.5px] text-[#52525b] leading-relaxed">
                          Then specify the behaviour — loop, play once, or scroll-controlled.
                        </p>

                        <div className="bg-neutral-100/60 rounded-xl p-4 border border-neutral-200/40 text-xs text-neutral-600 leading-relaxed shadow-3xs">
                          <span className="font-bold text-neutral-800 block mb-1">SET EXPLICIT BEHAVIOR:</span>
                          The AI will default to looping with a dark overlay unless told otherwise. Be specific about which of the three techniques you want.
                        </div>
                      </div>

                      {/* Step 3 */}
                      <div className="border-l-2 border-neutral-200 pl-6 space-y-4 text-left relative group">
                        <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-neutral-300 group-hover:bg-neutral-900 transition-colors" />
                        <div className="flex items-center gap-2.5">
                          <span className="text-xs font-mono font-bold text-neutral-400">03</span>
                          <h3 className="text-base font-semibold text-neutral-900">Check Mobile</h3>
                        </div>
                        <p className="text-[13px] text-[#52525b] leading-relaxed">
                          Resize your browser to 390px wide. If anything breaks, prompt:
                        </p>

                        <div className="bg-white rounded-xl p-4 border border-neutral-200/50 text-[12px] font-mono text-neutral-800 relative leading-relaxed group/copy shadow-xs">
                          <button 
                            onClick={() => {
                              navigator.clipboard.writeText('Optimise for mobile. Stack sections vertically. Make the headline font size 32px minimum. Ensure the CTA button is full width and thumb-reachable.');
                              triggerToast('Copied Prompt 3');
                            }}
                            className="absolute right-3 top-3 text-[10px] font-mono font-medium text-neutral-400 hover:text-black bg-white px-2 py-0.5 rounded border border-neutral-200 cursor-pointer shadow-xs"
                          >
                            Copy
                          </button>
                          "Optimise for mobile. Stack sections vertically. Make the headline font size 32px minimum. Ensure the CTA button is full width and thumb-reachable."
                        </div>
                      </div>

                      {/* Step 4 */}
                      <div className="border-l-2 border-neutral-200 pl-6 space-y-4 text-left relative group">
                        <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-neutral-300 group-hover:bg-neutral-900 transition-colors" />
                        <div className="flex items-center gap-2.5">
                          <span className="text-xs font-mono font-bold text-neutral-400">04</span>
                          <h3 className="text-base font-semibold text-neutral-900">Refine Typography</h3>
                        </div>
                        <p className="text-[13px] text-[#52525b] leading-relaxed">
                          AI defaults to Inter, Roboto, or Arial. These signal "generated." Download Helvetica Neue and prompt:
                        </p>

                        <div className="bg-white rounded-xl p-4 border border-neutral-200/50 text-[12px] font-mono text-neutral-800 relative leading-relaxed group/copy shadow-xs">
                          <button 
                            onClick={() => {
                              navigator.clipboard.writeText('Use Helvetica Neue for all sans-serif elements. Do not fall back to system fonts.');
                              triggerToast('Copied Prompt 4');
                            }}
                            className="absolute right-3 top-3 text-[10px] font-mono font-medium text-neutral-400 hover:text-black bg-white px-2 py-0.5 rounded border border-neutral-200 cursor-pointer shadow-xs"
                          >
                            Copy
                          </button>
                          "Use Helvetica Neue for all sans-serif elements. Do not fall back to system fonts."
                        </div>

                        <p className="text-[12.5px] text-[#52525b] leading-relaxed">
                          Or find a font you like on <a href="https://fontshare.com" target="_blank" rel="noopener noreferrer" className="font-semibold text-neutral-850 hover:text-black underline">fontshare.com</a>, 100% free & higher quality than most Google Fonts.
                        </p>
                      </div>

                    </div>

                    {/* Right Column - Checklist "Know when to stop" */}
                    <div className="lg:col-span-5 space-y-8 text-left">
                      
                      <div className="bg-white rounded-[24px] p-6 sm:p-8 border border-neutral-200/60 shadow-sm relative overflow-hidden">
                        
                        <div className="absolute top-0 right-0 w-24 h-24 bg-neutral-50 rounded-bl-full pointer-events-none flex items-center justify-center">
                          <Check className="w-8 h-8 text-neutral-300 transform translate-x-3 -translate-y-3" />
                        </div>

                        <span className="text-[10px] font-mono tracking-widest text-neutral-400 uppercase block mb-1">
                          CRITERIA MATRIX
                        </span>
                        
                        <h3 className="text-lg font-bold text-neutral-950 mb-5">
                          Know when to stop.
                        </h3>

                        <p className="text-[12.5px] text-neutral-500 leading-relaxed mb-6">
                          Ask yourself four questions before prompting again:
                        </p>

                        {/* Checklist items */}
                        <div className="space-y-4">
                          {[
                            { q: "Is the headline clear?", desc: "Perfect syntax, high weight and legibility." },
                            { q: "Is the CTA visible without scrolling?", desc: "Sits comfortably above the fold." },
                            { q: "Does it work on mobile?", desc: "Stops overlaps and scales typography down correctly." },
                            { q: "Does the background enhance rather than distract?", desc: "Harmonious balance without overpowering overlays." }
                          ].map((item, index) => (
                            <div key={index} className="flex gap-3 items-start border-b border-neutral-100 pb-3">
                              <span className="w-5 h-5 rounded-full border border-emerald-500 bg-emerald-50/50 flex items-center justify-center flex-shrink-0 text-[10px] font-bold text-emerald-600 mt-0.5 select-none">
                                ✓
                              </span>
                              <div>
                                <h4 className="text-[13.5px] font-semibold text-neutral-900">{item.q}</h4>
                              </div>
                            </div>
                          ))}
                        </div>

                        <p className="text-[12.5px] text-neutral-500 leading-relaxed mt-6">
                          If yes to all <span className="font-semibold text-neutral-800">four</span> — you are done.
                        </p>

                        <div className="mt-8 pt-6 border-t border-neutral-150 flex items-center justify-between text-[10.5px] font-mono text-neutral-400 select-none">
                          <span>blueprint verified</span>
                          <span className="text-emerald-500 font-semibold flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            OPTIMIZED
                          </span>
                        </div>

                      </div>

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

                  {/* High fidelity layout featuring carefully separated resources inside cards */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    
                    {/* LEFT PANEL: MAIN PREMIUM HIGHLIGHTED CURATOR RESOURCES */}
                    <div className="lg:col-span-5 space-y-6">
                      
                      {/* Motionsites Card */}
                      <a 
                        href="https://motionsites.ai/sections" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="block bg-neutral-950 text-white rounded-2xl p-8 hover:bg-neutral-900 hover:scale-[1.01] transition-all duration-200 text-left relative overflow-hidden group shadow-md"
                        id="link-motionsites"
                      >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-bl-full pointer-events-none transition-all group-hover:scale-110" />
                        <span className="text-[10px] font-mono tracking-widest text-neutral-400 uppercase mb-4 block">
                          FEATURED PLATFORM
                        </span>
                        <h2 className="text-2xl font-display font-medium mb-3 tracking-tight">motionsites.ai/sections</h2>
                        <p className="text-xs text-neutral-300 leading-relaxed mb-6 max-w-sm">
                          Handpicked showcase cataloging motion-rich layouts, full-view transitions, and beautiful fluid scroll dynamics.
                        </p>
                        <div className="flex items-center gap-1.5 text-xs text-white font-medium">
                          <span>Visit Website</span>
                          <ExternalLink className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </a>

                      {/* Viktor Oddy Card */}
                      <a 
                        href="https://x.com/viktoroddy" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="block bg-neutral-50 border border-neutral-200 text-neutral-900 rounded-2xl p-8 hover:bg-neutral-100/60 hover:border-neutral-300 hover:scale-[1.01] transition-all duration-200 text-left relative overflow-hidden group"
                        id="link-viktoroddy"
                      >
                        <span className="text-[10px] font-mono tracking-widest text-[#52525b] uppercase mb-4 block">
                          X CREATOR CORNER
                        </span>
                        <h2 className="text-xl font-display font-medium mb-3 tracking-tight">Viktor Oddy's X Channel</h2>
                        <p className="text-xs text-neutral-500 leading-relaxed mb-6 max-w-sm">
                          Premium tips, layout reviews, micro-animation breakdowns, and tactical aesthetic frameworks for modern web designers.
                        </p>
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-neutral-900">
                          <span>x.com/viktoroddy</span>
                          <ExternalLink className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </a>

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
          <span className="text-neutral-500">© 2026 The Indie Web. All rights reserved.</span>
        </div>
        <div className="flex flex-wrap gap-x-6 gap-y-2 items-center justify-center">
          <a href="https://x.com/Shanekfarrell" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">X</a>
          <a href="https://www.linkedin.com/in/shanekevinfarrell/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">LI</a>
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
