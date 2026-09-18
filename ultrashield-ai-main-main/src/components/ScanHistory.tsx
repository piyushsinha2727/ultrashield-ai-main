import { motion } from 'framer-motion';
import { Globe, Clock } from 'lucide-react';

interface Scan {
  id: string;
  url: string;
  risk_score: number;
  status: string;
  reason: string | null;
  created_at: string;
}

const ScanHistory = ({ scans, onSelect }: { scans: Scan[]; onSelect?: (scan: Scan) => void }) => {
  if (scans.length === 0) {
    return (
      <div className="glass-card p-8 text-center">
        <Globe className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
        <p className="text-muted-foreground text-sm">No scans yet. Enter a URL above to get started.</p>
      </div>
    );
  }

  return (
    <div className="glass-card overflow-hidden">
      <div className="p-4 border-b border-border">
        <h3 className="text-sm font-semibold text-foreground">Recent Scans</h3>
      </div>
      <div className="divide-y divide-border max-h-80 overflow-y-auto">
        {scans.map((scan, i) => (
          <motion.div
            key={scan.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            onClick={() => onSelect?.(scan)}
            className="px-4 py-3 flex items-center gap-3 hover:bg-muted/30 transition-colors cursor-pointer"
          >
            <div className={`w-2 h-2 rounded-full shrink-0 ${
              scan.status === 'safe' ? 'bg-safe' : scan.status === 'suspicious' ? 'bg-suspicious' : 'bg-dangerous'
            }`} />
            <div className="flex-1 min-w-0">
              <p className="text-sm text-foreground font-mono truncate">{scan.url}</p>
              <p className="text-xs text-muted-foreground truncate">{scan.reason}</p>
            </div>
            <div className="text-right shrink-0">
              <p className={`text-xs font-bold ${
                scan.status === 'safe' ? 'text-safe' : scan.status === 'suspicious' ? 'text-suspicious' : 'text-dangerous'
              }`}>
                {scan.risk_score}/100
              </p>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {new Date(scan.created_at).toLocaleDateString()}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ScanHistory;
