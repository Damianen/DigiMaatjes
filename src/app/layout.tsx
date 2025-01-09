import type { Metadata } from 'next';

import './globals.css';

export const metadata: Metadata = {
	title: 'DigiMaatjes',
	description: 'Een app voor oud (en jong) om samen spelletjes te spelen en contact te houden.',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body>{children}</body>
		</html>
	);
}
