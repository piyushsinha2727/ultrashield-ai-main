import { Shield } from 'lucide-react';

const Footer = () => (
  <footer className="border-t border-border py-6 mt-12">
    <div className="container max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-2">
        <Shield className="w-4 h-4 text-primary" />
        <span className="text-sm text-muted-foreground">UltraShield AI</span>
      </div>
      <p className="text-xs text-muted-foreground text-center">
        © 2026 BlockBuster Team – Hack & Forge. All Rights Reserved.
      </p>
    </div>
  </footer>
);

export default Footer;
