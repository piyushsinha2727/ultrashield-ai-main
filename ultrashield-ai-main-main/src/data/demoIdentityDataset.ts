export type AgeGroup = 'child' | 'teen' | 'adult';

export interface DemoIdentity {
  id: string;
  name: string;
  dob: string;
  ageGroup: AgeGroup;
  protectionLevel: 'Maximum' | 'High' | 'Standard';
  description: string;
}

export const DEMO_IDS: Record<string, DemoIdentity> = {
  // Child Accounts (Under 13)
  'CHD-001': { id: 'CHD-001', name: 'Aarav Kumar', dob: '2015-10-03', ageGroup: 'child', protectionLevel: 'Maximum', description: 'Strict protection: Adult, Gambling, Violence & Unsafe Search blocked' },
  'CHD-002': { id: 'CHD-002', name: 'Anaya Sharma', dob: '2016-04-12', ageGroup: 'child', protectionLevel: 'Maximum', description: 'Strict protection: Adult, Gambling, Violence & Unsafe Search blocked' },
  'CHD-003': { id: 'CHD-003', name: 'Vivaan Patel', dob: '2014-06-08', ageGroup: 'child', protectionLevel: 'Maximum', description: 'Strict protection: Adult, Gambling, Violence & Unsafe Search blocked' },
  'CHD-004': { id: 'CHD-004', name: 'Diya Singh', dob: '2015-11-07', ageGroup: 'child', protectionLevel: 'Maximum', description: 'Strict protection: Adult, Gambling, Violence & Unsafe Search blocked' },
  'CHD-005': { id: 'CHD-005', name: 'Arjun Gupta', dob: '2014-12-15', ageGroup: 'child', protectionLevel: 'Maximum', description: 'Strict protection: Adult, Gambling, Violence & Unsafe Search blocked' },
  'CHD-006': { id: 'CHD-006', name: 'Myra Mehta', dob: '2015-03-20', ageGroup: 'child', protectionLevel: 'Maximum', description: 'Strict protection: Adult, Gambling, Violence & Unsafe Search blocked' },
  'CHD-007': { id: 'CHD-007', name: 'Kabir Jain', dob: '2013-09-01', ageGroup: 'child', protectionLevel: 'Maximum', description: 'Strict protection: Adult, Gambling, Violence & Unsafe Search blocked' },
  'CHD-008': { id: 'CHD-008', name: 'Siya Verma', dob: '2015-07-23', ageGroup: 'child', protectionLevel: 'Maximum', description: 'Strict protection: Adult, Gambling, Violence & Unsafe Search blocked' },

  // Teen Accounts (13–17)
  'TEEN-101': { id: 'TEEN-101', name: 'Rahul Sharma', dob: '2009-05-09', ageGroup: 'teen', protectionLevel: 'High', description: 'High protection: Adult content restricted with warning, Gambling & Malware blocked' },
  'TEEN-102': { id: 'TEEN-102', name: 'Priya Patel', dob: '2008-11-14', ageGroup: 'teen', protectionLevel: 'High', description: 'High protection: Adult content restricted with warning, Gambling & Malware blocked' },
  'TEEN-103': { id: 'TEEN-103', name: 'Aditya Singh', dob: '2010-02-17', ageGroup: 'teen', protectionLevel: 'High', description: 'High protection: Adult content restricted with warning, Gambling & Malware blocked' },
  'TEEN-104': { id: 'TEEN-104', name: 'Neha Gupta', dob: '2008-07-29', ageGroup: 'teen', protectionLevel: 'High', description: 'High protection: Adult content restricted with warning, Gambling & Malware blocked' },
  'TEEN-105': { id: 'TEEN-105', name: 'Arjun Mehta', dob: '2009-12-02', ageGroup: 'teen', protectionLevel: 'High', description: 'High protection: Adult content restricted with warning, Gambling & Malware blocked' },
  'TEEN-106': { id: 'TEEN-106', name: 'Riya Jain', dob: '2010-08-21', ageGroup: 'teen', protectionLevel: 'High', description: 'High protection: Adult content restricted with warning, Gambling & Malware blocked' },
  'TEEN-107': { id: 'TEEN-107', name: 'Karan Verma', dob: '2008-03-06', ageGroup: 'teen', protectionLevel: 'High', description: 'High protection: Adult content restricted with warning, Gambling & Malware blocked' },
  'TEEN-108': { id: 'TEEN-108', name: 'Sneha Kapoor', dob: '2009-10-19', ageGroup: 'teen', protectionLevel: 'High', description: 'High protection: Adult content restricted with warning, Gambling & Malware blocked' },

  // Adult Accounts (18+)
  'ADT-201': { id: 'ADT-201', name: 'Alex Johnson', dob: '1992-05-15', ageGroup: 'adult', protectionLevel: 'Standard', description: 'Standard protection: Phishing & Malware blocked, Adult content allowed' },
  'ADT-202': { id: 'ADT-202', name: 'Jamie Smith', dob: '1998-08-22', ageGroup: 'adult', protectionLevel: 'Standard', description: 'Standard protection: Phishing & Malware blocked, Adult content allowed' },
  'ADT-203': { id: 'ADT-203', name: 'Taylor Brown', dob: '1990-03-10', ageGroup: 'adult', protectionLevel: 'Standard', description: 'Standard protection: Phishing & Malware blocked, Adult content allowed' },
  'ADT-204': { id: 'ADT-204', name: 'Morgan Lee', dob: '1995-11-30', ageGroup: 'adult', protectionLevel: 'Standard', description: 'Standard protection: Phishing & Malware blocked, Adult content allowed' },
  'ADT-205': { id: 'ADT-205', name: 'Priya Sharma', dob: '1996-01-20', ageGroup: 'adult', protectionLevel: 'Standard', description: 'Standard protection: Phishing & Malware blocked, Adult content allowed' },
  'ADT-206': { id: 'ADT-206', name: 'Ravi Patel', dob: '1994-07-14', ageGroup: 'adult', protectionLevel: 'Standard', description: 'Standard protection: Phishing & Malware blocked, Adult content allowed' },
  'ADT-207': { id: 'ADT-207', name: 'Sophia Chen', dob: '1993-12-05', ageGroup: 'adult', protectionLevel: 'Standard', description: 'Standard protection: Phishing & Malware blocked, Adult content allowed' },
  'ADT-208': { id: 'ADT-208', name: 'Daniel Kim', dob: '1991-09-18', ageGroup: 'adult', protectionLevel: 'Standard', description: 'Standard protection: Phishing & Malware blocked, Adult content allowed' },
};

export function getDemoIdentity(idKey: string): DemoIdentity | undefined {
  const formattedKey = idKey.trim().toUpperCase();
  return DEMO_IDS[formattedKey];
}

export function getDemoIdentitiesByGroup(ageGroup: AgeGroup): DemoIdentity[] {
  return Object.values(DEMO_IDS).filter(identity => identity.ageGroup === ageGroup);
}
