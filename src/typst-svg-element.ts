import { $typst } from "@myriaddreamin/typst.ts";
import MyPlugin from "main";

export default class TypstSvgElement extends HTMLElement {
	typstContent: string;
	plugin: MyPlugin;
	isinline: boolean;

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
			if (this.plugin.settings.enableFallBackToTex) {
				this.shadowRoot.appendChild(
					this.plugin.tex2html(
						this.typstContent
							.split("/*__typsidian-divider*/") // remove the template content
							.slice(-1),
						{
							display: !this.isinline,
						}
					)
				);
				return;
			}
			svgText = error;
		}

		// 确保 shadowRoot 存在
		if (this.shadowRoot) {
			this.shadowRoot.innerHTML = `
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
