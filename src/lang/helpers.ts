import { moment } from "obsidian";
import en from "./locale/en";
import zhCN from "./locale/zh-cn";
import zhTW from "./locale/zh-tw";

const localeMap: { [key: string]: Partial<typeof en> } = {
	en,
	"zh-cn": zhCN,
	"zh-tw": zhTW,
};

const locale = localeMap[moment.locale()];

export function t(str: keyof typeof en): string {
	return (locale && locale[str]) || en[str];
}

