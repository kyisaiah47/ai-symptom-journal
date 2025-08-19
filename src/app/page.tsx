"use client";

import { useState, useEffect } from "react";
import { Plus, Calendar, TrendingUp, FileText, Brain } from "lucide-react";
import { supabase, SymptomEntry } from "@/lib/supabase";
import SymptomEntryForm from "@/components/SymptomEntryForm";
import HealthTimeline from "@/components/HealthTimeline";
import AIInsights from "@/components/AIInsights";
import DoctorReport from "@/components/DoctorReport";

export default function Dashboard() {
	const [entries, setEntries] = useState<SymptomEntry[]>([]);
	const [activeTab, setActiveTab] = useState<
		"log" | "timeline" | "insights" | "report"
	>("log");
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		loadEntries();
	}, []);

	const loadEntries = async () => {
		try {
			const { data, error } = await supabase
				.from("symptom_entries")
				.select("*")
				.order("date", { ascending: false });

			if (error) throw error;
			setEntries(data || []);
		} catch (error) {
			console.error("Error loading entries:", error);
		} finally {
			setLoading(false);
		}
	};

	const handleEntryAdded = () => {
		loadEntries();
	};

	const tabs = [
		{ id: "log", label: "Log Symptoms", icon: Plus },
		{ id: "timeline", label: "Timeline", icon: Calendar },
		{ id: "insights", label: "AI Insights", icon: Brain },
		{ id: "report", label: "Doctor Report", icon: FileText },
	];

	if (loading) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
			</div>
		);
	}

	return (
		<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
			{/* Header */}
			<div className="mb-8">
				<h2 className="text-3xl font-bold text-gray-900">Health Dashboard</h2>
				<p className="mt-2 text-gray-600">
					Track your symptoms and get AI-powered insights for better health
					management.
				</p>
			</div>

			{/* Stats Cards */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
				<div className="bg-white rounded-lg shadow p-6">
					<div className="flex items-center">
						<Calendar className="h-8 w-8 text-indigo-600" />
						<div className="ml-4">
							<p className="text-sm font-medium text-gray-600">Total Entries</p>
							<p className="text-2xl font-bold text-gray-900">
								{entries.length}
							</p>
						</div>
					</div>
				</div>

				<div className="bg-white rounded-lg shadow p-6">
					<div className="flex items-center">
						<TrendingUp className="h-8 w-8 text-green-600" />
						<div className="ml-4">
							<p className="text-sm font-medium text-gray-600">This Week</p>
							<p className="text-2xl font-bold text-gray-900">
								{
									entries.filter((entry) => {
										const entryDate = new Date(entry.date);
										const weekAgo = new Date();
										weekAgo.setDate(weekAgo.getDate() - 7);
										return entryDate >= weekAgo;
									}).length
								}
							</p>
						</div>
					</div>
				</div>

				<div className="bg-white rounded-lg shadow p-6">
					<div className="flex items-center">
						<Brain className="h-8 w-8 text-purple-600" />
						<div className="ml-4">
							<p className="text-sm font-medium text-gray-600">AI Analyses</p>
							<p className="text-2xl font-bold text-gray-900">
								{entries.filter((entry) => entry.ai_summary).length}
							</p>
						</div>
					</div>
				</div>
			</div>

			{/* Tab Navigation */}
			<div className="border-b border-gray-200 mb-8">
				<nav className="-mb-px flex space-x-8">
					{tabs.map((tab) => {
						const Icon = tab.icon;
						return (
							<button
								key={tab.id}
								onClick={() => setActiveTab(tab.id as any)}
								className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
									activeTab === tab.id
										? "border-indigo-500 text-indigo-600"
										: "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
								}`}
							>
								<Icon className="h-4 w-4" />
								<span>{tab.label}</span>
							</button>
						);
					})}
				</nav>
			</div>

			{/* Tab Content */}
			<div className="bg-white rounded-lg shadow min-h-[600px]">
				{activeTab === "log" && (
					<SymptomEntryForm onEntryAdded={handleEntryAdded} />
				)}
				{activeTab === "timeline" && <HealthTimeline entries={entries} />}
				{activeTab === "insights" && <AIInsights entries={entries} />}
				{activeTab === "report" && <DoctorReport entries={entries} />}
			</div>
		</div>
	);
}
