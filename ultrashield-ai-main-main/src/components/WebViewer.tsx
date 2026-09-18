import { motion } from 'framer-motion';
import { AlertTriangle, ExternalLink, X, Shield } from 'lucide-react';

interface WebViewerProps {
  url: string;
  onClose: () => void;
}

const WebViewer = ({ url, onClose }: WebViewerProps) => {
  const fullUrl = url.startsWith('http') ? url : `https://${url}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card overflow-hidden"
    >
      <div className="flex items-center gap-3 border-b border-border bg-muted/30 px-4 py-2.5">
        <Shield className="h-4 w-4 text-safe" />
        <span className="flex-1 truncate font-mono text-xs text-muted-foreground">{fullUrl}</span>
        <a href={fullUrl} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground">
          <ExternalLink className="h-4 w-4" />
        </a>
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="flex items-start gap-2 border-b border-border bg-accent/10 px-4 py-2 text-xs text-muted-foreground">
        <AlertTriangle className="mt-0.5 h-3.5 w-3.5 text-accent" />
        <p>
          If the embedded page says <span className="font-medium text-foreground">refused to connect</span>, that is a browser iframe policy on the site itself, not a threat block.
        </p>
      </div>

      <div className="relative bg-background" style={{ height: '500px' }}>
        <iframe
          src={fullUrl}
          className="h-full w-full border-0"
          sandbox="allow-scripts allow-same-origin allow-forms"
          title="Secure Web Viewer"
        />
      </div>
    </motion.div>
  );
};

export default WebViewer;
