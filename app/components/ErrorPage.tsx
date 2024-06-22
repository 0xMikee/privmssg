import styles from "./ErrorPage.module.scss";

type ErrorPageProps = {
	title: string;
	text: HTMLDivElement;
};

export const ErrorPage = ({ title, text }: ErrorPageProps) => (
	<div className={styles.errorPage}>
		{title}
		{text}
	</div>
);
