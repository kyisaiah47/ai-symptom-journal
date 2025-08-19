import { NextRequest, NextResponse } from "next/server";
import { analyzeSymptoms } from "@/lib/gemini";

export async function POST(request: NextRequest) {
	try {
		const { entries } = await request.json();

		if (!entries || !Array.isArray(entries)) {
			return NextResponse.json(
				{ error: "Invalid entries data" },
				{ status: 400 }
			);
		}

		const analysis = await analyzeSymptoms(entries);

		return NextResponse.json(analysis);
	} catch (error) {
		console.error("Analysis API Error:", error);
		return NextResponse.json(
			{ error: "Failed to analyze symptoms" },
			{ status: 500 }
		);
	}
}

export async function GET() {
	return NextResponse.json({
		message: "AI Symptom Analysis API",
		endpoints: {
			"POST /api/analyze": "Analyze symptom entries and generate insights",
		},
	});
}
