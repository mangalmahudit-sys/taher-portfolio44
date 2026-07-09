const { useState, useEffect, useRef, useMemo, createContext, useContext, StrictMode } = React;
const { motion, useScroll, useTransform, useSpring, useInView, useMotionValue, AnimatePresence } = window.Motion;

// --- Scroll Progress Bar ---
const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });
  return (
    <motion.div
      style={{
        scaleX,
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '4px',
        background: '#000',
        transformOrigin: '0%',
        zIndex: 9999
      }}
    />
  );
};

// --- Animated Text Utils ---
const AnimatedText = ({ text, className, once = true }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once, margin: '-10%' });
  const words = text.split(' ');

  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.04, delayChildren: 0.04 * i },
    }),
  };
  const child = {
    visible: { opacity: 1, y: 0, transition: { type: 'spring', damping: 20, stiffness: 100 } },
    hidden: { opacity: 0, y: 40 },
  };

  return (
    <motion.div ref={ref} className={className} variants={container} initial="hidden" animate={inView ? 'visible' : 'hidden'}>
      {words.map((word, index) => (
        <motion.span variants={child} style={{ display: 'inline-block', marginRight: '0.25em' }} key={index}>
          {word}
        </motion.span>
      ))}
    </motion.div>
  );
};

// --- Pill Component ---
const Pill = ({ children, variant = 'default', className = '', as = 'div', ...props }) => {
  const Component = as;
  let variantClasses = '';
  if (variant === 'outline') variantClasses = 'pill-outline';
  else if (variant === 'black') variantClasses = 'pill-black';
  return (
    <Component className={`pill ${variantClasses} ${className}`} {...props}>
      {children}
    </Component>
  );
};

