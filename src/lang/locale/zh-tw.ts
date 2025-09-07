// 繁體中文
export default {
	// Plugin info
	pluginName: "Typsidian",
	pluginDescription:
		"Typsidian 是一個插件，提供 [typst](https://typst.app) 相關功能，如正確顯示 typst 代碼、匯出非 typst markdown 檔案到其他 markdown 平台。",

	// Settings
	enableMathTypst: "段落latex轉換成Typst",
	enableMathTypstDesc: "$$ $$內容被轉換typst代碼,匯出預設用png圖片",
	enableInlineMathTypst: "行內latex轉換成Typst",
	enableInlineMathTypstDesc: "$$內容被轉換typst代碼， 匯出時用tex匯出",
	enableFallBackToTexInline: "Typst inline代碼轉換失敗時回退到tex",
	enableFallBackToTexInlineDesc: "如果開啟，Typst代碼轉換失敗時回退到tex",
	enableFallBackToTexBlock: "Typst block代碼轉換失敗時回退到tex",
	enableFallBackToTexBlockDesc: "如果開啟，Typst代碼轉換失敗時回退到tex",
	githubToken: "Github Token",
	githubTokenDesc: "Github Token, 用於上傳圖片到github",
	usrAndRepo: "Github 用戶名/倉庫",
	usrAndRepoDesc: "Github 用戶名/倉庫, 用於上傳圖片到github",
	uploadImageDir: "上傳圖片目錄",
	uploadImageDirDesc: "上傳圖片目錄, 用於上傳圖片到github",
	supportLocalFonts: "向 typst 添加本地字體",
	supportLocalFontsDesc: "本地字體的字體名, 沒有會預設忽略, 用逗號分隔",
	mathTypstTemplate: "段落Typst模板",
	mathTypstTemplateDesc: "段落Typst前綴",
	typstRenderCodeTemplate: "Typst渲染代碼模板",
	typstRenderCodeTemplateDesc: "Typst渲染代碼前綴",

	// Commands
	duplicateNormalNoteWithPng: "複製普通筆記並轉換為typst，圖片格式為png",
	duplicateNormalNoteWithSvg: "複製普通筆記並轉換為typst，圖片格式為svg",

	// Status bar
	statusBarText: "typsidian √",

	// Errors
	illegalTypstMathCode: "非法的 typst 數學代碼。",

	// Custom Language Templates
	customLanguageTemplates: "自定義語言模板",
	customLanguageTemplatesDesc:
		"添加自定義語言格式用於 Typst 渲染。使用 {content} 作為用戶輸入的佔位符。",
	addLanguageTemplate: "添加語言模板",
	languageName: "語言名稱",
	languageNamePlaceholder: "例如：typstblock, typstmath, typstdiagram",
	template: "模板",
	templatePlaceholder: "使用 {content} 作為用戶輸入的佔位符",
	enabled: "啟用",
	remove: "刪除",
	exampleTemplate:
		"#set page(width: auto, height: auto, margin: 10pt)\n#set text(size: 16pt)\n{content}",
	guide: "指南",
	guideLink: "https://zhuanlan.zhihu.com/p/1936210614520361485",
	uploading: "上传中...",
	uploadOK: "成功",
};
