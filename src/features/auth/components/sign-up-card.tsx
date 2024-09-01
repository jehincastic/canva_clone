"use client";

import { FaGithub } from "react-icons/fa";
import Link from "next/link";
import { signIn } from "next-auth/react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const providers = [{
	name: "Github",
	icon: FaGithub,
}];

export const SignUpCard = () => {
	const onProviderSignUp = (provider: string) => {
		signIn(provider, { callbackUrl: "/" })
	};

	return (
		<Card className="w-full h-full p-8">
			<CardHeader className="px-0 pt-0">
				<CardTitle>
				Create an account
				</CardTitle>
				<CardDescription>
					Use your gihtub account to continue
				</CardDescription>
			</CardHeader>
			<CardContent className="space-y-5 px-0 pb-0">
				<div className="flex flex-col gap-y-2.5">
					{
						providers.map(({ name, icon: Icon }) => (
							<Button
								variant="outline"
								size="lg"
								className="w-full relative"
								key={name}
								onClick={() => onProviderSignUp(name.toLowerCase())}
							>
								<Icon className="mr-2 size-5 top-2.5 left-2.5 absolute" />
								Continue with {name}
							</Button>
						))
					}
				</div>
				<p className="text-xs text-muted-foreground">
					Already have an account?&nbsp;
					<Link href="/sign-in">
						<span className="text-sky-700 hover:underline">Sign in</span>
					</Link>
				</p>
			</CardContent>
		</Card>
	);
};