// --- Navbar Component ---
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  const menuItems = [
    { label: 'Home', href: '#home' },
    { label: 'About', href: '#about' },
    { label: 'Projects', href: '#projects' },
    { label: 'Contact', href: '#contact' }
  ];

  return (
    <div className="navbar-wrapper">
      <motion.nav
        className="navbar"
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="nav-left">
          <div className="brand" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} style={{ cursor: 'pointer' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="2" y="10" width="16" height="6" rx="2" transform="rotate(-35 2 10)" fill="black" />
              <rect x="8" y="14" width="16" height="6" rx="2" transform="rotate(-35 8 14)" fill="black" />
            </svg>
            <span className="brand-text mobile-hidden">Taher Mangal Mahudi</span>
          </div>

          <button className="menu-btn" onClick={toggleMenu} aria-label="Toggle Menu">
            <div className="menu-icon-circle">
              {isOpen ? (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 12h16" /><path d="M4 6h16" /><path d="M4 18h16" />
                </svg>
              )}
            </div>
            <span>{isOpen ? 'Close' : 'Menu'}</span>
          </button>

          <div className="nav-tags mobile-hidden">
            <Pill>UI/UX Design</Pill>
            <Pill>Visual Design</Pill>
          </div>
        </div>

        <div className="nav-right mobile-hidden">
          <Pill>
            <div className="status-dot-circle">
              <svg width="10" height="10" viewBox="0 0 10 10" fill="white">
                <circle cx="2.5" cy="2.5" r="1.5" />
                <circle cx="7.5" cy="2.5" r="1.5" />
                <circle cx="2.5" cy="7.5" r="1.5" />
                <circle cx="7.5" cy="7.5" r="1.5" />
              </svg>
            </div>
            Available for Work
          </Pill>
        </div>
      </motion.nav>

      {/* Glassmorphic Dropdown / Fullscreen Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className="menu-overlay"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="menu-links">
              {menuItems.map((item, idx) => (
                <motion.a
                  key={idx}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="menu-link-item"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 + 0.1 }}
                >
                  <span className="menu-link-number">0{idx + 1}</span>
                  <span className="menu-link-text">{item.label}</span>
                </motion.a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- Hero Component ---
const Hero = () => {
  return (
    <section id="home" className="hero-section">
      <div className="hero-video-wrapper">
        <motion.video
          className="hero-video"
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260508_215831_c6a8989c-d716-4d8d-8745-e972a2eec711.mp4"
          autoPlay
          muted
          loop
          playsInline
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>

      <motion.div
        className="hero-footer-wrapper"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="container hero-footer">
          <div className="hero-left-block">
            <motion.div
              className="hero-subtitle"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8, duration: 1 }}
            >
              <motion.div className="dot" animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 2 }} />
              <span>Designing simple, useful & beautiful digital experiences</span>
            </motion.div>

            <motion.h1
              className="hero-heading"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.0, duration: 1 }}
            >
              UI/UX Designer /<br />
              Crafting Digital Experiences.
            </motion.h1>

            <motion.div
              className="hero-buttons"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.2, duration: 1 }}
            >
              <Pill as="a" href="#projects" variant="black" className="hero-btn">View Projects</Pill>
              <Pill as="a" href="#contact" variant="outline" className="hero-btn-outline">Contact Me</Pill>
            </motion.div>
          </div>


        </div>
      </motion.div>
    </section>
  );
};

// --- About Component ---
const About = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 80%', 'center center'] });

  return (
    <section id="about" className="section about-section" ref={ref}>
      <div className="container">
        <div className="about-content">
          <AnimatedText text="I design user-friendly interfaces that solve real problems." className="about-heading" />

          <motion.p
            className="about-paragraph"
            style={{ opacity: scrollYProgress, y: useTransform(scrollYProgress, [0, 1], [50, 0]) }}
          >
            I am a UI/UX Designer and Graphic Designer focused on creating clean, purposeful, and easy-to-use digital products. I work from research and wireframes to high-fidelity UI and interactive prototypes.
          </motion.p>

          <motion.div
            style={{
              opacity: scrollYProgress,
              y: useTransform(scrollYProgress, [0, 1], [30, 0]),
              marginTop: '-40px',
              marginBottom: '60px'
            }}
          >
            <Pill
              as="a"
              href="./resume.pdf"
              download="Taher_Mangal_Mahudi_Resume.pdf"
              variant="black"
              style={{ display: 'inline-flex', gap: '8px', alignItems: 'center' }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" x2="12" y1="15" y2="3" />
              </svg>
              Download Resume
            </Pill>
          </motion.div>

          <div className="about-info-grid" style={{ marginBottom: '60px' }}>
            {
              [
                { label: 'Location', value: 'India' },
                { label: 'Focus', value: 'UI/UX Design' },
              ].map((info, idx) => {
                return (
                  <motion.div
                    key={idx}
                    className="info-card"
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-5%' }}
                    transition={{ duration: 0.6, delay: idx * 0.1, ease: 'easeOut' }}
                  >
                    <span className="info-label text-gray">{info.label}</span>
                    <span className="info-value">{info.value}</span>
                  </motion.div>
                );
              })
            }
          </div>
        </div>
      </div>
    </section>
  );
};

// --- Skills Animations ---
const WireframingAnim = () => (
  <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none">
    <line x1="10" y1="10" x2="90" y2="10" stroke="var(--color-border)" strokeWidth="1" strokeDasharray="2,2" />
    <line x1="10" y1="30" x2="90" y2="30" stroke="var(--color-border)" strokeWidth="1" />
    <line x1="30" y1="30" x2="30" y2="90" stroke="var(--color-border)" strokeWidth="1" />
    <motion.rect
      x="40" y="40" width="40" height="40" rx="2"
      stroke="#4285F4" strokeWidth="1.5" fill="rgba(66, 133, 244, 0.05)"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
    />
    <motion.line
      x1="40" y1="40" x2="80" y2="80" stroke="#4285F4" strokeWidth="1" strokeDasharray="2,2"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
    />
    <motion.line
      x1="80" y1="40" x2="40" y2="80" stroke="#4285F4" strokeWidth="1" strokeDasharray="2,2"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
    />
  </svg>
);

const UXResearchAnim = () => (
  <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none">
    <motion.circle cx="30" cy="50" r="6" fill="#34A853" animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 2 }} />
    <motion.circle cx="70" cy="30" r="5" fill="#34A853" animate={{ scale: [1, 1.3, 1] }} transition={{ repeat: Infinity, duration: 2.3 }} />
    <motion.circle cx="70" cy="70" r="7" fill="#34A853" animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 1.8 }} />
    <motion.line x1="30" y1="50" x2="70" y2="30" stroke="#34A853" strokeWidth="1.5" strokeDasharray="4,4" animate={{ strokeDashoffset: [0, -10] }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }} />
    <motion.line x1="30" y1="50" x2="70" y2="70" stroke="#34A853" strokeWidth="1.5" strokeDasharray="4,4" animate={{ strokeDashoffset: [0, 10] }} transition={{ repeat: Infinity, duration: 2.2, ease: "linear" }} />
  </svg>
);

const UXAnim = () => (
  <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none">
    <motion.circle
      cx="40" cy="50" r="22"
      stroke="#EA4335" strokeWidth="1.5" fill="rgba(234, 67, 53, 0.05)"
      animate={{ cx: [40, 42, 40] }}
      transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
    />
    <motion.circle
      cx="60" cy="50" r="22"
      stroke="#EA4335" strokeWidth="1.5" fill="rgba(234, 67, 53, 0.05)"
      animate={{ cx: [60, 58, 60] }}
      transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
    />
    <motion.circle cx="50" cy="50" r="4" fill="#EA4335" animate={{ opacity: [0.3, 1, 0.3], scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 2 }} />
  </svg>
);

const UIDesignAnim = () => (
  <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none">
    <rect x="15" y="20" width="70" height="60" rx="3" stroke="var(--color-border)" strokeWidth="1.5" />
    <circle cx="23" cy="27" r="2" fill="#EA4335" />
    <circle cx="29" cy="27" r="2" fill="#FBBC05" />
    <circle cx="35" cy="27" r="2" fill="#34A853" />
    <motion.rect
      x="30" y="42" width="40" height="16" rx="2"
      stroke="#4285F4" strokeWidth="1.5" fill="rgba(66, 133, 244, 0.08)"
      animate={{ scale: [1, 1.05, 1] }}
      transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
    />
    <motion.polygon
      points="62,54 62,64 66,61 70,66 71,65 67,60 71,60"
      fill="#111"
      animate={{ x: [-5, 2, -5], y: [2, -4, 2] }}
      transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
    />
  </svg>
);

const UserFlowsAnim = () => (
  <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none">
    <circle cx="20" cy="50" r="6" stroke="#4285F4" strokeWidth="2" fill="var(--color-bg)" />
    <text x="20" y="53" fontSize="8" fill="#4285F4" textAnchor="middle" fontWeight="bold">A</text>
    <circle cx="50" cy="50" r="6" stroke="#4285F4" strokeWidth="2" fill="var(--color-bg)" />
    <text x="50" y="53" fontSize="8" fill="#4285F4" textAnchor="middle" fontWeight="bold">B</text>
    <circle cx="80" cy="50" r="6" stroke="#4285F4" strokeWidth="2" fill="var(--color-bg)" />
    <text x="80" y="53" fontSize="8" fill="#4285F4" textAnchor="middle" fontWeight="bold">C</text>
    <motion.line
      x1="26" y1="50" x2="44" y2="50"
      stroke="#4285F4" strokeWidth="1.5" strokeDasharray="3,3"
      animate={{ strokeDashoffset: [0, -6] }}
      transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
    />
    <motion.line
      x1="56" y1="50" x2="74" y2="50"
      stroke="#4285F4" strokeWidth="1.5" strokeDasharray="3,3"
      animate={{ strokeDashoffset: [0, -6] }}
      transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
    />
  </svg>
);

const ColorTheoryAnim = () => (
  <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none">
    <motion.rect
      x="20" y="30" width="16" height="40" rx="1"
      fill="#4285F4" stroke="var(--color-border)" strokeWidth="1"
      animate={{ y: [30, 26, 30] }}
      transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
    />
    <motion.rect
      x="42" y="30" width="16" height="40" rx="1"
      fill="#34A853" stroke="var(--color-border)" strokeWidth="1"
      animate={{ y: [30, 34, 30] }}
      transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
    />
    <motion.rect
      x="64" y="30" width="16" height="40" rx="1"
      fill="#FBBC05" stroke="var(--color-border)" strokeWidth="1"
      animate={{ y: [30, 28, 30] }}
      transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
    />
    <rect x="35" y="76" width="30" height="12" rx="2" fill="var(--color-text)" />
    <text x="50" y="84" fontSize="6" fill="var(--color-bg)" textAnchor="middle" fontWeight="bold">AAA PASS</text>
  </svg>
);

const TypographyAnim = () => (
  <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none">
    <line x1="10" y1="80" x2="90" y2="80" stroke="var(--color-border)" strokeWidth="0.5" />
    <line x1="50" y1="10" x2="50" y2="90" stroke="var(--color-border)" strokeWidth="0.5" strokeDasharray="1,2" />
    <motion.text
      x="50" y="70"
      fill="var(--color-text)"
      fontSize="48"
      textAnchor="middle"
      fontFamily="serif"
      animate={{ fontWeight: [200, 900, 200] }}
      transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
    >
      A
    </motion.text>
    <text x="50" y="88" fontSize="6" fill="var(--color-gray)" textAnchor="middle">w: 200 ➔ 900</text>
  </svg>
);

const MobileAppAnim = () => (
  <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none">
    <rect x="30" y="15" width="40" height="70" rx="6" stroke="var(--color-text)" strokeWidth="2" />
    <rect x="47" y="18" width="6" height="2" rx="1" fill="var(--color-text)" />
    <g clipPath="url(#phone-clip-view)">
      <defs>
        <clipPath id="phone-clip-view">
          <rect x="32" y="22" width="36" height="58" rx="2" />
        </clipPath>
      </defs>
      <motion.g animate={{ y: [0, -25, 0] }} transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}>
        <rect x="35" y="25" width="30" height="15" rx="2" fill="rgba(66, 133, 244, 0.1)" stroke="#4285F4" strokeWidth="1" />
        <circle cx="42" cy="32" r="3" fill="#4285F4" />
        <rect x="35" y="45" width="30" height="15" rx="2" fill="rgba(52, 168, 83, 0.1)" stroke="#34A853" strokeWidth="1" />
        <rect x="35" y="65" width="30" height="15" rx="2" fill="rgba(251, 188, 5, 0.1)" stroke="#FBBC05" strokeWidth="1" />
      </motion.g>
    </g>
  </svg>
);

const CSSAnim = () => (
  <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none">
    <rect x="15" y="15" width="70" height="70" stroke="#FBBC05" strokeWidth="1" strokeDasharray="3,3" />
    <text x="20" y="23" fontSize="5" fill="#FBBC05">margin</text>
    <motion.rect
      x="25" y="25" width="50" height="50"
      stroke="#34A853" strokeWidth="1"
      animate={{ x: [25, 23, 25], y: [25, 23, 25], width: [50, 54, 50], height: [50, 54, 50] }}
      transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
    />
    <text x="28" y="32" fontSize="5" fill="#34A853">padding</text>
    <rect x="35" y="35" width="30" height="30" stroke="#4285F4" strokeWidth="1.5" fill="rgba(66, 133, 244, 0.05)" />
    <text x="38" y="42" fontSize="5" fill="#4285F4">content</text>
  </svg>
);

const HTMLAnim = () => (
  <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none">
    <rect x="10" y="20" width="80" height="60" rx="3" fill="#222" />
    <motion.text
      x="20" y="38" fontSize="8" fill="#FBBC05" fontFamily="monospace"
      animate={{ opacity: [0.3, 1, 0.3] }}
      transition={{ repeat: Infinity, duration: 2 }}
    >
      &lt;div&gt;
    </motion.text>
    <motion.text
      x="30" y="52" fontSize="8" fill="#4285F4" fontFamily="monospace"
      animate={{ x: [0, 5, 0] }}
      transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
    >
      &lt;h1&gt;Hello&lt;/h1&gt;
    </motion.text>
    <motion.text
      x="20" y="66" fontSize="8" fill="#FBBC05" fontFamily="monospace"
      animate={{ opacity: [0.3, 1, 0.3] }}
      transition={{ repeat: Infinity, duration: 2 }}
    >
      &lt;/div&gt;
    </motion.text>
  </svg>
);

const InteractionDesignAnim = () => (
  <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none">
    <circle cx="50" cy="50" r="8" fill="var(--color-text)" />
    <motion.circle
      cx="50" cy="50" r="8"
      stroke="var(--color-text)" strokeWidth="1"
      animate={{ scale: [1, 4], opacity: [0.8, 0] }}
      transition={{ repeat: Infinity, duration: 2, ease: "easeOut" }}
    />
    <motion.circle
      cx="50" cy="50" r="8"
      stroke="var(--color-text)" strokeWidth="1"
      animate={{ scale: [1, 4], opacity: [0.8, 0] }}
      transition={{ repeat: Infinity, duration: 2, delay: 1, ease: "easeOut" }}
    />
  </svg>
);

const InformationArchitectureAnim = () => (
  <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none">
    <circle cx="50" cy="25" r="4" fill="var(--color-text)" />
    <circle cx="30" cy="55" r="4" fill="var(--color-text)" />
    <circle cx="70" cy="55" r="4" fill="var(--color-text)" />
    <motion.circle cx="20" cy="80" r="3" fill="#4285F4" animate={{ opacity: [0.2, 1, 0.2] }} transition={{ repeat: Infinity, duration: 1.5 }} />
    <motion.circle cx="40" cy="80" r="3" fill="#4285F4" animate={{ opacity: [0.2, 1, 0.2] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.5 }} />
    <motion.circle cx="60" cy="80" r="3" fill="#4285F4" animate={{ opacity: [0.2, 1, 0.2] }} transition={{ repeat: Infinity, duration: 1.5, delay: 1 }} />
    <path d="M 50,29 L 30,51" stroke="var(--color-border)" strokeWidth="1" />
    <path d="M 50,29 L 70,51" stroke="var(--color-border)" strokeWidth="1" />
    <path d="M 30,59 L 20,77" stroke="var(--color-border)" strokeWidth="1" strokeDasharray="2,2" />
    <path d="M 30,59 L 40,77" stroke="var(--color-border)" strokeWidth="1" strokeDasharray="2,2" />
    <path d="M 70,59 L 60,77" stroke="var(--color-border)" strokeWidth="1" strokeDasharray="2,2" />
  </svg>
);

const BrandingAnim = () => (
  <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none">
    <circle cx="50" cy="50" r="35" stroke="var(--color-border)" strokeWidth="0.5" strokeDasharray="2,2" />
    <circle cx="50" cy="50" r="20" stroke="var(--color-border)" strokeWidth="0.5" strokeDasharray="2,2" />
    <line x1="15" y1="50" x2="85" y2="50" stroke="var(--color-border)" strokeWidth="0.5" />
    <line x1="50" y1="15" x2="50" y2="85" stroke="var(--color-border)" strokeWidth="0.5" />
    <motion.path
      d="M 35,35 Q 50,20 65,35 T 50,80 Z"
      stroke="var(--color-text)" strokeWidth="2" fill="rgba(0,0,0,0.03)"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
    />
  </svg>
);

// --- 3D Software Logo Components ---
const FigmaLogo3D = () => (
  <div className="logo-3d-wrapper">
    <div className="logo-3d-layer shadow-layer" />
    <div className="logo-3d-layer base-layer" style={{ background: 'rgba(242, 78, 29, 0.05)', borderColor: '#F24E1E' }} />
    <div className="logo-3d-layer symbol-layer">
      <svg width="40" height="60" viewBox="0 0 54 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M13.3333 80.0002C20.6933 80.0002 26.6667 74.0268 26.6667 66.6668V53.3335H13.3333C5.97333 53.3335 0 59.3068 0 66.6668C0 74.0268 5.97333 80.0002 13.3333 80.0002Z" fill="#0ACF83" />
        <path d="M0 39.9998C0 32.6398 5.97333 26.6665 13.3333 26.6665H26.6667V53.3332H13.3333C5.97333 53.3332 0 47.3598 0 39.9998Z" fill="#A259FF" />
        <path d="M0 13.3333C0 5.97333 5.97333 0 13.3333 0H26.6667V26.6667H13.3333C5.97333 26.6667 0 20.6933 0 13.3333Z" fill="#F24E1E" />
        <path d="M26.6667 0H40.0001C47.3601 0 53.3334 5.97333 53.3334 13.3333C53.3334 20.6933 47.3601 26.6667 40.0001 26.6667H26.6667V0Z" fill="#FF7262" />
        <path d="M53.3334 39.9998C53.3334 47.3598 47.3601 53.3332 40.0001 53.3332C32.6401 53.3332 26.6667 47.3598 26.6667 39.9998C26.6667 32.6398 32.6401 26.6665 40.0001 26.6665C47.3601 26.6665 53.3334 32.6398 53.3334 39.9998Z" fill="#1ABCFE" />
      </svg>
    </div>
  </div>
);

const AdobeXDLogo3D = () => (
  <div className="logo-3d-wrapper">
    <div className="logo-3d-layer shadow-layer" />
    <div className="logo-3d-layer base-layer" style={{ background: 'rgba(255, 9, 218, 0.05)', borderColor: '#FF09DA' }} />
    <div className="logo-3d-layer symbol-layer">
      <svg width="50" height="50" viewBox="0 0 50 50" fill="none">
        <rect width="50" height="50" rx="8" fill="#470137" />
        <rect x="1" y="1" width="48" height="48" rx="7" stroke="#FF09DA" strokeWidth="2" />
        <text x="12" y="33" fill="#FF09DA" fontSize="22" fontFamily="sans-serif" fontWeight="900">X</text>
        <text x="28" y="33" fill="#FF09DA" fontSize="22" fontFamily="sans-serif" fontWeight="300">d</text>
      </svg>
    </div>
  </div>
);

const AdobePSLogo3D = () => (
  <div className="logo-3d-wrapper">
    <div className="logo-3d-layer shadow-layer" />
    <div className="logo-3d-layer base-layer" style={{ background: 'rgba(0, 194, 255, 0.05)', borderColor: '#00C2FF' }} />
    <div className="logo-3d-layer symbol-layer">
      <svg width="50" height="50" viewBox="0 0 50 50" fill="none">
        <rect width="50" height="50" rx="8" fill="#001E36" />
        <rect x="1" y="1" width="48" height="48" rx="7" stroke="#00C2FF" strokeWidth="2" />
        <text x="11" y="33" fill="#00C2FF" fontSize="22" fontFamily="sans-serif" fontWeight="900">P</text>
        <text x="27" y="33" fill="#00C2FF" fontSize="22" fontFamily="sans-serif" fontWeight="300">s</text>
      </svg>
    </div>
  </div>
);

const AdobeAILogo3D = () => (
  <div className="logo-3d-wrapper">
    <div className="logo-3d-layer shadow-layer" />
    <div className="logo-3d-layer base-layer" style={{ background: 'rgba(255, 154, 0, 0.05)', borderColor: '#FF9A00' }} />
    <div className="logo-3d-layer symbol-layer">
      <svg width="50" height="50" viewBox="0 0 50 50" fill="none">
        <rect width="50" height="50" rx="8" fill="#331C00" />
        <rect x="1" y="1" width="48" height="48" rx="7" stroke="#FF9A00" strokeWidth="2" />
        <text x="12" y="33" fill="#FF9A00" fontSize="22" fontFamily="sans-serif" fontWeight="900">A</text>
        <text x="29" y="33" fill="#FF9A00" fontSize="22" fontFamily="sans-serif" fontWeight="300">i</text>
      </svg>
    </div>
  </div>
);

const CorelDrawLogo3D = () => (
  <div className="logo-3d-wrapper">
    <div className="logo-3d-layer shadow-layer" />
    <div className="logo-3d-layer base-layer" style={{ background: 'rgba(52, 168, 83, 0.05)', borderColor: '#34A853' }} />
    <div className="logo-3d-layer symbol-layer">
      <svg width="60" height="60" viewBox="0 0 100 100" fill="none">
        <path d="M 50,15 C 22,15 16,35 18,53 C 20,65 32,75 50,83 C 68,75 80,65 82,53 C 84,35 78,15 50,15 Z" fill="rgba(52,168,83,0.1)" />
        <path d="M 50,15 C 22,15 16,35 18,53 C 20,65 32,75 50,83 C 40,77 32,67 30,55 C 28,37 36,18 50,15 Z" fill="#1B5E20" />
        <path d="M 50,15 C 30,18 28,37 30,55 C 32,67 40,77 50,83 C 44,77 38,67 36,55 C 34,37 40,18 50,15 Z" fill="#34A853" />
        <path d="M 50,15 C 36,18 34,37 36,55 C 38,67 44,77 50,83 C 56,77 62,67 64,55 C 66,37 64,18 50,15 Z" fill="#8BF642" />
        <path d="M 50,15 C 64,18 66,37 64,55 C 62,67 56,77 50,83 C 60,77 68,67 70,55 C 72,37 70,18 50,15 Z" fill="#34A853" />
        <path d="M 50,15 C 70,18 72,37 70,55 C 68,67 60,77 50,83 C 68,75 80,65 82,53 C 84,35 78,15 50,15 Z" fill="#1B5E20" />
        <path d="M 50,15 C 36,18 34,37 36,55 C 38,67 44,77 50,83" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
        <path d="M 50,15 C 44,18 38,67 36,55" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
        <path d="M 50,15 C 64,18 66,37 64,55 C 62,67 56,77 50,83" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
        <path d="M 50,15 C 56,18 62,67 64,55" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
        <rect x="45" y="88" width="10" height="6" rx="1.5" fill="#5D4037" stroke="#3E2723" strokeWidth="1" />
        <line x1="47" y1="83" x2="47" y2="88" stroke="#3E2723" strokeWidth="1" />
        <line x1="53" y1="83" x2="53" y2="88" stroke="#3E2723" strokeWidth="1" />
      </svg>
    </div>
  </div>
);

const PremiereProLogo3D = () => (
  <div className="logo-3d-wrapper">
    <div className="logo-3d-layer shadow-layer" />
    <div className="logo-3d-layer base-layer" style={{ background: 'rgba(234, 154, 255, 0.05)', borderColor: '#EA9AFF' }} />
    <div className="logo-3d-layer symbol-layer">
      <svg width="50" height="50" viewBox="0 0 50 50" fill="none">
        <rect width="50" height="50" rx="8" fill="#18002E" />
        <rect x="1" y="1" width="48" height="48" rx="7" stroke="#EA9AFF" strokeWidth="2" />
        <text x="12" y="33" fill="#EA9AFF" fontSize="22" fontFamily="sans-serif" fontWeight="900">P</text>
        <text x="27" y="33" fill="#EA9AFF" fontSize="22" fontFamily="sans-serif" fontWeight="300">r</text>
      </svg>
    </div>
  </div>
);

const FramerLogo3D = () => (
  <div className="logo-3d-wrapper">
    <div className="logo-3d-layer shadow-layer" />
    <div className="logo-3d-layer base-layer" style={{ background: 'rgba(0, 85, 255, 0.05)', borderColor: '#0055FF' }} />
    <div className="logo-3d-layer symbol-layer">
      <svg width="45" height="45" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4 0h16v8h-8zM4 8h8l8 8H4zM4 16h8v8z" fill="#0055FF" />
      </svg>
    </div>
  </div>
);

const GithubLogo3D = () => (
  <div className="logo-3d-wrapper">
    <div className="logo-3d-layer shadow-layer" />
    <div className="logo-3d-layer base-layer" style={{ background: 'rgba(24, 23, 23, 0.05)', borderColor: '#181717' }} />
    <div className="logo-3d-layer symbol-layer">
      <svg width="45" height="45" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" fill="#181717" />
      </svg>
    </div>
  </div>
);

// --- Software Card Component (Interactive 3D Perspective) ---
const SoftwareCard = ({ name, desc, logoComponent: LogoComponent, proficiency, level, themeColor, idx }) => {
  const [isHovered, setIsHovered] = useState(false);

  const cardStyle = {
    '--theme-color': themeColor,
    '--theme-glow': `${themeColor}22`,
  };

  return (
    <motion.div
      className={`skill-card software-skill-card ${isHovered ? 'hovered' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={cardStyle}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-5%' }}
      transition={{ duration: 0.8, delay: (idx % 3) * 0.1, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="software-card-glow" />
      <div className="skill-card-grid-bg" />

      <div className="skill-card-metrics">
        <span>PROF: {proficiency}%</span>
        <span>LVL: {level.toUpperCase()}</span>
        <span>ID: 0{idx + 1}</span>
      </div>

      <div className="skill-card-visual" style={{ perspective: '1000px', transformStyle: 'preserve-3d' }}>
        <LogoComponent />
      </div>

      <div className="skill-card-content">
        <h3 className="skill-card-title">{name}</h3>
        <p className="skill-card-desc text-gray">{desc}</p>
      </div>
    </motion.div>
  );
};

// --- Software List Data ---
const softwareListData = [
  {
    name: 'Figma',
    desc: 'Primary tool for collaborative UI/UX interfaces and component design systems.',
    logo: FigmaLogo3D,
    proficiency: 95,
    level: 'Expert',
    themeColor: '#F24E1E',
    skills: ['Design Systems', 'Auto Layout', 'Prototyping', 'Variables', 'Dev Mode']
  },
  {
    name: 'Framer',
    desc: 'Web builder and design tool for interactive sites and high-fidelity prototypes.',
    logo: FramerLogo3D,
    proficiency: 85,
    level: 'Advanced',
    themeColor: '#0055FF',
    skills: ['Site Design', 'React Components', 'Responsive Layouts', 'CMS Integration']
  },
  {
    name: 'Adobe XD',
    desc: 'Vector-based tool for mobile app design, wireframing, and quick layouts.',
    logo: AdobeXDLogo3D,
    proficiency: 85,
    level: 'Advanced',
    themeColor: '#FF09DA',
    skills: ['Wireframing', 'UI Kits', 'Voice Prototypes', 'Component States']
  },
  {
    name: 'Adobe Photoshop',
    desc: 'Advanced raster graphics editor for layout editing and visual design assets.',
    logo: AdobePSLogo3D,
    proficiency: 90,
    level: 'Expert',
    themeColor: '#00C2FF',
    skills: ['Photo Editing', 'Color Grading', 'Compositing', 'Asset Export']
  },
  {
    name: 'Adobe Illustrator',
    desc: 'Industry-standard vector editor for custom branding, icons, and illustrations.',
    logo: AdobeAILogo3D,
    proficiency: 88,
    level: 'Advanced',
    themeColor: '#FF9A00',
    skills: ['Vector Assets', 'Iconography', 'Logo Design', 'Typography']
  },
  {
    name: 'Corel Draw',
    desc: 'Vector drawing software for graphic layouts and logo guidelines construction.',
    logo: CorelDrawLogo3D,
    proficiency: 80,
    level: 'Advanced',
    themeColor: '#34A853',
    skills: ['Print Layouts', 'Vector Tracing', 'Logo Grids', 'Technical Drawing']
  },
  {
    name: 'Premiere Pro',
    desc: 'Non-linear video editing program for custom motion graphic animations and micro-interactions.',
    logo: PremiereProLogo3D,
    proficiency: 75,
    level: 'Proficient',
    themeColor: '#EA9AFF',
    skills: ['Video Editing', 'Lumetri Color', 'Audio Sync', 'Motion Graphics']
  },
  {
    name: 'GitHub',
    desc: 'Version control and collaboration platform for hosting code and managing design handoff repositories.',
    logo: GithubLogo3D,
    proficiency: 88,
    level: 'Advanced',
    themeColor: '#181717',
    skills: ['Git Flow', 'Pull Requests', 'Markdown', 'Projects', 'CI/CD Actions']
  }
];

// --- Skills Data ---
const skillsData = [
  { label: 'Wireframing', anim: WireframingAnim, desc: 'Structural blueprints and low-fidelity layout grid wireframes.' },
  { label: 'UX Research', anim: UXResearchAnim, desc: 'Competitor audits, surveys, personas, and market validation.' },
  { label: 'User Experience (UX)', anim: UXAnim, desc: 'Empathetic pathways, information hierarchy, and user-centric flows.' },
  { label: 'User Interface Design', anim: UIDesignAnim, desc: 'Clean, pixel-perfect layout screens with high-fidelity system design.' },
  { label: 'User Flows', anim: UserFlowsAnim, desc: 'Logic trees, sequential user navigation pathways, and decision trees.' },
  { label: 'Color Theory', anim: ColorTheoryAnim, desc: 'Visual contrast ratios, harmonized palettes, and accessibility checks.' },
  { label: 'Typography', anim: TypographyAnim, desc: 'Font hierarchy scale, tracking, and weight layout systems.' },
  { label: 'Mobile Application Design', anim: MobileAppAnim, desc: 'Responsive mobile screen cards and component interfaces.' },
  { label: 'Cascading Style Sheets (CSS)', anim: CSSAnim, desc: 'Custom box-model, layout layouts, flexbox, grid, and animations.' },
  { label: 'HTML', anim: HTMLAnim, desc: 'Semantic tag organization and robust structural DOM nesting.' },
  { label: 'Interaction Design', anim: InteractionDesignAnim, desc: 'Animated transitions, hover states, buttons, and micro-interactions.' },
  { label: 'Information Architecture', anim: InformationArchitectureAnim, desc: 'Site maps, page hierarchies, and content mapping tables.' },
  { label: 'Branding', anim: BrandingAnim, desc: 'Consistent design system vectors, logo logic, and visual assets.' }
];

const Skills = () => {
  const [activeTab, setActiveTab] = useState('technical');

  return (
    <section id="skills" className="section bg-light">
      <div className="container">
        <div className="section-header-row">
          <div className="section-header">
            <p className="text-gray" style={{ textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: '600', marginBottom: '16px' }}>
              Capabilities
            </p>
            <AnimatedText text="Skills & Competencies" className="section-title" />
          </div>

          <div className="skills-tab-switcher">
            <button
              className={`skills-tab-btn ${activeTab === 'technical' ? 'active' : ''}`}
              onClick={() => setActiveTab('technical')}
            >
              Technical Skills
              {activeTab === 'technical' && (
                <motion.div className="active-tab-indicator" layoutId="activeTabIndicator" />
              )}
            </button>
            <button
              className={`skills-tab-btn ${activeTab === 'software' ? 'active' : ''}`}
              onClick={() => setActiveTab('software')}
            >
              Software Skills
              {activeTab === 'software' && (
                <motion.div className="active-tab-indicator" layoutId="activeTabIndicator" />
              )}
            </button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'technical' ? (
            <motion.div
              key="technical"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="skills-grid"
            >
              {skillsData.map((skill, idx) => {
                const AnimComponent = skill.anim;
                return (
                  <motion.div
                    key={idx}
                    className="skill-card"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-5%' }}
                    transition={{ duration: 0.8, delay: (idx % 3) * 0.1, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <div className="skill-card-grid-bg" />
                    <div className="skill-card-metrics">
                      <span>W: 100%</span>
                      <span>H: 220px</span>
                      <span>ID: 0{idx + 1}</span>
                    </div>

                    <div className="skill-card-visual">
                      <AnimComponent />
                    </div>

                    <div className="skill-card-content">
                      <h3 className="skill-card-title">{skill.label}</h3>
                      <p className="skill-card-desc text-gray">{skill.desc}</p>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          ) : (
            <motion.div
              key="software"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="software-grid"
            >
              {softwareListData.map((item, idx) => (
                <SoftwareCard
                  key={idx}
                  idx={idx}
                  name={item.name}
                  desc={item.desc}
                  logoComponent={item.logo}
                  proficiency={item.proficiency}
                  level={item.level}
                  themeColor={item.themeColor}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

// --- Portfolio Card Component (Matching Screenshot Design) ---
// --- Portfolio Card Component (Matching Screenshot Design) ---
const PortfolioCard = ({ number, name, title, desc, img, link, year, tags, isUpcoming, objectPosition, onMouseEnter, onMouseLeave }) => {
  return (
    <a
      href={link || '#'}
      target="_blank"
      rel="noopener noreferrer"
      className="portfolio-card"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="portfolio-card-image-wrapper">
        {img ? (
          <img src={img} alt={title} style={objectPosition ? { objectPosition } : {}} />
        ) : (
          <div style={{ width: '100%', height: '100%', background: '#eaeaea' }} />
        )}
        <div className="portfolio-card-overlay" />
        {isUpcoming && (
          <div className="portfolio-card-upcoming-badge">
            Upcoming
          </div>
        )}
      </div>

      <div className="portfolio-card-info">
        <div className="portfolio-card-meta">
          <span>0{number} . {name}</span>
          <span>{year}</span>
        </div>

        <h3 className="portfolio-card-title">{title}</h3>
        <p className="portfolio-card-desc text-gray">{desc}</p>

        <div className="portfolio-card-tags">
          {tags && tags.map((tag, idx) => (
            <span key={idx} className="portfolio-card-tag">{tag}</span>
          ))}
        </div>
      </div>
    </a>
  );
};



// --- Portfolio Section (Split by Category) ---
const PortfolioSection = ({ appProjects, landingProjects, upcomingProjects }) => {
  const [activeTab, setActiveTab] = useState('app-web');
  const [hoverText, setHoverText] = useState('');
  const [isHovered, setIsHovered] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, { stiffness: 400, damping: 30 });
  const springY = useSpring(mouseY, { stiffness: 400, damping: 30 });

  const handleMouseMove = (e) => {
    mouseX.set(e.clientX);
    mouseY.set(e.clientY);
  };

  const handleMouseEnterCard = (type) => {
    if (type === 'upcoming') {
      setHoverText('Coming Soon');
    } else {
      setHoverText(type === 'case-study' ? 'See Case Study →' : 'See Design →');
    }
    setIsHovered(true);
  };

  const handleMouseLeaveCard = () => {
    setIsHovered(false);
  };

  return (
    <section
      id="projects"
      className="section portfolio-section-dark"
      onMouseMove={handleMouseMove}
      style={{ position: 'relative' }}
    >
      <div className="container">
        <div className="section-header-row">
          <div className="section-header" style={{ marginBottom: 0 }}>
            <p className="text-gray" style={{ textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: '600', marginBottom: '16px' }}>
              01 // Portfolio
            </p>
            <AnimatedText text="Portfolio" className="section-title" />
          </div>

          <div className="skills-tab-switcher portfolio-tab-switcher">
            <button
              className={`skills-tab-btn portfolio-tab-btn ${activeTab === 'app-web' ? 'active' : ''}`}
              onClick={() => setActiveTab('app-web')}
            >
              App & Web Design
              {activeTab === 'app-web' && (
                <motion.div className="active-tab-indicator portfolio-active-tab-indicator" layoutId="portfolioTabIndicator" />
              )}
            </button>
            <button
              className={`skills-tab-btn portfolio-tab-btn ${activeTab === 'landing' ? 'active' : ''}`}
              onClick={() => setActiveTab('landing')}
            >
              Landing Pages
              {activeTab === 'landing' && (
                <motion.div className="active-tab-indicator portfolio-active-tab-indicator" layoutId="portfolioTabIndicator" />
              )}
            </button>
            <button
              className={`skills-tab-btn portfolio-tab-btn ${activeTab === 'upcoming' ? 'active' : ''}`}
              onClick={() => setActiveTab('upcoming')}
            >
              Upcoming Projects
              {activeTab === 'upcoming' && (
                <motion.div className="active-tab-indicator portfolio-active-tab-indicator" layoutId="portfolioTabIndicator" />
              )}
            </button>
          </div>
        </div>

        <div style={{ marginTop: '48px' }}>
          <AnimatePresence mode="wait">
            {activeTab === 'app-web' && (
              <motion.div
                key="app-web"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4 }}
                className="portfolio-grid"
              >
                {appProjects.map((project, idx) => (
                  <PortfolioCard
                    key={idx}
                    number={idx + 1}
                    name={project.name}
                    title={project.title}
                    desc={project.description}
                    img={project.img}
                    link={project.link}
                    year={project.year}
                    tags={project.tags}
                    objectPosition={project.objectPosition}
                    onMouseEnter={() => handleMouseEnterCard('case-study')}
                    onMouseLeave={handleMouseLeaveCard}
                  />
                ))}
              </motion.div>
            )}

            {activeTab === 'landing' && (
              <motion.div
                key="landing"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4 }}
                className="portfolio-grid"
              >
                {landingProjects.map((project, idx) => (
                  <PortfolioCard
                    key={idx}
                    number={idx + 1}
                    name={project.name}
                    title={project.title}
                    desc={project.description}
                    img={project.img}
                    link={project.link}
                    year={project.year}
                    tags={project.tags}
                    objectPosition={project.objectPosition}
                    onMouseEnter={() => handleMouseEnterCard('design')}
                    onMouseLeave={handleMouseLeaveCard}
                  />
                ))}
              </motion.div>
            )}

            {activeTab === 'upcoming' && (
              <motion.div
                key="upcoming"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4 }}
                className="portfolio-grid"
              >
                {upcomingProjects.map((project, idx) => (
                  <PortfolioCard
                    key={idx}
                    number={idx + 1}
                    name={project.name}
                    title={project.title}
                    desc={project.description}
                    img={project.img}
                    link={project.link}
                    year={project.year}
                    tags={project.tags}
                    isUpcoming={true}
                    objectPosition={project.objectPosition}
                    onMouseEnter={() => handleMouseEnterCard('upcoming')}
                    onMouseLeave={handleMouseLeaveCard}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Custom Cursor Follower */}
      <motion.div
        className="custom-portfolio-cursor-wrapper mobile-hidden"
        style={{
          x: springX,
          y: springY,
        }}
      >
        <motion.div
          className="custom-portfolio-cursor"
          animate={{
            scale: isHovered ? 1 : 0,
            opacity: isHovered ? 1 : 0
          }}
          transition={{ type: 'spring', stiffness: 350, damping: 25 }}
        >
          {hoverText}
        </motion.div>
      </motion.div>
    </section>
  );
};



