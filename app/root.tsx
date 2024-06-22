import {
	Links,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
} from "@remix-run/react";
import "./tailwind.css";
import { NextUIProvider } from "@nextui-org/react";
import {ThemeProvider as NextThemesProvider} from "next-themes";
import Header from "~/components/Header";
import Layout from "~/components/Layout";
import "./styles/1_core/global.scss"

export const App = () => {
	return (
		<html lang="en">
			<head>
				<title>PrivMssg</title>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<Meta />
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
}

export default App;
