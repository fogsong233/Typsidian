// English
export default {
	// Plugin info
	pluginName: "Typsidian",
	pluginDescription:
		"Typsidian is a plugin, which provides related functions of [typst](https://typst.app), such as correct display of typst code, export non-typst markdown file for other markdown platform.",

	// Settings
	enableMathTypst: "Convert block LaTeX to Typst",
	enableMathTypstDesc:
		"$$ $$ content is converted to typst code, exported as PNG by default",
	enableInlineMathTypst: "Convert inline LaTeX to Typst",
	enableInlineMathTypstDesc:
		"$ $ content is converted to typst code, exported as tex",
	enableFallBackToTexInline:
		"Fallback to tex when Typst inline code conversion fails",
	enableFallBackToTexInlineDesc:
		"If enabled, fallback to tex when Typst code conversion fails",
	enableFallBackToTexBlock:
		"Fallback to tex when Typst block code conversion fails",
	enableFallBackToTexBlockDesc:
		"If enabled, fallback to tex when Typst code conversion fails",
	githubToken: "Github Token",
	githubTokenDesc: "Github Token, used for uploading images to github",
	usrAndRepo: "Github Username/Repository",
	usrAndRepoDesc:
		"Github Username/Repository, used for uploading images to github",
	uploadImageDir: "Upload Image Directory",
	uploadImageDirDesc:
		"Upload Image Directory, used for uploading images to github",
	supportLocalFonts: "Add local fonts to typst",
	supportLocalFontsDesc:
		"Local font names, ignored by default if not found, separated by commas",
	mathTypstTemplate: "Math Block Typst Template",
	mathTypstTemplateDesc: "Math Block Typst prefix",
	typstRenderCodeTemplate: "Typst Render Code Template",
	typstRenderCodeTemplateDesc: "Typst render code prefix",

	// Commands
	duplicateNormalNoteWithPng:
		"Duplicate a normal note with typst transformed, img is png format",
	duplicateNormalNoteWithSvg:
		"Duplicate a normal note with typst transformed, img is svg format",

	// Status bar
	statusBarText: "typsidian √",

	// Errors
	illegalTypstMathCode: "illegal typst math code.",

	// Custom Language Templates
	customLanguageTemplates: "Custom Language Templates",
	customLanguageTemplatesDesc:
		"Add custom language formats for Typst rendering. Use {content} as placeholder for user input.",
	addLanguageTemplate: "Add Language Template",
	languageName: "Language Name",
	languageNamePlaceholder: "e.g., typstblock, typstmath, typstdiagram",
	template: "Template",
	templatePlaceholder: "Use {content} as placeholder for user input",
	enabled: "Enabled",
	remove: "Remove",
	exampleTemplate:
		"#set page(width: auto, height: auto, margin: 10pt)\n#set text(size: 16pt)\n{content}",
	guide: "Guide",
	guideLink: "https://github.com/fogsong233/Typsidian",
	uploading: "uploading...",
	uploadOK: "Okay √",

	typst2PNG: "export typst to png",
	typst2SVG: "export typst to svg",
};
