import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { ShieldCheck, User, Calendar, CreditCard, Lock, CheckCircle2, ShieldAlert, Baby, UserCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
  ageGroup: 'child' | 'teen' | 'adult';
}

export const UserProfileModal = ({ isOpen, onClose, user, ageGroup }: UserProfileModalProps) => {
  const metadata = user?.user_metadata || {};
  const name = metadata.name || user?.email?.split('@')[0] || 'Aarav Kumar';
  const govId = metadata.gov_id || (ageGroup === 'child' ? 'CHD-001' : ageGroup === 'teen' ? 'TEEN-101' : 'ADT-201');
  const dob = metadata.date_of_birth || (ageGroup === 'child' ? '2015-10-03' : ageGroup === 'teen' ? '2009-05-09' : '1992-05-15');

  const getGroupBadge = () => {
    if (ageGroup === 'child') {
      return {
        label: 'Child Account (Under 13)',
        color: 'bg-primary/20 text-primary border-primary/40',
        icon: <Baby className="w-5 h-5 text-primary" />,
        protection: 'Maximum Protection (Strict Block)',
        rules: [
          '🚫 Pornography & Explicit Material: Permanently Blocked',
          '🚫 Online Gambling & Casino: Permanently Blocked',
          '🚫 Graphic Violence & Harmful Search: Permanently Blocked',
          '🚫 Phishing & Malware Links: Permanently Blocked',
          '✅ Verified Educational Websites: Unrestricted Access',
        ],
      };
    }
    if (ageGroup === 'teen') {
      return {
        label: 'Teen Account (13–17)',
        color: 'bg-secondary/20 text-secondary border-secondary/40',
        icon: <ShieldAlert className="w-5 h-5 text-secondary" />,
        protection: 'High Protection (Restricted Mode)',
        rules: [
          '⚠️ Explicit Material: Partial Ban / Restricted Warning',
          '🚫 Gambling & Betting: Blocked (Underage Law)',
          '🚫 Phishing & Malware Links: Permanently Blocked',
          '✅ Educational & News Portals: Unrestricted Access',
        ],
      };
    }
    return {
      label: 'Adult Account (18+)',
      color: 'bg-accent/20 text-accent border-accent/40',
      icon: <UserCheck className="w-5 h-5 text-accent" />,
      protection: 'Standard Protection',
      rules: [
        '🚫 Phishing, Virus & Cyber Attacks: Permanently Blocked',
        '✅ Verified Adult Material: Permitted for Adult Tier',
        '✅ Gambling & Betting Portals: Permitted',
      ],
    };
  };

  const badgeInfo = getGroupBadge();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass-card max-w-md border border-primary/30 p-6 bg-card text-foreground">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2.5 rounded-xl bg-primary/15 text-primary border border-primary/30">
              {badgeInfo.icon}
            </div>
            <div>
              <DialogTitle className="text-lg font-bold gradient-text">{name}</DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Verified Safe Browsing Profile
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 my-2 text-xs">
          {/* Identity Info Grid */}
          <div className="glass-card p-3.5 space-y-2 border border-glass-border">
            <div className="flex justify-between items-center py-1 border-b border-border/50">
              <span className="text-muted-foreground flex items-center gap-1.5 font-medium">
                <CreditCard className="w-3.5 h-3.5 text-primary" /> Demo Government ID:
              </span>
              <span className="font-mono font-bold text-accent bg-muted/80 px-2 py-0.5 rounded">{govId}</span>
            </div>

            <div className="flex justify-between items-center py-1 border-b border-border/50">
              <span className="text-muted-foreground flex items-center gap-1.5 font-medium">
                <Calendar className="w-3.5 h-3.5 text-secondary" /> Date of Birth:
              </span>
              <span className="font-medium text-foreground">{dob}</span>
            </div>

            <div className="flex justify-between items-center py-1 border-b border-border/50">
              <span className="text-muted-foreground flex items-center gap-1.5 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-safe" /> Verification Status:
              </span>
              <span className="text-safe flex items-center gap-1 font-semibold">
                <CheckCircle2 className="w-3 h-3" /> Identity Verified
              </span>
            </div>

            <div className="flex justify-between items-center py-1">
              <span className="text-muted-foreground flex items-center gap-1.5 font-medium">
                <Lock className="w-3.5 h-3.5 text-primary" /> Active Protection:
              </span>
              <span className={`px-2 py-0.5 rounded font-bold border ${badgeInfo.color}`}>
                {badgeInfo.protection}
              </span>
            </div>
          </div>

          {/* Active Filtering Rules */}
          <div className="glass-card p-3.5 space-y-1.5 border border-glass-border">
            <p className="font-semibold text-foreground mb-1 text-[11px] uppercase tracking-wider">Enforced Policy Rules:</p>
            {badgeInfo.rules.map((rule, idx) => (
              <p key={idx} className="text-muted-foreground text-xs leading-relaxed">
                {rule}
              </p>
            ))}
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <Button variant="cyber-outline" size="sm" onClick={onClose} className="w-full text-xs h-9">
            Close Profile Details
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
