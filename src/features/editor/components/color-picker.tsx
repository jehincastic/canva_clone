import { ChromePicker, CirclePicker } from "react-color";

import { colors } from "@/features/editor/types";
import { rgbaObjToString } from "@/features/editor/utils";

interface ColorPickerProps {
	value: string;
	onChange: (value: string) => void;
}

const ColorPicker = ({ value, onChange }: ColorPickerProps) => {
	return (
		<div className="w-full space-y-4">
			<ChromePicker
				color={value}
				onChange={({ rgb }) => {
					onChange(rgbaObjToString(rgb));
				}}
				className="border rounded-lg"
			/>
			<CirclePicker
				color={value}
				colors={colors}
				onChangeComplete={({ rgb }) => {
					onChange(rgbaObjToString(rgb));
				}}
			/>
		</div>
	);
};

export { ColorPicker };