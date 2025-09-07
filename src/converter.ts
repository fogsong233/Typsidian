#!/usr/bin/env node
import { Octokit } from "@octokit/rest";
import { randomUUID } from "crypto";
import TypsidianPlugin from "main";
import remarkMath from "remark-math";
import remarkParse from "remark-parse";
import remarkStringify from "remark-stringify";
import { typst2tex } from "tex2typst";
import { unified } from "unified";
import Base64 from "./base64";
import { Editor, MarkdownView, Notice } from "obsidian";
import remarkFrontmatter from "remark-frontmatter";
import { $typst } from "@myriaddreamin/typst.ts/dist/esm/contrib/snippet.mjs";
import { t } from "./lang/helpers";
interface MDNode {
	type: string;
	children?: MDNode[];
	value?: string;
	url?: string;
	lang?: string;
}

class GithubUploader {
	private octokit: Octokit;
	private owner: string;
	private repo: string;

	constructor(token: string, userAndRepo: string) {
		this.octokit = new Octokit({ auth: token });
		const [owner, repo] = userAndRepo.split("/");
		this.owner = owner;
		this.repo = repo;
	}

	async checkValid() {
		try {
			await this.octokit.repos.get({
				owner: this.owner,
				repo: this.repo,
			});
			return true;
		} catch (error) {
			console.error("Invalid GitHub repository or token:", error);
			return false;
		}
	}

	async uploadTo(path: string, textContentBase64: string): Promise<string> {
		try {
			await this.octokit.repos.createOrUpdateFileContents({
				owner: this.owner,
				repo: this.repo,
				path,
				message: `Upload file: ${path}`,
				content: textContentBase64,
				branch: "main",
			});
			const contentLink = `https://raw.githubusercontent.com/${this.owner}/${this.repo}/main/${path}`;
			return contentLink;
		} catch (error) {
			console.error("Error uploading file to GitHub:", error);
			return "";
		}
	}
}

async function typstToPngBase64(typstContent: string): Promise<string> {
	const div = document.createElement("div");
	await $typst.canvas(div, { mainContent: typstContent });
	const canvas = div.querySelectorAll("canvas")[0];
	const pngBase64 = canvas.toDataURL("image/png").split(",")[1];
	return pngBase64;
}
async function initGithubUploader(
	plugin: TypsidianPlugin
): Promise<GithubUploader> {
	const uploader = new GithubUploader(
		plugin.settings.githubToken,
		plugin.settings.usrAndRepo
	);
	if (!(await uploader.checkValid())) {
		throw new Error("Invalid GitHub repository or token.");
	}
	return uploader;
}
async function processNodes(
	tree: MDNode,
	plugin: TypsidianPlugin,
	uploader: GithubUploader,
	config: { convertToPng: boolean }
) {
	await visit<MDNode>(
		tree,
		(node) => node.children || [],
		async (node) => {
			if (isTypstCode(node, plugin)) {
				return await handleTypstNode(node, plugin, uploader, config);
			}
			if (isLatexNode(node)) {
				node.type = "math"; // normalize latex
			}
			if (isTypstMath(node, plugin)) {
				return await handleTypstMath(node, plugin, uploader, config);
			}
		}
	);
}

function isLatexNode(node: MDNode): boolean {
	return node.type === "code" && node.lang === "t-latex";
}

function isTypstCode(node: MDNode, plugin: TypsidianPlugin): boolean {
	return (
		node.type === "code" &&
		plugin.settings.customLanguageTemplates
			.map((it) => it.language.trim())
			.includes(node.lang)
	);
}

function isTypstMath(node: MDNode, plugin: TypsidianPlugin): boolean {
	return (
		(node.type === "math" && plugin.settings.enableMathBlockTypst) ||
		(node.type === "inlineMath" && plugin.settings.enableInlineMathTypst)
	);
}

