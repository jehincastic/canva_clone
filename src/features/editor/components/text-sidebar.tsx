import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Activetool, Editor } from "@/features/editor/types";
import { ToolSidebarHeader } from "@/features/editor/components/tool-sidebar-header";
import { ToolSidebarClose } from "@/features/editor/components/tool-sidebar-close";
import { Button } from "@/components/ui/button";

interface TextSidebarProps {
	editor: Editor | undefined;
  activeTool: Activetool;
  onChangeActiveTool: (tool: Activetool) => void;
}

const TextSidebar = ({ editor, activeTool, onChangeActiveTool }: TextSidebarProps) => {
	const onClose = () => {
		onChangeActiveTool("select");
	};

	return (
		<aside
			className={cn(
				"bg-white relative border-r z-[40] w-[360px] h-full flex flex-col",
				activeTool === "text" ? "visible" : "hidden"
			)}
		>
			<ToolSidebarHeader
				title="Text"
				description="Add text to your canvas"
			/>

			<ScrollArea>
				<div className="p-4 space-y-4 border-b">
					<Button
						className="w-full"
						onClick={() => editor?.addText("Textbox", {})}
					>
						Add a textbox
					</Button>
					<Button
						className="w-full h-16"
						variant="secondary"
						size="lg"
						onClick={() => editor?.addText("Heading", {
							fontSize: 80, fontWeight: 700,
						})}
					>
						<span className="text-3xl font-bold">
							Add a heading
						</span>
					</Button>
					<Button
						className="w-full h-16"
						variant="secondary"
						size="lg"
						onClick={() => editor?.addText("Subheading", {
							fontSize: 44, fontWeight: 500,
						})}
					>
						<span className="text-xl font-semibold">
							Add a sub heading
						</span>
					</Button>
					<Button
						className="w-full h-16"
						variant="secondary"
						size="lg"
						onClick={() => editor?.addText("Paragraph", { fontSize: 32 })}
					>
						Paragraph
					</Button>
				</div>
			</ScrollArea>

			<ToolSidebarClose onClick={onClose} />
		</aside>
	);
};

export { TextSidebar };