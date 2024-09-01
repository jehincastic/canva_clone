import { useEvent } from "react-use";

import { Editor } from "@/features/editor/types";

interface UseHotkeysProps {
	editor: Editor | undefined;
};

export const useHotkeys = ({ editor }: UseHotkeysProps) => {
	useEvent("keydown", (event) => {
		const isInput = ["INPUT", "TEXTAREA"].includes((event.target as HTMLElement).tagName);
		if (isInput) {
			return;
		}

		const isCtrlKey = event.ctrlKey || event.metaKey;
		if (event.key === "Backspace" || event.key === "Delete") {
			editor?.delete();
		} else if (isCtrlKey && event.key === "z") {
			event.preventDefault();
			editor?.onUndo();
		} else if (isCtrlKey && event.key === "y") {
			event.preventDefault();
			editor?.onRedo();
		} else if (isCtrlKey && event.key === "c") {
			event.preventDefault();
			editor?.onCopy();
		} else if (isCtrlKey && event.key === "v") {
			event.preventDefault();
			editor?.onPaste();
		} else if (isCtrlKey && event.key === "s") {
			event.preventDefault();
			editor?.save(true);
		} else if (isCtrlKey && event.key === "a") {
			event.preventDefault();
			editor?.selectAll();
		}
	});
};