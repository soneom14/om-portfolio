import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { 
  Shield, Terminal, Cpu, Code, Lock, Search, ExternalLink, Github, 
  Linkedin, Mail, Download, Printer, Sun, Moon, Menu, X, ChevronUp, 
  CheckCircle, AlertCircle, Server, Activity, Layers, Globe, User, 
  BookOpen, Briefcase, QrCode, Key, FileText, Filter, Camera, Upload, 
  Phone, Award
} from 'lucide-react';

export default function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('omjaisone_theme');
    return saved ? JSON.parse(saved) : true;
  });

  const [activeSection, setActiveSection] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const [projectCategory, setProjectCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProject, setSelectedProject] = useState(null);

  const [showResumeModal, setShowResumeModal] = useState(false);

  const [profileImage, setProfileImage] = useState(() => {
    return localStorage.getItem('omjaisone_photo') || '';
  });
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [photoUrlInput, setPhotoUrlInput] = useState('');
  const [imageError, setImageError] setActiveQrModal] = useState(null);

  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [formStatus, setFormStatus] = useState(null);

  const [cursorPos, setCursorPos] = useState({ x: -100, y: -100 });
  const [cursorHovered, setCursorHovered] = useState(false);

  useEffect(() => {
    localStorage.setItem('omjaisone_theme', JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
        localStorage.setItem('omjaisone_photo', reader.result);
        setImageError(false);
        setShowPhotoModal(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUrlSubmit = (e) => {
    e.preventDefault();
    if (photoUrlInput.trim()) {
      setProfileImage(photoUrlInput.trim());
      localStorage.setItem('omjaisone_photo', photoUrlInput.trim());
      setImageError(false);
      setPhotoUrlInput('');
      setShowPhotoModal(false);
    }
  };

  const handleResetPhoto = () => {
    setProfileImage('');
    localStorage.removeItem('omjaisone_photo');
    setImageError(false);
    setShowPhotoModal(false);
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
    };

    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }

      const sections = ['home', 'about', 'skills', 'projects', 'education', 'resume', 'contact'];
      const scrollPos = window.scrollY + 200;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, canvasRef.current.clientWidth / canvasRef.current.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, alpha: true, antialias: true });
    
    renderer.setSize(canvasRef.current.clientWidth, canvasRef.current.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const sphereGeometry = new THREE.IcosahedronGeometry(2.2, 2);
    const sphereMaterial = new THREE.MeshBasicMaterial({
      color: darkMode ? 0x00ffcc : 0x0284c7,
      wireframe: true,
      transparent: true,
      opacity: 0.35
    });
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    scene.add(sphere);

    const coreGeometry = new THREE.OctahedronGeometry(1.2, 0);
    const coreMaterial = new THREE.MeshBasicMaterial({
      color: darkMode ? 0x3b82f6 : 0x6366f1,
      wireframe: true,
      transparent: true,
      opacity: 0.75
    });
    const core = new THREE.Mesh(coreGeometry, coreMaterial);
    scene.add(core);

    const particleCount = 200;
    const particlesGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 10;
      positions[i + 1] = (Math.random() - 0.5) * 10;
      positions[i + 2] = (Math.random() - 0.5) * 10;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particlesMaterial = new THREE.PointsMaterial({
      color: darkMode ? 0x10b981 : 0x0284c7,
      size: 0.04,
      transparent: true,
      opacity: 0.8
    });
    const particleSystem = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particleSystem);

    camera.position.z = 4.5;

    let mouseX = 0;
    let mouseY = 0;

    const handleWindowMouseMove = (e) => {
      mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener('mousemove', handleWindowMouseMove);

    let animationFrameId;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      sphere.rotation.x += 0.003;
      sphere.rotation.y += 0.004;

      core.rotation.x -= 0.005;
      core.rotation.y -= 0.006;

      particleSystem.rotation.y += 0.001;

      sphere.rotation.y += mouseX * 0.01;
      sphere.rotation.x += mouseY * 0.01;

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!canvasRef.current) return;
      const width = canvasRef.current.clientWidth;
      const height = canvasRef.current.clientHeight;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mousemove', handleWindowMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      renderer.dispose();
    };
  }, [darkMode]);

  const projectsData = [
    {
      id: 'packetguard',
      name: 'PacketGuard',
      category: 'Cybersecurity',
      shortDesc: 'Gamified Cybersecurity & Network Packet Analysis Platform.',
      tech: ['Python', 'Flask', 'HTML/CSS', 'JavaScript', 'Network Security'],
      github: 'https://github.com/soneom14',
      overview: 'PacketGuard is a Flask-based learning platform that simulates TCP/UDP traffic and helps users investigate packet loss, duplication, reordering, and tampering.',
      problem: 'Grasping network protocol anomalies and packet-level details is often difficult without interactive visual telemetry tools.',
      objective: 'Build an intuitive learning tool featuring mission scoring, live traffic dashboards, and real-time anomaly insights.',
      features: ['Live Traffic Dashboard', 'TCP/UDP Packet Simulation', 'Mission Scoring Engine', 'Packet Tampering Insights'],
      implementation: 'Engineered with Python Flask backend, Scapy logic, and dynamic frontend charting using HTML, CSS, and JavaScript.',
      future: 'Add multi-user competitive CTF rooms and expanded packet pcap file parsing.'
    },
    {
      id: 'trackshield',
      name: 'TrackShield IoT Tracking System',
      category: 'Engineering',
      shortDesc: 'QR and GPS-based tracking system integrating hardware and software safety monitoring.',
      tech: ['ESP8266', 'GPS Module', 'GSM900A', 'Arduino / C++', 'IoT'],
      github: 'https://github.com/soneom14',
      overview: 'TrackShield is a hardware-software safety ecosystem leveraging ESP8266 microcontrollers, GPS modules, and GSM hardware to track positions and send safety alerts.',
      problem: 'Standalone safety trackers often lack real-time cellular fallback or rapid QR identity correlation.',
      objective: 'Construct a low-cost, reliable embedded tracker with real-time location streaming and QR identity verification.',
      features: ['Real-Time GPS Triangulation', 'GSM SMS Alert Dispatch', 'QR Identification Tag', 'Emergency Panic Button'],
      implementation: 'Hardware programmed in C++ via Arduino IDE, integrating cellular telemetry and custom serial protocols.',
      future: 'Incorporate low-power BLE mesh fallback and mobile application dashboard integration.'
    },
    {
      id: 'sentinelscan-ai',
      name: 'SentinelScan-AI',
      category: 'AI',
      shortDesc: 'CEH-aligned automated vulnerability assessment and pentest reporting framework.',
      tech: ['Python', 'Nmap', 'Burp Suite', 'AI / ML', 'Report Gen'],
      github: 'https://github.com/soneom14',
      overview: 'SentinelScan-AI is a Python-based vulnerability assessment framework designed for multi-threaded asset discovery, CVE mapping, and automated report generation.',
      problem: 'Manual vulnerability assessment requires repetitive scanning workflows and time-consuming report drafting.',
      objective: 'Automate port scanning, banner grabbing, threat scoring, and executive report formatting.',
      features: ['Threaded Port Scanning', 'Banner Grabbing & OS Fingerprinting', 'CVE Lookup & Risk Matrix', 'Automated HTML/PDF Reporting'],
      implementation: 'Written in modular Python, integrating subprocess scan wrappers, CVE lookup tables, and dynamic Jinja HTML/PDF rendering.',
      future: 'Implement direct web app spidering and vulnerability prioritization using AI agents.'
    },
    {
      id: 'youify',
      name: 'Youify - React Journaling App',
      category: 'Web Development',
      shortDesc: 'React-based journaling application for structured personal note-taking.',
      tech: ['React.js', 'JavaScript', 'HTML5', 'CSS3', 'Tailwind'],
      github: 'https://github.com/soneom14',
      overview: 'Youify is a clean, responsive web application designed for interactive journaling and digital note management.',
      problem: 'Standard note apps often lack focused writing environments and local data privacy controls.',
      objective: 'Deliver an intuitive UI with fast component rendering, local state persistence, and customized tag filtering.',
      features: ['Rich Journal Editor', 'Dynamic Categorization', 'Local Persistence', 'Responsive Dark Theme'],
      implementation: 'Built with React component architecture, utilizing state hooks and Tailwind styling for visual elegance.',
      future: 'Implement cloud synchronization and end-to-end encrypted entry backups.'
    },
    {
      id: 'drone-collision',
      name: 'Drone Collision Avoidance System',
      category: 'Engineering',
      shortDesc: 'Embedded proximity sensing and autonomous flight vector override module.',
      tech: ['Arduino', 'C++', 'Ultrasonic Sensors', 'Electronics'],
      github: 'https://github.com/soneom14',
      overview: 'An embedded safety subsystem engineered to detect proximity obstacles and execute evasive maneuvers.',
      problem: 'Micro drones operating in complex environments face collision risks due to limited sensor array integration.',
      objective: 'Build a low-latency hardware override circuit using distance sensors and real-time microcontroller loops.',
      features: ['Obstacle Distance Sensing', 'Interrupt Signal Override', 'Compact Microcontroller Shield', 'Low Latency Response'],
      implementation: 'Programmed in C++ for Arduino hardware, integrating sensor array interrupts and motor speed signals.',
      future: 'Upgrade to LIDAR sensor arrays and multi-axis optical flow sensor tracking.'
    },
    {
      id: 'soc-investigation-lab',
      name: 'SOC Investigation Lab',
      category: 'Cybersecurity',
      shortDesc: 'Virtual Security Operations Center sandbox for malware log analysis & incident response.',
      tech: ['Kali Linux', 'Parrot OS', 'Wireshark', 'Autopsy', 'FTK Imager'],
      github: 'https://github.com/soneom14',
      overview: 'A virtual laboratory setup configured for simulating attack vectors, inspecting syslogs, and performing disk and network forensics.',
      problem: 'Gaining hands-on security operation experience requires controlled environments for live attack/defense observation.',
      objective: 'Maintain a multi-VM setup with centralized log collection, threat hunting exercises, and forensic analysis.',
      features: ['Packet Analysis Logs', 'Memory & Disk Artifact Forensics', 'Attack Scenario Simulation', 'Incident Writeups'],
      implementation: 'Deployed across hypervisors using Kali Linux, Parrot OS, and digital forensic tools including Autopsy and FTK Imager.',
      future: 'Expand automated log parsing with SIEM integrations.'
    }
  ];

  const filteredProjects = projectsData.filter((project) => {
    const matchesCategory = projectCategory === 'All' || project.category === projectCategory;
    const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          project.shortDesc.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          project.tech.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setFormStatus('error');
      return;
    }
    setFormStatus('sending');
    setTimeout(() => {
      setFormStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 1200);
  };

  const scrollTo = (id) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className={`min-h-screen font-sans antialiased transition-colors duration-300 selection:bg-cyan-500 selection:text-black ${darkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      
      <div 
        className="hidden md:block fixed pointer-events-none z-50 transition-transform duration-75 ease-out -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-400 opacity-75"
        style={{
          left: `${cursorPos.x}px`,
          top: `${cursorPos.y}px`,
          width: cursorHovered ? '48px' : '24px',
          height: cursorHovered ? '48px' : '24px',
          boxShadow: darkMode ? '0 0 15px rgba(6, 182, 212, 0.6)' : '0 0 10px rgba(2, 132, 199, 0.4)',
          backgroundColor: cursorHovered ? 'rgba(6, 182, 212, 0.15)' : 'transparent'
        }}
      />

      <header className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${scrolled ? (darkMode ? 'bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80 py-3 shadow-lg' : 'bg-white/80 backdrop-blur-md border-b border-slate-200 py-3 shadow-sm') : 'bg-transparent py-5'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          
          <a 
            href="#home" 
            onClick={(e) => { e.preventDefault(); scrollTo('home'); }} 
            className="flex items-center space-x-2 group"
            onMouseEnter={() => setCursorHovered(true)}
            onMouseLeave={() => setCursorHovered(false)}
          >
            <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-cyan-500 via-blue-600 to-emerald-400 p-[2px] flex items-center justify-center shadow-md shadow-cyan-500/20 group-hover:shadow-cyan-500/40 transition-all">
              <div className={`w-full h-full ${darkMode ? 'bg-slate-950' : 'bg-white'} rounded-[6px] flex items-center justify-center`}>
                <Shield className="w-5 h-5 text-cyan-400" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg tracking-wider bg-gradient-to-r from-cyan-400 via-blue-400 to-emerald-400 bg-clip-text text-transparent">
                OM JAI SONE
              </span>
              <span className="text-[10px] tracking-widest text-slate-400 uppercase -mt-1 font-mono">
                ECE // CYBERSECURITY
              </span>
            </div>
          </a>

          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {[
              { id: 'home', label: 'Home' },
              { id: 'about', label: 'About' },
              { id: 'skills', label: 'Skills' },
              { id: 'projects', label: 'Projects' },
              { id: 'education', label: 'Education' },
              { id: 'resume', label: 'Resume' },
              { id: 'contact', label: 'Contact' }
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                onMouseEnter={() => setCursorHovered(true)}
                onMouseLeave={() => setCursorHovered(false)}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  activeSection === item.id
                    ? (darkMode ? 'text-cyan-400 bg-slate-900/80 border border-cyan-500/30' : 'text-blue-600 bg-blue-50 border border-blue-200')
                    : (darkMode ? 'text-slate-300 hover:text-cyan-400 hover:bg-slate-900/50' : 'text-slate-600 hover:text-blue-600 hover:bg-slate-100')
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-lg transition-all ${
                darkMode 
                  ? 'bg-slate-900 text-amber-400 border border-slate-800 hover:bg-slate-800' 
                  : 'bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200'
              }`}
              title="Toggle Theme"
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`md:hidden p-2 rounded-lg ${darkMode ? 'bg-slate-900 text-slate-200' : 'bg-slate-100 text-slate-800'}`}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className={`md:hidden px-4 pt-3 pb-6 border-b shadow-2xl ${darkMode ? 'bg-slate-950/95 border-slate-800' : 'bg-white/95 border-slate-200'}`}>
            <div className="flex flex-col space-y-2">
              {[
                { id: 'home', label: 'Home' },
                { id: 'about', label: 'About' },
                { id: 'skills', label: 'Skills' },
                { id: 'projects', label: 'Projects' },
                { id: 'education', label: 'Education' },
                { id: 'resume', label: 'Resume' },
                { id: 'contact', label: 'Contact' }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollTo(item.id)}
                  className={`text-left px-4 py-2.5 rounded-lg font-medium text-base transition-colors ${
                    activeSection === item.id
                      ? (darkMode ? 'bg-cyan-500/10 text-cyan-400 border-l-4 border-cyan-400' : 'bg-blue-50 text-blue-600 border-l-4 border-blue-600')
                      : (darkMode ? 'text-slate-300 hover:bg-slate-900' : 'text-slate-700 hover:bg-slate-100')
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </header>

      <section id="home" className="relative min-h-screen flex items-center pt-24 pb-16 overflow-hidden">
        <div 
          className="absolute inset-0 pointer-events-none opacity-10"
          style={{
            backgroundImage: `radial-gradient(${darkMode ? '#06b6d4' : '#0284c7'} 1px, transparent 1px)`,
            backgroundSize: '32px 32px'
          }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 backdrop-blur-sm text-cyan-400 text-xs font-mono tracking-wide">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>ECE STUDENT &amp; CYBERSECURITY DEVELOPER</span>
            </div>

            <div className="space-y-2">
              <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight">
                Hi, I'm <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-emerald-400 bg-clip-text text-transparent">OM JAI SONE</span>
              </h1>
              <p className="text-xl sm:text-2xl font-semibold text-slate-400 dark:text-slate-300 font-mono">
                Cybersecurity Enthusiast | Electronics &amp; Computer Engineering Student
              </p>
            </div>

            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed mx-auto lg:mx-0">
              "Securing the Digital World, One Innovation at a Time."
            </p>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-4">
              <button
                onClick={() => scrollTo('projects')}
                onMouseEnter={() => setCursorHovered(true)}
                onMouseLeave={() => setCursorHovered(false)}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all flex items-center space-x-2"
              >
                <Terminal className="w-5 h-5" />
                <span>View My Projects</span>
              </button>

              <button
                onClick={() => setShowResumeModal(true)}
                onMouseEnter={() => setCursorHovered(true)}
                onMouseLeave={() => setCursorHovered(false)}
                className={`px-6 py-3 rounded-xl font-semibold transition-all border flex items-center space-x-2 ${
                  darkMode 
                    ? 'bg-slate-900 border-slate-700 text-slate-200 hover:bg-slate-800 hover:border-cyan-500/40' 
                    : 'bg-white border-slate-300 text-slate-800 hover:bg-slate-100 hover:border-blue-400'
                }`}
              >
                <FileText className="w-5 h-5 text-cyan-500" />
                <span>Download Resume</span>
              </button>

              <button
                onClick={() => scrollTo('contact')}
                onMouseEnter={() => setCursorHovered(true)}
                onMouseLeave={() => setCursorHovered(false)}
                className={`px-6 py-3 rounded-xl font-semibold transition-all border flex items-center space-x-2 ${
                  darkMode 
                    ? 'bg-slate-950 border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10' 
                    : 'bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100'
                }`}
              >
                <Mail className="w-5 h-5" />
                <span>Contact Me</span>
              </button>
            </div>

            <div className="pt-6 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-sm text-slate-500">
              <a 
                href="https://github.com/soneom14" 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center space-x-2 hover:text-cyan-400 transition-colors"
              >
                <Github className="w-5 h-5" />
                <span>github.com/soneom14</span>
              </a>
              <a 
                href="https://www.linkedin.com/in/om-sone-ba591a352/" 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center space-x-2 hover:text-cyan-400 transition-colors"
              >
                <Linkedin className="w-5 h-5" />
                <span>LinkedIn</span>
              </a>
              <span className="flex items-center space-x-1.5 font-mono text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-md">
                <Globe className="w-3.5 h-3.5" />
                <span>Pune, Maharashtra, India</span>
              </span>
            </div>
          </div>

          <div className="lg:col-span-5 flex justify-center relative">
            <div className={`w-full max-w-md aspect-square rounded-3xl p-4 relative overflow-hidden border ${darkMode ? 'border-slate-800/80 bg-slate-900/40 backdrop-blur-md' : 'border-slate-200 bg-white/60 shadow-xl'}`}>
              <canvas ref={canvasRef} className="w-full h-full block rounded-2xl" />

              <div className="absolute bottom-6 left-6 right-6 p-3 rounded-xl bg-slate-950/80 border border-cyan-500/30 backdrop-blur-md text-xs font-mono text-cyan-400 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-emerald-400 animate-pulse" />
                  <span>SEC_CORE // SYSTEM ONLINE</span>
                </div>
                <span className="text-slate-500">MIT ADT ECE</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      <section id="about" className={`py-24 border-t ${darkMode ? 'border-slate-900 bg-slate-950/60' : 'border-slate-200 bg-slate-100/50'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-mono text-cyan-400 uppercase tracking-widest mb-2">01. BACKGROUND &amp; VISION</h2>
            <h3 className="text-3xl sm:text-4xl font-bold tracking-tight">About Me</h3>
            <div className="w-16 h-1 bg-gradient-to-r from-cyan-400 to-blue-600 mx-auto mt-4 rounded-full" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative group max-w-xs sm:max-w-sm w-full">
                <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-cyan-500 via-blue-500 to-emerald-400 opacity-30 group-hover:opacity-60 blur transition duration-500" />
                <div className={`relative rounded-2xl p-8 border flex flex-col items-center text-center space-y-6 ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-lg'}`}>
                  
                  <div className="relative group/avatar">
                    <div className="w-36 h-36 rounded-full bg-slate-950 border-2 border-cyan-400/60 overflow-hidden flex items-center justify-center relative shadow-xl shadow-cyan-500/10">
                      {profileImage && !imageError ? (
                        <img 
                          src={profileImage} 
                          alt="Om Jai Sone" 
                          onError={() => setImageError(true)}
                          className="w-full h-full object-cover object-top transition-transform duration-300 group-hover/avatar:scale-105"
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center text-cyan-400 space-y-1">
                          <Shield className="w-14 h-14 text-cyan-400 drop-shadow-[0_0_10px_rgba(6,182,212,0.6)] animate-pulse" />
                          <span className="text-[9px] font-mono tracking-widest text-slate-400">NO PHOTO</span>
                        </div>
                      )}
                      <div className="absolute inset-0 rounded-full border border-dashed border-cyan-500/40 animate-spin-slow pointer-events-none" />
                    </div>

                    <button
                      onClick={() => setShowPhotoModal(true)}
                      onMouseEnter={() => setCursorHovered(true)}
                      onMouseLeave={() => setCursorHovered(false)}
                      className="absolute bottom-0 right-0 p-2 rounded-full bg-cyan-500 text-black hover:bg-cyan-400 shadow-lg border border-slate-900 transition-all text-xs font-mono flex items-center space-x-1"
                      title="Upload / Change Profile Photo"
                    >
                      <Camera className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div>
                    <h4 className="text-xl font-bold">Om Jai Sone</h4>
                    <p className="text-sm font-mono text-cyan-400">Electronics &amp; Computer Engineering</p>
                    <p className="text-xs text-slate-500 mt-1">MIT ADT University, Pune</p>
                  </div>

                  <div className="w-full pt-4 border-t border-slate-800 text-left space-y-2 text-xs font-mono text-slate-400">
                    <div className="flex justify-between">
                      <span>STATUS:</span>
                      <span className="text-emerald-400">3rd Year Student</span>
                    </div>
                    <div className="flex justify-between">
                      <span>LOCATION:</span>
                      <span className="text-slate-300">Pune, MH, India</span>
                    </div>
                    <div className="flex justify-between">
                      <span>FOCUS:</span>
                      <span className="text-cyan-400">Cybersecurity &amp; Tech Dev</span>
                    </div>
                  </div>

                </div>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-6 text-slate-600 dark:text-slate-300 leading-relaxed">
              <p className="text-lg">
                I am <strong className="text-slate-900 dark:text-slate-100">Om Jai Sone</strong>, a third-year Electronics and Computer Engineering student at MIT ADT University, Pune, with a strong interest in cybersecurity, ethical hacking, penetration testing, network security, digital forensics, and software development.
              </p>
              
              <p>
                My background in Electronics &amp; Computer Engineering equips me with a unique dual perspective on hardware logic and high-level software security. I enjoy exploring how systems work under the hood, identifying security vulnerabilities, understanding modern threat vectors, and building security solutions.
              </p>

              <p>
                My work extends across cybersecurity research, artificial intelligence, web application security, vulnerability assessment, security automation, digital forensics, and hardware IoT projects.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                <div className={`p-4 rounded-xl border ${darkMode ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}`}>
                  <Lock className="w-6 h-6 text-cyan-400 mb-2" />
                  <h5 className="font-semibold text-slate-900 dark:text-slate-100 mb-1">Ethical Hacking &amp; Pentesting</h5>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Hands-on experience with Kali Linux, Nmap, Wireshark, Metasploit, Autopsy, FTK Imager, and Burp Suite.</p>
                </div>

                <div className={`p-4 rounded-xl border ${darkMode ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}`}>
                  <Cpu className="w-6 h-6 text-emerald-400 mb-2" />
                  <h5 className="font-semibold text-slate-900 dark:text-slate-100 mb-1">Hardware &amp; IoT Integration</h5>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Integrating ESP8266, ESP32, GSM, and GPS modules for real-world tracking and safety solutions.</p>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      <section id="skills" className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-mono text-cyan-400 uppercase tracking-widest mb-2">02. TECHNICAL MATRIX</h2>
            <h3 className="text-3xl sm:text-4xl font-bold tracking-tight">Skills &amp; Toolkit</h3>
            <div className="w-16 h-1 bg-gradient-to-r from-cyan-400 to-blue-600 mx-auto mt-4 rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            <div className={`p-6 rounded-2xl border transition-all hover:border-cyan-500/50 ${darkMode ? 'bg-slate-900/70 border-slate-800' : 'bg-white border-slate-200 shadow-md'}`}>
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  <Shield className="w-6 h-6" />
                </div>
                <h4 className="text-xl font-bold">Cybersecurity</h4>
              </div>
              <ul className="space-y-2.5">
                {[
                  'Ethical Hacking & Pentesting',
                  'Network Security',
                  'Web Application Security',
                  'Vulnerability Assessment',
                  'Basic Digital Forensics',
                  'Security Automation'
                ].map((skill, idx) => (
                  <li key={idx} className="flex items-center space-x-2 text-sm text-slate-300 dark:text-slate-300">
                    <CheckCircle className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span>{skill}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className={`p-6 rounded-2xl border transition-all hover:border-emerald-500/50 ${darkMode ? 'bg-slate-900/70 border-slate-800' : 'bg-white border-slate-200 shadow-md'}`}>
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <Key className="w-6 h-6" />
                </div>
                <h4 className="text-xl font-bold">Security Tools</h4>
              </div>
              <ul className="space-y-2.5">
                {[
                  'Burp Suite & Nmap',
                  'Wireshark & Metasploit',
                  'Autopsy & FTK Imager',
                  'WPScan & NetHunter'
                ].map((skill, idx) => (
                  <li key={idx} className="flex items-center space-x-2 text-sm text-slate-300 dark:text-slate-300">
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{skill}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className={`p-6 rounded-2xl border transition-all hover:border-blue-500/50 ${darkMode ? 'bg-slate-900/70 border-slate-800' : 'bg-white border-slate-200 shadow-md'}`}>
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  <Code className="w-6 h-6" />
                </div>
                <h4 className="text-xl font-bold">Programming</h4>
              </div>
              <ul className="space-y-2.5">
                {[
                  'Python',
                  'C & C++',
                  'JavaScript',
                  'HTML5 & CSS3',
                  'SQL'
                ].map((skill, idx) => (
                  <li key={idx} className="flex items-center space-x-2 text-sm text-slate-300 dark:text-slate-300">
                    <CheckCircle className="w-4 h-4 text-blue-400 shrink-0" />
                    <span>{skill}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className={`p-6 rounded-2xl border transition-all hover:border-purple-500/50 ${darkMode ? 'bg-slate-900/70 border-slate-800' : 'bg-white border-slate-200 shadow-md'}`}>
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                  <Cpu className="w-6 h-6" />
                </div>
                <h4 className="text-xl font-bold">Hardware &amp; IoT</h4>
              </div>
              <ul className="space-y-2.5">
                {[
                  'ESP8266 & ESP32',
                  'GSM900A & GPS Modules',
                  'Arduino Nano & 8051',
                  'Circuit Design & Testing'
                ].map((skill, idx) => (
                  <li key={idx} className="flex items-center space-x-2 text-sm text-slate-300 dark:text-slate-300">
                    <CheckCircle className="w-4 h-4 text-purple-400 shrink-0" />
                    <span>{skill}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className={`p-6 rounded-2xl border transition-all hover:border-amber-500/50 ${darkMode ? 'bg-slate-900/70 border-slate-800' : 'bg-white border-slate-200 shadow-md'}`}>
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  <Server className="w-6 h-6" />
                </div>
                <h4 className="text-xl font-bold">Operating Systems</h4>
              </div>
              <ul className="space-y-2.5">
                {[
                  'Linux',
                  'Kali Linux',
                  'Parrot OS'
                ].map((skill, idx) => (
                  <li key={idx} className="flex items-center space-x-2 text-sm text-slate-300 dark:text-slate-300">
                    <CheckCircle className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>{skill}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className={`p-6 rounded-2xl border transition-all hover:border-indigo-500/50 ${darkMode ? 'bg-slate-900/70 border-slate-800' : 'bg-white border-slate-200 shadow-md'}`}>
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  <Globe className="w-6 h-6" />
                </div>
                <h4 className="text-xl font-bold">Development &amp; Tools</h4>
              </div>
              <ul className="space-y-2.5">
                {[
                  'Git & GitHub',
                  'VS Code & VirtualBox',
                  'React.js & Flask'
                ].map((skill, idx) => (
                  <li key={idx} className="flex items-center space-x-2 text-sm text-slate-300 dark:text-slate-300">
                    <CheckCircle className="w-4 h-4 text-indigo-400 shrink-0" />
                    <span>{skill}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>

        </div>
      </section>

      <section id="projects" className={`py-24 border-t ${darkMode ? 'border-slate-900 bg-slate-950/80' : 'border-slate-200 bg-slate-100/50'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-xs font-mono text-cyan-400 uppercase tracking-widest mb-2">03. INNOVATIONS &amp; LABS</h2>
            <h3 className="text-3xl sm:text-4xl font-bold tracking-tight">Featured Projects</h3>
            <div className="w-16 h-1 bg-gradient-to-r from-cyan-400 to-blue-600 mx-auto mt-4 rounded-full" />
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10">
            <div className="flex flex-wrap items-center justify-center gap-2">
              {['All', 'Cybersecurity', 'AI', 'Web Development', 'Engineering'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setProjectCategory(cat)}
                  onMouseEnter={() => setCursorHovered(true)}
                  onMouseLeave={() => setCursorHovered(false)}
                  className={`px-4 py-2 rounded-lg text-xs font-mono transition-all ${
                    projectCategory === cat
                      ? 'bg-cyan-500 text-black font-bold shadow-md shadow-cyan-500/20'
                      : (darkMode ? 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800' : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200')
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="relative w-full md:w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-9 pr-4 py-2 rounded-lg text-xs font-mono focus:outline-none focus:ring-2 focus:ring-cyan-500 border ${
                  darkMode ? 'bg-slate-900 border-slate-800 text-slate-200' : 'bg-white border-slate-200 text-slate-800'
                }`}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <div 
                key={project.id}
                className={`group rounded-2xl border transition-all duration-300 flex flex-col justify-between overflow-hidden hover:-translate-y-1 ${
                  darkMode 
                    ? 'bg-slate-900/60 border-slate-800 hover:border-cyan-500/40 hover:shadow-xl hover:shadow-cyan-500/5' 
                    : 'bg-white border-slate-200 shadow-md hover:shadow-xl'
                }`}
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-mono px-2.5 py-1 rounded-md bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                      {project.category}
                    </span>
                    <FolderCodeIcon className="w-5 h-5 text-slate-500 group-hover:text-cyan-400 transition-colors" />
                  </div>

                  <h4 className="text-xl font-bold mb-2 group-hover:text-cyan-400 transition-colors">
                    {project.name}
                  </h4>

                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
                    {project.shortDesc}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {project.tech.map((t, idx) => (
                      <span key={idx} className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800/40 text-slate-400 border border-slate-800">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className={`p-4 border-t flex items-center justify-between text-xs font-mono ${darkMode ? 'border-slate-800 bg-slate-950/40' : 'border-slate-100 bg-slate-50'}`}>
                  <button
                    onClick={() => setSelectedProject(project)}
                    onMouseEnter={() => setCursorHovered(true)}
                    onMouseLeave={() => setCursorHovered(false)}
                    className="text-cyan-400 hover:underline flex items-center space-x-1"
                  >
                    <span>View Details</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>

                  <a
                    href={project.github}
                    target="_blank"
                    rel="noreferrer"
                    className="text-slate-400 hover:text-white flex items-center space-x-1"
                  >
                    <Github className="w-4 h-4" />
                    <span>Repository</span>
                  </a>
                </div>
              </div>
            ))}
          </div>

          {filteredProjects.length === 0 && (
            <div className="text-center py-12 text-slate-500 font-mono text-sm">
              No projects found matching current criteria.
            </div>
          )}

        </div>
      </section>

      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className={`w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border p-6 sm:p-8 relative ${darkMode ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900 shadow-2xl'}`}>
            
            <button
              onClick={() => setSelectedProject(null)}
              className="absolute top-4 right-4 p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="inline-block px-3 py-1 rounded-md text-xs font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 mb-3">
              {selectedProject.category}
            </div>

            <h3 className="text-2xl font-bold mb-4">{selectedProject.name}</h3>

            <p className="text-slate-400 text-sm mb-6 leading-relaxed">
              {selectedProject.overview}
            </p>

            <div className="space-y-6 text-sm">
              <div>
                <h5 className="font-semibold text-cyan-400 font-mono text-xs uppercase tracking-wider mb-1">Problem Statement</h5>
                <p className="text-slate-300">{selectedProject.problem}</p>
              </div>

              <div>
                <h5 className="font-semibold text-cyan-400 font-mono text-xs uppercase tracking-wider mb-1">Objective</h5>
                <p className="text-slate-300">{selectedProject.objective}</p>
              </div>

              <div>
                <h5 className="font-semibold text-cyan-400 font-mono text-xs uppercase tracking-wider mb-2">Key Features</h5>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-mono text-xs">
                  {selectedProject.features.map((feat, idx) => (
                    <li key={idx} className="flex items-center space-x-2">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h5 className="font-semibold text-cyan-400 font-mono text-xs uppercase tracking-wider mb-1">Implementation Details</h5>
                <p className="text-slate-300">{selectedProject.implementation}</p>
              </div>

              <div>
                <h5 className="font-semibold text-cyan-400 font-mono text-xs uppercase tracking-wider mb-1">Future Scope</h5>
                <p className="text-slate-300">{selectedProject.future}</p>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-slate-800 flex items-center justify-between">
              <a
                href={selectedProject.github}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-mono text-xs flex items-center space-x-2"
              >
                <Github className="w-4 h-4" />
                <span>View Repository</span>
              </a>

              <button
                onClick={() => setSelectedProject(null)}
                className="px-4 py-2 rounded-lg bg-cyan-500 text-black font-semibold text-xs"
              >
                Close Window
              </button>
            </div>

          </div>
        </div>
      )}

      <section id="education" className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-mono text-cyan-400 uppercase tracking-widest mb-2">04. ACADEMIC &amp; TRAINING</h2>
            <h3 className="text-3xl sm:text-4xl font-bold tracking-tight">Education, Internships &amp; Certifications</h3>
            <div className="w-16 h-1 bg-gradient-to-r from-cyan-400 to-blue-600 mx-auto mt-4 rounded-full" />
          </div>

          <div className="max-w-3xl mx-auto relative border-l-2 border-slate-800 ml-4 sm:ml-auto space-y-12 pl-6 sm:pl-8">
            
            <div className="relative">
              <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-6 h-6 rounded-full bg-cyan-500 border-4 border-slate-950 flex items-center justify-center shadow-lg shadow-cyan-500/50" />
              
              <div className={`p-6 rounded-2xl border ${darkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-md'}`}>
                <span className="text-xs font-mono text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded border border-cyan-500/20">
                  2024 - 2028 | UNDERGRADUATE
                </span>
                <h4 className="text-xl font-bold mt-2">B.Tech in Electronics &amp; Computer Engineering (3rd Year)</h4>
                <p className="text-slate-400 text-sm font-semibold mt-1">MIT ADT University, Pune</p>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  Focusing on cybersecurity, network protocols, digital forensics, embedded systems hardware, and software development.
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-6 h-6 rounded-full bg-blue-500 border-4 border-slate-950 flex items-center justify-center shadow-lg shadow-blue-500/50" />
              
              <div className={`p-6 rounded-2xl border ${darkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-md'}`}>
                <span className="text-xs font-mono text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded border border-blue-500/20">
                  2021 - 2024 | DIPLOMA
                </span>
                <h4 className="text-xl font-bold mt-2">Diploma in Electronics &amp; Telecommunication</h4>
                <p className="text-slate-400 text-sm font-semibold mt-1">Cusrow Wadia Institute of Technology, Pune</p>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  Strong foundation in electronic circuits, telecommunications, signal analysis, and hardware assembly.
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-6 h-6 rounded-full bg-slate-600 border-4 border-slate-950 flex items-center justify-center shadow-lg" />
              
              <div className={`p-6 rounded-2xl border ${darkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-md'}`}>
                <span className="text-xs font-mono text-slate-400 bg-slate-800/40 px-2.5 py-1 rounded border border-slate-800">
                  2020 - 2021 | 10TH GRADE
                </span>
                <h4 className="text-xl font-bold mt-2">Secondary School Certificate</h4>
                <p className="text-slate-400 text-sm font-semibold mt-1">Sardar Dastur Hoshang Boys High School</p>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-6 h-6 rounded-full bg-emerald-500 border-4 border-slate-950 flex items-center justify-center shadow-lg shadow-emerald-500/50" />
              
              <div className={`p-6 rounded-2xl border ${darkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-md'}`}>
                <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/20">
                  CYBERSECURITY INTERNSHIP
                </span>
                <h4 className="text-xl font-bold mt-2">Cybersecurity Intern</h4>
                <p className="text-slate-400 text-sm font-semibold mt-1">Corizo (2-Month Online Internship &amp; Training)</p>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  Hands-on training in ethical hacking, network analysis, vulnerability assessment with Kali Linux, Wireshark, Nmap, Metasploit, and Burp Suite. Built cloud pentesting lab projects.
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-6 h-6 rounded-full bg-amber-500 border-4 border-slate-950 flex items-center justify-center shadow-lg shadow-amber-500/50" />
              
              <div className={`p-6 rounded-2xl border ${darkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-md'}`}>
                <span className="text-xs font-mono text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded border border-amber-500/20">
                  ELECTRONICS INTERNSHIP
                </span>
                <h4 className="text-xl font-bold mt-2">Electronics Manufacturing Intern</h4>
                <p className="text-slate-400 text-sm font-semibold mt-1">KK Electronics, Pune (1.5 Months)</p>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  Industrial internship focused on component assembly, device testing, circuit wiring, hardware maintenance, and production quality control.
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-6 h-6 rounded-full bg-purple-500 border-4 border-slate-950 flex items-center justify-center shadow-lg shadow-purple-500/50" />
              
              <div className={`p-6 rounded-2xl border ${darkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-md'}`}>
                <span className="text-xs font-mono text-purple-400 bg-purple-500/10 px-2.5 py-1 rounded border border-purple-500/20">
                  ACCREDITATIONS &amp; CERTIFICATES
                </span>
                <h4 className="text-xl font-bold mt-2 mb-4">Certifications &amp; Achievements</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono text-slate-300">
                  <div className="flex items-center space-x-2">
                    <Award className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span>CEH Training Completed</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Award className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span>CHFI Training Completed</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Award className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>AWS Cloud Practitioner</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Award className="w-4 h-4 text-blue-400 shrink-0" />
                    <span>Google Cloud Intro to Gen AI</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Award className="w-4 h-4 text-purple-400 shrink-0" />
                    <span>IBM What is Data Science?</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Award className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>IGTT Research Presentation</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      <section id="resume" className={`py-24 border-t ${darkMode ? 'border-slate-900 bg-slate-950/80' : 'border-slate-200 bg-slate-100/50'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-xs font-mono text-cyan-400 uppercase tracking-widest mb-2">05. QUALIFICATIONS</h2>
            <h3 className="text-3xl sm:text-4xl font-bold tracking-tight">Resume Summary</h3>
            <div className="w-16 h-1 bg-gradient-to-r from-cyan-400 to-blue-600 mx-auto mt-4 rounded-full" />
          </div>

          <div className={`max-w-4xl mx-auto rounded-3xl border p-8 sm:p-12 ${darkMode ? 'bg-slate-900/70 border-slate-800' : 'bg-white border-slate-200 shadow-xl'}`}>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pb-8 border-b border-slate-800">
              <div>
                <h4 className="text-2xl font-bold">Om Jai Sone</h4>
                <p className="text-cyan-400 font-mono text-sm">3rd Year ECE Student | Cybersecurity Enthusiast</p>
                <p className="text-slate-500 text-xs mt-1">Pune, Maharashtra, India • +91 9028595962 • soneom14@gmail.com</p>
              </div>

              <div className="flex items-center space-x-3">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono flex items-center space-x-2"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print</span>
                </button>

                <button
                  onClick={() => setShowResumeModal(true)}
                  className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-xs flex items-center space-x-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Full View</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 text-sm">
              <div>
                <h5 className="font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider text-xs font-mono mb-3 text-cyan-400">
                  // Academic Qualifications
                </h5>
                <ul className="space-y-3">
                  <li className="border-l-2 border-cyan-500/40 pl-3">
                    <p className="font-semibold text-slate-200">MIT ADT University, Pune</p>
                    <p className="text-xs text-slate-400">B.Tech - Electronics &amp; Computer Engineering (2024–2028)</p>
                  </li>
                  <li className="border-l-2 border-cyan-500/40 pl-3">
                    <p className="font-semibold text-slate-200">Cusrow Wadia Institute of Tech</p>
                    <p className="text-xs text-slate-400">Diploma in E&amp;TC (2021–2024)</p>
                  </li>
                </ul>
              </div>

              <div>
                <h5 className="font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider text-xs font-mono mb-3 text-emerald-400">
                  // Key Skills
                </h5>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Kali Linux, Parrot OS, Nmap, Wireshark, Autopsy, FTK Imager, Metasploit, Burp Suite, Python, C/C++, HTML/CSS, JavaScript, ESP8266, ESP32, GSM, GPS, and AWS Cloud fundamentals.
                </p>
              </div>
            </div>

          </div>

        </div>
      </section>

      {showResumeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className={`w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl border p-8 relative ${darkMode ? 'bg-slate-950 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'}`}>
            
            <button
              onClick={() => setShowResumeModal(false)}
              className="absolute top-4 right-4 p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center pb-6 border-b border-slate-800">
              <h3 className="text-2xl font-bold uppercase tracking-wider">OM JAI SONE</h3>
              <p className="text-cyan-400 font-mono text-xs mt-1">3rd Year Electronics &amp; Computer Engineering Student | Cybersecurity Enthusiast</p>
              <p className="text-slate-400 text-xs mt-1">Pune, India | +91 9028595962 | soneom14@gmail.com</p>
            </div>

            <div className="py-6 space-y-6 text-xs leading-relaxed">
              <div>
                <h4 className="font-mono text-cyan-400 font-bold uppercase tracking-wider border-b border-slate-800 pb-1 mb-2">Professional Summary</h4>
                <p className="text-slate-300">
                  Third-year Electronics and Computer Engineering student at MIT ADT University with a strong interest in cybersecurity, ethical hacking, penetration testing, and digital forensics. Hands-on experience with Kali Linux, Nmap, Wireshark, Metasploit, and Burp Suite. Developing SentinelScan-AI, a Python vulnerability assessment framework.
                </p>
              </div>

              <div>
                <h4 className="font-mono text-cyan-400 font-bold uppercase tracking-wider border-b border-slate-800 pb-1 mb-2">Education</h4>
                <p><strong>B.Tech in Electronics &amp; Computer Engineering (3rd Year):</strong> MIT ADT University, Pune (2024–2028)</p>
                <p><strong>Diploma in Electronics &amp; Telecommunication:</strong> Cusrow Wadia Institute of Technology, Pune (2021–2024)</p>
                <p><strong>Secondary School (10th Grade):</strong> Sardar Dastur Hoshang Boys High School (2020–2021)</p>
              </div>

              <div>
                <h4 className="font-mono text-cyan-400 font-bold uppercase tracking-wider border-b border-slate-800 pb-1 mb-2">Internships &amp; Training</h4>
                <p><strong>Cybersecurity Intern (Corizo):</strong> Completed training in ethical hacking, penetration testing labs using Kali Linux, Nmap, Metasploit, and Burp Suite.</p>
                <p><strong>Electronics Intern (KK Electronics):</strong> Industrial internship focused on electronic manufacturing, circuit testing, device assembly, and maintenance.</p>
              </div>

              <div>
                <h4 className="font-mono text-cyan-400 font-bold uppercase tracking-wider border-b border-slate-800 pb-1 mb-2">Key Projects</h4>
                <p>• <strong>PacketGuard:</strong> Gamified Cybersecurity &amp; Network Packet Analysis Platform using Flask and Scapy.</p>
                <p>• <strong>TrackShield:</strong> IoT QR &amp; GPS-based tracking system using ESP8266 and GSM modules.</p>
                <p>• <strong>SentinelScan-AI:</strong> Automated Python Vulnerability Assessment &amp; HTML/PDF report framework.</p>
                <p>• <strong>Youify:</strong> React-based Journaling Application.</p>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 flex justify-between items-center text-xs font-mono">
              <span className="text-slate-500">[ Om Sone Resume Document ]</span>
              <button
                onClick={() => setShowResumeModal(false)}
                className="px-4 py-2 rounded-lg bg-cyan-500 text-black font-semibold"
              >
                Close Window
              </button>
            </div>

          </div>
        </div>
      )}

      {showPhotoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <div className={`w-full max-w-md rounded-2xl border p-6 relative ${darkMode ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900 shadow-2xl'}`}>
            <button
              onClick={() => setShowPhotoModal(false)}
              className="absolute top-4 right-4 p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-2 text-cyan-400 mb-2">
              <Camera className="w-5 h-5" />
              <h4 className="text-lg font-bold">Set Profile Photo</h4>
            </div>
            <p className="text-xs text-slate-400 mb-6">
              Upload an image file directly from your device or supply a direct image link.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-2 uppercase">Option 1: Upload Image File</label>
                <label className="w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-xl border border-dashed border-cyan-500/40 bg-cyan-500/5 hover:bg-cyan-500/10 text-cyan-400 cursor-pointer font-mono text-xs transition-colors">
                  <Upload className="w-4 h-4" />
                  <span>Choose Image File...</span>
                  <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                </label>
              </div>

              <div className="flex items-center space-x-2 my-2">
                <div className="h-px bg-slate-800 flex-1" />
                <span className="text-[10px] font-mono text-slate-500 uppercase">OR</span>
                <div className="h-px bg-slate-800 flex-1" />
              </div>

              <form onSubmit={handleUrlSubmit} className="space-y-3">
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1 uppercase">Option 2: Image URL</label>
                  <input
                    type="url"
                    placeholder="https://example.com/photo.jpg"
                    value={photoUrlInput}
                    onChange={(e) => setPhotoUrlInput(e.target.value)}
                    className={`w-full px-3 py-2.5 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-cyan-500 border ${
                      darkMode ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'
                    }`}
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-xs font-mono transition-colors"
                >
                  Apply URL
                </button>
              </form>

              {profileImage && (
                <div className="pt-2">
                  <button
                    onClick={handleResetPhoto}
                    className="w-full py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 font-mono text-xs transition-colors"
                  >
                    Reset Photo
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <section id="contact" className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-mono text-cyan-400 uppercase tracking-widest mb-2">06. GET IN TOUCH</h2>
            <h3 className="text-3xl sm:text-4xl font-bold tracking-tight">Contact &amp; Connect</h3>
            <div className="w-16 h-1 bg-gradient-to-r from-cyan-400 to-blue-600 mx-auto mt-4 rounded-full" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            <div className="lg:col-span-5 space-y-6">
              <div className={`p-6 rounded-2xl border ${darkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-md'}`}>
                <h4 className="text-lg font-bold mb-4">Direct Details</h4>
                
                <div className="space-y-4 text-sm">
                  <a href="mailto:soneom14@gmail.com" className="flex items-center space-x-3 text-slate-300 hover:text-cyan-400 transition-colors">
                    <div className="p-2.5 rounded-lg bg-cyan-500/10 text-cyan-400">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 font-mono">EMAIL</p>
                      <p className="font-semibold">soneom14@gmail.com</p>
                    </div>
                  </a>

                  <a href="tel:+919028595962" className="flex items-center space-x-3 text-slate-300 hover:text-cyan-400 transition-colors">
                    <div className="p-2.5 rounded-lg bg-purple-500/10 text-purple-400">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 font-mono">PHONE</p>
                      <p className="font-semibold">+91 9028595962</p>
                    </div>
                  </a>

                  <a href="https://github.com/soneom14" target="_blank" rel="noreferrer" className="flex items-center space-x-3 text-slate-300 hover:text-cyan-400 transition-colors">
                    <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-400">
                      <Github className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 font-mono">GITHUB</p>
                      <p className="font-semibold">github.com/soneom14</p>
                    </div>
                  </a>

                  <a href="https://www.linkedin.com/in/om-sone-ba591a352/" target="_blank" rel="noreferrer" className="flex items-center space-x-3 text-slate-300 hover:text-cyan-400 transition-colors">
                    <div className="p-2.5 rounded-lg bg-blue-500/10 text-blue-400">
                      <Linkedin className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 font-mono">LINKEDIN</p>
                      <p className="font-semibold">om-sone-ba591a352</p>
                    </div>
                  </a>
                </div>
              </div>

              <div className={`p-6 rounded-2xl border ${darkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-md'}`}>
                <h4 className="text-sm font-mono font-bold text-slate-400 uppercase tracking-wider mb-4">Profile QR Codes</h4>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setActiveQrModal('github')}
                    className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-cyan-500/40 text-left flex flex-col items-center justify-center space-y-2 group"
                  >
                    <QrCode className="w-8 h-8 text-cyan-400 group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-mono text-slate-300">GitHub QR</span>
                  </button>

                  <button
                    onClick={() => setActiveQrModal('linkedin')}
                    className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-blue-500/40 text-left flex flex-col items-center justify-center space-y-2 group"
                  >
                    <QrCode className="w-8 h-8 text-blue-400 group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-mono text-slate-300">LinkedIn QR</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7">
              <form onSubmit={handleFormSubmit} className={`p-8 rounded-2xl border space-y-6 ${darkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-lg'}`}>
                <h4 className="text-xl font-bold">Send Me a Message</h4>

                {formStatus === 'success' && (
                  <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 shrink-0" />
                    <span>Message received! Thank you for getting in touch.</span>
                  </div>
                )}

                {formStatus === 'error' && (
                  <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-mono flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>Please complete all required fields.</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-2 uppercase">Your Name *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className={`w-full px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 border ${
                        darkMode ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'
                      }`}
                      placeholder="e.g. Alex Mercer"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-2 uppercase">Your Email *</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className={`w-full px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 border ${
                        darkMode ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'
                      }`}
                      placeholder="e.g. alex@sec.io"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-2 uppercase">Subject</label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className={`w-full px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 border ${
                      darkMode ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'
                    }`}
                    placeholder="Project / Cyber Security Inquiry"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-2 uppercase">Message *</label>
                  <textarea
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className={`w-full px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 border ${
                      darkMode ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'
                    }`}
                    placeholder="Hello Om Jai, I would like to discuss..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={formStatus === 'sending'}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-sm shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center space-x-2"
                >
                  <Terminal className="w-4 h-4" />
                  <span>{formStatus === 'sending' ? 'Sending...' : 'Send Message'}</span>
                </button>
              </form>
            </div>

          </div>

        </div>
      </section>

      {activeQrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className={`w-full max-w-sm rounded-2xl border p-6 text-center relative ${darkMode ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'}`}>
            <button
              onClick={() => setActiveQrModal(null)}
              className="absolute top-4 right-4 p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <h4 className="text-lg font-bold mb-2">
              {activeQrModal === 'github' ? 'GitHub Link QR' : 'LinkedIn Link QR'}
            </h4>

            <div className="p-4 bg-white rounded-xl mx-auto w-52 h-52 flex items-center justify-center my-4 shadow-lg border border-slate-200">
              <img 
                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
                  activeQrModal === 'github' 
                    ? 'https://github.com/soneom14' 
                    : 'https://www.linkedin.com/in/om-sone-ba591a352/'
                )}`}
                alt={`${activeQrModal} QR Code`}
                className="w-full h-full object-contain"
              />
            </div>

            <p className="text-xs font-mono text-slate-400 break-all px-2">
              {activeQrModal === 'github' ? 'https://github.com/soneom14' : 'https://www.linkedin.com/in/om-sone-ba591a352/'}
            </p>
          </div>
        </div>
      )}

      <footer className={`py-12 border-t ${darkMode ? 'border-slate-900 bg-slate-950' : 'border-slate-200 bg-white'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-2">
            <Shield className="w-5 h-5 text-cyan-400" />
            <span className="font-bold text-sm bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              OM JAI SONE
            </span>
            <span className="text-xs text-slate-500 font-mono">© {new Date().getFullYear()}</span>
          </div>

          <p className="text-xs text-slate-500 font-mono text-center">
            Built with React, Tailwind CSS &amp; Three.js • MIT ADT University, Pune
          </p>

          <div className="flex items-center space-x-4 text-slate-400">
            <a href="https://github.com/soneom14" target="_blank" rel="noreferrer" className="hover:text-cyan-400 transition-colors">
              <Github className="w-4 h-4" />
            </a>
            <a href="https://www.linkedin.com/in/om-sone-ba591a352/" target="_blank" rel="noreferrer" className="hover:text-cyan-400 transition-colors">
              <Linkedin className="w-4 h-4" />
            </a>
          </div>
        </div>
      </footer>

      {scrolled && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 z-40 p-3 rounded-full bg-cyan-500 text-black shadow-lg shadow-cyan-500/30 hover:bg-cyan-400 transition-all"
          aria-label="Back to Top"
        >
          <ChevronUp className="w-5 h-5" />
        </button>
      )}

    </div>
  );
}

function FolderCodeIcon(props) {
  return (
    <svg 
      {...props} 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L8.6 3.3A2 2 0 0 0 6.9 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/>
      <path d="m10 10-2 2 2 2"/>
      <path d="m14 10 2 2-2 2"/>
    </svg>
  );
}
```