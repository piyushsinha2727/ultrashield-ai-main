import { analyzeUrl, ThreatAnalysis } from "@/lib/threatEngine";

export async function scanWebsite(url: string, userMode: string = "adult"): Promise<{
  category: string;
  riskScore: number;
  action: "BLOCKED" | "WARNING" | "ALLOWED";
  analysis: ThreatAnalysis;
}> {
  const analysis = analyzeUrl(url, userMode);

  let action: "BLOCKED" | "WARNING" | "ALLOWED" = "ALLOWED";

  if (analysis.status === "dangerous" || analysis.blocked_for_age) {
    action = "BLOCKED";
  } else if (analysis.status === "suspicious") {
    action = "WARNING";
  }

  return {
    category: analysis.category,
    riskScore: analysis.risk_score,
    action,
    analysis,
  };
}