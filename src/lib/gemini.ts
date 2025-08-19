import { GoogleGenerativeAI } from "@google/generative-ai";
import { SymptomEntry } from "@/lib/supabase";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GOOGLE_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

export interface SymptomAnalysis {
	summary: string;
	urgency: "low" | "medium" | "high";
	patterns: string[];
	recommendations: string[];
	doctorNotes: string;
}

export async function analyzeSymptoms(
	entries: SymptomEntry[]
): Promise<SymptomAnalysis> {
	const prompt = `
    As a healthcare AI assistant, analyze the following symptom entries and provide:
    1. A concise summary of the health patterns
    2. Urgency level (low/medium/high) for seeking medical care
    3. Notable patterns or correlations
    4. General health recommendations
    5. Notes formatted for sharing with a doctor

    Symptom entries:
    ${JSON.stringify(entries, null, 2)}

    Format your response as JSON with keys: summary, urgency, patterns, recommendations, doctorNotes.
    Be helpful but remind users this is not a substitute for professional medical advice.
  `;

	try {
		const result = await model.generateContent(prompt);
		const response = await result.response;
		const text = response.text();

		// Parse JSON response
		const jsonMatch = text.match(/\{[\s\S]*\}/);
		if (jsonMatch) {
			return JSON.parse(jsonMatch[0]);
		}

		// Fallback if JSON parsing fails
		return {
			summary: text,
			urgency: "low",
			patterns: [],
			recommendations: [
				"Consult with a healthcare provider for personalized advice",
			],
			doctorNotes: text,
		};
	} catch (error) {
		console.error("Error analyzing symptoms:", error);
		throw new Error("Failed to analyze symptoms");
	}
}

export async function generateHealthInsights(
	entries: SymptomEntry[]
): Promise<string[]> {
	const prompt = `
    Analyze these health entries for patterns and correlations:
    ${JSON.stringify(entries, null, 2)}
    
    Provide 3-5 brief insights about patterns, trends, or correlations you notice.
    Each insight should be one sentence. Focus on actionable observations.
  `;

	try {
		const result = await model.generateContent(prompt);
		const response = await result.response;
		const text = response.text();

		return text
			.split("\n")
			.filter((line) => line.trim().length > 0)
			.slice(0, 5);
	} catch (error) {
		console.error("Error generating insights:", error);
		return ["Unable to generate insights at this time."];
	}
}