// --- Contact & Footer ---
// --- Contact Link Row Component ---
const ContactLinkRow = ({ number, platform, value, href, hoverColor, isDownload }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e) => {
    if (platform === 'Gmail') {
      e.preventDefault();
      navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <a
      href={href}
      target={isDownload ? undefined : "_blank"}
      rel={isDownload ? undefined : "noopener noreferrer"}
      className="contact-link-row"
      style={{ '--hover-color': hoverColor }}
      download={isDownload ? "Taher_Mangal_Mahudi_Resume.pdf" : undefined}
    >
      <div className="contact-link-line" />

      <div className="contact-link-content">
        <div className="contact-link-left">
          <span className="contact-link-number">{number}</span>
          <span className="contact-link-platform">{platform}</span>
        </div>

        <div className="contact-link-middle">
          <span className="contact-link-value">{copied ? 'Copied to Clipboard!' : value}</span>
        </div>

        <div className="contact-link-right">
          {platform === 'Gmail' && (
            <button className="contact-link-copy-btn" onClick={handleCopy}>
              {copied ? 'Copied ✓' : 'Copy'}
            </button>
          )}
          <span className="contact-link-arrow">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </span>
        </div>
      </div>
    </a>
  );
};

// --- Contact & Footer ---
const ContactAndFooter = () => {
  return (
    <section id="contact" className="contact-section" style={{ padding: '120px 0 0' }}>
      <div className="container" style={{ paddingBottom: '80px' }}>
        <div style={{ maxWidth: '800px', marginBottom: '48px' }}>
          <p className="text-gray" style={{ textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: '600', marginBottom: '16px' }}>
            Get In Touch
          </p>
          <AnimatedText text="Let’s build something together." className="contact-heading" />
          <p className="text-gray" style={{ marginTop: '24px', fontSize: 'clamp(1.1rem, 2vw, 1.4rem)', lineHeight: '1.6', maxWidth: '650px' }}>
            Open for UI/UX internships, full-time design roles, freelance contracts, and creative collaborations. Feel free to reach out via any platform!
          </p>
        </div>

        <div className="contact-link-rows-wrapper">
          <ContactLinkRow
            number="01"
            platform="Gmail"
            value="tahermangalmahudi@gmail.com"
            href="https://mail.google.com/mail/?view=cm&fs=1&to=tahermangalmahudi@gmail.com"
            hoverColor="#EA4335"
          />
          <ContactLinkRow
            number="02"
            platform="LinkedIn"
            value="Taher Mangal Mahudi"
            href="https://www.linkedin.com/in/taher-mangalmahudi-71bb8a390/"
            hoverColor="#0077B5"
          />
          <ContactLinkRow
            number="03"
            platform="Instagram"
            value="@taher_m44"
            href="https://www.instagram.com/taher_m44/"
            hoverColor="#E1306C"
          />
          <ContactLinkRow
            number="04"
            platform="Resume"
            value="Download CV / Resume (PDF)"
            href="./resume.pdf"
            hoverColor="#34A853"
            isDownload={true}
          />
        </div>
      </div>

      <div className="container footer-bottom" style={{ borderTop: 'none', paddingTop: '40px' }}>
        <div className="footer-links">
          <a href="#home">Home</a>
          <a href="#about">About</a>
          <a href="#projects">Projects</a>
        </div>
        <p className="footer-copyright">
          © 2026 Taher Mangal Mahudi.
        </p>
      </div>
    </section>
  );
};



