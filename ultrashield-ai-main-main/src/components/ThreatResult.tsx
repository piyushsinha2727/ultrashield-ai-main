import { motion } from 'framer-motion';
import { Shield, AlertTriangle, XOctagon, ExternalLink, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ThreatResultProps {
  url: string;
  riskScore: number;
  status: 'safe' | 'suspicious' | 'dangerous';
  category: string;
  confidence: number;
  detectionType: string;
  recommendation: string;
  reason: string;
  details?: string[];
  aiPowered?: boolean;
  onProceed?: () => void;
  onDismiss?: () => void;
}

const ThreatResult = ({ url, riskScore, status, category, confidence, detectionType, recommendation, reason, details, aiPowered, onProceed, onDismiss }: ThreatResultProps) => {
  const config = {
    safe: {
      icon: <CheckCircle className="w-8 h-8" />,
      title: 'Website is Safe',
      colorClass: 'status-safe',
      borderClass: 'border-safe/30',
      bgClass: 'bg-safe/5',
    },
    suspicious: {
      icon: <AlertTriangle className="w-8 h-8" />,
      title: 'Suspicious Website Detected',
      colorClass: 'status-suspicious',
      borderClass: 'border-suspicious/30',
      bgClass: 'bg-suspicious/5',
    },
    dangerous: {
      icon: <XOctagon className="w-8 h-8" />,
      title: '⚠️ Dangerous Website Blocked',
      colorClass: 'status-dangerous',
      borderClass: 'border-dangerous/30',
      bgClass: 'bg-dangerous/5',
    },
  }[status];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`glass-card p-6 border ${config.borderClass} ${config.bgClass}`}
    >
      <div className="flex items-start gap-4">
        <div className={config.colorClass}>{config.icon}</div>
        <div className="flex-1">
          <h3 className={`text-lg font-semibold mb-1 ${config.colorClass}`}>{config.title}</h3>
          <p className="text-sm text-muted-foreground font-mono mb-2 break-all">{url}</p>
          <div className="mb-2 flex flex-wrap gap-2 text-xs text-muted-foreground">
            <span className="px-2 py-1 rounded-md bg-background/70 border border-border">Category: {category}</span>
            <span className="px-2 py-1 rounded-md bg-background/70 border border-border">Confidence: {confidence}%</span>
            <span className="px-2 py-1 rounded-md bg-background/70 border border-border">Detection: {detectionType}</span>
          </div>
          <p className="text-sm text-foreground mb-3">{reason}</p>

          <div className="mb-3 p-3 rounded-lg border border-border bg-background/60">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Recommendation</h4>
            <p className="text-sm font-bold text-foreground">{recommendation}</p>
          </div>

          {aiPowered && (
            <div className="flex items-center gap-1 mb-2">
              <span className="text-xs px-2 py-0.5 rounded-full bg-accent/20 text-accent">🤖 AI-Powered Analysis</span>
            </div>
          )}

          {details && details.length > 0 && (
            <div className="glass-card p-3 mb-3 space-y-1">
              {details.map((detail, i) => (
                <p key={i} className="text-xs text-muted-foreground">• {detail}</p>
              ))}
            </div>
          )}

          <div className="flex items-center gap-4 mb-4">
            <div className="text-xs text-muted-foreground">Risk Score</div>
            <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${riskScore}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className={`h-full rounded-full ${
                  status === 'safe' ? 'bg-safe' : status === 'suspicious' ? 'bg-suspicious' : 'bg-dangerous'
                }`}
              />
            </div>
            <span className={`text-sm font-bold ${config.colorClass}`}>{riskScore}/100</span>
          </div>

          <div className="flex gap-3">
            {status === 'safe' && onProceed && (
              <Button variant="cyber" size="sm" onClick={onProceed}>
                <ExternalLink className="w-3 h-3 mr-1" /> Visit Site
              </Button>
            )}
            {status === 'suspicious' && onProceed && (
              <Button variant="cyber-outline" size="sm" onClick={onProceed}>
                Proceed Anyway
              </Button>
            )}
            {onDismiss && (
              <Button variant="ghost" size="sm" onClick={onDismiss}>
                Dismiss
              </Button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ThreatResult;
