/**
 * AI Content & Threat Classification Service using Google Gemini API
 */

export interface AIScanResult {
  category: string;
  status: 'safe' | 'suspicious' | 'dangerous';
  riskScore: number;
  blockedForAge: boolean;
  reason: string;
}

export async function scanUrlWithGemini(url: string, ageGroup: string = 'child'): Promise<AIScanResult | null> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  if (!apiKey) {
    return null;
  }

  try {
    const prompt = `You are a web safety & content classification AI scanner. Analyze the URL "${url}" for a user in "${ageGroup}" mode.
Categories: "adult", "gambling", "phishing", "malware", "scam", "violence", "safe".
Requirements:
1. Adult material (porn, erotica, explicit sites or typos like porhub, pornhub, xnxx, p0rn):
   - Child mode: status="dangerous", blockedForAge=true, riskScore=100.
   - Teen mode: status="suspicious", blockedForAge=false, riskScore=70.
   - Adult mode: status="safe", blockedForAge=false, riskScore=15.
2. Malware / Phishing / Viruses -> dangerous for ALL tiers.
3. Gambling -> dangerous for Child & Teen.
4. Clean educational sites -> safe for ALL.

Respond STRICTLY in JSON format without markdown code blocks:
{"category":"...","status":"safe|suspicious|dangerous","riskScore":0-100,"blockedForAge":true|false,"reason":"..."}`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
      }),
    });

    const data = await response.json();
    const candidateText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (candidateText) {
      const cleanJson = candidateText.replace(/```json|```/g, '').trim();
      const parsed = JSON.parse(cleanJson);
      return {
        category: parsed.category || 'analyzed',
        status: parsed.status || 'safe',
        riskScore: Number(parsed.riskScore ?? 0),
        blockedForAge: Boolean(parsed.blockedForAge),
        reason: parsed.reason || 'Analyzed by Gemini AI',
      };
    }
  } catch {}

  return null;
}