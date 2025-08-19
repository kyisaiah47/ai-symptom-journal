import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "AI Symptom Journal - Track Your Health",
	description:
		"Intelligent health tracking with AI-powered insights for better preventive care",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<body className={inter.className}>
				<div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
					<nav>
						<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
							<div className="flex justify-between pt-20">
								<div className="flex items-center">
									<div className="w-10 h-10 bg-gradient-to-br from-amber-600 to-orange-700 rounded-xl flex items-center justify-center mr-3 shadow-lg">
										<span className="text-white font-bold text-lg">📓</span>
									</div>
									<h1 className="text-2xl font-bold text-amber-900 font-serif">
										Wellness Journal
									</h1>
								</div>
								<div className="flex items-center space-x-4">
									<span className="text-sm text-amber-700 italic">
										Your cozy health companion
									</span>
								</div>
							</div>
						</div>
					</nav>
					<main>{children}</main>
				</div>
			</body>
		</html>
	);
}
