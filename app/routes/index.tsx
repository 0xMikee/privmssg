import type { MetaFunction } from "@remix-run/node";
import { Button } from "@nextui-org/react";
import {Link} from "@remix-run/react";

export const meta: MetaFunction = () => {
	return [
		{ title: "New Remix App" },
		{ name: "description", content: "Welcome to Remix!" },
	];
};

const Index = () => {
	return (
		<>
			<Link to="/notes">
				<Button size="sm">
					Notes
				</Button>
			</Link>
		<Link to="/notes/new">
			<Button size="sm">
				Create a New Private Message
			</Button>
		</Link>
		</>
	);
};

export default Index;
