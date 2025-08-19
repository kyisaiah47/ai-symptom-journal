import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface SymptomEntry {
	id: string;
	user_id: string;
	date: string;
	symptoms: string[];
	severity: number;
	notes: string;
	voice_notes_url?: string;
	photos_urls?: string[];
	ai_summary?: string;
	created_at: string;
	updated_at: string;
}

export interface HealthInsight {
	id: string;
	user_id: string;
	entry_ids: string[];
	insight_type: "pattern" | "correlation" | "recommendation" | "alert";
	title: string;
	description: string;
	confidence_score: number;
	created_at: string;
}
