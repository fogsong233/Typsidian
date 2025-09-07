// 简体中文
export default {
	// Plugin info
	pluginName: "Typsidian",
	pluginDescription:
		"Typsidian 是一个插件，提供 [typst](https://typst.app) 相关功能，如正确显示 typst 代码、导出非 typst markdown 文件到其他 markdown 平台。",

	// Settings
	enableMathTypst: "段落latex转换成Typst",
	enableMathTypstDesc: "$$ $$内容被转换typst代码,导出默认用png图片",
	enableInlineMathTypst: "行内latex转换成Typst",
	enableInlineMathTypstDesc: "$$内容被转换typst代码， 导出时用tex导出",
	enableTypstRenderCode: "开启Typst code渲染代码",
	enableTypstRenderCodeDesc:
		"```typrender```内容自动转为typst渲染，导出为png",
	enableTypst2TexInMath: "段落数学模式下的Typst代码导出为latex公式",
	enableTypst2TexInMathDesc: "",
	enableFallBackToTexInline: "Typst inline代码转换失败时回退到tex",
	enableFallBackToTexInlineDesc: "如果开启，Typst代码转换失败时回退到tex",
	enableFallBackToTexBlock: "Typst block代码转换失败时回退到tex",
	enableFallBackToTexBlockDesc: "如果开启，Typst代码转换失败时回退到tex",
	githubToken: "Github Token",
	githubTokenDesc: "Github Token, 用于上传图片到github",
	usrAndRepo: "Github 用户名/仓库",
	usrAndRepoDesc: "Github 用户名/仓库, 用于上传图片到github",
	uploadImageDir: "上传图片目录",
	uploadImageDirDesc: "上传图片目录, 用于上传图片到github",
	supportLocalFonts: "向 typst 添加本地字体",
	supportLocalFontsDesc: "本地字体的字体名, 没有会默认忽略, 用逗号分隔",
	mathTypstTemplate: "段落Typst模板",
	mathTypstTemplateDesc: "段落Typst前缀",
	typstRenderCodeTemplate: "Typst渲染代码模板",
	typstRenderCodeTemplateDesc: "Typst渲染代码前缀",

	// Commands
	duplicateNormalNoteWithPng: "复制普通笔记并转换为typst，图片格式为png",
	duplicateNormalNoteWithSvg: "复制普通笔记并转换为typst，图片格式为svg",

	// Status bar
	statusBarText: "typsidian √",

	// Errors
	illegalTypstMathCode: "非法的 typst 数学代码。",

	// Custom Language Templates
	customLanguageTemplates: "自定义语言模板",
	customLanguageTemplatesDesc:
		"添加自定义语言格式用于 Typst 渲染。使用 {content} 作为用户输入的占位符。",
	addLanguageTemplate: "添加语言模板",
	languageName: "语言名称",
	languageNamePlaceholder: "例如：typstblock, typstmath, typstdiagram",
	template: "模板",
	templatePlaceholder: "使用 {content} 作为用户输入的占位符",
	enabled: "启用",
	remove: "删除",
	exampleTemplate:
		"#set page(width: auto, height: auto, margin: 10pt)\n#set text(size: 16pt)\n{content}",
};
