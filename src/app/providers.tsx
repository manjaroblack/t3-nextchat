"use client";

import TrpcProvider from "@/lib/trpc/Provider";
import type { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import type { ReactNode } from "react";

interface ProvidersProps {
	children: ReactNode;
	session: Session | null;
}

export function Providers({ children, session }: ProvidersProps) {
	return (
		<TrpcProvider>
			<SessionProvider session={session}>{children}</SessionProvider>
		</TrpcProvider>
	);
}
