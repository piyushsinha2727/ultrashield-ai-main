import { motion } from 'framer-motion';
import { ShieldCheck, AlertTriangle, ShieldX, Activity } from 'lucide-react';

interface SecurityStatsProps {
  totalScans: number;
  threatsDetected: number;
  safeWebsites: number;
  blockedPhishing: number;
  securityScore: number;
}

const SecurityStats = ({ totalScans, threatsDetected, safeWebsites, blockedPhishing, securityScore }: SecurityStatsProps) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-3.5 flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-primary/15 text-primary flex items-center justify-center shrink-0">
          <Activity className="w-4 h-4" />
        </div>
        <div>
          <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Total Scans</p>
          <p className="text-xl font-extrabold text-foreground">{totalScans}</p>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="glass-card p-3.5 flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-safe/15 text-safe flex items-center justify-center shrink-0">
          <ShieldCheck className="w-4 h-4" />
        </div>
        <div>
          <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Safe Websites</p>
          <p className="text-xl font-extrabold text-safe">{safeWebsites}</p>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-3.5 flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-dangerous/15 text-dangerous flex items-center justify-center shrink-0">
          <ShieldX className="w-4 h-4" />
        </div>
        <div>
          <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Threats Blocked</p>
          <p className="text-xl font-extrabold text-dangerous">{threatsDetected}</p>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="glass-card p-3.5 flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-accent/15 text-accent flex items-center justify-center shrink-0">
          <AlertTriangle className="w-4 h-4" />
        </div>
        <div>
          <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">System Health</p>
          <p className="text-xl font-extrabold text-accent">{securityScore}%</p>
        </div>
      </motion.div>
    </div>
  );
};

export default SecurityStats;
