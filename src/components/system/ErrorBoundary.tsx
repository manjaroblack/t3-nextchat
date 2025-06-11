"use client";

import React, { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
	children: ReactNode;
}

interface State {
	hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
	public state: State = {
		hasError: false,
	};

	public static getDerivedStateFromError(_: Error): State {
		// Update state so the next render will show the fallback UI.
		return { hasError: true };
	}

	public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
		// You can also log the error to an error reporting service
		console.error("Uncaught error:", error, errorInfo);
	}

	public render() {
		if (this.state.hasError) {
			return (
				<div className="flex flex-col items-center justify-center min-h-screen text-center">
					<h1 className="text-2xl font-bold">Something went wrong.</h1>
					<p className="text-gray-400">
						We've been notified and are looking into it. Please try refreshing the page.
					</p>
				</div>
			);
		}

		return this.props.children;
	}
}

export default ErrorBoundary;
