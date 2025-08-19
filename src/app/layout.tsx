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
					<main>{children}</main>
				</div>
			</body>
		</html>
	);
}
