import { $typst } from "@myriaddreamin/typst.ts";
import TypsidianPlugin from "main";
import { fontInit } from "./font";
import { converterGen } from "./converter";
import { t } from "./lang/helpers";

export async function initTypst(plugin: TypsidianPlugin) {
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
	await fontInit(plugin.settings.supportLocalFonts);
}

export function regCmds(plugin: TypsidianPlugin) {
	const statusBarItemEl = plugin.addStatusBarItem();
	statusBarItemEl.setText(t("statusBarText"));

	plugin.addCommand({
		id: "duplicate-normal-note-with-png",
		name: t("duplicateNormalNoteWithPng"),
		editorCallback: converterGen(this, true),
	});
	plugin.addCommand({
		id: "duplicate-normal-note-with-svg",
		name: t("duplicateNormalNoteWithSvg"),
		editorCallback: converterGen(this, false),
	});
}
