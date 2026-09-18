import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Eye, EyeOff, Lock, Mail, User, Calendar, CreditCard, KeyRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { DEMO_IDS, getDemoIdentity, AgeGroup } from '@/data/demoIdentityDataset';
import { toast } from 'sonner';

const Register = () => {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [dob, setDob] = useState('');
  const [govId, setGovId] = useState('');
  const [assignedAgeGroup, setAssignedAgeGroup] = useState<AgeGroup | null>(null);
  const [otp, setOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const { signUp, user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && user) {
      navigate('/dashboard', { replace: true });
    }
  }, [authLoading, user, navigate]);

  const getAgeGroupLabel = (dateOfBirth: string) => {
    if (assignedAgeGroup) {
      if (assignedAgeGroup === 'child') return 'Child Mode (Under 13)';
      if (assignedAgeGroup === 'teen') return 'Teen Mode (13–17)';
      return 'Adult Mode (18+)';
    }
    const age = Math.floor((Date.now() - new Date(dateOfBirth).getTime()) / (365.25 * 24 * 60 * 60 * 1000));
    if (age < 13) return 'Child Mode (Under 13)';
    if (age < 18) return 'Teen Mode (13–17)';
    return 'Adult Mode (18+)';
  };

  const handleVerifyId = () => {
    setVerifying(true);
    setTimeout(() => {
      const match = getDemoIdentity(govId);
      if (match) {
        setName(match.name);
        setDob(match.dob);
        setAssignedAgeGroup(match.ageGroup);
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        setGeneratedOtp(code);
        toast.success(`OTP sent: ${code}`, { description: 'Demo OTP — testing environment' });
        setStep(2);
      } else {
        toast.error('Demo ID not found. Use CHD-001..008, TEEN-101..108, ADT-201..208.');
      }
      setVerifying(false);
    }, 600);
  };

  const handleVerifyOtp = () => {
    if (otp === generatedOtp) {
      toast.success('Identity verified successfully!');
      setStep(3);
    } else {
      toast.error('Invalid OTP code. Please enter the generated code.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signUp(email, password, name, dob, assignedAgeGroup ?? undefined, govId);
      const modeText = assignedAgeGroup ? `${assignedAgeGroup.toUpperCase()} Mode` : getAgeGroupLabel(dob);
      toast.success(`Account created! Assigned: ${modeText}`);
      navigate('/dashboard', { replace: true });
    } catch (err: any) {
      toast.error(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-secondary/5 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md px-6"
      >
        <div className="glass-card p-8">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }} className="mb-6 flex justify-center">
            <div className="glow-effect flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-secondary">
              <Shield className="h-7 w-7 text-primary-foreground" />
            </div>
          </motion.div>

          <h1 className="gradient-text mb-1 text-center text-2xl font-bold">Create Account</h1>
          <p className="mb-6 text-center text-sm text-muted-foreground">Step {step} of 3</p>

          <div className="mb-6 flex gap-2">
            {[1, 2, 3].map((s) => (
              <div key={s} className={`h-1 flex-1 rounded-full transition-all ${s <= step ? 'bg-gradient-to-r from-primary to-secondary' : 'bg-muted'}`} />
            ))}
          </div>

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                <p className="mb-2 text-sm text-muted-foreground">Enter your Demo Government ID to verify identity</p>
                
                {/* Demo IDs Table */}
                <div className="glass-card mb-2 p-3 text-xs text-muted-foreground">
                  <p className="mb-1 font-medium text-foreground">Demo Identity Verification (Testing Environment Only)</p>
                  <p className="text-[11px] text-muted-foreground">These IDs auto-assign age mode for safe browsing policy enforcement.</p>

                  <div className="mt-2 grid gap-2 sm:grid-cols-3">
                    <div>
                      <p className="font-semibold text-primary">Child Accounts</p>
                      {Object.entries(DEMO_IDS).filter(([id]) => id.startsWith('CHD')).map(([id, info]) => (
                        <p key={id} className="text-[11px]"><span className="font-mono text-accent">{id}</span> — {info.name}</p>
                      ))}
                    </div>
                    <div>
                      <p className="font-semibold text-secondary">Teen Accounts</p>
                      {Object.entries(DEMO_IDS).filter(([id]) => id.startsWith('TEEN')).map(([id, info]) => (
                        <p key={id} className="text-[11px]"><span className="font-mono text-accent">{id}</span> — {info.name}</p>
                      ))}
                    </div>
                    <div>
                      <p className="font-semibold text-cyan-400">Adult Accounts</p>
                      {Object.entries(DEMO_IDS).filter(([id]) => id.startsWith('ADT')).map(([id, info]) => (
                        <p key={id} className="text-[11px]"><span className="font-mono text-accent">{id}</span> — {info.name}</p>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="relative">
                  <label htmlFor="demo-id" className="sr-only">Demo ID</label>
                  <CreditCard className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    id="demo-id"
                    type="text"
                    aria-label="Demo ID"
                    placeholder="Demo ID (CHD-001, TEEN-101, ADT-201)"
                    value={govId}
                    onChange={(e) => setGovId(e.target.value)}
                    className="glass-input w-full pl-10"
                    required
                  />
                </div>
                <Button variant="cyber" className="h-11 w-full" onClick={handleVerifyId} disabled={!govId || verifying || authLoading}>
                  {verifying ? 'Verifying Identity...' : 'Verify Identity'}
                </Button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                <div className="glass-card p-3 text-sm">
                  <p className="text-muted-foreground">Identity Verified:</p>
                  <p className="font-medium text-foreground">{name}</p>
                  <p className="mt-1 text-xs text-accent">
                    Account Type: {assignedAgeGroup ? assignedAgeGroup.toUpperCase() : getAgeGroupLabel(dob)}
                    {' • '}Protection Level: {assignedAgeGroup === 'child' ? 'Maximum (Strict Block)' : assignedAgeGroup === 'teen' ? 'High (Warning/Restricted)' : 'Standard (Unrestricted Adult)'}
                  </p>
                </div>
                <div className="relative">
                  <label htmlFor="otp" className="sr-only">OTP Code</label>
                  <KeyRound className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    id="otp"
                    type="text"
                    aria-label="OTP Code"
                    placeholder="Enter 6-digit OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    maxLength={6}
                    className="glass-input w-full pl-10 font-mono tracking-widest"
                    required
                  />
                </div>
                <Button variant="cyber" className="h-11 w-full" onClick={handleVerifyOtp} disabled={otp.length !== 6 || authLoading}>
                  Verify OTP & Proceed
                </Button>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="relative">
                    <label htmlFor="reg-name" className="sr-only">Full name</label>
                    <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input id="reg-name" value={name} readOnly className="glass-input w-full pl-10 opacity-70" aria-label="Full name" />
                  </div>
                  <div className="relative">
                    <label htmlFor="reg-dob" className="sr-only">Date of birth</label>
                    <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input id="reg-dob" value={dob} readOnly className="glass-input w-full pl-10 opacity-70" aria-label="Date of birth" />
                  </div>
                  <div className="relative">
                    <label htmlFor="reg-email" className="sr-only">Email address</label>
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input id="reg-email" type="email" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} className="glass-input w-full pl-10" aria-label="Email address" required />
                  </div>
                  <div className="relative">
                    <label htmlFor="reg-password" className="sr-only">Password</label>
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input id="reg-password" type={showPassword ? 'text' : 'password'} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="glass-input w-full pl-10 pr-10" aria-label="Password" required />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  <div className="text-center text-xs font-medium text-accent">
                    Enforcing: {assignedAgeGroup ? `${assignedAgeGroup.toUpperCase()} Mode` : getAgeGroupLabel(dob)}
                  </div>
                  <Button type="submit" variant="cyber" className="h-11 w-full" disabled={loading || authLoading}>
                    {loading ? 'Creating Account...' : 'Complete Registration'}
                  </Button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-primary hover:text-primary/80">Sign In</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
