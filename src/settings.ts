import TypsidianPlugin from "main";
import { App, PluginSettingTab, Setting } from "obsidian";
import { t } from "./lang/helpers";

export interface CustomLanguageTemplate {
	language: string;
	template: string;
	enabled: boolean;
}

export interface TypsidianPluginSettings {
	enableMathBlockTypst: boolean;
	enableInlineMathTypst: boolean;
	enableFallBackToTexInline: boolean;
	githubToken: string;
	mathTypstTemplate: string;
	usrAndRepo: string; //"xxx/xxx"
	uploadImageDir: string;
	supportLocalFonts: string;
	customLanguageTemplates: CustomLanguageTemplate[];
	webCompilerWasmUrl: string;
	tsRendererWasmUrl: string;
}

export const DEFAULT_SETTINGS: TypsidianPluginSettings = {
	enableMathBlockTypst: true,
	enableInlineMathTypst: true,
	enableFallBackToTexInline: true,
	githubToken: "",
	usrAndRepo: "user/repo",
	uploadImageDir: "typst-images-obsidian",
	mathTypstTemplate:
		"#set page(width: auto, height: auto, margin: 10pt) \n #set text(size: 16pt, fill: if ({IsDarkMode}) { white } else { black }) \n",
	supportLocalFonts:
		"PingFang SC, Microsoft YaHei, Noto Serif, Noto Sans, Noto Serif, Noto Serif CJK SC, Noto Sans CJK SC",
	customLanguageTemplates: [
		{
			language: "typrender",
			template:
				"#set page(width: auto, height: auto, margin: 10pt) \n #set text(size: 16pt, fill: if ({IsDarkMode}) { white } else { black }) \n{content}",
			enabled: true,
		},
	],
	webCompilerWasmUrl: "https://cdn.jsdelivr.net/npm/@myriaddreamin/typst-ts-web-compiler/pkg/typst_ts_web_compiler_bg.wasm",
	tsRendererWasmUrl: "https://cdn.jsdelivr.net/npm/@myriaddreamin/typst-ts-renderer/pkg/typst_ts_renderer_bg.wasm"
};
export class TypsidianSettingTab extends PluginSettingTab {
	plugin: TypsidianPlugin;

