import { describe, it, expect } from 'vitest';
import { analyzeUrl, isKnownSafeDomain } from '@/lib/threatEngine';
import { getDemoIdentity } from '@/data/demoIdentityDataset';
import { ALL_KEYWORDS_COUNT } from '@/data/contentDataset';

describe('UltraShield AI Content Classifier & Policy Engine', () => {
  it('should have a dataset with 100+ patterns/keywords', () => {
    expect(ALL_KEYWORDS_COUNT).toBeGreaterThanOrEqual(100);
  });

  // TEST 1: Virus / Malware / Phishing -> BANNED FOR ALL THREE
  describe('Malicious & Virus Links (Banned for ALL)', () => {
    it('blocks malware links for Child, Teen, and Adult', () => {
      const url = 'http://malware-trojan-download.com/payload.exe';
      const childRes = analyzeUrl(url, 'child');
      const teenRes = analyzeUrl(url, 'teen');
      const adultRes = analyzeUrl(url, 'adult');

      expect(childRes.status).toBe('dangerous');
      expect(teenRes.status).toBe('dangerous');
      expect(adultRes.status).toBe('dangerous');

      expect(childRes.blocked_for_age).toBe(true);
      expect(teenRes.blocked_for_age).toBe(true);
      expect(adultRes.blocked_for_age).toBe(true);
    });

    it('blocks multi-token phishing domain login-bank-verify-portal.org for all user tiers', () => {
      const url = 'login-bank-verify-portal.org';
      const childRes = analyzeUrl(url, 'child');
      const teenRes = analyzeUrl(url, 'teen');
      const adultRes = analyzeUrl(url, 'adult');

      expect(childRes.status).toBe('dangerous');
      expect(teenRes.status).toBe('dangerous');
      expect(adultRes.status).toBe('dangerous');
      expect(childRes.category).toContain('Phishing');
    });

    it('blocks blacklisted domain login-bank-security.com for all user tiers', () => {
      const url = 'http://login-bank-security.com';
      const childRes = analyzeUrl(url, 'child');
      const adultRes = analyzeUrl(url, 'adult');

      expect(childRes.status).toBe('dangerous');
      expect(adultRes.status).toBe('dangerous');
      expect(childRes.blacklist_status).toBe('BLACKLISTED');
    });
  });

  // TEST 2: Porn / Adult Content & Typos (pornhub.com, porhub.com)
  describe('Adult / Pornography Content & Typo Domain Policy', () => {
    const url = 'https://pornhub.com/video/example';
    const typoUrl = 'porhub.com';

    it('permanently blocks adult content for Child accounts (Under 13)', () => {
      const res = analyzeUrl(url, 'child');
      expect(res.status).toBe('dangerous');
      expect(res.blocked_for_age).toBe(true);
      expect(res.risk_score).toBe(100);
      expect(res.reason).toContain('PERMANENTLY BLOCKED FOR CHILD');
    });

    it('permanently blocks adult domain typos (porhub.com) for Child accounts', () => {
      const res = analyzeUrl(typoUrl, 'child');
      expect(res.status).toBe('dangerous');
      expect(res.blocked_for_age).toBe(true);
      expect(res.risk_score).toBe(100);
      expect(res.reason).toContain('PERMANENTLY BLOCKED FOR CHILD');
    });

    it('applies Partial Ban / Restricted Warning for Teen accounts (13-17)', () => {
      const res = analyzeUrl(url, 'teen');
      expect(res.status).toBe('suspicious');
      expect(res.blocked_for_age).toBe(false);
      expect(res.risk_score).toBe(70);
      expect(res.reason).toContain('PARTIAL BAN / RESTRICTED FOR TEEN');
    });

    it('allows adult content for verified Adult accounts (18+)', () => {
      const res = analyzeUrl(url, 'adult');
      expect(res.status).toBe('safe');
      expect(res.blocked_for_age).toBe(false);
      expect(res.risk_score).toBeLessThanOrEqual(20);
      expect(res.reason).toContain('ACCESSIBLE FOR ADULT');
    });
  });

  // TEST 3: Gambling Policy -> BANNED FOR CHILD & TEEN, ALLOWED FOR ADULT
  describe('Online Gambling Policy', () => {
    const url = 'https://1xbet.com/casino/slots';

    it('blocks gambling for Child', () => {
      const res = analyzeUrl(url, 'child');
      expect(res.status).toBe('dangerous');
      expect(res.blocked_for_age).toBe(true);
    });

    it('blocks gambling for Teen (underage law)', () => {
      const res = analyzeUrl(url, 'teen');
      expect(res.status).toBe('dangerous');
      expect(res.blocked_for_age).toBe(true);
    });

    it('allows gambling for Adult', () => {
      const res = analyzeUrl(url, 'adult');
      expect(res.status).toBe('safe');
      expect(res.blocked_for_age).toBe(false);
    });
  });

  // TEST 4: Educational / Safe Sites -> ALLOWED FOR ALL
  describe('Safe & Educational Sites', () => {
    it('allows Wikipedia for Child, Teen, and Adult', () => {
      const url = 'https://wikipedia.org/wiki/Computer_science';
      expect(isKnownSafeDomain(url)).toBe(true);

      const childRes = analyzeUrl(url, 'child');
      const teenRes = analyzeUrl(url, 'teen');
      const adultRes = analyzeUrl(url, 'adult');

      expect(childRes.status).toBe('safe');
      expect(teenRes.status).toBe('safe');
      expect(adultRes.status).toBe('safe');
    });
  });

  // TEST 5: Demo Identity Verification System
  describe('Demo Identity Dataset', () => {
    it('resolves CHD-001 as Child mode', () => {
      const identity = getDemoIdentity('CHD-001');
      expect(identity).toBeDefined();
      expect(identity?.ageGroup).toBe('child');
      expect(identity?.name).toBe('Aarav Kumar');
    });

    it('resolves TEEN-101 as Teen mode', () => {
      const identity = getDemoIdentity('TEEN-101');
      expect(identity).toBeDefined();
      expect(identity?.ageGroup).toBe('teen');
      expect(identity?.name).toBe('Rahul Sharma');
    });

    it('resolves ADT-201 as Adult mode', () => {
      const identity = getDemoIdentity('ADT-201');
      expect(identity).toBeDefined();
      expect(identity?.ageGroup).toBe('adult');
      expect(identity?.name).toBe('Alex Johnson');
    });
  });
});
