import MyPlugin from "main";
import { App, PluginSettingTab, Setting } from "obsidian";

export interface MyPluginSettings {
	enableMathTypst: boolean;
	enableInlineMathTypst: boolean;
	enableTypstRenderCode: boolean; // typrender
	enableTypst2TexInMath: boolean;
	enableFallBackToTex: boolean;
	githubToken: string;
	mathTypstTemplate: string;
	typstRenderCodeTemplate: string;
	usrAndRepo: string; //"xxx/xxx"
	uploadImageDir: string;
}

export const DEFAULT_SETTINGS: MyPluginSettings = {
	enableMathTypst: true,
	enableInlineMathTypst: true,
	enableTypstRenderCode: true,
	enableTypst2TexInMath: true,
	enableFallBackToTex: false,
	githubToken: "",
	usrAndRepo: "user/repo",
	uploadImageDir: "typst-images-obsidian",
	mathTypstTemplate:
		"#set page(width: auto, height: auto, margin: 10pt) \n #set text(size: 16pt) \n",
	typstRenderCodeTemplate:
		"#set page(width: auto, height: auto, margin: 10pt) \n #set text(size: 16pt) \n",
};
export class MySettingTab extends PluginSettingTab {
	plugin: MyPlugin;

	constructor(app: App, plugin: MyPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName("段落latex转换成Typst")
			.setDesc("$$ $$内容被转换typst代码,导出默认用png图片")
			.addToggle((toggle) =>
				toggle
					.setValue(this.plugin.settings.enableMathTypst)
					.onChange(async (value) => {
						this.plugin.settings.enableMathTypst = value;
						await this.plugin.saveSettings();
					})
			);
		new Setting(containerEl)
			.setName("行内latex转换成Typst")
			.setDesc("$$内容被转换typst代码， 导出时用tex导出")
			.addToggle((toggle) =>
				toggle
					.setValue(this.plugin.settings.enableInlineMathTypst)
					.onChange(async (value) => {
						this.plugin.settings.enableInlineMathTypst = value;
						await this.plugin.saveSettings();
					})
			);
		new Setting(containerEl)
			.setName("开启Typst code渲染代码")
			.setDesc("```typrender```内容自动转为typst渲染，导出为png")
			.addToggle((toggle) =>
				toggle
					.setValue(this.plugin.settings.enableTypstRenderCode)
					.onChange(async (value) => {
						this.plugin.settings.enableTypstRenderCode = value;
						await this.plugin.saveSettings();
					})
			);
		new Setting(containerEl)
			.setName("段落数学模式下的Typst代码导出为latex公式")
			.setDesc("")
			.addToggle((toggle) =>
				toggle
					.setValue(this.plugin.settings.enableTypst2TexInMath)
					.onChange(async (value) => {
						this.plugin.settings.enableTypst2TexInMath = value;
						await this.plugin.saveSettings();
					})
			);
		new Setting(containerEl)
			.setName("Typst代码转换失败时回退到tex")
			.setDesc("如果开启，Typst代码转换失败时回退到tex")
			.addToggle((toggle) =>
				toggle
					.setValue(this.plugin.settings.enableFallBackToTex)
					.onChange(async (value) => {
						this.plugin.settings.enableFallBackToTex = value;
						await this.plugin.saveSettings();
					})
			);
		new Setting(containerEl)
			.setName("Github Token")
			.setDesc("Github Token, 用于上传图片到github")
			.addText((text) => {
				text.setPlaceholder("Github Token")
					.setValue(this.plugin.settings.githubToken)
					.onChange(async (value) => {
						this.plugin.settings.githubToken = value;
						await this.plugin.saveSettings();
					});
			});
		new Setting(containerEl)
			.setName("Github 用户名/仓库")
			.setDesc("Github 用户名/仓库, 用于上传图片到github")
			.addText((text) => {
				text.setPlaceholder("user/repo")
					.setValue(this.plugin.settings.usrAndRepo)
					.onChange(async (value) => {
						this.plugin.settings.usrAndRepo = value;
						await this.plugin.saveSettings();
					});
			});
		new Setting(containerEl)
			.setName("上传图片目录")
			.setDesc("上传图片目录, 用于上传图片到github")
			.addText((text) => {
				text.setPlaceholder("typst-images-obsidian")
					.setValue(this.plugin.settings.uploadImageDir)
					.onChange(async (value) => {
						this.plugin.settings.uploadImageDir = value;
						await this.plugin.saveSettings();
					});
			});
		new Setting(containerEl)
			.setName("段落Typst模板")
			.setDesc("段落Typst前缀")
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
		new Setting(containerEl)
			.setName("Typst渲染代码模板")
			.setDesc("Typst渲染代码前缀")
			.addTextArea((text) => {
				text.setPlaceholder(
					"#set(width: auto, height: auto, margin: 10pt) \n"
				)
					.setValue(this.plugin.settings.typstRenderCodeTemplate)
					.onChange(async (value) => {
						this.plugin.settings.typstRenderCodeTemplate = value;
						await this.plugin.saveSettings();
					});
			});
	}
}
