"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Mic, Camera, Save, AlertCircle } from "lucide-react";

interface Props {
	onEntryAdded: () => void;
}

const commonSymptoms = [
	"Headache",
	"Fatigue",
	"Nausea",
	"Fever",
	"Cough",
	"Sore Throat",
	"Muscle Pain",
	"Joint Pain",
	"Dizziness",
	"Sleep Issues",
	"Anxiety",
	"Stomach Pain",
	"Back Pain",
	"Shortness of Breath",
];

export default function SymptomEntryForm({ onEntryAdded }: Props) {
	const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
	const [severity, setSeverity] = useState(3);
	const [notes, setNotes] = useState("");
	const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState("");

	const handleSymptomToggle = (symptom: string) => {
		setSelectedSymptoms((prev) =>
			prev.includes(symptom)
				? prev.filter((s) => s !== symptom)
				: [...prev, symptom]
		);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (selectedSymptoms.length === 0) {
			setError("Please select at least one symptom");
			return;
		}

		setIsSubmitting(true);
		setError("");

		try {
			const { error: submitError } = await supabase
				.from("symptom_entries")
				.insert({
					user_id: "demo-user", // In production, use actual user ID
					date,
					symptoms: selectedSymptoms,
					severity,
					notes,
				});

			if (submitError) throw submitError;

			// Reset form
			setSelectedSymptoms([]);
			setSeverity(3);
			setNotes("");
			setDate(new Date().toISOString().split("T")[0]);

			onEntryAdded();
		} catch (err: any) {
			setError(err.message || "Failed to save entry");
		} finally {
			setIsSubmitting(false);
		}
	};

	const getSeverityColor = (level: number) => {
		if (level <= 2) return "bg-green-500";
		if (level <= 4) return "bg-yellow-500";
		if (level <= 6) return "bg-orange-500";
		return "bg-red-500";
	};

	const getSeverityLabel = (level: number) => {
		if (level <= 2) return "Mild";
		if (level <= 4) return "Moderate";
		if (level <= 6) return "Severe";
		return "Very Severe";
	};

	return (
		<div
			className="p-8 bg-gradient-to-br from-amber-25 to-orange-25"
			style={{
				background: "linear-gradient(135deg, #fefdf9 0%, #fef7ed 100%)",
			}}
		>
			<h3 className="text-2xl font-bold text-amber-900 mb-6 font-serif flex items-center">
				<span className="mr-3">📝</span>
				Log New Symptoms
			</h3>

			<form
				onSubmit={handleSubmit}
				className="space-y-6"
			>
				{/* Date */}
				<div>
					<label className="block text-sm font-medium text-amber-800 mb-2 font-serif">
						Date
					</label>
					<input
						type="date"
						value={date}
						onChange={(e) => setDate(e.target.value)}
						className="w-full px-4 py-3 border-2 border-amber-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 bg-amber-50 text-amber-900 shadow-inner"
					/>
				</div>

				{/* Symptoms Selection */}
				<div>
					<label className="block text-sm font-medium text-amber-800 mb-3 font-serif">
						Symptoms (select all that apply)
					</label>
					<div className="grid grid-cols-2 md:grid-cols-3 gap-3">
						{commonSymptoms.map((symptom) => (
							<button
								key={symptom}
								type="button"
								onClick={() => handleSymptomToggle(symptom)}
								className={`px-4 py-3 rounded-xl text-sm font-medium transition-all shadow-sm ${
									selectedSymptoms.includes(symptom)
										? "bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-lg transform scale-105"
										: "bg-amber-100 text-amber-800 hover:bg-amber-200 border border-amber-300"
								}`}
							>
								{symptom}
							</button>
						))}
					</div>
				</div>

				{/* Severity Scale */}
				<div>
					<label className="block text-sm font-medium text-amber-800 mb-3 font-serif">
						Overall Severity: {getSeverityLabel(severity)} ({severity}/8)
					</label>
					<div className="flex items-center space-x-3 bg-amber-50 p-4 rounded-xl border border-amber-200">
						<span className="text-sm text-amber-700 font-medium">Mild</span>
						<input
							type="range"
							min="1"
							max="8"
							value={severity}
							onChange={(e) => setSeverity(Number(e.target.value))}
							className="flex-1 h-2 bg-amber-200 rounded-lg appearance-none cursor-pointer slider"
						/>
						<span className="text-sm text-amber-700 font-medium">Severe</span>
					</div>
					<div className="mt-3 flex items-center justify-center">
						<div
							className={`w-5 h-5 rounded-full ${getSeverityColor(
								severity
							)} mr-3 shadow-sm`}
						></div>
						<span className="text-base text-amber-800 font-medium">
							{getSeverityLabel(severity)}
						</span>
					</div>
				</div>

				{/* Notes */}
				<div>
					<label className="block text-sm font-medium text-amber-800 mb-2 font-serif">
						Additional Notes
					</label>
					<textarea
						value={notes}
						onChange={(e) => setNotes(e.target.value)}
						placeholder="Describe how you're feeling, what might have triggered symptoms, or any other relevant details..."
						rows={4}
						className="w-full px-4 py-3 border-2 border-amber-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 bg-amber-50 text-amber-900 placeholder-amber-600 shadow-inner resize-none"
					/>
				</div>

				{/* Future Features */}
				<div className="border-t pt-4">
					<p className="text-sm font-medium text-gray-700 mb-3">
						Additional Options (Coming Soon)
					</p>
					<div className="flex space-x-4">
						<button
							type="button"
							disabled
							className="flex items-center px-3 py-2 bg-gray-100 text-gray-400 rounded-lg cursor-not-allowed"
						>
							<Mic className="h-4 w-4 mr-2" />
							Voice Note
						</button>
						<button
							type="button"
							disabled
							className="flex items-center px-3 py-2 bg-gray-100 text-gray-400 rounded-lg cursor-not-allowed"
						>
							<Camera className="h-4 w-4 mr-2" />
							Photo
						</button>
					</div>
				</div>

				{/* Error Message */}
				{error && (
					<div className="flex items-center p-3 bg-red-50 border border-red-200 rounded-lg">
						<AlertCircle className="h-5 w-5 text-red-600 mr-2" />
						<span className="text-sm text-red-700">{error}</span>
					</div>
				)}

				{/* Submit Button */}
				<button
					type="submit"
					disabled={isSubmitting || selectedSymptoms.length === 0}
					className="w-full flex items-center justify-center px-6 py-4 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-xl hover:from-amber-700 hover:to-orange-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all transform hover:scale-105 shadow-lg font-medium"
				>
					<Save className="h-5 w-5 mr-2" />
					{isSubmitting ? "Saving..." : "Save Entry"}
				</button>
			</form>
		</div>
	);
}
