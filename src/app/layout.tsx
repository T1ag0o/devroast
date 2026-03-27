import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/ui/navbar";
import { TRPCProvider } from "@/trpc/client";
import "./globals.css";

const jetbrainsMono = JetBrains_Mono({
	variable: "--font-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "devroast | paste your code. get roasted.",
	description:
		"Drop your code below and we'll rate it — brutally honest or full roast mode",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body
				className={`${jetbrainsMono.variable} font-sans antialiased bg-bg-page pb-16`}
			>
				<TRPCProvider>
					<Navbar
						logoText="devroast"
						links={[{ label: "leaderboard", href: "/leaderboard" }]}
					/>
					{children}
					<Footer />
				</TRPCProvider>
			</body>
		</html>
	);
}
