import { $typst } from "@myriaddreamin/typst.ts";
import TypsidianPlugin from "main";
import { fontInit } from "./font";
import { converterGen } from "./converter";
import { t } from "./lang/helpers";
import { Menu, Notice } from "obsidian";

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
	statusBarItemEl.id = "typstdian-status";
	statusBarItemEl.setText(t("statusBarText"));
	plugin.addRibbonIcon("dice", "Open menu", (event) => {
		const menu = new Menu();

		menu.addItem((item) =>
			item
				.setTitle(t("typst2PNG"))
				.setIcon("documents")
				.onClick(() => converterGen(plugin, true))
		);
		menu.addItem((item) =>
			item
				.setTitle(t("typst2SVG"))
				.setIcon("documents")
				.onClick(() => converterGen(plugin, true))
		);

		menu.showAtMouseEvent(event);
	});
	plugin.addCommand({
		id: "duplicate-normal-note-with-png",
		name: t("duplicateNormalNoteWithPng"),
		editorCallback: converterGen(plugin, true),
	});
	plugin.addCommand({
		id: "duplicate-normal-note-with-svg",
		name: t("duplicateNormalNoteWithSvg"),
		editorCallback: converterGen(plugin, false),
	});
}
