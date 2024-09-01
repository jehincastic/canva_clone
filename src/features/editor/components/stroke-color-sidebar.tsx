import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Activetool, Editor, STROKE_COLOR } from "@/features/editor/types";
import { ToolSidebarHeader } from "@/features/editor/components/tool-sidebar-header";
import { ToolSidebarClose } from "@/features/editor/components/tool-sidebar-close";
import { ColorPicker } from "@/features/editor/components/color-picker";

interface StrokeColorSidebarProps {
	editor: Editor | undefined;
  activeTool: Activetool;
  onChangeActiveTool: (tool: Activetool) => void;
}

const StrokeColorSidebar = ({ editor, activeTool, onChangeActiveTool }: StrokeColorSidebarProps) => {
	const strokeColor = editor?.getActiveStrokeColor() || STROKE_COLOR;

	const onClose = () => {
		onChangeActiveTool("select");
	};

	const onChange = (value: string) => {
		editor?.changeStrokeColor(value);
	};

	return (
		<aside
			className={cn(
				"bg-white relative border-r z-[40] w-[360px] h-full flex flex-col",
				activeTool === "stroke-color" ? "visible" : "hidden"
			)}
		>
			<ToolSidebarHeader
				title="Stroke color"
				description="Add stroke color to your element"
			/>

			<ScrollArea>
				<div className="p-4 space-y-6">
					<ColorPicker value={strokeColor} onChange={onChange}  />
				</div>
			</ScrollArea>

			<ToolSidebarClose onClick={onClose} />
		</aside>
	);
};

export { StrokeColorSidebar };
