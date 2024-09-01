import React, { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Activetool, Editor } from "@/features/editor/types";
import { ToolSidebarHeader } from "@/features/editor/components/tool-sidebar-header";
import { ToolSidebarClose } from "@/features/editor/components/tool-sidebar-close";
import { ColorPicker } from "@/features/editor/components/color-picker";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SettingsSidebarProps {
	editor: Editor | undefined;
  activeTool: Activetool;
  onChangeActiveTool: (tool: Activetool) => void;
}

const SettingsSidebar = ({ editor, activeTool, onChangeActiveTool }: SettingsSidebarProps) => {
	const workspace = editor?.getWorkspace();

	const initialWidth = useMemo(() => `${workspace?.width ?? 0}`, [workspace]);
	const initialHeight = useMemo(() => `${workspace?.height ?? 0}`, [workspace]);
	const initialBackground = useMemo(() => (workspace?.fill as string) ?? "#ffffff", [workspace]);

	const [width, setWidth] = useState(initialWidth);
	const [height, setHeight] = useState(initialHeight);
	const [background, setBackground] = useState(initialBackground);

	useEffect(() => {
		setWidth(initialWidth);
		setHeight(initialHeight);
		setBackground(initialWidth);
	}, [
		initialWidth,
		initialHeight,
		initialBackground,
	]);

	const onClose = () => {
		onChangeActiveTool("select");
	};

	const changeWidth = (value: string) => setWidth(value);

	const changeHeight = (value: string) => setHeight(value);

	const changeBackground = (value: string) => {
		setBackground(value);
		editor?.changeBackground(value);
	};

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		editor?.changeSize({ width: parseInt(width, 10), height: parseInt(height, 10) });
	};

	return (
		<aside
			className={cn(
				"bg-white relative border-r z-[40] w-[360px] h-full flex flex-col",
				activeTool === "settings" ? "visible" : "hidden"
			)}
		>
			<ToolSidebarHeader
				title="Settings"
				description="Change the look of your workspace"
			/>

			<ScrollArea>
				<form className="p-4 space-y-6" onSubmit={handleSubmit}>
					<div className="space-y-6">
						<Label>
							Height
						</Label>
						<Input
							placeholder="Height"
							value={height}
							type="number"
							onChange={e => changeHeight(e.target.value)}
						/>
					</div>
					<div className="space-y-6">
						<Label>
							Width
						</Label>
						<Input
							placeholder="Width"
							value={width}
							type="number"
							onChange={e => changeWidth(e.target.value)}
						/>
					</div>
					<div className="space-y-6">
						<Button className="w-full" type="submit">
							Resize
						</Button>
					</div>
				</form>
				<div className="p-4">
					<ColorPicker value={background} onChange={changeBackground}  />
				</div>
			</ScrollArea>

			<ToolSidebarClose onClick={onClose} />
		</aside>
	);
};

export { SettingsSidebar };
