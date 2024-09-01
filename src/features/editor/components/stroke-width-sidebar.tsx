import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Activetool, Editor, STROKE_DASH_ARRAY, STROKE_WIDTH } from "@/features/editor/types";
import { ToolSidebarHeader } from "@/features/editor/components/tool-sidebar-header";
import { ToolSidebarClose } from "@/features/editor/components/tool-sidebar-close";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";

interface StrokeWidthSidebarProps {
	editor: Editor | undefined;
  activeTool: Activetool;
  onChangeActiveTool: (tool: Activetool) => void;
}

const StrokeWidthSidebar = ({ editor, activeTool, onChangeActiveTool }: StrokeWidthSidebarProps) => {
	const strokeWidth = editor?.getActiveStrokeWidth() || STROKE_WIDTH;
	const strokeType = editor?.getActiveStrokeDashArray() || STROKE_DASH_ARRAY;

	const onClose = () => {
		onChangeActiveTool("select");
	};

	const onChangeStrokeWidth = (value: number) => {
		editor?.changeStrokeWidth(value);
	};

	const onChangeStrokeType = (value: number[]) => {
		editor?.changeStrokeDashArray(value);
	};

	return (
		<aside
			className={cn(
				"bg-white relative border-r z-[40] w-[360px] h-full flex flex-col",
				activeTool === "stroke-width" ? "visible" : "hidden"
			)}
		>
			<ToolSidebarHeader
				title="Stroke options"
				description="Modify the stroke of your element"
			/>

			<ScrollArea>
				<div className="p-4 space-y-4 border-b">
					<Label className="text-sm">
						Stroke width
					</Label>
					<Slider
						value={[strokeWidth]}
						onValueChange={(values) => onChangeStrokeWidth(values[0])}
					/>
				</div>
				<div className="p-4 space-y-4 border-b">
					<Label className="text-sm">
						Stroke type
					</Label>
					<Button
						variant="secondary"
						size="lg"
						className={cn(
							"w-full h-16 justify-start text-left py-2 px-4",
							strokeType.length === 0 && "border-2 border-blue-500"
						)}
						onClick={() => onChangeStrokeType([])}
					>
						<div className="w-full border-black rounded-full border-4" />
					</Button>
					<Button
						variant="secondary"
						size="lg"
						className={cn(
							"w-full h-16 justify-start text-left py-2 px-4",
							strokeType.length !== 0 && "border-2 border-blue-500"
						)}
						onClick={() => onChangeStrokeType([5, 5])}
					>
						<div className="w-full border-black rounded-full border-4 border-dashed" />
					</Button>
				</div>
			</ScrollArea>

			<ToolSidebarClose onClick={onClose} />
		</aside>
	);
};

export { StrokeWidthSidebar };
