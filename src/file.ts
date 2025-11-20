import TypsidianPlugin from "main";
import * as path from "path";

export async function loadPluginResource(
	plugin: TypsidianPlugin,
	fileName: string
) {
	// 获取当前插件的目录路径
	// 注意：manifest.id 是你在 manifest.json 里定义的 id
	const pluginDir = path.join(
		plugin.app.vault.configDir,
		"plugins",
		plugin.manifest.name,
		"typst"
	);
	const filePath = path.join(pluginDir, fileName);

	try {
		const buffer = await plugin.app.vault.adapter.readBinary(filePath);
		return buffer;
	} catch (e) {
		console.error("Failed to load resource:", e);
	}
}
