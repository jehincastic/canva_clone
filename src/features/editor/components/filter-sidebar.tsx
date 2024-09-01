import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Activetool, Editor, filters } from "@/features/editor/types";
import { ToolSidebarHeader } from "@/features/editor/components/tool-sidebar-header";
import { ToolSidebarClose } from "@/features/editor/components/tool-sidebar-close";
import { Button } from "@/components/ui/button";

interface FilterSidebarProps {
	editor: Editor | undefined;
  activeTool: Activetool;
  onChangeActiveTool: (tool: Activetool) => void;
}

const FilterSidebar = ({ editor, activeTool, onChangeActiveTool }: FilterSidebarProps) => {
	const onClose = () => {
		onChangeActiveTool("select");
	};

	return (
		<aside
			className={cn(
				"bg-white relative border-r z-[40] w-[360px] h-full flex flex-col",
				activeTool === "filter" ? "visible" : "hidden"
			)}
		>
			<ToolSidebarHeader
				title="Filters"
				description="Apply filter to selected image"
			/>

			<ScrollArea>
				<div className="p-4 space-y-4 border-b">
					{filters.map(filter => (
						<Button
							key={filter}
							variant="secondary"
							size="lg"
							className="w-full h-16 justify-start text-left text-base py-2 px-16 capitalize"
							onClick={() => editor?.changeImageFilter(filter)}
						>
							{filter}
						</Button>
					))}
				</div>
			</ScrollArea>

			<ToolSidebarClose onClick={onClose} />
		</aside>
	);
};

export { FilterSidebar };
