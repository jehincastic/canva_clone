import { useCallback, useEffect } from "react";
import { fabric } from "fabric";

interface UseAutoResizeProps {
	canvas: fabric.Canvas | null,
	container: HTMLDivElement | null,
}

const useAutoResize = ({ canvas, container }: UseAutoResizeProps) => {
	const autoZoom = useCallback(() => {
		if (!canvas || !container) {
			return;
		}

		const width = container.offsetWidth;
		const height = container.offsetHeight;

		canvas.setWidth(width);
		canvas.setHeight(height);

		const center = canvas.getCenter();
		const zoomRatio = 0.85;
		const localWorspace = canvas.getObjects().find(o => o.name === 'clip');
		if (!localWorspace) {
			return;
		}

		// @ts-ignore
		const scale = fabric.util.findScaleToFit(localWorspace, { width, height });
		const zoom = zoomRatio * scale;

		canvas.setViewportTransform(fabric.iMatrix.concat());
		canvas.zoomToPoint(new fabric.Point(center.left, center.top), zoom);

		const workspaceCenter = localWorspace.getCenterPoint();
		const viewPortTransform = canvas.viewportTransform;

		if (
			canvas.width === undefined ||
			canvas.height === undefined ||
			!viewPortTransform
		) {
			return;
		}

		viewPortTransform[4] = canvas.width / 2 - workspaceCenter.x * viewPortTransform[0];
		viewPortTransform[5] = canvas.height / 2 - workspaceCenter.y * viewPortTransform[3];

		canvas.setViewportTransform(viewPortTransform);

		localWorspace.clone((cloned: fabric.Rect) => {
			canvas.clipPath = cloned;
			canvas.requestRenderAll();
		});

	}, [canvas, container]);

	useEffect(() => {
		let resizeObserver: ResizeObserver | null = null;
		if (canvas && container) {
			resizeObserver = new ResizeObserver(() => {
				autoZoom();
			});

			resizeObserver.observe(container);
		}

		return () => {
			if (resizeObserver) {
				resizeObserver.disconnect();
			}
		};
	}, [canvas, container, autoZoom]);

	return { autoZoom };
};

export { useAutoResize };
