import { useCallback, useMemo, useState } from "react";
import { fabric } from "fabric";

import { useAutoResize } from "@/features/editor/hooks/use-auto-resize";
import {
	Editor, BuildEditorProps, EditorHookProps,
	CIRCLE_OPTIONS, RECTANGLE_OPTIONS,
	DIAMOND_OPTIONS, TRIANGLE_OPTIONS,
	WIDTH, HEIGHT, FILL_COLOR,
	STROKE_COLOR, STROKE_WIDTH,
	STROKE_DASH_ARRAY, TEXT_OPTIONS,
	FONT_FAMILY, FONT_WEIGHT,
	FONT_STYLE, FONT_LINE_THROUGH,
	FONT_UNDERLINE, TEXT_ALIGN,
	FONT_SIZE,
	JSON_KEYS,
} from "@/features/editor/types";
import { useCanvasEvents } from "@/features/editor/hooks/use-canvas-events";
import { createFilter, downloadFile, isTextType, transformText } from "@/features/editor/utils";
import { useClipboard } from "@/features/editor/hooks/use-clipboard";
import { useHistory } from "@/features/editor/hooks/use-history";
import { useHotkeys } from "@/features/editor/hooks/use-hotkeys";
import { useWindowwEvents } from "@/features/editor/hooks/use-window-events";

