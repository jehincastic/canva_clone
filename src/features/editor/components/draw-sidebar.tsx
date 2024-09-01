import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Activetool, Editor, STROKE_COLOR, STROKE_WIDTH } from "@/features/editor/types";
import { ToolSidebarHeader } from "@/features/editor/components/tool-sidebar-header";
import { ToolSidebarClose } from "@/features/editor/components/tool-sidebar-close";
import { ColorPicker } from "@/features/editor/components/color-picker";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

interface DrawSidebarProps {
	editor: Editor | undefined;
  activeTool: Activetool;
  onChangeActiveTool: (tool: Activetool) => void;
}

const DrawSidebar = ({ editor, activeTool, onChangeActiveTool }: DrawSidebarProps) => {
	const strokeColor = editor?.getActiveStrokeColor() || STROKE_COLOR;
	const strokeWidth = editor?.getActiveStrokeWidth() || STROKE_WIDTH;

	const onClose = () => {
		onChangeActiveTool("select");
	};

	const onChangeStrokeColor = (value: string) => {
		editor?.changeStrokeColor(value);
	};

	const onChangeStrokeWidth = (value: number) => {
		editor?.changeStrokeWidth(value);
	};

	return (
		<aside
			className={cn(
				"bg-white relative border-r z-[40] w-[360px] h-full flex flex-col",
				activeTool === "draw" ? "visible" : "hidden"
			)}
		>
			<ToolSidebarHeader
				title="Drawing mode"
				description="Modify brush settings"
			/>

			<ScrollArea>
				<div className="p-4 space-y-6">
					<Label className="text-sm">
						Brush width
					</Label>
					<Slider
						value={[strokeWidth]}
						onValueChange={(values) => onChangeStrokeWidth(values[0])}
					/>
				</div>
				<div className="p-4 space-y-6">
					<ColorPicker value={strokeColor} onChange={onChangeStrokeColor}  />
				</div>
			</ScrollArea>

			<ToolSidebarClose onClick={onClose} />
		</aside>
	);
};

export { DrawSidebar };
