import { fabric } from "fabric";
import * as material from "material-colors";

export const JSON_KEYS = [
	"name",
	"gradientAngle",
	"selectable",
	"hasControls",
	"linkData",
	"editable",
	"extensionType",
];

export const filters = [
	"none",
	"polaroid",
	"sepia",
	"kodachrome",
	"contrast",
	"brightness",
	"greyscale",
	"brownie",
	"vintage",
	"technicolor",
	"pixelate",
	"invert",
	"blur",
	"sharpen",
	"emboss",
	"removecolor",
	"blacknwhite",
	"vibrance",
	"blendcolor",
	"huerotate",
	"resize",
	"saturation",
	"gamma",
];

export const fonts = [
	"Arial",
	"Arial Black",
	"Verdana",
	"Helvetica",
	"Tahoma",
	"Trebuchet MS",
	"Times New Roman",
	"Georgia",
	"Garamond",
	"Courier New",
	"Brush Script MT",
	"Palatino",
	"Bookman",
	"Comic Sans MS",
	"Impact",
	"Lucida Sans Unicode",
	"Geneva",
	"Lucida Console"
];

export const selectionDependentTools = [
	"fill",
	"font",
	"filter",
	"opacity",
	"remove-bg",
	"stroke-color",
	"stroke-width",
];

export const colors = [
	material.red["500"],
	material.pink["500"],
	material.purple["500"],
	material.deepPurple["500"],
	material.indigo["500"],
	material.blue["500"],
	material.lightBlue["500"],
	material.cyan["500"],
	material.teal["500"],
	material.green["500"],
	material.lightGreen["500"],
	material.lime["500"],
	material.yellow["500"],
	material.amber["500"],
	material.orange["500"],
	material.deepOrange["500"],
	material.brown["500"],
	material.blueGrey["500"],
	"transparent",
];

export type Activetool = 
	| "select"
	| "shapes"
	| "text"
	| "images"
	| "draw"
	| "fill"
	| "stroke-color"
	| "stroke-width"
	| "font"
	| "opacity"
	| "filter"
	| "settings"
	| "ai"
	| "remove-bg"
	| "templates";

export const FILL_COLOR = "rgba(0,0,0,1)";

export const STROKE_COLOR = "rgba(0,0,0,1)";
export const STROKE_WIDTH = 2;
export const STROKE_DASH_ARRAY = [];

export const FONT_FAMILY = "Arial";
export const FONT_SIZE = 32;
export const FONT_WEIGHT = 400;
export const FONT_STYLE = "normal";
export const FONT_LINE_THROUGH = false;
export const FONT_UNDERLINE = false;
export const TEXT_ALIGN = "left";

export const HEIGHT = 400;
export const WIDTH = 400;


const POSITION_OPTIONS = {
	left: 100,
	top: 100,
	fill: FILL_COLOR,
};

const STOKE_OPTIONS = {
	stroke: STROKE_COLOR,
	strokeWidth: STROKE_WIDTH,
};

const BASE_OPTIONS = {
	...POSITION_OPTIONS,
	...STOKE_OPTIONS,
};

export const CIRCLE_OPTIONS = {
	radius: 200,
	...BASE_OPTIONS,
};

export const RECTANGLE_OPTIONS = {
	width: WIDTH,
	height: HEIGHT,
	angle: 0,
	...BASE_OPTIONS,
};

export const TRIANGLE_OPTIONS = {
	width: WIDTH,
	height: HEIGHT,
	angle: 0,
	...BASE_OPTIONS,
};

export const DIAMOND_OPTIONS = {
	width: WIDTH,
	height: HEIGHT,
	angle: 0,
	...BASE_OPTIONS,
};

export const TEXT_OPTIONS = {
	...POSITION_OPTIONS,
	type: "textbox",
	fontFamily: FONT_FAMILY,
	fontSize: FONT_SIZE,
	fontWeight: FONT_WEIGHT,
};

export interface EditorHookProps {
	clearSelectionCallback?: () => void;
}


export type BuildEditorProps = {
	canvas: fabric.Canvas;
	selectedObjects: fabric.Object[];
	fillColor: string;
	setFillColor: (value: string) => void;
	strokeColor: string;
	setStrokeColor: (value: string) => void;
	strokeWidth: number;
	setStrokeWidth: (value: number) => void;
	strokeDashArray: number[];
	setStrokeDashArray: (value: number[]) => void;
	fontFamily: string;
	setFontFamily: (value: string) => void;
	copy: () => void;
	paste: () => void;
	autoZoom: () => void;
	save: (skip?: boolean) => void;
	canRedo: () => boolean;
	canUndo: () => boolean;
	redo: () => void;
	undo: () => void;
};

export interface Editor {
	autoZoom: () => void;
	onCopy: () => void;
	onPaste: () => void;
	onUndo: () => void;
	onRedo: () => void;
	canUndo: () => boolean;
	canRedo: () => boolean;
	save: (skip?: boolean) => void;
	savePNG: () => void,
	saveJPG: () => void,
	saveJSON: () => void,
	loadJSON: (json: string) => void,
	selectAll: () => void;
	duplicate: () => void;
	zoomIn: () => void;
	zoomOut: () => void;
	getWorkspace: () => fabric.Object | undefined;
	changeSize: (size: { width: number, height: number }) => void;
	changeBackground: (value: string) => void;
	enableDrawingMode: () => void;
	disableDrawingMode: () => void;
	addImage: (value: string) => void;
	delete: () => void;
	bringForward: () => void;
	sendBackwards: () => void;
	changeImageFilter: (value: string) => void;
	changeOpacity: (value: number) => void;
	changeFillColor: (value: string) => void;
	changeStrokeColor: (value: string) => void;
	changeStrokeWidth: (value: number) => void;
	changeStrokeDashArray: (value: number[]) => void;
	changeFontFamily: (value: string) => void;
	changeFontWeight: (value: number) => void;
	changeFontStyle: (value: string) => void;
	changeFontLineThrough: (value: boolean) => void;
	changeFontUnderline: (value: boolean) => void;
	changeFontSize: (value: number) => void;
	changeTextAlign: (value: string) => void;
	addText: (value: string, options?: fabric.ITextboxOptions) => void;
	addCircle: () => void;
	addSoftRectangle: () => void;
	addRectangle: () => void;
	addTriangle: () =>  void;
	addInverseTriangle: () => void;
	addDiamond: () => void;
	getActiveOpacity: () => number;
	getActiveFillColor: () => string;
	getActiveStrokeColor: () => string;
	getActiveStrokeWidth: () => number;
	getActiveStrokeDashArray: () => number[];
	getActiveFontFamily: () => string;
	getActiveFontWeight: () => number;
	getActiveFontStyle: () => string;
	getActiveFontLineThrough: () => boolean;
	getActiveFontUnderline: () => boolean;
	getActiveFontSize: () => number;
	getActiveTextAlign: () => string;
	canvas: fabric.Canvas;
	selectedObjects: fabric.Object[];
}; 