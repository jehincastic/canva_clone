import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";

interface SidebarItemProps {
	icon: LucideIcon;
	label: string;
	href: string;
	isActive?: boolean;
	onClick?: () => void;
};

const SidebarItem = ({
	icon: Icon,
	href, label,
	isActive, onClick,
}: SidebarItemProps) => {
	return (
		<Link href={href} onClick={onClick}>
			<div className={cn(
				"flex items-center px-3 py-3 rounded-xl bg-transparent hover:bg-white transition",
				isActive && "bg-white"
			)}>
				<Icon className="mr-2 size-4 stroke-2" />
				<span className="text-sm font-medium">
					{label}
				</span>
			</div>
		</Link>
	);
};

export { SidebarItem };