	constructor(app: App, plugin: TypsidianPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		const titleContainer = containerEl.createEl("div");
		titleContainer.style.display = "flex";
		titleContainer.style.flexDirection = "column";
		titleContainer.style.alignItems = "baseline";
		titleContainer.style.justifyContent = "space-between";
		titleContainer.style.marginBottom = "10px";

		const title = titleContainer.createEl("img", {
			attr: {
				src: require("../assets/main-thin-content.gif"),
				width: "100%",
			},
		});
		title.style.margin = "0";
		titleContainer.createEl("a", {
			text: t("guide"),
			href: t("guideLink"),
		});

		new Setting(containerEl)
			.setName("typst.ts 编译器 wasm url")
			.addText((text) =>
				text
					.setValue(this.plugin.settings.webCompilerWasmUrl)
					.onChange(async (value) => {
						this.plugin.settings.webCompilerWasmUrl = value;
						await this.plugin.saveSettings();
					})
			);

		new Setting(containerEl)
			.setName("typst.ts 渲染器 wasm url")
			.addText((text) =>
				text
					.setValue(this.plugin.settings.tsRendererWasmUrl)
					.onChange(async (value) => {
						this.plugin.settings.tsRendererWasmUrl = value;
						await this.plugin.saveSettings();
					})
			);

		new Setting(containerEl)
			.setName(t("enableMathTypst"))
			.setDesc(t("enableMathTypstDesc"))
			.addToggle((toggle) =>
				toggle
					.setValue(this.plugin.settings.enableMathBlockTypst)
					.onChange(async (value) => {
						this.plugin.settings.enableMathBlockTypst = value;
						await this.plugin.saveSettings();
					})
			);
		new Setting(containerEl)
			.setName(t("enableInlineMathTypst"))
			.setDesc(t("enableInlineMathTypstDesc"))
			.addToggle((toggle) =>
				toggle
					.setValue(this.plugin.settings.enableInlineMathTypst)
					.onChange(async (value) => {
						this.plugin.settings.enableInlineMathTypst = value;
						await this.plugin.saveSettings();
					})
			);

		new Setting(containerEl)
			.setName(t("enableFallBackToTexInline"))
			.setDesc(t("enableFallBackToTexInlineDesc"))
			.addToggle((toggle) =>
				toggle
					.setValue(this.plugin.settings.enableFallBackToTexInline)
					.onChange(async (value) => {
						this.plugin.settings.enableFallBackToTexInline = value;
						await this.plugin.saveSettings();
					})
			);

		new Setting(containerEl)
			.setName(t("githubToken"))
			.setDesc(t("githubTokenDesc"))
			.addText((text) => {
				text.setPlaceholder("Github Token")
					.setValue(this.plugin.settings.githubToken)
					.onChange(async (value) => {
						this.plugin.settings.githubToken = value;
						await this.plugin.saveSettings();
					});
			});
		new Setting(containerEl)
			.setName(t("usrAndRepo"))
			.setDesc(t("usrAndRepoDesc"))
			.addText((text) => {
				text.setPlaceholder("user/repo")
					.setValue(this.plugin.settings.usrAndRepo)
					.onChange(async (value) => {
						this.plugin.settings.usrAndRepo = value;
						await this.plugin.saveSettings();
					});
			});
		new Setting(containerEl)
			.setName(t("uploadImageDir"))
			.setDesc(t("uploadImageDirDesc"))
			.addText((text) => {
				text.setPlaceholder("typst-images-obsidian")
					.setValue(this.plugin.settings.uploadImageDir)
					.onChange(async (value) => {
						this.plugin.settings.uploadImageDir = value;
						await this.plugin.saveSettings();
					});
			});
		new Setting(containerEl)
			.setName(t("supportLocalFonts"))
			.setDesc(t("supportLocalFontsDesc"))
			.addText((text) => {
				text.setPlaceholder(
					"PingFang SC, Microsoft YaHei, Noto Serif, Noto Sans, Noto Serif CJK SC, Noto Sans CJK ßSC"
				)
					.setValue(this.plugin.settings.supportLocalFonts)
					.onChange(async (value) => {
						this.plugin.settings.supportLocalFonts = value;
						await this.plugin.saveSettings();
					});
			});
		new Setting(containerEl)
			.setName(t("mathTypstTemplate"))
			.setDesc(t("mathTypstTemplateDesc"))
			.addTextArea((text) => {
				text.setPlaceholder(
					"#set(width: auto, height: auto, margin: 10pt) \n"
				)
					.setValue(this.plugin.settings.mathTypstTemplate)
					.onChange(async (value) => {
						this.plugin.settings.mathTypstTemplate = value;
						await this.plugin.saveSettings();
					});
			});

		// Custom Language Templates Section
		containerEl.createEl("h3", { text: t("customLanguageTemplates") });
		containerEl.createEl("p", { text: t("customLanguageTemplatesDesc") });

		// Add new template button
		new Setting(containerEl)
			.setName(t("addLanguageTemplate"))
			.addButton((button) => {
				button
					.setButtonText(t("addLanguageTemplate"))
					.setCta()
					.onClick(() => {
						const newTemplate: CustomLanguageTemplate = {
							language: "",
							template: t("exampleTemplate"),
							enabled: true,
						};
						this.plugin.settings.customLanguageTemplates.push(
							newTemplate
						);
						this.plugin.saveSettings();
						this.display(); // Refresh the settings UI
					});
			});

		// Display existing templates
		this.plugin.settings.customLanguageTemplates.forEach(
			(template, index) => {
				const templateContainer = containerEl.createDiv(
					"custom-language-template"
				);
				templateContainer.style.display = "flex";
				templateContainer.style.flexDirection = "column";
				templateContainer.style.background = "var(--interactive-hover)";
				templateContainer.style.padding = "0.5em 1em";
				templateContainer.style.borderRadius = "5px";

				// Language name setting
				new Setting(templateContainer)
					.setName(t("languageName"))
					.addText((text) => {
						text.setPlaceholder(t("languageNamePlaceholder"))
							.setValue(template.language)
							.onChange(async (value) => {
								template.language = value;
								await this.plugin.saveSettings();
							});
					});

				// Template content setting
				new Setting(templateContainer)
					.setName(t("template"))
					.addTextArea((text) => {
						text.setPlaceholder(t("templatePlaceholder"))
							.setValue(template.template)
							.onChange(async (value) => {
								template.template = value;
								await this.plugin.saveSettings();
							});
						text.inputEl.style.height = "100px";
					});

				// Enabled toggle and remove button
				const controlContainer =
					templateContainer.createDiv("template-controls");
				controlContainer.style.display = "flex";
				controlContainer.style.justifyContent = "space-between";
				controlContainer.style.alignItems = "center";

				// Enabled toggle
				new Setting(controlContainer)
					.setName(t("enabled"))
					.addToggle((toggle) => {
						toggle
							.setValue(template.enabled)
							.onChange(async (value) => {
								template.enabled = value;
								await this.plugin.saveSettings();
							});
					});

				// Remove button
				const removeButton = controlContainer.createEl("button", {
					text: t("remove"),
					cls: "mod-warning",
				});
				removeButton.onclick = async () => {
					this.plugin.settings.customLanguageTemplates.splice(
						index,
						1
					);
					await this.plugin.saveSettings();
					this.display(); // Refresh the settings UI
				};

				// Add separator
				const space = containerEl.createDiv();
				space.style.height = "1em";
			}
		);
	}
}
