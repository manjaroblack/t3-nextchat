"use client";

import { signOut } from "next-auth/react";
import Image from "next/image";

interface UserProps {
	name?: string | null;
	image?: string | null;
}

export default function User({ name, image }: UserProps) {
	return (
		<div className="flex items-center gap-4">
			<button
				type="button"
				onClick={() => signOut()}
				className="rounded-md bg-gray-800 px-4 py-2 text-white hover:bg-gray-700"
			>
				Sign out
			</button>
			{image && (
				<Image
					src={image}
					alt={name || "User avatar"}
					width={40}
					height={40}
					className="rounded-full"
				/>
			)}
		</div>
	);
}
