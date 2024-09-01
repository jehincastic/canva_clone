import { useState } from "react";

import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Activetool, Editor } from "@/features/editor/types";
import { ToolSidebarHeader } from "@/features/editor/components/tool-sidebar-header";
import { ToolSidebarClose } from "@/features/editor/components/tool-sidebar-close";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useGenerateImage } from "@/features/ai/api/use-generate-image";

interface AISidebarProps {
	editor: Editor | undefined;
  activeTool: Activetool;
  onChangeActiveTool: (tool: Activetool) => void;
}

const AISidebar = ({ editor, activeTool, onChangeActiveTool }: AISidebarProps) => {
	const mutation = useGenerateImage();
	const [prompt, setPrompt] = useState("");

	const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		mutation.mutateAsync({ prompt })
			.then(({ data }) => {
				editor?.addImage(data);
				setPrompt("");
				onChangeActiveTool("select");
			});
	};

	const onClose = () => {
		onChangeActiveTool("select");
	};

	return (
		<aside
			className={cn(
				"bg-white relative border-r z-[40] w-[360px] h-full flex flex-col",
				activeTool === "ai" ? "visible" : "hidden"
			)}
		>
			<ToolSidebarHeader
				title="AI"
				description="Generate an image using AI"
			/>

			<ScrollArea>
				<form onSubmit={onSubmit} className="p-4 space-y-6">
					<Textarea
						placeholder="an astronaut riding a horse on marse, hd, dramatic lighting"
						cols={30}
						rows={10}
						required
						minLength={3}
						value={prompt}
						disabled={mutation.isPending}
						onChange={e => setPrompt(e.target.value)}
					/>
					<Button
						type="submit"
						className="w-full"
						disabled={mutation.isPending}
					>
						Generate
					</Button>
				</form>
			</ScrollArea>

			<ToolSidebarClose onClick={onClose} />
		</aside>
	);
};

export { AISidebar };
