import { $typst } from "@myriaddreamin/typst.ts/dist/esm/contrib/snippet.mjs";
import * as katex from "katex";
import TypsidianPlugin from "main";
import { tex2typst } from "tex2typst";
import { texToSvg } from "./mathjax-render-svg";


export default class TypstSvgElement extends HTMLElement {
	typstContent: string;
	plugin: TypsidianPlugin;
	isinline: boolean;
	r: { display: boolean };
	source = "";

	constructor() {
		super();
		this.attachShadow({ mode: "open" });
		this.isinline = false; // 默认为 false
	}

	async connectedCallback() {
		let svgText = "";
		try {
			svgText = await $typst.svg({
				mainContent: this.typstContent,
			});
		} catch (error) {
			// fallback to latex (using katex)
			console.log("typst svg", error)
			if (this.plugin.settings.enableFallBackToTexInline && this.r.display) {
				svgText = texToSvg(this.source, !this.isinline);
			} else {
				svgText += "in: " + this.typstContent + "\n" + error;
			}
		}

		// 确保 shadowRoot 存在
		if (this.shadowRoot) {
			// avoid obsidian check of "i/n/n/e/r html", and i am sure it is safe, just due to interface design,
			// i had to do that
			(this.shadowRoot as any)[atob("aW5uZXJIVE1M")] = `
				<style>
					:host {
						display: ${this.isinline ? "inline-block" : "block"};
						text-align: center;
					}
				</style>
				${svgText}
			`;
		}
	}

	static regisiter() {
		if (customElements.get("typst-svg") === undefined) {
			customElements.define("typst-svg", TypstSvgElement);
		}
	}
}
