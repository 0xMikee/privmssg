import type { SVGProps } from "react";

export type PathProps = SVGProps<SVGPathElement>;

export const Path = (props): PathProps => (
	<path fillRule="evenodd" {...props} />
);
