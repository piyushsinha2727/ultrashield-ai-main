import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Shield,
  Rocket,
  Search,
  CheckCircle,
  AlertTriangle,
  Eye,
  Globe,
  ShieldCheck,
  Database,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import ThreatResult from '@/components/ThreatResult';
import { analyzeUrl, ThreatAnalysis } from '@/lib/threatEngine';

const sectionFade = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const Landing = () => {
  const [scrolling, setScrolling] = useState(false);
  const [url, setUrl] = useState('');
  const [scanResult, setScanResult] = useState<ThreatAnalysis | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanSteps, setScanSteps] = useState<string[]>([]);
  const [scanStepIndex, setScanStepIndex] = useState(0);
  const [stats] = useState({
    websites: 2400000,
    threats: 142000,
    accuracy: 96,
    time: 2.1,
  });

  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolling(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scanHistory = useMemo(() => [
    { url: 'secure-login-paypal.com', status: 'dangerous', risk_score: 87, reason: 'Phishing URL patterns detected' },
    { url: 'exampleadultsite.com', status: 'dangerous', risk_score: 93, reason: 'Adult content indicators found' },
    { url: 'google.com', status: 'safe', risk_score: 8, reason: 'Trusted domain' },
  ], []);

  const runScan = async () => {
    if (!url.trim()) return;
    setIsScanning(true);
    const steps = [
      'Scanning domain...',
      'Checking blacklist...',
      'Running AI model...',
      'Analyzing keywords...',
      'Evaluating domain reputation...',
      'Generating report...',
    ];
    setScanSteps(steps);
    setScanStepIndex(0);

    for (let i = 0; i < steps.length; i++) {
      setScanStepIndex(i);
      await new Promise((resolve) => setTimeout(resolve, 450));
    }

    const result = analyzeUrl(url, 'adult');
    setScanResult(result);
    setIsScanning(false);
  };

  const reviewRegister = () => navigate('/register');

  const threatLevel = (score: number) => {
    if (score <= 30) return 'SAFE';
    if (score <= 60) return 'SUSPICIOUS';
    return 'DANGEROUS';
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#020617] via-[#070e1f] to-[#0f172a] text-foreground">
      <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${scrolling ? 'bg-background/95 backdrop-blur-xl border-b border-border' : 'bg-transparent'}`}>
        <div className="container mx-auto flex items-center justify-between px-4 py-4 lg:px-8">
          <div className="flex items-center gap-2 text-white">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-primary to-secondary shadow-lg shadow-primary/40">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <span className="text-xl font-black tracking-tight">UltraShield AI</span>
          </div>
          <nav className="hidden items-center gap-6 text-sm md:flex">
            <a href="#product" className="hover:text-primary">Product</a>
            <a href="#features" className="hover:text-primary">Features</a>
            <a href="#works" className="hover:text-primary">Technology</a>
            <a href="#stats" className="hover:text-primary">Security</a>
            <a href="#footer" className="hover:text-primary">Docs</a>
          </nav>
          <div className="flex items-center gap-2">
            <Link to="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground">Login</Link>
            <Button variant="cyber" size="sm" onClick={reviewRegister}>Get Started</Button>
          </div>
        </div>
      </header>

      <main className="pt-24">
        <section id="product" className="container mx-auto px-4 pb-16 pt-16 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <motion.div initial="hidden" animate="visible" variants={sectionFade} transition={{ duration: 0.7 }}>
              <p className="mb-3 inline-flex items-center gap-2 rounded-full bg-primary/20 px-3 py-1 text-xs text-primary">AI-Powered • Real-time • Enterprise security</p>
              <h1 className="max-w-2xl text-4xl font-bold leading-tight lg:text-6xl">AI-Powered Malicious Website Detection</h1>
              <p className="mt-6 max-w-xl text-lg text-muted-foreground">Protect users from phishing, adult content, fake payment pages and malware websites with real-time hybrid threat analysis.</p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Button variant="cyber" className="px-6 py-3" onClick={() => document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' })}>Start Free Scan</Button>
                <Button variant="cyber-outline" className="px-6 py-3" onClick={() => document.getElementById('dashboard')?.scrollIntoView({ behavior: 'smooth' })}>View Demo</Button>
              </div>

              <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3">
                <div className="rounded-xl border border-border bg-background/40 p-4 text-center">
                  <p className="text-3xl font-bold text-primary">98%</p>
                  <p className="text-xs text-muted-foreground">Security Score</p>
                </div>
                <div className="rounded-xl border border-border bg-background/40 p-4 text-center">
                  <p className="text-3xl font-bold text-secondary">14,200</p>
                  <p className="text-xs text-muted-foreground">Threats Blocked Today</p>
                </div>
                <div className="rounded-xl border border-border bg-background/40 p-4 text-center">
                  <p className="text-3xl font-bold text-safe">2.1s</p>
                  <p className="text-xs text-muted-foreground">Average Scan Time</p>
                </div>
              </div>
            </motion.div>

            <motion.div initial="hidden" animate="visible" variants={sectionFade} transition={{ duration: 0.7, delay: 0.2 }}>
              <div className="relative overflow-hidden rounded-3xl border border-border bg-[#020617] p-6 shadow-2xl shadow-blue-900/20">
                <div className="absolute inset-0 bg-grid opacity-30" />
                <div className="relative z-10">
                  <div className="mb-6 grid grid-cols-3 gap-3">
                    <div className="h-2 rounded-full bg-primary animate-pulse" />
                    <div className="h-2 rounded-full bg-secondary animate-pulse delay-75" />
                    <div className="h-2 rounded-full bg-cyan-400 animate-pulse delay-150" />
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium"> <Shield className="h-4 w-4 text-primary" /> Scanning domain in real time</div>
                  <div className="mt-3 h-72 rounded-2xl border border-border bg-[#040b1f]" />
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <section id="demo" className="container mx-auto px-4 pb-16 lg:px-8">
          <motion.div initial="hidden" animate="visible" variants={sectionFade}>
            <div className="glass-card rounded-3xl border border-border p-8">
              <div className="mb-4 flex items-center justify-between gap-4">
                <h2 className="text-2xl font-bold">Live URL Scanner</h2>
                <span className="rounded-full border border-primary/50 bg-primary/10 px-3 py-1 text-xs text-primary">Interactive Demo</span>
              </div>

              <p className="text-muted-foreground mb-5">Try it now: enter a URL and get an instant threat score.</p>
              <div className="flex flex-wrap gap-3">
                <input
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="Enter URL here..."
                  className="flex-1 min-w-[200px] rounded-lg border border-border bg-background/70 px-4 py-3 focus:border-primary focus:outline-none"
                />
                <Button variant="cyber" className="h-12 px-6" onClick={runScan} disabled={isScanning || !url.trim()}>
                  {isScanning ? 'Scanning...' : 'Scan Website'}
                </Button>
              </div>

              {isScanning && (
                <div className="mt-4 rounded-lg border border-secondary/30 bg-background/70 p-3 text-xs text-muted-foreground">
                  <span className="font-medium text-secondary">{scanSteps[scanStepIndex]}</span>
                </div>
              )}

              {scanResult && (
                <div className="mt-5">
                  <div className="mb-3 text-sm text-muted-foreground">Result example: </div>
                  <ThreatResult
                    url={scanResult.url}
                    riskScore={scanResult.risk_score}
                    status={scanResult.status}
                    category={scanResult.category}
                    confidence={scanResult.confidence}
                    detectionType={scanResult.detection_methods.join(', ')}
                    recommendation={scanResult.recommendation}
                    reason={scanResult.reason}
                    details={scanResult.details}
                    aiPowered={!!scanResult.ai_analysis}
                  />
                </div>
              )}

              <div className="mt-6 glass-card p-4 border border-border bg-background/80">
                <h3 className="text-sm font-semibold">Demo Identity Verification (Testing Only)</h3>
                <p className="text-xs text-muted-foreground">Use CHD-, TEEN-, or ADT- IDs to set the browsing mode automatically.</p>
                <div className="mt-3 grid w-full gap-3 sm:grid-cols-3 text-xs">
                  <div>
                    <p className="font-medium text-primary">Child Accounts</p>
                    <p>CHD-001 — Aarav Kumar</p>
                    <p>CHD-002 — Anaya Sharma</p>
                    <p>CHD-003 — Vivaan Patel</p>
                    <p>CHD-004 — Diya Singh</p>
                  </div>
                  <div>
                    <p className="font-medium text-secondary">Teen Accounts</p>
                    <p>TEEN-101 — Rahul Sharma</p>
                    <p>TEEN-102 — Priya Patel</p>
                    <p>TEEN-103 — Aditya Singh</p>
                    <p>TEEN-104 — Neha Gupta</p>
                  </div>
                  <div>
                    <p className="font-medium text-cyan-400">Adult Accounts</p>
                    <p>ADT-201 — Alex Johnson</p>
                    <p>ADT-202 — Jamie Smith</p>
                    <p>ADT-203 — Taylor Brown</p>
                    <p>ADT-204 — Morgan Lee</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
      </section>

        <section id="features" className="container mx-auto px-4 pb-16 lg:px-8">
          <motion.h3 initial="hidden" animate="visible" variants={sectionFade} className="text-3xl font-bold">What UltraShield AI Detects</motion.h3>
          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {[
              { title: 'AI Threat Detection', icon: <Rocket className="h-5 w-5" />, desc: 'Detect phishing, malware, and scam websites using machine learning analytics.' },
              { title: 'Adult Content Filtering', icon: <Eye className="h-5 w-5" />, desc: 'Protect children and workplaces from explicit websites in real-time.' },
              { title: 'Domain Risk Analysis', icon: <Database className="h-5 w-5" />, desc: 'Check domain age, SSL certificate, and suspicious patterns instantly.' },
              { title: 'Blacklist Intelligence', icon: <Globe className="h-5 w-5" />, desc: 'Cross-check websites with global security databases and block threats.' },
            ].map((feature) => (
              <div key={feature.title} className="glass-card p-5 border border-border">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-background/70 text-primary">{feature.icon}</div>
                <h4 className="text-lg font-semibold">{feature.title}</h4>
                <p className="mt-2 text-sm text-muted-foreground">{feature.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="works" className="container mx-auto px-4 pb-16 lg:px-8">
          <motion.h3 initial="hidden" animate="visible" variants={sectionFade} className="text-3xl font-bold">How it Works</motion.h3>
          <ol className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              'User enters website URL',
              'AI analyzes content and keywords',
              'System checks domain reputation',
              'Threat score is generated',
              'User receives security report',
            ].map((text, idx) => (
              <li key={text} className="glass-card p-5 border border-border">
                <div className="mb-2 text-2xl font-black text-primary">{idx + 1}</div>
                <p className="text-sm text-muted-foreground">{text}</p>
              </li>
            ))}
          </ol>
        </section>

        <section id="dashboard" className="container mx-auto px-4 pb-16 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-2">
            <motion.div initial="hidden" animate="visible" variants={sectionFade}>
              <h3 className="text-3xl font-bold">Security Dashboard Preview</h3>
              <p className="mt-4 text-muted-foreground">Professional cybersecurity dashboard for monitoring threats.</p>
              <div className="mt-6 grid gap-3">
                <div className="glass-card p-4 border border-border">
                  <p className="text-xs text-muted-foreground">Threat Score</p>
                  <p className="text-xl font-bold">87 / 100</p>
                </div>
                <div className="glass-card p-4 border border-border">
                  <p className="text-xs text-muted-foreground">AI Explanation</p>
                  <p className="text-base">The URL uses phishing and adult keywords associated with compromised forms.</p>
                </div>
                <div className="glass-card p-4 border border-border">
                  <p className="text-xs text-muted-foreground">Scan History</p>
                  <p className="text-base">google.com (SAFE), paypaI-login.com (PHISHING), exampleadultsite.com (BLOCKED)</p>
                </div>
              </div>
            </motion.div>
            <motion.div initial="hidden" animate="visible" variants={sectionFade}>
              <div className="relative aspect-video overflow-hidden rounded-3xl border border-border bg-background/40">
                <div className="h-full w-full bg-[linear-gradient(120deg,rgba(6,182,212,.2),rgba(99,102,241,.2))]" />
              </div>
            </motion.div>
          </div>
        </section>

        <section id="stats" className="container mx-auto px-4 pb-16 lg:px-8">
          <motion.h3 initial="hidden" animate="visible" variants={sectionFade} className="text-3xl font-bold">Security Statistics</motion.h3>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="glass-card p-5 border border-border text-center">
              <p className="text-3xl font-bold text-primary">{(stats.websites / 1000000).toFixed(1)}M</p>
              <p className="text-sm text-muted-foreground">Websites Analyzed</p>
            </div>
            <div className="glass-card p-5 border border-border text-center">
              <p className="text-3xl font-bold text-dangerous">{(stats.threats / 1000).toFixed(0)}K</p>
              <p className="text-sm text-muted-foreground">Threats Detected</p>
            </div>
            <div className="glass-card p-5 border border-border text-center">
              <p className="text-3xl font-bold text-secondary">{stats.accuracy}%</p>
              <p className="text-sm text-muted-foreground">Accuracy Rate</p>
            </div>
            <div className="glass-card p-5 border border-border text-center">
              <p className="text-3xl font-bold text-safe">{stats.time}s</p>
              <p className="text-sm text-muted-foreground">Average Scan Time</p>
            </div>
          </div>
        </section>

        <section id="use-cases" className="container mx-auto px-4 pb-16 lg:px-8">
          <motion.h3 initial="hidden" animate="visible" variants={sectionFade} className="text-3xl font-bold">Use Cases</motion.h3>
          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {[
              { title: 'Parents', desc: 'Protect children from adult websites.' },
              { title: 'Companies', desc: 'Prevent employees accessing malicious websites.' },
              { title: 'Schools', desc: 'Block harmful content on student networks.' },
              { title: 'Security Teams', desc: 'Detect phishing attacks early.' },
            ].map((card) => (
              <div key={card.title} className="glass-card p-5 border border-border">
                <h4 className="text-lg font-semibold">{card.title}</h4>
                <p className="text-sm text-muted-foreground mt-2">{card.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="cta" className="container mx-auto px-4 pb-20 lg:px-8">
          <motion.div initial="hidden" animate="visible" variants={sectionFade} className="glass-card border border-border p-8 text-center">
            <h3 className="text-3xl font-bold">Start Browsing Safely Today</h3>
            <p className="mt-3 text-muted-foreground">Detect malicious websites instantly using AI-powered threat detection.</p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Button variant="cyber" className="px-8 py-3" onClick={reviewRegister}>Create Free Account</Button>
              <Button variant="cyber-outline" className="px-8 py-3" onClick={() => navigate('/login')}>Login</Button>
            </div>
          </motion.div>
        </section>
      </main>

      <footer id="footer" className="border-t border-border bg-background/80 px-4 py-10 text-sm text-muted-foreground lg:px-8">
        <div className="container mx-auto grid gap-6 md:grid-cols-4">
          <div>
            <p className="text-lg font-bold">UltraShield AI</p>
            <p className="mt-2 max-w-xs">Enterprise-grade website threat scanning and protection for modern security teams.</p>
          </div>
          <div>
            <h4 className="mb-2 font-semibold text-foreground">Product</h4>
            <p>Features</p>
            <p>Technology</p>
            <p>Security</p>
          </div>
          <div>
            <h4 className="mb-2 font-semibold text-foreground">Resources</h4>
            <p>Documentation</p>
            <p>API</p>
            <p>Blog</p>
          </div>
          <div>
            <h4 className="mb-2 font-semibold text-foreground">Company</h4>
            <p>About</p>
            <p>Privacy Policy</p>
            <p>Terms</p>
          </div>
        </div>
        <p className="mt-8 text-center text-xs">© 2026 UltraShield AI</p>
      </footer>
    </div>
  );
};

export default Landing;
