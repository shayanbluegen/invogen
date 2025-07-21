import type { Metadata } from "next";
import type { PropsWithChildren } from "react";

import "./globals.css";

export const metadata: Metadata = {
	title: "InvoGen - Invoice Generator",
	description: "Advanced invoice management system with authentication, dashboard, and PDF export capabilities.",
};

export default function RootLayout({ children }: Readonly<PropsWithChildren>) {
	return (
		<html lang="en">
			<body>{children}</body>
		</html>
	);
}