// --- Main App Component ---
const appProjects = [
  {
    name: 'FURNI AR',
    title: 'Augmented Reality UX and Interactive Shopping Experience',
    description: 'Interactive AR furniture placement and shopping experience design, from low-fidelity wireframes to full prototypes.',
    year: '2026',
    img: './funit.png',
    link: 'https://www.figma.com/proto/ZpesSephEfgsDCPD8dF8Wg/Untitled?node-id=1-2',
    tags: ['AR/UX', 'MOBILE APP', 'FIGMA']
  },
  {
    name: 'MUSCLEX',
    title: 'Next-Gen Fitness App with Workout and Progress Tracking',
    description: 'Personalized workout planner, workout logs, progress tracking charts, and customized supplement shopping experiences.',
    year: '2026',
    img: './Frame 12.png',
    link: './case1.pdf',
    tags: ['HEALTH TECH', 'DESIGN SYSTEM', 'MOBILE']
  }
];

const landingProjects = [
  {
    name: 'ECODUST',
    title: 'Ecodust - Sci-Fi Survival Game Landing Page',
    description: 'Cinematic gaming landing page design with immersive visual storytelling, features grids, and character story maps.',
    year: '2025',
    img: './WEB  FIMGA.png',
    link: 'https://www.figma.com/proto/5tK0hqzmym5SIZiZM8QwsD/Untitled?node-id=1-2',
    tags: ['WEB DESIGN', 'GAMING', 'LANDING PAGE']
  },
  {
    name: 'HM CONCEPT',
    title: 'Modern Web Design and Editorial Layouts Showcase',
    description: 'Modern typography-driven editorial web layouts and visual design showcase with custom illustrations.',
    year: '2025',
    img: './UI HM.png',
    link: 'https://www.figma.com/proto/5tK0hqzmym5SIZiZM8QwsD/Untitled?node-id=1-2',
    tags: ['WEB DESIGN', 'BRANDING', 'EDITORIAL']
  },
  {
    name: 'HERON LANDING',
    title: 'Clean Responsive Web Identity and UI Design System',
    description: 'Clean layout grids and responsive web landing page for a modern corporate identity and UI systems developer.',
    year: '2025',
    img: './ui website heron.png',
    link: 'https://www.figma.com/proto/ju56WgFZ8gygCpJtx8Xeba/Untitled?node-id=2-2',
    tags: ['RESPONSIVE', 'IDENTITY', 'UI SYSTEM']
  }
];

const upcomingProjects = [
  {
    name: 'H&M REDESIGN',
    title: 'H&M Website Redesign',
    description: 'A modern redesign concept for the H&M website focused on improving user experience, visual hierarchy, and product discovery.',
    year: 'Upcoming',
    img: './fash man.png',
    link: '#',
    tags: ['WEB REDESIGN', 'UX/UI', 'CONCEPT'],
    objectPosition: 'top'
  },
  {
    name: 'NOVAPAY WALLET',
    title: 'NovaPay Mobile Wallet Redesign',
    description: 'A modern mobile wallet redesign focused on making digital payments faster, safer, and easier to use.',
    year: 'Upcoming',
    img: './nov.png',
    link: '#',
    tags: ['MOBILE APP', 'FINTECH', 'CONCEPT']
  }
];

function App() {
  return (
    <React.Fragment>
      <ScrollProgress />
      <Navbar />

      <main>
        <Hero />
        <About />
        <PortfolioSection appProjects={appProjects} landingProjects={landingProjects} upcomingProjects={upcomingProjects} />
        <Skills />
      </main>

      <ContactAndFooter />
    </React.Fragment>
  );
}

// Render the App
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
