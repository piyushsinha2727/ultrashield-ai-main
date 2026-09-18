/**
 * Comprehensive Content Classification & Age Policy Dataset (250+ words, patterns, token signatures, and domain typos)
 * Centralized dataset used for real-time URL analysis, age-based filtering, and threat scoring.
 */

export interface PolicyRule {
  category: string;
  threatType: string;
  riskScore: number;
  childAction: 'BLOCKED' | 'RESTRICTED' | 'ALLOWED';
  teenAction: 'BLOCKED' | 'RESTRICTED' | 'ALLOWED';
  adultAction: 'BLOCKED' | 'RESTRICTED' | 'ALLOWED';
  reasonTemplate: {
    child: string;
    teen: string;
    adult: string;
  };
}

// ── 1. KNOWN SAFE & TRUSTED DOMAINS ──
export const SAFE_DOMAINS: string[] = [
  'google.com', 'youtube.com', 'amazon.com', 'wikipedia.org', 'github.com',
  'stackoverflow.com', 'microsoft.com', 'apple.com', 'netflix.com', 'reddit.com',
  'linkedin.com', 'twitter.com', 'facebook.com', 'instagram.com', 'whatsapp.com',
  'bbc.com', 'cnn.com', 'nytimes.com', 'github.io', 'medium.com',
  'coursera.org', 'khanacademy.org', 'edx.org', 'udemy.com', 'codecademy.com',
  'w3schools.com', 'mozilla.org', 'python.org', 'nodejs.org', 'npmjs.com',
  'nasa.gov', 'nationalgeographic.com', 'duolingo.com', 'scratch.mit.edu',
  'pbskids.org', 'nationalgeographic.com', 'britannica.com', 'arxiv.org',
  'bing.com', 'duckduckgo.com', 'yahoo.com', 'msn.com',
];

// ── 2. PHISHING HIGH-RISK TOKENS & PATTERNS ──
export const PHISHING_TOKENS: string[] = [
  'login', 'bank', 'security', 'verify', 'account', 'signin', 'confirm',
  'update', 'billing', 'auth', 'paypal', 'apple', 'microsoft', 'amazon',
  'portal', 'wallet', 'credential', 'support', 'pass', 'secureserver',
  'identity', 'banking', 'online-banking', 'suspended', 'urgent',
  'pypal', 'paypa1', 'g00gle', 'micros0ft', 'securelogin',
];

export const PHISHING_KEYWORDS: string[] = [
  'login-verify', 'account-suspended', 'urgent-action', 'confirm-identity',
  'verify-account', 'update-billing', 'reset-password-now', 'secure-login',
  'paypal-verify', 'apple-id-confirm', 'microsoft-alert', 'google-security',
  'bank-verify', 'suspended-account', 'unusual-activity', 'signin-alert',
  'account-locked', 'verify-your-identity', 'confirm-payment', 'security-update',
  'credential-harvest', '0nline-banking', 'paypal-login', 'paypai-login', 'amazon-payment-check',
];

// ── 3. MALWARE, VIRUS, RANSOMWARE, TROJAN & BOTNETS ──
export const MALWARE_TOKENS: string[] = [
  'malware', 'trojan', 'trojanhorse', 'ransomware', 'keylogger', 'rootkit', 'spyware',
  'crack', 'keygen', 'warez', 'nulled', 'exploit', 'botnet', 'payload',
  'dropper', 'virus', 'worm', 'stealer', 'hacktool', 'backdoor', 'zero-day',
  'm4lware', 'tr0jan', 'r4nsomware', 'backdoor-trojan', 'rat-stealer',
];

export const MALWARE_KEYWORDS: string[] = [
  'malware', 'trojan', 'trojanhorse', 'trojan-horse', 'ransomware', 'keylogger', 'rootkit', 'spyware',
  'free-crack', 'keygen', 'warez', 'nulled', 'cracked-software',
  'free-download-full', 'hack-tool', 'exploit-kit', 'botnet',
  'drive-by-download', 'backdoor', 'payload', 'dropper', 'virus-download',
  'worm-payload', 'stealer-exe', 'rat-tool', 'zero-day-exploit', 'c2-server',
];

// ── 4. SCAM & FINANCIAL FRAUD ──
export const SCAM_KEYWORDS: string[] = [
  'free-money', 'earn-quick', 'get-rich', 'guaranteed-income', 'double-bitcoin',
  'free-iphone', 'winner-selected', 'claim-prize', 'lottery-winner',
  'investment-guaranteed', 'crypto-doubler', 'money-flip', 'cash-app-flip',
  'sugar-daddy', 'sugar-mommy', 'work-from-home-easy', 'mlm-opportunity',
  'pyramid-scheme', 'ponzi', 'forex-signal-guaranteed', 'crypto-scam',
];

