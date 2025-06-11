"use client";

import { signIn } from "next-auth/react";

export default function LoginButton() {
	return (
		<button
			type="button"
			onClick={() => signIn("google")}
			className="rounded-md bg-gray-800 px-4 py-2 text-white hover:bg-gray-700"
		>
			Sign in with Google
		</button>
	);
}
