"use client";

import { useState } from "react";
import { BsBorderWidth } from "react-icons/bs";
import { AlignCenter, AlignLeft, AlignRight, ArrowDown, ArrowUp, ChevronDown, CopyIcon, SquareSplitHorizontal, TrashIcon } from "lucide-react";
import { RxTransparencyGrid } from "react-icons/rx";
import { FaBold, FaItalic, FaStrikethrough, FaUnderline } from "react-icons/fa";
import { TbColorFilter } from "react-icons/tb";

import {
  Activetool, Editor,
  TEXT_ALIGN, FONT_LINE_THROUGH,
  FONT_STYLE, FONT_UNDERLINE,
  FONT_WEIGHT, FONT_SIZE,
} from "@/features/editor/types";
import { Hint } from "@/components/hint";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { isTextType } from "@/features/editor/utils";
import { FontSizeInput } from "@/features/editor/components/font-size-input";

interface ToolbarProps {
  editor: Editor | undefined;
  activeTool: Activetool;
  onChangeActiveTool: (val: Activetool) => void;
}

export const Toolbar = ({
  editor,
  activeTool,
  onChangeActiveTool,
}: ToolbarProps) => {
  const fillColor = editor?.getActiveFillColor();
  const strokeColor = editor?.getActiveStrokeColor();
	const fontFamily = editor?.getActiveFontFamily();
  const initialFontWeight = editor?.getActiveFontWeight() ?? FONT_WEIGHT;
  const initialFontStyle = editor?.getActiveFontStyle() ?? FONT_STYLE;
  const initialFontLineThrough = editor?.getActiveFontLineThrough() ?? FONT_LINE_THROUGH;
  const initialFontUnderline = editor?.getActiveFontUnderline() ?? FONT_UNDERLINE;
  const initialFontSize = editor?.getActiveFontSize() ?? FONT_SIZE;
  const initialTextAlign = editor?.getActiveTextAlign() ?? TEXT_ALIGN;

  const [properties, setProperties] = useState({
    fontWeight: initialFontWeight,
    fontStyle: initialFontStyle,
    fontLineThrough: initialFontLineThrough,
    fontUnderline: initialFontUnderline,
    fontSize: initialFontSize,
    textAlign: initialTextAlign,
  });

  const toggleBold = () => {
    const newValue = properties.fontWeight > 500 ? 500 : 700;
    editor?.changeFontWeight(newValue);
    setProperties(oldProps => ({ ...oldProps, fontWeight: newValue }));
  };

  const toggleItalic = () => {
    const isItalic = properties.fontStyle === "italic";
    const newValue = isItalic ? "normal" : "italic";

    editor?.changeFontStyle(newValue);
    setProperties(oldProps => ({ ...oldProps, fontStyle: newValue }));
  };

  const toggleLineThrough = () => {
    const newValue = !properties.fontLineThrough;
    editor?.changeFontLineThrough(newValue);
    setProperties(oldProps => ({ ...oldProps, fontLineThrough: newValue }));
  };

  const toggleUnderline = () => {
    const newValue = !properties.fontUnderline;
    editor?.changeFontUnderline(newValue);
    setProperties(oldProps => ({ ...oldProps, fontUnderline: newValue }));
  };

  const toggleTextAlign = (value: string) => {
    editor?.changeTextAlign(value);
    setProperties(oldProps => ({ ...oldProps, textAlign: value }));
  };

  const updateFontSize = (value: number) => {
    if (value <= 0) {
      return;
    }
    let newValue = value;
    if (isNaN(value)) {
      newValue = 0;
    }

    editor?.changeFontSize(newValue);
    setProperties(oldProps => ({ ...oldProps, fontSize: newValue }));
  };

  if (!editor?.selectedObjects.length) {
    return (
      <div className="shrink-0 h-[56px] border-b bg-white w-full flex items-center overflow-x-auto z-[49] p-2 gap-x-2" />
    );
  }

  const selectedObjectType = editor.selectedObjects[0].type;
  const isText = isTextType(selectedObjectType);
  const isImage = selectedObjectType === "image";

  return (
    <div className="shrink-0 h-[56px] border-b bg-white w-full flex items-center overflow-x-auto z-[49] p-2 gap-x-2">
      {
        !isImage && (
          <div className="flex items-center-h-full justify-center">
            <Hint label="Color" side="bottom" sideOffset={5}>
              <Button
                onClick={() => onChangeActiveTool("fill")}
                size="icon"
                variant="ghost"
                className={cn(activeTool === "fill" && "bg-gray-100")}
              >
                <div
                  className="rounded-sm size-4 border"
                  style={{ backgroundColor: fillColor }}
                />
              </Button>
            </Hint>
          </div>
        )
      }
      {
        !isText && (
          <>
            <div className="flex items-center-h-full justify-center">
              <Hint label="Stroke Color" side="bottom" sideOffset={5}>
                <Button
                  onClick={() => onChangeActiveTool("stroke-color")}
                  size="icon"
                  variant="ghost"
                  className={cn(activeTool === "stroke-color" && "bg-gray-100")}
                >
                  <div
                    className="rounded-sm size-4 border-2 bg-white"
                    style={{ borderColor: strokeColor }}
                  />
                </Button>
              </Hint>
            </div>
            <div className="flex items-center-h-full justify-center">
              <Hint label="Stroke Width" side="bottom" sideOffset={5}>
                <Button
                  onClick={() => onChangeActiveTool("stroke-width")}
                  size="icon"
                  variant="ghost"
                  className={cn(activeTool === "stroke-width" && "bg-gray-100")}
                >
                  <BsBorderWidth className="size-4" />
                </Button>
              </Hint>
            </div>
          </>
        )
      }
      {
        isText && (
          <>
            <div className="flex items-center-h-full justify-center">
              <Hint label="Font" side="bottom" sideOffset={5}>
                <Button
                  onClick={() => onChangeActiveTool("font")}
                  size="icon"
                  variant="ghost"
                  className={cn(
                    "w-auto px-2 text-sm",
                    activeTool === "font" && "bg-gray-100"
                  )}
                >
                  <div
                    className="max-w-[100px] truncate"
                    style={{ fontFamily }}
                  >
                    {fontFamily}
                  </div>
                  <ChevronDown className="size-4 ml-2 shrink-0" />
                </Button>
              </Hint>
            </div>
            <div className="flex items-center-h-full justify-center">
              <Hint label="Bold" side="bottom" sideOffset={5}>
                <Button
                  onClick={toggleBold}
                  size="icon"
                  variant="ghost"
                  className={cn(properties.fontWeight > 500 && "bg-gray-100")}
                >
                  <FaBold className="size-4" />
                </Button>
              </Hint>
            </div>
            <div className="flex items-center-h-full justify-center">
              <Hint label="Italic" side="bottom" sideOffset={5}>
                <Button
                  onClick={toggleItalic}
                  size="icon"
                  variant="ghost"
                  className={cn(properties.fontStyle === "italic" && "bg-gray-100")}
                >
                  <FaItalic className="size-4" />
                </Button>
              </Hint>
            </div>
            <div className="flex items-center-h-full justify-center">
              <Hint label="Underline" side="bottom" sideOffset={5}>
                <Button
                  onClick={toggleUnderline}
                  size="icon"
                  variant="ghost"
                  className={cn(properties.fontUnderline && "bg-gray-100")}
                >
                  <FaUnderline className="size-4" />
                </Button>
              </Hint>
            </div>
            <div className="flex items-center-h-full justify-center">
              <Hint label="Line through" side="bottom" sideOffset={5}>
                <Button
                  onClick={toggleLineThrough}
                  size="icon"
                  variant="ghost"
                  className={cn(properties.fontLineThrough && "bg-gray-100")}
                >
                  <FaStrikethrough className="size-4" />
                </Button>
              </Hint>
            </div>
            <div className="flex items-center-h-full justify-center">
              <Hint label="Align left" side="bottom" sideOffset={5}>
                <Button
                  onClick={() => toggleTextAlign("left")}
                  size="icon"
                  variant="ghost"
                  className={cn(properties.textAlign === "left" && "bg-gray-100")}
                >
                  <AlignLeft className="size-4" />
                </Button>
              </Hint>
            </div>
            <div className="flex items-center-h-full justify-center">
              <Hint label="Align center" side="bottom" sideOffset={5}>
                <Button
                  onClick={() => toggleTextAlign("center")}
                  size="icon"
                  variant="ghost"
                  className={cn(properties.textAlign === "center" && "bg-gray-100")}
                >
                  <AlignCenter className="size-4" />
                </Button>
              </Hint>
            </div>
            <div className="flex items-center-h-full justify-center">
              <Hint label="Align right" side="bottom" sideOffset={5}>
                <Button
                  onClick={() => toggleTextAlign("right")}
                  size="icon"
                  variant="ghost"
                  className={cn(properties.textAlign === "right" && "bg-gray-100")}
                >
                  <AlignRight className="size-4" />
                </Button>
              </Hint>
            </div>
            <div className="flex items-center-h-full justify-center">
              <FontSizeInput 
                value={properties.fontSize}
                onChange={updateFontSize}
              />
            </div>
          </>
        )
      }
      {
        isImage && (
          <>
            <div className="flex items-center-h-full justify-center">
              <Hint label="Filters" side="bottom" sideOffset={5}>
                <Button
                  onClick={() => onChangeActiveTool("filter")}
                  size="icon"
                  variant="ghost"
                  className={cn(activeTool === "filter" && "bg-gray-100")}
                >
                  <TbColorFilter className="size-4" />
                </Button>
              </Hint>
            </div>
            <div className="flex items-center-h-full justify-center">
              <Hint label="Remove background" side="bottom" sideOffset={5}>
                <Button
                  onClick={() => onChangeActiveTool("remove-bg")}
                  size="icon"
                  variant="ghost"
                  className={cn(activeTool === "filter" && "bg-gray-100")}
                >
                  <SquareSplitHorizontal className="size-4" />
                </Button>
              </Hint>
            </div>
          </>
        )
      }
      <div className="flex items-center-h-full justify-center">
        <Hint label="Bring forward" side="bottom" sideOffset={5}>
          <Button
            onClick={() => editor?.bringForward()}
            size="icon"
            variant="ghost"
          >
            <ArrowUp className="size-4" />
          </Button>
        </Hint>
      </div>
      <div className="flex items-center-h-full justify-center">
        <Hint label="Send backwards" side="bottom" sideOffset={5}>
          <Button
            onClick={() => editor?.sendBackwards()}
            size="icon"
            variant="ghost"
          >
            <ArrowDown className="size-4" />
          </Button>
        </Hint>
      </div>
      <div className="flex items-center-h-full justify-center">
        <Hint label="Opacity" side="bottom" sideOffset={5}>
          <Button
            onClick={() => onChangeActiveTool("opacity")}
            size="icon"
            variant="ghost"
            className={cn(activeTool === "opacity" && "bg-gray-100")}
          >
            <RxTransparencyGrid className="size-4" />
          </Button>
        </Hint>
      </div>
      <div className="flex items-center-h-full justify-center">
        <Hint label="Duplicate" side="bottom" sideOffset={5}>
          <Button
            onClick={() => editor?.duplicate()}
            size="icon"
            variant="ghost"
          >
            <CopyIcon className="size-4" />
          </Button>
        </Hint>
      </div>
      <div className="flex items-center-h-full justify-center">
        <Hint label="Delete" side="bottom" sideOffset={5}>
          <Button
            onClick={() => editor?.delete()}
            size="icon"
            variant="ghost"
          >
            <TrashIcon className="size-4" />
          </Button>
        </Hint>
      </div>
		</div>
  );
};
