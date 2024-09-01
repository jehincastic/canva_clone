import { fabric } from "fabric";
import { useCallback, useRef, useState } from "react";

import { JSON_KEYS } from "@/features/editor/types";

interface useHistoryProps {
	canvas: fabric.Canvas | null;
}

const useHistory = ({ canvas }: useHistoryProps) => {
	const [historyIndex, setHistoryIndex] = useState(0);
	const canvasHistory = useRef<string[]>([]);
	const skipSave = useRef(false);

	const canUndo = useCallback(() => {
		return historyIndex > 0;
	}, [historyIndex]);

	const canRedo = useCallback(() => {
		return historyIndex < canvasHistory.current.length - 1;
	}, [historyIndex]);

	const save = useCallback((skip = false) => {
		if (!canvas) {
			return;
		}
		
		const currentState = JSON.stringify(canvas.toJSON(JSON_KEYS));
		if (!skipSave.current && !skip) {
			canvasHistory.current.push(currentState);
			setHistoryIndex(canvasHistory.current.length - 1);
		}


	}, [canvas]);

	const undo = useCallback((skip = false) => {
		if (!canUndo()) {
			return;
		}

		skipSave.current = true;
		canvas?.clear().renderAll();
		
		const prevIdx = historyIndex - 1;
		const prevState = JSON.parse(canvasHistory.current[prevIdx]);
		
		canvas?.loadFromJSON(prevState, () => {
			canvas.renderAll();
			setHistoryIndex(prevIdx);
			skipSave.current = false;
		});
	
	}, [canUndo, canvas, historyIndex]);

	const redo = useCallback((skip = false) => {
		if (!canRedo()) {
			return;
		}

		skipSave.current = true;
		canvas?.clear().renderAll();
		
		const nextIdx = historyIndex + 1;
		const nextState = JSON.parse(canvasHistory.current[nextIdx]);
		
		canvas?.loadFromJSON(nextState, () => {
			canvas.renderAll();
			setHistoryIndex(nextIdx);
			skipSave.current = false;
		});
	
	}, [canRedo, canvas, historyIndex]);

	return {
		save, canvasHistory,
		canUndo, canRedo,
		undo, redo, setHistoryIndex,
	};
}

export { useHistory };
