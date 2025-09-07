import { MarkdownView, Plugin, loadMathJax } from "obsidian";
import {
	DEFAULT_SETTINGS,
	TypsidianPluginSettings,
	TypsidianSettingTab,
} from "src/settings";
import { typst2tex } from "tex2typst";
import TypstSvgElement from "src/typst-svg-element";
import { t } from "src/lang/helpers";

import { initTypst, regCmds } from "src/init";
declare const MathJax: any;

export default class TypsidianPlugin extends Plugin {
	settings: TypsidianPluginSettings;
	tex2html: any; // mathjax tex2chtml function
	async onload() {
		await this.loadSettings();

		await initTypst(this);

		regCmds(this);

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new TypsidianSettingTab(this.app, this));
		await loadMathJax();
		this.tex2html = MathJax.tex2chtml;

		MathJax.tex2chtml = (e: string, r: { display: boolean }) =>
			this.typstTex2Html(e, r);

		// Register custom language template processors
		this.registerCustomLanguageProcessors();
	}

	onunload() {
		MathJax.tex2chtml = this.tex2html;
	}

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			await this.loadData()
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
		// Re-register custom language processors when settings change
		this.registerCustomLanguageProcessors();
		this.app.workspace
			.getActiveViewOfType(MarkdownView)
			?.previewMode.rerender(true);
	}

	private registerCustomLanguageProcessors() {
		// Unregister existing custom language processors
		// Note: Obsidian doesn't provide a direct way to unregister processors,
		// so we'll rely on the new registration to override the old ones

		// Register custom language template processors
		this.settings.customLanguageTemplates.forEach((template) => {
			if (template.enabled && template.language.trim()) {
				this.registerMarkdownCodeBlockProcessor(
					template.language,
					(source, el, ctx) => {
						const typstEl = document.createElement(
							"typst-svg"
						) as TypstSvgElement;
						// Replace {content} placeholder with user input
						const processedContent = template.template.replace(
							/\{content\}/g,
							source
						);
						typstEl.typstContent = processedContent;
						typstEl.plugin = this;
						el.appendChild(typstEl);
					}
				);
			}
		});
	}

	typstTex2Html(source: string, r: { display: boolean }): ChildNode | null {
		try {
			if (r.display) {
				if (this.settings.enableMathTypst) {
					if (this.settings.enableTypst2TexInMath) {
						return this.tex2html(typst2tex(source), r);
					} else {
						TypstSvgElement.regisiter();
						const el = document.createElement(
							"typst-svg"
						) as TypstSvgElement;
						el.typstContent = `${this.settings.mathTypstTemplate} \n 
						/*__typsidian-divider*/
						$ ${source} $`;
						el.plugin = this;
						return el;
					}
				}
			} else if (this.settings.enableInlineMathTypst) {
				if (source.includes("\\")) {
					throw new Error(t("illegalTypstMathCode"));
				}
				return this.tex2html(typst2tex(source), r);
			}
			return this.tex2html(source, r);
		} catch (error) {
			if (this.settings.enableFallBackToTexBlock && r.display) {
				return this.tex2html(source, r);
			}
			if (this.settings.enableFallBackToTexInline && !r.display) {
				return this.tex2html(source, r);
			}
			const renderedString = `<span style="color: red;">${error}</span>`;
			return new DOMParser().parseFromString(renderedString, "text/html")
				.body.firstChild;
		}
	}
}