const buildEditor = ({
	canvas, fillColor, setFillColor,
	setStrokeColor, setStrokeWidth,
	strokeColor, strokeWidth, selectedObjects,
	setStrokeDashArray, strokeDashArray, fontFamily,
	setFontFamily, copy, paste, autoZoom,
	canRedo, canUndo, redo, save, undo,
}: BuildEditorProps): Editor => {	
	const getWorkspace = () => canvas.getObjects().find(o => o.name === 'clip');

	const center = (object: fabric.Object) => {
		const workspace = getWorkspace();
		const centerPoint = workspace?.getCenterPoint();

		if (!centerPoint) {
			return;
		}

		// @ts-ignore
		canvas._centerObject(object, centerPoint);
	};

	const addToCanvas = (object: fabric.Object) => {
		center(object);
		canvas.add(object);
		canvas.setActiveObject(object);
	};

	const getDefaultProps = () => {
		return {
			strokeWidth,
			strokeDashArray,
			fill: fillColor,
			stroke: strokeColor,
		};
	};

	const updateZoom = (type: "in" | "out") => {
		let zoomRatio = canvas.getZoom();

		const zoomBy = 0.05;
		const maxZoom = 1;
		const minZoom = 0.2;

		if (type === "in") {
			zoomRatio += zoomBy;
			zoomRatio = zoomRatio > maxZoom ? maxZoom : zoomRatio;
		} else if (type === "out") {
			zoomRatio -= zoomBy;
			zoomRatio = zoomRatio < minZoom ? minZoom : zoomRatio;
		}
		const center = canvas.getCenter();
		canvas.zoomToPoint(new fabric.Point(center.left, center.top), zoomRatio);
	};

	const generateSaveOptions = (format: string) => {
		const { width, height, left, top } = getWorkspace() as fabric.Rect;

		return {
			name: "Image",
			format,
			...(format === "jpeg" ? { quality: 1 } : {}),
			width,
			height,
			left,
			top,
		};
	};

	const savePNG = () => {
		const opts = generateSaveOptions("png");

		canvas.setViewportTransform([1,0,0,1,0,0]);
		const dataUrl = canvas.toDataURL(opts);

		downloadFile(dataUrl, "png");
		autoZoom();
	};

	const saveJPG = () => {
		const opts = generateSaveOptions("jpeg");

		canvas.setViewportTransform([1,0,0,1,0,0]);
		const dataUrl = canvas.toDataURL(opts);

		downloadFile(dataUrl, "jpeg");
		autoZoom();
	};

	const saveJSON = () => {
		const dataObj = canvas.toJSON(JSON_KEYS);
		transformText(dataObj.objects);
		
		const fileString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(dataObj, null, "\t"))}`;
		downloadFile(fileString, "json");
		autoZoom();
	};

	const loadJSON = (json: string) => {
		const data = JSON.parse(json);
		canvas.loadFromJSON(data, () => {
			autoZoom();
		});
	};

	return {
		autoZoom,
		onCopy: copy,
		onPaste: paste,
		onUndo: undo,
		onRedo: redo,
		canUndo,
		canRedo,
		save,
		savePNG,
		saveJPG,
		saveJSON,
		loadJSON,
		selectAll: () => {
			canvas.discardActiveObject();
			const allObj = canvas.getObjects().filter(obj => obj.selectable);
			canvas.setActiveObject(new fabric.ActiveSelection(allObj, { canvas: canvas }));
			canvas.renderAll();
		},
		duplicate: () => {
			copy();
			paste();
		},
		zoomIn: () => updateZoom("in"),
		zoomOut: () => updateZoom("out"),
		getWorkspace: getWorkspace,
		changeSize: (size: { width: number, height: number }) => {
			const workspace = getWorkspace();
			workspace?.set(size);
			autoZoom();
			save();
		},
		changeBackground: (value: string) => {
			const workspace = getWorkspace();
			workspace?.set({ fill: value });
			canvas.renderAll();
			save();
		},
		enableDrawingMode: () => {
			canvas.discardActiveObject();
			canvas.renderAll();
			canvas.isDrawingMode = true;
		},
		disableDrawingMode: () => {
			canvas.isDrawingMode = false;
		},
		addImage: (value: string) => {
			fabric.Image.fromURL(value, (image) => {
				const workspace = getWorkspace();
				image.scaleToWidth(workspace?.width || 0);
				image.scaleToHeight(workspace?.height || 0);
				addToCanvas(image);
			}, { crossOrigin: "anonymous" });
		},
		delete: () => {
			canvas.getActiveObjects().forEach((obj) => canvas.remove(obj));
			canvas.discardActiveObject();
			canvas.renderAll();
		},
		bringForward: () => {
			canvas.getActiveObjects().forEach((obj) => {
				canvas.bringForward(obj);
			});

			canvas.renderAll();

			const workspace = getWorkspace();
			workspace?.sendToBack();
		},
		sendBackwards: () => {
			canvas.getActiveObjects().forEach((obj) => {
				canvas.sendBackwards(obj);
			});

			canvas.renderAll();
			
			const workspace = getWorkspace();
			workspace?.sendToBack();
		},
		changeImageFilter: (value: string) => {
			const effect = createFilter(value);
			canvas.getActiveObjects().forEach(obj => {
				if (obj.type === "image") {
					const imgObj = obj as fabric.Image;
					imgObj.filters = effect ? [effect] : [];
					imgObj.applyFilters();
				}
			});
			canvas.renderAll();
		},
		changeOpacity: (value: number) => {
			canvas.getActiveObjects().forEach(obj => {
				obj.set({ opacity: value });
			});
			canvas.renderAll();
		},
		changeFillColor: (value: string) => {
			setFillColor(value);
			canvas.getActiveObjects().forEach(obj => {
				obj.set({ fill: value });
			});
			canvas.renderAll();
		},
		changeStrokeColor: (value: string) => {
			setStrokeColor(value);
			canvas.getActiveObjects().forEach(obj => {
				if (isTextType(obj.type)) {
					obj.set({ fill: value });
					return;	
				}

				obj.set({ stroke: value });
			});
			canvas.freeDrawingBrush.color = value;
			canvas.renderAll();
		},
		changeStrokeWidth: (value: number) => {
			setStrokeWidth(value);
			canvas.getActiveObjects().forEach(obj => {
				obj.set({ strokeWidth: value });
			});
			canvas.freeDrawingBrush.width = value;
			canvas.renderAll();
		},
		changeStrokeDashArray: (value: number[]) => {
			setStrokeDashArray(value);
			canvas.getActiveObjects().forEach(obj => {
				obj.set({ strokeDashArray: value });
			});
			canvas.renderAll();
		},
		changeFontFamily: (value: string) => {
			setFontFamily(value);
			canvas.getActiveObjects().forEach(obj => {
				if (isTextType(obj.type)) {
					// @ts-ignore
					obj.set({ fontFamily: value });
				}
			});
			canvas.renderAll();
		},
		changeFontWeight: (value: number) => {
			canvas.getActiveObjects().forEach(obj => {
				if (isTextType(obj.type)) {
					// @ts-ignore
					obj.set({ fontWeight: value });
				}
			});
			canvas.renderAll();
		},
		changeFontStyle: (value: string) => {
			canvas.getActiveObjects().forEach(obj => {
				if (isTextType(obj.type)) {
					// @ts-ignore
					obj.set({ fontStyle: value });
				}
			});
			canvas.renderAll();
		},
		changeFontLineThrough: (value: boolean) => {
			canvas.getActiveObjects().forEach(obj => {
				if (isTextType(obj.type)) {
					// @ts-ignore
					obj.set({ linethrough: value });
				}
			});
			canvas.renderAll();
		},
		changeFontUnderline: (value: boolean) => {
			canvas.getActiveObjects().forEach(obj => {
				if (isTextType(obj.type)) {
					// @ts-ignore
					obj.set({ underline: value });
				}
			});
			canvas.renderAll();
		},
		changeFontSize: (value: number) => {
			canvas.getActiveObjects().forEach(obj => {
				if (isTextType(obj.type)) {
					// @ts-ignore
					obj.set({ fontSize: value });
				}
			});
			canvas.renderAll();
		},
		changeTextAlign: (value: string) => {
			canvas.getActiveObjects().forEach(obj => {
				if (isTextType(obj.type)) {
					// @ts-ignore
					obj.set({ textAlign: value });
				}
			});
			canvas.renderAll();
		},
		addText: (text: string, options?: fabric.ITextboxOptions) => {
			const object = new fabric.Textbox(text, {
				...TEXT_OPTIONS,
				...options,
				fill: fillColor,
			});
			addToCanvas(object);
		},
		addCircle: () => {
			const object = new fabric.Circle({
				...CIRCLE_OPTIONS,
				...getDefaultProps(),
			});
			addToCanvas(object);
		},
		addSoftRectangle: () => {
			const object = new fabric.Rect({
				...RECTANGLE_OPTIONS,
				rx: 50,
				ry: 50,
				...getDefaultProps(),
			});
			addToCanvas(object);
		},
		addRectangle: () => {
			const object = new fabric.Rect({
				...RECTANGLE_OPTIONS,
				...getDefaultProps(),
			});
			addToCanvas(object);
		},
		addTriangle: () => {
			const object = new fabric.Triangle({
				...TRIANGLE_OPTIONS,
				...getDefaultProps(),
			});
			addToCanvas(object);
		},
		addInverseTriangle: () => {
			const object = new fabric.Polygon([
				{ x: 0, y: 0 },
				{ x: TRIANGLE_OPTIONS.width, y: 0 },
				{ x: TRIANGLE_OPTIONS.width / 2, y: TRIANGLE_OPTIONS.height },
			], {
				...TRIANGLE_OPTIONS,
				...getDefaultProps(),
			});
			addToCanvas(object);
		},
		addDiamond: () => {

			const object = new fabric.Polygon([
				{ x: WIDTH / 2, y: 0 },
				{ x: WIDTH, y: HEIGHT / 2 },
				{ x: WIDTH / 2, y: HEIGHT },
				{ x: 0, y: HEIGHT / 2 },
			], {
				...DIAMOND_OPTIONS,
				...getDefaultProps(),
			});
			addToCanvas(object);
		},
		getActiveOpacity: () => {
			const selectedObject = selectedObjects[0];
			if (!selectedObject) {
				return 1;
			}

			return selectedObject.get("opacity") ?? 1;
		},
		getActiveFillColor: () => {
			const selectedObject = selectedObjects[0];
			if (!selectedObject) {
				return fillColor;
			}

			const value = selectedObject.get("fill") || fillColor;
			return value as string;
		},
		getActiveStrokeColor: () => {
			const selectedObject = selectedObjects[0];
			if (!selectedObject) {
				return strokeColor;
			}

			return selectedObject.get("stroke") || strokeColor;
		},
		getActiveStrokeWidth: () => {
			const selectedObject = selectedObjects[0];
			if (!selectedObject) {
				return strokeWidth;
			}

			return selectedObject.get("strokeWidth") ?? strokeWidth;
		},
		getActiveStrokeDashArray: () => {
			const selectedObject = selectedObjects[0];
			if (!selectedObject) {
				return strokeDashArray;
			}

			return selectedObject.get("strokeDashArray") ?? strokeDashArray;
		},
		getActiveFontFamily: () => {
			const selectedObject = selectedObjects[0];
			if (!selectedObject || !isTextType(selectedObject.type)) {
				return fontFamily;
			}

			// @ts-ignore
			return selectedObject.get("fontFamily") ?? fontFamily;
		},
		getActiveFontWeight: () => {
			const selectedObject = selectedObjects[0];
			if (!selectedObject || !isTextType(selectedObject.type)) {
				return FONT_WEIGHT;
			}

			// @ts-ignore
			return selectedObject.get("fontWeight") ?? FONT_WEIGHT;
		},
		getActiveFontStyle: () => {
			const selectedObject = selectedObjects[0];
			if (!selectedObject || !isTextType(selectedObject.type)) {
				return FONT_STYLE;
			}

			// @ts-ignore
			return selectedObject.get("fontStyle") ?? FONT_STYLE;
		},
		getActiveFontLineThrough: () => {
			const selectedObject = selectedObjects[0];
			if (!selectedObject || !isTextType(selectedObject.type)) {
				return FONT_LINE_THROUGH;
			}

			// @ts-ignore
			return selectedObject.get("linethrough") ?? FONT_LINE_THROUGH;
		},
		getActiveFontUnderline: () => {
			const selectedObject = selectedObjects[0];
			if (!selectedObject || !isTextType(selectedObject.type)) {
				return FONT_UNDERLINE;
			}

			// @ts-ignore
			return selectedObject.get("underline") ?? FONT_UNDERLINE;
		},
		getActiveFontSize: () => {
			const selectedObject = selectedObjects[0];
			if (!selectedObject || !isTextType(selectedObject.type)) {
				return FONT_SIZE;
			}

			// @ts-ignore
			return selectedObject.get("fontSize") ?? FONT_SIZE;
		},
		getActiveTextAlign: () => {
			const selectedObject = selectedObjects[0];
			if (!selectedObject || !isTextType(selectedObject.type)) {
				return TEXT_ALIGN;
			}

			// @ts-ignore
			return selectedObject.get("textAlign") ?? TEXT_ALIGN;
		},
		canvas,
		selectedObjects,
	};
};

const useEditor = ({ clearSelectionCallback }: EditorHookProps) => {
	const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
	const [container, setContainer] = useState<HTMLDivElement | null>(null);
	const [selectedObjects, setSelectedObjects] = useState<fabric.Object[]>([]);

	const [fontFamily, setFontFamily] = useState(FONT_FAMILY);
	const [fillColor, setFillColor] = useState(FILL_COLOR);
	const [strokeColor, setStrokeColor] = useState(STROKE_COLOR);
	const [strokeWidth, setStrokeWidth] = useState(STROKE_WIDTH);
	const [strokeDashArray, setStrokeDashArray] = useState<number[]>(STROKE_DASH_ARRAY);

	useWindowwEvents();

	const {
		save, canRedo, canUndo,
		redo, undo, canvasHistory,
		setHistoryIndex,
	} = useHistory({ canvas });
	const { copy, paste } = useClipboard({ canvas });
	const { autoZoom } = useAutoResize({ canvas, container });

	useCanvasEvents({
		save,
		canvas,
		setSelectedObjects,
		clearSelectionCallback,
	});

	const editor = useMemo(() => {
		if (canvas) {
			return buildEditor({
				canvas, fillColor, setFillColor,
				strokeColor, setStrokeColor,
				strokeWidth, setStrokeWidth,
				selectedObjects, strokeDashArray,
				setStrokeDashArray, fontFamily, setFontFamily,
				copy, paste, autoZoom, save, canRedo, canUndo,
				redo, undo,
			});
		}
		return undefined;
	}, [
		canvas, fillColor,
		strokeColor, strokeWidth ,
		selectedObjects, strokeDashArray,
		fontFamily, copy, paste, autoZoom,
		canRedo, canUndo, redo, undo, save,
	]);

	useHotkeys({ editor });

	const init = useCallback(({
		initialCanvas,
		initialContainer,
	}: {
		initialCanvas: fabric.Canvas,
		initialContainer: HTMLDivElement,
	}) => {
		fabric.Object.prototype.set({
			cornerColor: "#FFF",
			cornerStyle: "circle",
			borderColor: "#3b82f6",
			borderScaleFactor: 1.5,
			transparentCorners: false,
			borderOpacityWhenMoving: 1,
			cornerStrokeColor: "#3b82f6",
		});

		const initalWorkspace = new fabric.Rect({
			width: 900,
			height: 1200,
			name: "clip",
			fill: "white",
			selectable: false,
			hasControls: false,
			shadow: new fabric.Shadow({
				color: "rgba(0,0,0,0.8)",
				blur: 5,
			}),
		});

		initialCanvas.setWidth(initialContainer.offsetWidth);
		initialCanvas.setHeight(initialContainer.offsetHeight);

		initialCanvas.add(initalWorkspace);
		initialCanvas.centerObject(initalWorkspace);
		initialCanvas.clipPath = initalWorkspace;

		setCanvas(initialCanvas);
		setContainer(initialContainer);

		const currentState = JSON.stringify(initialCanvas.toJSON(JSON_KEYS));
		canvasHistory.current = [currentState];
		setHistoryIndex(0);
	}, [canvasHistory, setHistoryIndex]);

	return { init, editor };
};

export { useEditor };
