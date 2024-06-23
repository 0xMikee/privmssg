import {
	Links,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
} from "@remix-run/react";
import type { LinksFunction } from "@remix-run/node";
import "./tailwind.css";
import { NextUIProvider } from "@nextui-org/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import Header from "~/components/Header";
import Layout from "~/components/Layout";
import "./styles/1_core/global.scss";
import { rootLinks } from "~/utils/rootLinks";
import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
	return [
		{ charset: "utf-8" },
		{ name: "viewport", content: "width=device-width,initial-scale=1",},
	];
};

export const links: LinksFunction = () => {
	return [...rootLinks];
};

export const App = ({ title = "PrivMssg - Secure private message" }) => {
	return (
		<html lang="en">
			<head>
				<Meta />
				<title>{title}</title>
				<Links />
			</head>
			<body>
				<NextUIProvider>
					<NextThemesProvider attribute="class" defaultTheme="dark">
						<Header />
						<Layout>
							<Outlet />
						</Layout>
						<ScrollRestoration />
						<Scripts />
					</NextThemesProvider>
				</NextUIProvider>
			</body>
		</html>
	);
};

export default App;
