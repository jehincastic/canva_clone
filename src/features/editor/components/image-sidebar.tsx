import { AlertTriangle, Loader } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Activetool, Editor } from "@/features/editor/types";
import { ToolSidebarHeader } from "@/features/editor/components/tool-sidebar-header";
import { ToolSidebarClose } from "@/features/editor/components/tool-sidebar-close";
import { useGetImages } from "@/features/images/api/use-get-images";
import { UploadButton } from "@/lib/uploadthing";

interface ImageSidebarProps {
	editor: Editor | undefined;
  activeTool: Activetool;
  onChangeActiveTool: (tool: Activetool) => void;
}

const ImageSidebar = ({ editor, activeTool, onChangeActiveTool }: ImageSidebarProps) => {
	const { data, isLoading, isError } = useGetImages();
	
	const onClose = () => {
		onChangeActiveTool("select");
	};

	return (
		<aside
			className={cn(
				"bg-white relative border-r z-[40] w-[360px] h-full flex flex-col",
				activeTool === "images" ? "visible" : "hidden"
			)}
		>
			<ToolSidebarHeader
				title="Images"
				description="Add images to the canvas"
			/>
			<div className="p-4 border-b hidden">
				<UploadButton
					appearance={{
						button: "w-full text-sm font-medium",
						allowedContent: "hidden",
					}}
					content={{ button: "Upload Image" }}
					endpoint="imageUploader"
					onClientUploadComplete={(res) => {
						editor?.addImage(res[0].url)
					}}
				/>
			</div>
			{
				isLoading && (
					<div className="flex items-center justify-center flex-1">
						<Loader className="size-4 text-muted-foreground animate-spin" />
					</div>
				)
			}
			{
				isError && (
					<div className="flex flex-col gap-y-4 items-center justify-center flex-1">
						<AlertTriangle className="size-4 text-muted-foreground" />
						<p className="text-muted-foreground text-xs">
							Failed to fetch images
						</p>
					</div>
				)
			}
			<ScrollArea>
				<div className="p-4">
					<div className="grid grid-cols-2 gap-4">
						{
							data?.images && data.images.map((image) => {
								return (
									<button
										onClick={() => editor?.addImage(image.urls.regular)}
										key={image.id}
										className="relative w-full h-[100px] group hover:opacity-75 transition bg-muted rounded-sm overflow-hidden border"
									>
										<Image
											fill
											src={image.urls.small}
											alt={image.alt_description || "Image"}
											className="object-cover"
										/>
										<Link
											target="_blank"
											href={image.links.html}
											className="opacity-0 absolute left-0 bottom-0 w-full text-[10px] truncate text-white group-hover:opacity-100 hover:underline p-1 bg-black/50 text-left"
										>
											{image.user.name}
										</Link>
									</button>
								);
							})
						}
					</div>
				</div>
			</ScrollArea>

			<ToolSidebarClose onClick={onClose} />
		</aside>
	);
};

export { ImageSidebar };
