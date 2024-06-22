import {
	isRouteErrorResponse,
	useParams,
	useRouteError,
} from "@remix-run/react";
import type { ErrorResponse } from "@remix-run/router";

export const GeneralErrorBoundary = ({
	statusHandlers,
}: {
	statusHandlers?: Record<
		number,
		(info: {
			error: ErrorResponse;
			params: Record<string, string | undefined>;
		}) => JSX.Element | null
	>;
}) => {
	const error = useRouteError();
	const params = useParams();

	if (typeof document !== "undefined") {
		console.error("Caught error:", error);
	}

	if (isRouteErrorResponse(error)) {
		const handler = statusHandlers?.[error.status];
		return handler({ error, params });
	}
};
