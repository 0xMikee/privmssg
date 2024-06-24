import { Link } from "@remix-run/react";
import { Button, Chip, Input } from "@nextui-org/react";
import styles from "./ErrorPage.module.scss";
import { Icon, IconId } from "~/components/Icon";

type ErrorPageProps = {
	pathname: string;
};

export const ErrorPage = ({ pathname }: ErrorPageProps) => (
	<div className={styles.errorPage}>{pathname}</div>
);
