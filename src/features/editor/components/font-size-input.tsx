import React from "react";
import { MinusIcon, PlusIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface FontSizeInput {
	value: number;
	onChange: (value: number) => void;
}

const FontSizeInput = ({ onChange, value }: FontSizeInput) => {
	const increment = () => onChange(value + 1);
	const decrement = () => onChange(value - 1);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = parseInt(e.target.value, 10);
		onChange(value);
	};

	return (
		<div className="flex items-center">
			<Button
				onClick={decrement}
				variant="outline"
				className="p-2 rounded-r-none border-r-0"
				size="icon"
			>
				<MinusIcon className="size-4" />
			</Button>
			<Input
				onChange={handleChange}
				value={value}
				className="w-[50px] h-8 focus-visible:ring-offset-0 focus-visible:ring-0 rounded-none"
			/>
			<Button
				onClick={increment}
				variant="outline"
				className="p-2 rounded-l-none border-l-0"
				size="icon"
			>
				<PlusIcon className="size-4" />
			</Button>
		</div>
	);
};

export { FontSizeInput };
