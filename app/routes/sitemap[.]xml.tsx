export const loader = () => {
	const newDate = new Date();
	const date = newDate.toLocaleDateString();

	const content = `
        <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
    <loc>https://privmssg.com/</loc>
    <lastmod>${date}</lastmod>
    <priority>1.0</priority>
    </url>
    <url>
    <loc>https://privmssg.com/notes/new</loc>
    <lastmod>${date}</lastmod>
    <priority>1.0</priority>
    </url>
    </urlset>
    `;

	return new Response(content, {
		status: 200,
		headers: {
			"Content-Type": "application/xml",
			"xml-version": "1.0",
			encoding: "UTF-8",
		},
	});
};
