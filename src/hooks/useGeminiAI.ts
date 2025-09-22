import { useState } from "react";

export function useGeminiAI() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Call Gemini API with health data
  async function askGemini(prompt: string, apiKey: string) {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" + apiKey, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      });
      const data = await response.json();
      if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
        setResult(data.candidates[0].content.parts[0].text);
      } else {
        setError("No response from Gemini AI");
      }
    } catch (e: any) {
      setError(e.message || "Error calling Gemini API");
    } finally {
      setLoading(false);
    }
  }

  return { askGemini, loading, result, error };
}
