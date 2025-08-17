import {
	App,
	MarkdownView,
	Modal,
	Notice,
	Plugin,
	loadMathJax,
} from "obsidian";
import {
	DEFAULT_SETTINGS,
	TypsidianPluginSettings,
	TypsidianSettingTab,
} from "src/settings";
import { typst2tex } from "tex2typst";
import TypstSvgElement from "src/typst-svg-element";
import { converterGen } from "src/converter";
import { $typst } from "@myriaddreamin/typst.ts";
import { TypstSnippet } from "@myriaddreamin/typst.ts/dist/esm/contrib/snippet.mjs";
import { fontInit } from "src/font";
declare const MathJax: any;

export default class TypsidianPlugin extends Plugin {
	settings: TypsidianPluginSettings;
	tex2html: any; // mathjax tex2chtml function
	async onload() {
		await this.loadSettings();
		// init typst
		$typst.setCompilerInitOptions({
			getModule: () =>
				"https://cdn.jsdelivr.net/npm/@myriaddreamin/typst-ts-web-compiler/pkg/typst_ts_web_compiler_bg.wasm",
		});
		$typst.setRendererInitOptions({
			getModule: () =>
				"https://cdn.jsdelivr.net/npm/@myriaddreamin/typst-ts-renderer/pkg/typst_ts_renderer_bg.wasm",
		});
		// add font
		await fontInit(this.settings.supportLocalFonts);
		// This adds a status bar item to the bottom of the app. Does not work on mobile apps.
		const statusBarItemEl = this.addStatusBarItem();
		statusBarItemEl.setText("typsidian √");

		this.addCommand({
			id: "duplicate-normal-note-with-png",
			name: "duplicate a normal note with typst transformed, img is png format",
			editorCallback: converterGen(this, true),
		});
		this.addCommand({
			id: "duplicate-normal-note-with-svg",
			name: "duplicate a normal note with typst transformed, img is svg format",
			editorCallback: converterGen(this, false),
		});

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new TypsidianSettingTab(this.app, this));
		await loadMathJax();
		this.tex2html = MathJax.tex2chtml;
		MathJax.tex2chtml = (e: string, r: { display: boolean }) =>
			this.typstTex2Html(e, r); // avoid this binding
		this.registerMarkdownCodeBlockProcessor(
			"typrender",
			(source, el, ctx) => {
				const typstEl = document.createElement(
					"typst-svg"
				) as TypstSvgElement;
				typstEl.typstContent = `${this.settings.typstRenderCodeTemplate} \n 
				/*__typsidian-divider*/
				${source}`;
				typstEl.plugin = this;
				el.appendChild(typstEl);
			}
		);
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
		this.app.workspace
			.getActiveViewOfType(MarkdownView)
			?.previewMode.rerender(true);
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
					throw new Error("illegal typst math code.");
				}
				return this.tex2html(typst2tex(source), r);
			}
			return this.tex2html(source, r);
		} catch (error) {
			if (this.settings.enableFallBackToTex) {
				return this.tex2html(source, r);
			}
			const renderedString = `<span style="color: red;">${error}</span>`;
			return new DOMParser().parseFromString(renderedString, "text/html")
				.body.firstChild;
		}
	}
}