// ── 5. ADULT / PORNO / EXPLICIT (Comprehensive list covering all adult sites and typos) ──
export const ADULT_KEYWORDS: string[] = [
  'porn', 'pornhub', 'porhub', 'porno', 'pornography', 'p0rn', 'prn', 'xxx', 'xvideos', 'xnxx',
  'adult', 'nsfw', 'sex', 's3x', 'naked', 'nude', 'erotic', 'hentai', 'onlyfans', 'chaturbate',
  'brazzers', 'xhamster', 'redtube', 'youporn', 'stripchat', 'cam4', 'livejasmin', 'bongacams',
  'rule34', 'e621', 'nhentai', 'hanime', 'fapello', 'thothub', 'spankbang', 'eporner', 'tube8',
  'beeg', 'bangbros', 'naughtyamerica', 'realitykings', 'mofos', 'tushy', 'blacked', 'vixen',
  'hegre', 'met-art', 'playboy', 'penthouse', 'hustler', 'sexting', 'hookup', 'tinder-hookup',
  'escort', 'backpage', 'adultfriendfinder', 'ashleymadison', 'fetlife', 'xvideo', 'x-video',
  'porno-video', 'sex-video', 'adult-zone', 'free-porn', 'taboo-porn', 'softcore', 'hardcore-porn', 'porh',
  'adultdvd', 'sexcam', 'camgirl', 'milf', 'fetish', 'erotica', 'nsfw-chat', 'playboy-plus',
];

// ── 6. GAMBLING & BETTING ──
export const GAMBLING_KEYWORDS: string[] = [
  'casino', 'bet', 'gambling', 'slots', 'poker', 'blackjack', 'roulette',
  'sportsbet', 'betting', '1xbet', 'bet365', 'betway', 'draftkings',
  'fanduel', 'bovada', 'stake', 'rollbit', 'roobet', 'csgoroll',
  'jackpot', 'slot-machine', 'online-casino', 'spin-win', 'lucky-draw',
  'mega-win', 'lottery', 'lotto', 'powerball', 'scratch-card', 'c4sino', 'b3t',
];

// ── 7. VIOLENCE, GORE & EXTREMISM ──
export const VIOLENCE_KEYWORDS: string[] = [
  'gore', 'bestgore', 'liveleak-death', 'execution', 'torture-video',
  'self-harm', 'suicide-method', 'how-to-kill', 'mass-shooting',
  'bomb-making', 'weapon-tutorial', 'drug-market', 'darknet-market',
  'silk-road', 'hitman-hire', 'doxxing-service', 'extremist-propaganda',
];

// ── 8. ILLEGAL DRUGS & NARCOTICS ──
export const ILLEGAL_DRUGS_KEYWORDS: string[] = [
  'buy-fentanyl', 'darknet-drugs', 'illegal-narcotics', 'buy-cocaine',
  'buy-weed-online', 'synthetic-drugs', 'pill-mill', 'narcotic-vendor',
];

// ── 9. SUSPICIOUS PATTERNS & TLDS ──
export const SUSPICIOUS_PATTERNS: string[] = [
  'free', 'winner', 'prize', 'click-here', 'limited-offer',
  'crypto-invest', 'earn-money', 'download-free', 'act-now',
  'exclusive-deal', 'one-time-offer', 'congratulations',
];

export const SUSPICIOUS_TLDS: string[] = [
  '.xyz', '.tk', '.ml', '.ga', '.cf', '.gq', '.top', '.buzz', '.club', '.icu',
];

export const BLACKLISTED_DOMAINS: string[] = [
  'phishing.com', 'malware.com', '0nline-banking-secure.net',
  'paypal-login.com', 'paypai-login.com', 'secure-login-paypal.com', 'amazon-payment-check.net',
  'login-verify-security.net', 'update-payment-info.org', 'confirm-account-info.io',
  'badware-site.test', 'ransomware-download.info', 'trojan-dropper.cc', 'login-bank-security.com',
  'trojenhorse.com', 'trojanhorse.com', 'trojan-horse.com',
];

export const EMBED_RESTRICTED_DOMAINS: string[] = [
  'google.com', 'facebook.com', 'instagram.com', 'x.com', 'twitter.com',
  'linkedin.com', 'reddit.com', 'youtube.com', 'github.com',
];

// Combine all keywords for metrics
export const ALL_KEYWORDS_COUNT =
  PHISHING_KEYWORDS.length +
  PHISHING_TOKENS.length +
  MALWARE_KEYWORDS.length +
  MALWARE_TOKENS.length +
  SCAM_KEYWORDS.length +
  ADULT_KEYWORDS.length +
  GAMBLING_KEYWORDS.length +
  VIOLENCE_KEYWORDS.length +
  ILLEGAL_DRUGS_KEYWORDS.length +
  SUSPICIOUS_PATTERNS.length +
  SAFE_DOMAINS.length;
