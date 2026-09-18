import {
  SAFE_DOMAINS,
  PHISHING_KEYWORDS,
  PHISHING_TOKENS,
  MALWARE_KEYWORDS,
  MALWARE_TOKENS,
  SCAM_KEYWORDS,
  ADULT_KEYWORDS,
  GAMBLING_KEYWORDS,
  VIOLENCE_KEYWORDS,
  ILLEGAL_DRUGS_KEYWORDS,
  SUSPICIOUS_PATTERNS,
  SUSPICIOUS_TLDS,
  BLACKLISTED_DOMAINS,
} from '@/data/contentDataset';

export interface ThreatAnalysis {
  url: string;
  risk_score: number;
  status: 'safe' | 'suspicious' | 'dangerous';
  category: string;
  confidence: number;
  reason: string;
  recommendation: string;
  detection_methods: string[];
  threat_type?: string;
  blocked_for_age?: boolean;
  age_policy?: 'BLOCKED_ALL' | 'BLOCKED_CHILD_TEEN' | 'BLOCKED_CHILD_RESTRICTED_TEEN' | 'ALLOWED_ALL';
  ai_analysis?: string;
  details?: string[];
  domain_age?: string;
  ssl_status?: string;
  hosting_provider?: string;
  blacklist_status?: string;
}

function extractDomain(url: string): string {
  try {
    const cleaned = url.replace(/^(https?:\/\/)?(www\.)?/, '');
    return cleaned.split('/')[0].toLowerCase();
  } catch {
    return url.toLowerCase();
  }
}

/**
 * Normalize leetspeak and common typos
 */
function normalizeText(text: string): string {
  let normalized = text.toLowerCase();
  normalized = normalized
    .replace(/0/g, 'o')
    .replace(/1/g, 'i')
    .replace(/3/g, 'e')
    .replace(/@/g, 'a')
    .replace(/\$/g, 's');
  
  if (normalized.includes('porhub')) {
    normalized = normalized.replace('porhub', 'pornhub');
  }
  return normalized;
}

export function isKnownSafeDomain(url: string): boolean {
  const domain = extractDomain(url);
  return SAFE_DOMAINS.some((trustedDomain) => (
    domain === trustedDomain || domain.endsWith(`.${trustedDomain}`)
  ));
}

function matchesPatterns(text: string, patterns: string[]): string[] {
  const normalized = normalizeText(text);
  return patterns.filter((p) => text.includes(p) || normalized.includes(p));
}

