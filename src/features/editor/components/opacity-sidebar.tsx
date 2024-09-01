import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Activetool, Editor } from "@/features/editor/types";
import { ToolSidebarHeader } from "@/features/editor/components/tool-sidebar-header";
import { ToolSidebarClose } from "@/features/editor/components/tool-sidebar-close";
import { Slider } from "@/components/ui/slider";

interface OpacitySidebarProps {
	editor: Editor | undefined;
  activeTool: Activetool;
  onChangeActiveTool: (tool: Activetool) => void;
}

const OpacitySidebar = ({ editor, activeTool, onChangeActiveTool }: OpacitySidebarProps) => {
	const initalOpacity = editor?.getActiveOpacity() ?? 1;
	const [opacity, setOpacity] = useState(initalOpacity);

	useEffect(() => {
		setOpacity(initalOpacity);
	}, [initalOpacity]);

	const onClose = () => {
		onChangeActiveTool("select");
	};

	const onChange = (value: number) => {
		editor?.changeOpacity(value);
		setOpacity(value);
	};

	return (
		<aside
			className={cn(
				"bg-white relative border-r z-[40] w-[360px] h-full flex flex-col",
				activeTool === "opacity" ? "visible" : "hidden"
			)}
		>
			<ToolSidebarHeader
				title="Opacity"
				description="Change the opacity of the elements"
			/>

			<ScrollArea>
				<div className="p-4 space-y-4 border-b">
					<Slider
						value={[opacity]}
						onValueChange={(values) => onChange(values[0])}
						max={1}
						min={0}
						step={0.01}
					/>
				</div>
			</ScrollArea>

			<ToolSidebarClose onClick={onClose} />
		</aside>
	);
};

export { OpacitySidebar };
