import type { APIContext, GetStaticPathsResult } from "astro";
import { getCollection, getEntryBySlug } from "astro:content";
import satori, { SatoriOptions } from "satori";
import { html } from "satori-html";
import { siteConfig } from "@/site-config";
import { getFormattedDate } from "@/utils";

const monoFontReg = await fetch(
	"https://api.fontsource.org/v1/fonts/roboto-mono/latin-400-normal.ttf"
);

const monoFontBold = await fetch(
	"https://api.fontsource.org/v1/fonts/roboto-mono/latin-700-normal.ttf"
);

const ogOptions: SatoriOptions = {
	width: 1200,
	height: 630,
	// debug: true,
	embedFont: true,
	fonts: [
		{
			name: "Roboto Mono",
			data: await monoFontReg.arrayBuffer(),
			weight: 400,
			style: "normal",
		},
		{
			name: "Roboto Mono",
			data: await monoFontBold.arrayBuffer(),
			weight: 700,
			style: "normal",
		},
	],
};

const markup = (title: string, pubDate: string) => html`<div
	tw="flex flex-col w-full h-full bg-[#1d1f21] text-[#c9cacc]"
>
	<div tw="flex flex-col flex-1 w-full p-10 justify-center">
		<p tw="text-2xl mb-6">${pubDate}</p>
		<h1 tw="text-6xl font-bold leading-snug text-white">${title}</h1>
	</div>
	<div tw="flex items-center justify-between w-full p-10 border-t border-[#06787F] text-xl">
		<div tw="flex items-center">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				xml:space="preserve"
				style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2"
				viewBox="0 0 512 512"
			>
				<path
					d="M353.844 133.192 189.767 297.258l62.645-265.486h.012l101.42 101.42Z"
					style="fill:#fdb147;fill-rule:nonzero"
					transform="matrix(-1 0 0 1 511.999 0)"
				/>
				<path
					d="M455.253 31.772v.012L353.844 133.192l-101.42-101.42h202.829Z"
					style="fill:#08787f;fill-rule:nonzero"
					transform="matrix(-1 0 0 1 511.999 0)"
				/>
				<path
					d="M455.253 31.784v202.829L353.844 133.192 455.253 31.784Z"
					style="fill:#fdb147;fill-rule:nonzero"
					transform="matrix(-1 0 0 1 511.999 0)"
				/>
				<path
					d="m353.844 133.192 101.409 101.421-265.486 62.656v-.011l164.077-164.066Z"
					style="fill:#08787f;fill-rule:nonzero"
					transform="matrix(-1 0 0 1 511.999 0)"
				/>
				<path
					d="M484.493 251.583 463.93 231.02V35.367l17.277-17.277a8.674 8.674 0 0 0-12.266-12.265l-17.277 17.277H256.009L235.447 2.54a8.672 8.672 0 0 0-12.265 0 8.672 8.672 0 0 0 0 12.265l19.684 19.684-61.047 258.689a24.617 24.617 0 0 0-4.361 22.506 24.628 24.628 0 0 0 18.71 17.059l38.93 7.902a25.176 25.176 0 0 1 17.22 12.8 25.172 25.172 0 0 1 1.153 21.423 25.215 25.215 0 0 1-28.626 15.211L78.998 359.18c-21.96-4.654-44.101 7.813-51.516 28.997a44.717 44.717 0 0 0 3.442 37.087 44.718 44.718 0 0 0 30.316 21.637l.604.117c11.493 2.217 21.253 9.408 26.778 19.728 5.525 10.32 6.097 22.428 1.569 33.224a8.673 8.673 0 1 0 15.995 6.708c6.556-15.634 5.728-33.173-2.274-48.119-8.002-14.946-22.138-25.361-38.781-28.572l-.604-.117a27.384 27.384 0 0 1-18.567-13.251 27.383 27.383 0 0 1-2.107-22.713c4.54-12.973 18.105-20.603 31.547-17.757l145.844 30.899a42.539 42.539 0 0 0 48.297-25.663 42.459 42.459 0 0 0-1.945-36.145 42.462 42.462 0 0 0-29.051-21.594l-38.93-7.902c-3.872-.786-5.172-3.802-5.551-5.062-.308-1.02-.745-3.332.581-5.657l257.894-60.858 19.684 19.684a8.654 8.654 0 0 0 6.134 2.541 8.676 8.676 0 0 0 6.136-14.809Zm-37.911-37.91-80.48-80.48 80.48-80.48v160.96ZM434.317 40.448l-80.48 80.48-80.481-80.48h160.961Zm-92.746 92.746L205.219 269.545l52.067-220.636 84.285 84.285ZM217.485 281.812 353.837 145.46l84.285 84.285-220.637 52.067Z"
					style="fill:#5a1750;fill-rule:nonzero"
					transform="matrix(-1 0 0 1 511.999 0)"
				/>
			</svg>
			<p tw="ml-3 font-semibold">${siteConfig.title}</p>
		</div>
		<p>by ${siteConfig.author}</p>
	</div>
</div>`;

export async function get({ params: { slug } }: APIContext) {
	const post = await getEntryBySlug("post", slug!);
	const title = post?.data.title ?? siteConfig.title;
	const postDate = getFormattedDate(post?.data.publishDate ?? Date.now(), {
		weekday: "long",
		month: "long",
	});
	const svg = await satori(markup(title, postDate), ogOptions);
	const png = new Resvg(svg).render().asPng();
	return {
		body: png,
		encoding: "binary",
	};
}

export async function getStaticPaths(): Promise<GetStaticPathsResult> {
	const posts = await getCollection("post");
	return posts.filter(({ data }) => !data.ogImage).map(({ slug }) => ({ params: { slug } }));
}
