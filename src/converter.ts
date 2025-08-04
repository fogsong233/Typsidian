#!/usr/bin/env node
import { Octokit } from "@octokit/rest";
import { randomUUID } from "crypto";
import MyPlugin from "main";
import remarkMath from "remark-math";
import remarkParse from "remark-parse";
import remarkStringify from "remark-stringify";
import { typst2tex } from "tex2typst";
import { unified } from "unified";
import Base64 from "./base64";
import { $typst } from "@myriaddreamin/typst.ts";
import { Editor, MarkdownView, Notice } from "obsidian";
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

function svgToPngBase64(svgText: string): Promise<string> {
	const svg = new Blob([svgText], { type: "image/svg+xml" });
	const url = URL.createObjectURL(svg);

	return new Promise((resolve, reject) => {
		const img = new Image();
		img.onload = function () {
			const canvas = document.createElement("canvas");
			const ctx = canvas.getContext("2d");

			canvas.width = img.width;
			canvas.height = img.height;

			ctx.drawImage(img, 0, 0);

			const pngBase64 = canvas.toDataURL("image/png");
			resolve(pngBase64.split("data:image/png;base64,")[0]);
		};
		img.onerror = reject;
		img.src = url;
	});
}

export async function transformMDWithoutTypst(
	plugin: MyPlugin,
	mdText: string,
	config: { convertToPng: boolean } = { convertToPng: false }
): Promise<string> {
	const githubUploader = new GithubUploader(
		plugin.settings.githubToken,
		plugin.settings.usrAndRepo
	);
	if ((await githubUploader.checkValid()) === false) {
		throw new Error("Invalid GitHub repository or token.");
	}
	const mdProcessor = unified()
		.use(remarkParse)
		.use(remarkMath)
		.use(() => async (tree: MDNode) => {
			await visit<MDNode>(
				tree,
				(node) => node.children || [],
				async (node) => {
					new Notice(`Processing node: ${node}`);
					const imgPath = `${
						plugin.settings.uploadImageDir
					}/${Date.now()}-${randomUUID()}.${
						config.convertToPng ? "png" : "svg"
					}`;

					// convert to svg or png
					if (
						(node.type === "code" &&
							node.lang === "typrender" &&
							plugin.settings.enableTypstRenderCode) ||
						(node.type === "math" &&
							plugin.settings.enableMathTypst &&
							!!plugin.settings.enableFallBackToTex)
					) {
						const source = node.value || "";
						const svgText = await $typst.svg({
							mainContent: `${plugin.settings.typstRenderCodeTemplate} \n ${source}`,
						});
						let imgBase64 = "";
						if (config.convertToPng) {
							imgBase64 = await svgToPngBase64(svgText);
						} else {
							imgBase64 = Base64.encode(svgText);
						}
						const link = await githubUploader.uploadTo(
							imgPath,
							imgBase64
						);
						const imgNode: MDNode = {
							type: "image",
							url: link,
						};
						node.type = "paragraph";
						node.children = [imgNode];
						return node;
					}

					// convert to latex
					if (
						(node.type === "math" &&
							plugin.settings.enableMathTypst &&
							plugin.settings.enableTypst2TexInMath) ||
						(node.type === "inlineMath" &&
							plugin.settings.enableInlineMathTypst)
					) {
						if (plugin.settings.enableInlineMathTypst) {
							const content = node.value || "";
							node.value = typst2tex(content);
						}
						return node;
					}
				}
			);
		})
		.use(remarkStringify);
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
	convertToPng: boolean
): (editor: Editor, view: MarkdownView) => Promise<void> {
	return async (editor: Editor, view: MarkdownView) => {
		try {
			const newMDText = await transformMDWithoutTypst(
				this,
				editor.getValue(),
				{ convertToPng }
			);
			const newFilePath = view.file?.path.split(".")[0] + "-notypst.md";
			this.app.vault.create(newFilePath, newMDText);
		} catch (error) {
			new Notice(
				"Error duplicating note with typst transformed: " + error
			);
		}
	};
}
