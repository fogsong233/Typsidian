![](./res/title.gif)
Typsidian is a plugin of [Obsidian](https://obsidian.md/), which provides releted functions of [typst](https://typst.app), suchs as correct display of typst code, export 
non-typst markdown file for other markdown platform.

中文介绍看这里:  施工中

You can modify settings to make any of `$..$`, `$$...$$`,
```
```typrender
...
```
```
display typst code rather than latex code, and it provides
that when typst parsing gets errors, display automatically
return to latex(please enable it in settings).

And when you are focus on a note, open command panel:

![](./res/image.png)
run them will duplicate file of active editor with typst code automatically transformed to latex or image(png/svg,
uploaded to github, therefore you should ensure you add 
your token and other relevant setting items, otherwise it goes wrong).

Feel free to issue.

#### TODO:
- internation support.
- new converter from typst to latex.

#### Acknowledge
- For developers of these libraries and tools.
```
"@types/node": "^16.11.6",
"@typescript-eslint/eslint-plugin": "5.29.0",
"@typescript-eslint/parser": "5.29.0",
"builtin-modules": "3.3.0",
"esbuild": "0.17.3",
"obsidian": "latest",
"tslib": "2.4.0",
"typescript": "4.7.4"
"@myriaddreamin/typst-ts-renderer": "0.6.1-rc2",
"@myriaddreamin/typst-ts-web-compiler": "0.6.1-rc2",
"@myriaddreamin/typst.ts": "0.6.1-rc2",
"@octokit/rest": "^22.0.0",
"remark-frontmatter": "^5.0.0",
"remark-math": "^6.0.0",
"remark-parse": "^11.0.0",
"remark-stringify": "^11.0.0",
"sharp": "^0.34.3",
"tex2typst": "^0.3.9",
"unified": "^11.0.5"
```
- [zhihu on Obsidian](https://github.com/dongguaguaguagua/zhihu_obsidian)
