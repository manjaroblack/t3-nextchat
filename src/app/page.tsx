import { Button } from "@/components/ui/button";

export default function Home() {
	return (
		<main className="flex min-h-screen flex-col items-center justify-center bg-neutral-bg-dark text-text-primary p-24">
			<h1 className="text-4xl font-bold mb-4">T3-NextChat</h1>
			<p className="mb-8">Shadcn/ui Button:</p>
			<Button>Click Me</Button>
		</main>
	);
}
