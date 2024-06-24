import type { SVGProps } from "react";

export type SvgProps = {
	title?: string;
} & SVGProps<SVGSVGElement>;

export const Svg = ({ title = "Icon", children, ...props }: SvgProps) => (
	<svg role="img" aria-label={title} {...props}>
		{title && <title>{title}</title>}
		{children}
	</svg>
);
