import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Shield, Loader2 } from 'lucide-react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  loading?: boolean;
}

const hasProtocol = (value: string) => /^[a-zA-Z][a-zA-Z\d+\-.]*:\/\//.test(value);

const isUrl = (input: string): boolean => {
  const trimmed = input.trim();
  if (!trimmed || trimmed.includes(' ')) return false;

  try {
    const candidate = hasProtocol(trimmed) ? trimmed : `https://${trimmed}`;
    const parsed = new URL(candidate);
    const hostname = parsed.hostname;

    return (
      Boolean(hostname) &&
      (hostname.includes('.') || hostname === 'localhost' || /^\d{1,3}(\.\d{1,3}){3}$/.test(hostname))
    );
  } catch {
    return false;
  }
};

const SearchBar = ({ onSearch, loading }: SearchBarProps) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    onSearch(query.trim());
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="w-full"
    >
      <div className="relative glass-card p-1 flex items-center glow-effect">
        <div className="flex items-center px-3 text-muted-foreground">
          <Shield className="w-5 h-5 text-primary" />
        </div>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter URL to scan or search the web..."
          className="flex-1 bg-transparent px-2 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none text-sm"
        />
        <button
          type="submit"
          disabled={loading || !query.trim()}
          className="mr-1 flex items-center gap-2 rounded-lg bg-gradient-to-r from-primary to-secondary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-all hover:shadow-lg hover:shadow-primary/25 disabled:opacity-50"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
          {isUrl(query) ? 'Scan' : 'Search'}
        </button>
      </div>
    </motion.form>
  );
};

export default SearchBar;
export { isUrl };
