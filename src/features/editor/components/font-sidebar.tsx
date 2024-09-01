import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Activetool, Editor, fonts } from "@/features/editor/types";
import { ToolSidebarHeader } from "@/features/editor/components/tool-sidebar-header";
import { ToolSidebarClose } from "@/features/editor/components/tool-sidebar-close";
import { Button } from "@/components/ui/button";

interface FontSidebarProps {
	editor: Editor | undefined;
  activeTool: Activetool;
  onChangeActiveTool: (tool: Activetool) => void;
}

const FontSidebar = ({ editor, activeTool, onChangeActiveTool }: FontSidebarProps) => {
	const activeFont = editor?.getActiveFontFamily();
	const onClose = () => {
		onChangeActiveTool("select");
	};

	return (
		<aside
			className={cn(
				"bg-white relative border-r z-[40] w-[360px] h-full flex flex-col",
				activeTool === "font" ? "visible" : "hidden"
			)}
		>
			<ToolSidebarHeader
				title="Font"
				description="Modify the font"
			/>

			<ScrollArea>
				<div className="p-4 space-y-4 border-b">
					{fonts.map(font => (
						<Button
							key={font}
							variant="secondary"
							size="lg"
							className={cn(
								"w-full h-16 justify-start text-left text-base py-2 px-16",
								font === activeFont && "border-2 border-blue-500"
							)}
							style={{ fontFamily: font }}
							onClick={() => editor?.changeFontFamily(font)}
						>
							{font}
						</Button>
					))}
				</div>
			</ScrollArea>

			<ToolSidebarClose onClick={onClose} />
		</aside>
	);
};

export { FontSidebar };