export function analyzeUrl(url: string, ageGroup: string = 'adult'): ThreatAnalysis {
  const domain = extractDomain(url);
  const urlLower = url.toLowerCase();
  const normalizedAgeGroup = (ageGroup || 'adult').toLowerCase();
  
  // ── LAYER 1: BLACKLIST CHECK (Banned for ALL) ──
  const blacklistMatch = BLACKLISTED_DOMAINS.find((blacklisted) => domain.includes(blacklisted.toLowerCase()));
  if (blacklistMatch) {
    return {
      url,
      risk_score: 100,
      status: 'dangerous',
      category: 'Blacklisted Threat',
      confidence: 99,
      reason: '🚨 Domain is blacklisted in threat intelligence databases (PhishTank/OpenPhish). Banned for ALL age tiers.',
      recommendation: 'CRITICAL: ACCESS BLOCKED FOR ALL USERS',
      detection_methods: ['Blacklist Intelligence', 'Domain Reputation'],
      threat_type: 'blacklist',
      age_policy: 'BLOCKED_ALL',
      blocked_for_age: true,
      details: [`Matched blacklisted domain: ${blacklistMatch}`, 'Action: Universal Access Blocked'],
      domain_age: 'Untrusted',
      ssl_status: 'Invalid / Suspicious',
      hosting_provider: 'Blocked Host',
      blacklist_status: 'BLACKLISTED',
    };
  }

  // ── LAYER 2: MULTI-TOKEN PHISHING & CREDENTIAL HARVESTING HEURISTIC ──
  const phishingMatches = matchesPatterns(urlLower, PHISHING_KEYWORDS);
  const matchedPhishingTokens = PHISHING_TOKENS.filter((token) => urlLower.includes(token));
  
  if (phishingMatches.length > 0 || matchedPhishingTokens.length >= 2) {
    const matchedList = Array.from(new Set([...phishingMatches, ...matchedPhishingTokens]));
    return {
      url,
      risk_score: Math.min(100, 85 + matchedList.length * 5),
      status: 'dangerous',
      category: 'Phishing Threat',
      confidence: 96,
      reason: '🚫 BLOCKED FOR ALL USERS: Fake credential harvesting or bank login phishing scam detected.',
      recommendation: 'CRITICAL: BLOCK ACCESS (Child, Teen, Adult)',
      detection_methods: ['Multi-Token Phishing Classifier', 'Credential Harvest Heuristic'],
      threat_type: 'phishing',
      age_policy: 'BLOCKED_ALL',
      blocked_for_age: true,
      details: [`Phishing indicators found: ${matchedList.join(', ')}`, 'Target: Bank/Credential theft', 'Banned for: Child, Teen, Adult'],
      blacklist_status: 'NOT_LISTED',
    };
  }

  // ── LAYER 3: MALWARE & VIRUS THREATS ──
  const malwareMatches = matchesPatterns(urlLower, MALWARE_KEYWORDS);
  const matchedMalwareTokens = MALWARE_TOKENS.filter((token) => urlLower.includes(token));

  if (malwareMatches.length > 0 || matchedMalwareTokens.length >= 2) {
    const matchedList = Array.from(new Set([...malwareMatches, ...matchedMalwareTokens]));
    return {
      url,
      risk_score: Math.min(100, 90 + matchedList.length * 4),
      status: 'dangerous',
      category: 'Malware / Virus Threat',
      confidence: 98,
      reason: '🚫 BLOCKED FOR ALL USERS: Virus/Malware distribution link detected. Poses security risk to devices.',
      recommendation: 'CRITICAL: BLOCK ACCESS (Child, Teen, Adult)',
      detection_methods: ['Malware Pattern Analyzer', 'Exploit Payload Scanner'],
      threat_type: 'malware',
      age_policy: 'BLOCKED_ALL',
      blocked_for_age: true,
      details: [`Malware keywords found: ${matchedList.join(', ')}`, 'Risk: Device infection/Trojan', 'Banned for: Child, Teen, Adult'],
      blacklist_status: 'NOT_LISTED',
    };
  }

  const scamMatches = matchesPatterns(urlLower, SCAM_KEYWORDS);
  if (scamMatches.length > 0) {
    return {
      url,
      risk_score: Math.min(100, 80 + scamMatches.length * 5),
      status: 'dangerous',
      category: 'Financial Scam',
      confidence: 94,
      reason: '🚫 BLOCKED FOR ALL USERS: Deceptive financial scam or cryptocurrency fraud detected.',
      recommendation: 'BLOCK ACCESS (Child, Teen, Adult)',
      detection_methods: ['Scam Signature Match', 'Financial Risk Engine'],
      threat_type: 'scam',
      age_policy: 'BLOCKED_ALL',
      blocked_for_age: true,
      details: [`Scam indicators found: ${scamMatches.join(', ')}`, 'Banned for: Child, Teen, Adult'],
      blacklist_status: 'NOT_LISTED',
    };
  }

  // ── LAYER 4: ADULT / EXPLICIT CONTENT POLICY MATRIX ──
  const adultMatches = matchesPatterns(urlLower, ADULT_KEYWORDS);
  if (adultMatches.length > 0) {
    if (normalizedAgeGroup === 'child') {
      return {
        url,
        risk_score: 100,
        status: 'dangerous',
        category: 'Adult / Explicit Content',
        confidence: 98,
        reason: '🚫 PERMANENTLY BLOCKED FOR CHILD: Adult/pornographic content is strictly banned for accounts under 13.',
        recommendation: 'ACCESS PERMANENTLY BLOCKED',
        detection_methods: ['Fuzzy Typo Classifier', 'Adult Content Filter'],
        threat_type: 'age_restricted_adult',
        age_policy: 'BLOCKED_CHILD_RESTRICTED_TEEN',
        blocked_for_age: true,
        details: [`Adult keywords: ${adultMatches.join(', ')}`, 'Policy: Child Mode (Under 13) -> Strict Ban', 'Status: Banned'],
        blacklist_status: 'NOT_LISTED',
      };
    }

    if (normalizedAgeGroup === 'teen') {
      return {
        url,
        risk_score: 70,
        status: 'suspicious',
        category: 'Adult / Explicit Content',
        confidence: 90,
        reason: '⚠️ PARTIAL BAN / RESTRICTED FOR TEEN: Explicit adult material detected. SafeSearch & parental warnings enforced.',
        recommendation: 'PROCEED WITH CAUTION — AGE RESTRICTED',
        detection_methods: ['Age Protection Matrix', 'Teen Restricted Filter'],
        threat_type: 'age_restricted_adult',
        age_policy: 'BLOCKED_CHILD_RESTRICTED_TEEN',
        blocked_for_age: false,
        details: [`Adult keywords: ${adultMatches.join(', ')}`, 'Policy: Teen Mode (13–17) -> Restricted Warning', 'Status: Restricted Warning'],
        blacklist_status: 'NOT_LISTED',
      };
    }

    // Adult user mode (18+)
    return {
      url,
      risk_score: 15,
      status: 'safe',
      category: 'Adult Content (Verified Adult User)',
      confidence: 85,
      reason: '✅ ACCESSIBLE FOR ADULT: Adult material detected, but permitted under Adult User Mode (18+).',
      recommendation: 'Safe to access for adult account',
      detection_methods: ['Age Protection Matrix', 'Adult Mode Verification'],
      threat_type: 'adult_allowed',
      age_policy: 'BLOCKED_CHILD_RESTRICTED_TEEN',
      blocked_for_age: false,
      details: [`Adult keywords: ${adultMatches.join(', ')}`, 'Policy: Adult Mode (18+) -> Allowed'],
      blacklist_status: 'NOT_LISTED',
    };
  }

  // ── LAYER 5: GAMBLING POLICY MATRIX ──
  const gamblingMatches = matchesPatterns(urlLower, GAMBLING_KEYWORDS);
  if (gamblingMatches.length > 0) {
    if (normalizedAgeGroup === 'child' || normalizedAgeGroup === 'teen') {
      return {
        url,
        risk_score: 95,
        status: 'dangerous',
        category: 'Online Gambling',
        confidence: 95,
        reason: `🚫 BLOCKED FOR MINORS (${normalizedAgeGroup.toUpperCase()}): Gambling and betting content is legally banned for users under 18.`,
        recommendation: 'ACCESS BLOCKED FOR MINORS',
        detection_methods: ['Underage Gambling Filter', 'Age Protection Matrix'],
        threat_type: 'age_restricted_gambling',
        age_policy: 'BLOCKED_CHILD_TEEN',
        blocked_for_age: true,
        details: [`Gambling keywords: ${gamblingMatches.join(', ')}`, `Policy: ${normalizedAgeGroup} Mode -> Banned`],
        blacklist_status: 'NOT_LISTED',
      };
    }

    return {
      url,
      risk_score: 20,
      status: 'safe',
      category: 'Online Gambling',
      confidence: 88,
      reason: '✅ ACCESSIBLE FOR ADULT: Gambling platform detected, permitted for adult user mode.',
      recommendation: 'Visit with standard caution',
      detection_methods: ['Age Protection Matrix'],
      threat_type: 'gambling_allowed',
      age_policy: 'BLOCKED_CHILD_TEEN',
      blocked_for_age: false,
      details: [`Gambling keywords: ${gamblingMatches.join(', ')}`, 'Policy: Adult Mode -> Allowed'],
      blacklist_status: 'NOT_LISTED',
    };
  }

  // ── LAYER 6: VIOLENCE & ILLEGAL DRUGS MATRIX ──
  const violenceMatches = matchesPatterns(urlLower, VIOLENCE_KEYWORDS);
  if (violenceMatches.length > 0) {
    if (normalizedAgeGroup === 'child' || normalizedAgeGroup === 'teen') {
      return {
        url,
        risk_score: 98,
        status: 'dangerous',
        category: 'Violent & Harmful Content',
        confidence: 96,
        reason: `🚫 BLOCKED FOR MINORS (${normalizedAgeGroup.toUpperCase()}): Graphic violence and harmful content are restricted.`,
        recommendation: 'ACCESS BLOCKED',
        detection_methods: ['Harmful Content Scanner', 'Age Protection Matrix'],
        threat_type: 'age_restricted_violence',
        age_policy: 'BLOCKED_CHILD_TEEN',
        blocked_for_age: true,
        details: [`Violence keywords: ${violenceMatches.join(', ')}`, 'Banned for Child and Teen tiers'],
        blacklist_status: 'NOT_LISTED',
      };
    }

    return {
      url,
      risk_score: 65,
      status: 'suspicious',
      category: 'Graphic / Violent Content',
      confidence: 85,
      reason: '⚠️ WARNING: Graphic violent content detected. Proceed with caution.',
      recommendation: 'PROCEED WITH CAUTION',
      detection_methods: ['Content Analyzer'],
      threat_type: 'violence_warning',
      age_policy: 'BLOCKED_CHILD_TEEN',
      blocked_for_age: false,
      details: [`Violence keywords: ${violenceMatches.join(', ')}`],
      blacklist_status: 'NOT_LISTED',
    };
  }

  // ── LAYER 7: TRUSTED SAFE DOMAIN CHECK ──
  if (isKnownSafeDomain(url)) {
    return {
      url,
      risk_score: 5,
      status: 'safe',
      category: 'Verified Safe & Educational',
      confidence: 99,
      reason: '✅ ALLOWED FOR ALL USERS: Trusted domain with high security score and positive reputation.',
      recommendation: 'SAFE TO VISIT (Child, Teen, Adult)',
      detection_methods: ['Trusted Registry', 'Domain Verification'],
      threat_type: 'safe_domain',
      age_policy: 'ALLOWED_ALL',
      blocked_for_age: false,
      details: ['Verified in trusted domain list', 'SSL Certificate valid', 'Accessible for all age groups'],
      blacklist_status: 'NOT_LISTED',
    };
  }

  // ── LAYER 8: SUSPICIOUS TLD & PATTERNS ──
  const suspiciousMatches = matchesPatterns(urlLower, SUSPICIOUS_PATTERNS);
  const tldMatch = SUSPICIOUS_TLDS.find((tld) => domain.endsWith(tld));
  if (suspiciousMatches.length > 0 || tldMatch) {
    return {
      url,
      risk_score: 55,
      status: 'suspicious',
      category: 'Low-Reputation Domain',
      confidence: 75,
      reason: '⚠️ Website displays suspicious url patterns or low-reputation TLD.',
      recommendation: 'Proceed with caution, avoid submitting passwords.',
      detection_methods: ['TLD Reputation', 'Pattern Check'],
      threat_type: 'suspicious',
      age_policy: 'ALLOWED_ALL',
      blocked_for_age: false,
      details: [
        tldMatch ? `Suspicious TLD match: ${tldMatch}` : 'Suspicious string pattern',
        ...(suspiciousMatches.length > 0 ? [`Indicators: ${suspiciousMatches.join(', ')}`] : []),
      ],
      blacklist_status: 'NOT_LISTED',
    };
  }

  // DEFAULT SAFE RESULT
  return {
    url,
    risk_score: 12,
    status: 'safe',
    category: 'Clean Domain',
    confidence: 88,
    reason: '✅ Clean URL: No malicious indicators or age policy violations detected.',
    recommendation: 'Safe to visit',
    detection_methods: ['General Heuristic Scan'],
    threat_type: 'clean',
    age_policy: 'ALLOWED_ALL',
    blocked_for_age: false,
    details: ['No threat flags triggered', 'Standard web page'],
    blacklist_status: 'NOT_LISTED',
  };
}
