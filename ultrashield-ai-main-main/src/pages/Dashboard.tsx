import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, LogOut, Baby, UserCheck, ShieldAlert, User, CheckCircle2, Lock } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import SearchBar, { isUrl } from '@/components/SearchBar';
import SecurityStats from '@/components/SecurityStats';
import ThreatCharts from '@/components/ThreatCharts';
import ThreatResult from '@/components/ThreatResult';
import ScanHistory from '@/components/ScanHistory';
import WebViewer from '@/components/WebViewer';
import Footer from '@/components/Footer';
import { UserProfileModal } from '@/components/UserProfileModal';
import { analyzeUrl, isKnownSafeDomain, ThreatAnalysis } from '@/lib/threatEngine';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

interface Scan {
  id: string;
  url: string;
  risk_score: number;
  status: string;
  reason: string | null;
  created_at: string;
}

const Dashboard = () => {
  const { user, signOut, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [scans, setScans] = useState<Scan[]>([]);
  const [scanning, setScanning] = useState(false);
  const [currentResult, setCurrentResult] = useState<ThreatAnalysis | null>(null);
  const [viewingUrl, setViewingUrl] = useState<string | null>(null);
  const [ageGroup, setAgeGroup] = useState<'child' | 'teen' | 'adult'>('child');
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  /**
   * LOAD USER DATA & LOCK AGE GROUP TO VERIFIED PROFILE
   */
  const loadData = useCallback(async () => {
    if (!user) return;

    let userAgeGroup: 'child' | 'teen' | 'adult' = 'child';

    if (user.user_metadata?.age_group) {
      userAgeGroup = user.user_metadata.age_group as any;
    }

    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('name, age_group')
        .eq('user_id', user.id)
        .maybeSingle();

      if (profile?.age_group) {
        userAgeGroup = profile.age_group as any;
      }

      const { data: scanData } = await supabase
        .from('website_scans')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (scanData && scanData.length > 0) {
        setScans(scanData);
      } else {
        const storedScans = localStorage.getItem('ultrashield:local_scans');
        if (storedScans) setScans(JSON.parse(storedScans));
      }
    } catch {
      const storedScans = localStorage.getItem('ultrashield:local_scans');
      if (storedScans) setScans(JSON.parse(storedScans));
    }

    setAgeGroup(userAgeGroup);
  }, [user]);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
      return;
    }

    if (user) {
      loadData();
    }
  }, [user, authLoading, navigate, loadData]);

  useEffect(() => {
    const savedResult = sessionStorage.getItem('ultrashield:last-scan-result');
    const savedViewerUrl = sessionStorage.getItem('ultrashield:last-viewer-url');

    if (savedResult) {
      try {
        setCurrentResult(JSON.parse(savedResult));
      } catch {
        sessionStorage.removeItem('ultrashield:last-scan-result');
      }
    }

    if (savedViewerUrl) {
      setViewingUrl(savedViewerUrl);
    }
  }, []);

  useEffect(() => {
    if (currentResult) {
      sessionStorage.setItem('ultrashield:last-scan-result', JSON.stringify(currentResult));
      return;
    }
    sessionStorage.removeItem('ultrashield:last-scan-result');
  }, [currentResult]);

  useEffect(() => {
    if (viewingUrl) {
      sessionStorage.setItem('ultrashield:last-viewer-url', viewingUrl);
      return;
    }
    sessionStorage.removeItem('ultrashield:last-viewer-url');
  }, [viewingUrl]);

  /**
   * SEARCH / SCAN HANDLER
   */
  const handleSearch = async (query: string) => {
    if (!isUrl(query)) {
      const googleUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
      window.open(googleUrl, '_blank', 'noopener,noreferrer');
      toast.info('Search results opened in a new tab');
      return;
    }

    setScanning(true);
    setCurrentResult(null);
    setViewingUrl(null);

    const localResult = analyzeUrl(query, ageGroup);
    await new Promise((r) => setTimeout(r, 400));

    let finalResult: ThreatAnalysis = localResult;

    try {
      const { data, error } = await supabase.functions.invoke(
        'analyze-threat',
        { body: { url: query, ageGroup } }
      );

      const keepLocalTrustedResult =
        isKnownSafeDomain(query) &&
        localResult.status === 'safe' &&
        !localResult.blocked_for_age;

      if (!error && data && !data.fallback && !data.error && !keepLocalTrustedResult) {
        const aiScore = Number(data.risk_score ?? 0);
        const localScore = localResult.risk_score;
        const useAi = aiScore >= localScore;

        finalResult = {
          url: query,
          risk_score: Math.max(aiScore, localScore),
          status: useAi ? data.status : localResult.status,
          category: useAi ? data.category || localResult.category : localResult.category || 'Unknown',
          confidence: Number(useAi ? data.confidence ?? localResult.confidence ?? 75 : localResult.confidence ?? 75),
          reason: useAi ? data.reason : localResult.reason,
          recommendation: useAi ? data.recommendation || localResult.recommendation : localResult.recommendation || 'Review with caution',
          detection_methods: [...(localResult.detection_methods || []), ...(data.detection_methods || [])],
          threat_type: useAi ? data.threat_type : localResult.threat_type,
          blocked_for_age: Boolean(data.blocked_for_age || localResult.blocked_for_age),
          ai_analysis: data.reason,
          details: [...(localResult.details || []), ...(data.details || [])],
        };
      }
    } catch {}

    setCurrentResult(finalResult);

    const newScan: Scan = {
      id: `scan-${Date.now()}`,
      url: finalResult.url,
      risk_score: finalResult.risk_score,
      status: finalResult.status,
      reason: finalResult.reason,
      created_at: new Date().toISOString(),
    };

    setScans((prev) => {
      const updated = [newScan, ...prev.filter((s) => s.url !== finalResult.url)].slice(0, 50);
      localStorage.setItem('ultrashield:local_scans', JSON.stringify(updated));
      return updated;
    });

    try {
      if (user && !user.id.startsWith('demo-')) {
        await supabase.from('website_scans').insert({
          user_id: user.id,
          url: finalResult.url,
          risk_score: finalResult.risk_score,
          status: finalResult.status,
          reason: finalResult.reason,
        });
      }
    } catch {}

    setScanning(false);
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  const totalThreats = scans.filter((s) => s.status !== 'safe').length;

  const stats = {
    totalScans: scans.length,
    threatsDetected: totalThreats,
    safeWebsites: scans.filter((s) => s.status === 'safe').length,
    blockedPhishing: scans.filter((s) => s.status === 'dangerous').length,
    securityScore: 94,
  };

  const userName = user?.user_metadata?.name || user?.email?.split('@')[0] || 'User';
  const govId = user?.user_metadata?.gov_id || (ageGroup === 'child' ? 'CHD-001' : ageGroup === 'teen' ? 'TEEN-101' : 'ADT-201');

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Shield className="w-10 h-10 text-primary animate-pulse" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="particle" />
        <div className="particle" />
        <div className="particle" />
        <div className="particle" />
      </div>

      {/* HEADER BAR */}
      <header className="border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container max-w-6xl flex items-center justify-between py-3">
          <div className="flex items-center gap-3">
            <div className="brand-logo flex h-10 w-10 items-center justify-center rounded-xl p-2">
              <Shield className="w-5 h-5 text-primary-foreground drop-shadow" />
            </div>
            <div>
              <h1 className="text-base font-extrabold gradient-text tracking-wide">UltraShield AI</h1>
              <p className="text-xs text-muted-foreground font-medium">Safe Browsing & Age Protection Engine</p>
            </div>
          </div>

          {/* Locked Account Protection Badge (Clickable to open User Profile Details Modal) */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsProfileOpen(true)}
              className="flex items-center gap-2 bg-muted/80 hover:bg-muted p-1.5 px-3 rounded-xl border border-glass-border text-xs transition-all shadow-md group"
              title="Click to view verified profile details"
            >
              <div className="flex items-center gap-1.5 font-bold">
                {ageGroup === 'child' && (
                  <span className="flex items-center gap-1 text-primary bg-primary/20 px-2.5 py-1 rounded-lg border border-primary/30">
                    <Baby className="w-4 h-4" /> CHILD ACCOUNT
                  </span>
                )}
                {ageGroup === 'teen' && (
                  <span className="flex items-center gap-1 text-secondary bg-secondary/20 px-2.5 py-1 rounded-lg border border-secondary/30">
                    <ShieldAlert className="w-4 h-4" /> TEEN ACCOUNT
                  </span>
                )}
                {ageGroup === 'adult' && (
                  <span className="flex items-center gap-1 text-accent bg-accent/20 px-2.5 py-1 rounded-lg border border-accent/30">
                    <UserCheck className="w-4 h-4" /> ADULT ACCOUNT
                  </span>
                )}
              </div>

              <div className="hidden sm:flex items-center gap-1 text-muted-foreground group-hover:text-foreground text-[11px] font-mono border-l border-border pl-2">
                <span>{govId}</span>
                <Lock className="w-3 h-3 text-muted-foreground" />
              </div>
            </button>

            <Button variant="ghost" size="sm" onClick={handleLogout} title="Sign Out">
              <LogOut className="w-4 h-4 text-muted-foreground hover:text-foreground" />
            </Button>
          </div>
        </div>
      </header>

      {/* MAIN DASHBOARD CONTENT */}
      <main className="container max-w-6xl py-6 space-y-5 relative z-10">
        <SearchBar onSearch={handleSearch} loading={scanning} />

        {currentResult && (
          <ThreatResult
            url={currentResult.url}
            riskScore={currentResult.risk_score}
            status={currentResult.status}
            category={currentResult.category ?? 'Unknown'}
            confidence={currentResult.confidence ?? 0}
            detectionType={currentResult.detection_methods?.[0] ?? '150+ Pattern Engine'}
            recommendation={currentResult.recommendation ?? ''}
            reason={currentResult.reason}
            details={currentResult.details}
            aiPowered={!!currentResult.ai_analysis}
          />
        )}

        {viewingUrl && (
          <WebViewer url={viewingUrl} onClose={() => setViewingUrl(null)} />
        )}

        <SecurityStats {...stats} />

        <ThreatCharts
          scans={scans.map((s) => ({
            status: s.status,
            created_at: s.created_at,
            risk_score: s.risk_score,
          }))}
        />

        <ScanHistory scans={scans} onSelect={(scan) => handleSearch(scan.url)} />
      </main>

      {/* User Identity Details Modal */}
      <UserProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        user={user}
        ageGroup={ageGroup}
      />

      <Footer />
    </div>
  );
};

export default Dashboard;