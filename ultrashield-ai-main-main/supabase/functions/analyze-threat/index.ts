import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { url, ageGroup } = await req.json();
    const ULTRASHIELD_API_KEY = Deno.env.get("ULTRASHIELD_API_KEY");
    if (!ULTRASHIELD_API_KEY) throw new Error("ULTRASHIELD_API_KEY is not configured");

    const systemPrompt = `You are a cybersecurity threat analysis AI. Analyze the given URL and return a threat assessment.

RULES:
- You are analyzing a URL for potential security threats.
- Consider: phishing patterns, malware indicators, scam signals, domain reputation, suspicious TLDs, keyword analysis.
- The user's age group is: ${ageGroup}

For users under 18 (child or teen):
- ANY URL containing adult/explicit/pornographic content keywords MUST be scored 100 and marked dangerous with blocked_for_age=true
- ANY URL containing gambling keywords MUST be scored 100 and marked dangerous with blocked_for_age=true  
- Be EXTREMELY strict — even slight hints of inappropriate content must be blocked

For all users:
- Phishing URLs (fake login pages, credential harvesting): score 80-100, dangerous
- Malware distribution sites: score 85-100, dangerous
- Scam/fraud sites: score 70-100, dangerous
- Suspicious but not confirmed threats: score 35-70, suspicious
- Known safe domains (google, amazon, wikipedia, etc.): score 5-15, safe
- Unknown domains: score 20-40, analyze carefully

You MUST respond with a valid JSON object using this tool.`;

    const response = await fetch("https://api.ultrashield.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${ULTRASHIELD_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Analyze this URL for security threats: ${url}` },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "threat_assessment",
              description: "Return the threat assessment for the analyzed URL",
              parameters: {
                type: "object",
                properties: {
                  risk_score: { type: "number", description: "Risk score from 0-100" },
                  status: { type: "string", enum: ["safe", "suspicious", "dangerous"] },
                  reason: { type: "string", description: "Human-readable explanation of the threat assessment" },
                  threat_type: { type: "string", description: "Type of threat: phishing, malware, scam, adult_content, gambling, harmful_content, suspicious_content, none" },
                  blocked_for_age: { type: "boolean", description: "Whether this content is blocked due to age restrictions" },
                  details: { type: "array", items: { type: "string" }, description: "List of specific findings" },
                },
                required: ["risk_score", "status", "reason", "threat_type", "blocked_for_age", "details"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "threat_assessment" } },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited, please try again later." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI analysis failed", fallback: true }), {
        status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    
    if (toolCall?.function?.arguments) {
      const analysis = JSON.parse(toolCall.function.arguments);
      return new Response(JSON.stringify({ ...analysis, url, ai_powered: true }), {
        status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "AI returned unexpected format", fallback: true }), {
      status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("analyze-threat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error", fallback: true }), {
      status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
