import { $typst } from "@myriaddreamin/typst.ts";
import { TypstSnippet } from "@myriaddreamin/typst.ts/dist/esm/contrib/snippet.mjs";

interface FontData {
	postscriptName: string;
	fullName: string;
	family: string;
	style: string;
	blob: () => Promise<Blob>;
}

interface Window {
	queryLocalFonts?: () => Promise<FontData[]>;
}

export async function fontInit(setFontStr: string) {
	const fonts = await (window as Window).queryLocalFonts();
	const setFontNames = setFontStr
		.split(",")
		.map((f) => f.trim().toLowerCase());
	const setFonts = fonts.filter((f) =>
		setFontNames.includes(f.family.trim().toLowerCase())
	);
	for (const font of setFonts) {
		const bi = await font.blob();
		$typst.use(TypstSnippet.preloadFontFromUrl(URL.createObjectURL(bi)));
	}
}