async function uploadGithubAndGetLink(
	raw: string,
	plugin: TypsidianPlugin,
	uploader: GithubUploader,
	config: { convertToPng: boolean }
) {
	const imgPath = `${
		plugin.settings.uploadImageDir
	}/${Date.now()}-${randomUUID()}.${config.convertToPng ? "png" : "svg"}`;

	let imgBase64: string;
	if (config.convertToPng) {
		imgBase64 = await typstToPngBase64(raw);
	} else {
		const svgText = await $typst.svg({
			mainContent: raw,
			data_selection: {
				js: false,
				body: true,
				css: true,
				defs: true,
			},
		});
		imgBase64 = Base64.encode(svgText);
	}
	const link = await uploader.uploadTo(imgPath, imgBase64);
	new Notice("Upload img: " + link);
	return link;
}

async function handleTypstNode(
	node: MDNode,
	plugin: TypsidianPlugin,
	uploader: GithubUploader,
	config: { convertToPng: boolean }
): Promise<MDNode> {
	const source =
		plugin.settings.customLanguageTemplates
			.find((it) => it.language.trim() === node.lang)
			?.template.replace("{IsDarkMode}", "false")
			.replace("{content}", node.value) ?? "";

	return {
		type: "paragraph",
		children: [
			{
				type: "image",
				url: await uploadGithubAndGetLink(
					source,
					plugin,
					uploader,
					config
				),
			},
		],
	};
}

async function handleTypstMath(
	node: MDNode,
	plugin: TypsidianPlugin,
	uploader: GithubUploader,
	config: { convertToPng: boolean }
): Promise<MDNode> {
	if (node.type === "math") {
		return {
			type: "paragraph",
			children: [
				{
					type: "image",
					url: await uploadGithubAndGetLink(
						plugin.settings.mathTypstTemplate.replace(
							"{IsDarkMode}",
							"false"
						) +
							"\n \n $ " +
							node.value +
							" $",
						plugin,
						uploader,
						config
					),
				},
			],
		};
	}
	if (node.type === "inlineMath" && plugin.settings.enableInlineMathTypst) {
		try {
			await $typst.svg({ mainContent: node.value });
			node.value = typst2tex(node.value).replace("\n", " ");
		} catch {}
	}
	return node;
}

async function transformMDWithoutTypst(
	plugin: TypsidianPlugin,
	mdText: string,
	config: { convertToPng: boolean } = { convertToPng: false }
): Promise<string> {
	const githubUploader = await initGithubUploader(plugin);

	const mdProcessor = unified()
		.use(remarkParse)
		.use(remarkMath)
		.use(() => async (tree: MDNode) => {
			await processNodes(tree, plugin, githubUploader, config);
		})
		.use(remarkStringify)
		.use(remarkFrontmatter, ["yaml"]);

	const mdRes = await mdProcessor.process(mdText);
	return String(mdRes);
}

async function visit<E>(
	root: E,
	getChildren: (node: E) => E[],
	visitor: (node: E) => Promise<E | void>
) {
	const stack: E[] = [];
	const newRoot = await visitor(root);
	if (newRoot !== undefined) {
		stack.push(newRoot as E);
	} else {
		stack.push(root);
	}
	while (stack.length > 0) {
		const parentNode = stack.pop()!;
		const children = getChildren(parentNode);
		for (const [index, child] of children.entries()) {
			const newChild = await visitor(child);
			if (newChild !== undefined) {
				children[index] = newChild as E;
				stack.push(newChild as E);
			} else {
				stack.push(child);
			}
		}
	}
}

export function converterGen(
	plugin: TypsidianPlugin,
	convertToPng: boolean
): (editor: Editor, view: MarkdownView) => Promise<void> {
	return async (editor: Editor, view: MarkdownView) => {
		const el = document.getElementById("typstdian-status");
		try {
			new Notice("processing...");
			el.setText(t("uploading"));
			const newMDText = await transformMDWithoutTypst(
				plugin,
				editor.getValue(),
				{ convertToPng }
			);
			const newFilePath =
				view.file?.path.split(".").slice(0, -1).join() +
				`-notypst${convertToPng ? "png" : "svg"}.md`;
			this.app.vault.create(newFilePath, newMDText);
			el.setText(t("uploadOK"));
			new Notice("Successfully created");
		} catch (error) {
			new Notice(
				"Error when duplicating note with typst transformed: " + error
			);
		} finally {
			setTimeout(() => {
				el.setText(t("statusBarText"));
			}, 3000);
		}
	};
}
