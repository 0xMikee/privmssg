import {
	Links,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
} from "@remix-run/react";
import type { LinksFunction } from "@remix-run/node";
import { NextUIProvider } from "@nextui-org/react";
import {ThemeProvider as NextThemesProvider, useTheme} from "next-themes";
import Header from "~/components/Header";
import Layout from "~/components/Layout";
import "./styles/1_core/global.scss";
import { rootLinks } from "~/utils/rootLinks";
import type { MetaFunction } from "@remix-run/node";
import {seo} from "~/utils/seo";

export const meta: MetaFunction = () => {
	const { theme } = useTheme();

	return [
		{ charset: "utf-8" },
		{ name: "viewport", content: "width=device-width,initial-scale=1"},
        {
            name: "theme-color",
            content: theme === "dark" ? "#000000" : "#ffffff",
        },
		...seo,
	];
};

export const links: LinksFunction = () => {
	return [...rootLinks];
};

export const App = ({ title = "PrivMssg - Secure private message" }) => {
	return (
		<html lang="en">
		<NextThemesProvider attribute="class" defaultTheme="dark">
			<head>
				<Meta />
				<title>{title}</title>
				<Links />
			</head>
			<body>
				<NextUIProvider>

						<Header />
						<Layout>
							<Outlet />
						</Layout>
						<ScrollRestoration />
						<Scripts />
				</NextUIProvider>
			</body>
		</NextThemesProvider>
		</html>
	);
};

export default App;
