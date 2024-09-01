import { useEvent } from "react-use";

const useWindowwEvents = () => {
	useEvent("beforeunload", (event) => {
		(event || window.event).returnValue = "Are you sure you want to leave?";
	});
};

export { useWindowwEvents };
