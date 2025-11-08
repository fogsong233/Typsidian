const { mathjax } = require('mathjax-full/js/mathjax');
const { TeX } = require('mathjax-full/js/input/tex');
const { SVG } = require('mathjax-full/js/output/svg');
const { liteAdaptor } = require('mathjax-full/js/adaptors/liteAdaptor');
const { RegisterHTMLHandler } = require('mathjax-full/js/handlers/html');
const { AllPackages } = require('mathjax-full/js/input/tex/AllPackages');

// 1. 设置 MathJax 核心配置
const adaptor = liteAdaptor();
RegisterHTMLHandler(adaptor);

// 2. 创建核心组件
const tex = new TeX({
    packages: AllPackages, // 加载所有 TeX 宏包
});

const svg = new SVG({
    fontCache: 'none' // 禁用字体缓存，确保每次转换都是完整的 SVG
});

// 3. 创建 HTML 文档（用于 MathJax 内部渲染上下文）
const html = mathjax.document('', {
    InputJax: tex,
    OutputJax: svg,
});

/**
 * 将 TeX 字符串转换为 SVG 字符串
 * @param {string} texInput 要转换的 TeX 字符串（例如：'E = mc^2'）
 * @returns {string} 转换后的 SVG 字符串
 */
export function texToSvg(texInput: string, displayMode: boolean) {
    try {
        // 1. 创建 Math 节点，将 TeX 字符串解析成内部格式
        const math = html.convert(texInput, {
            display: displayMode,
            // display: false, // 行内公式模式
        });

        // 2. 将 Math 节点渲染成 SVG 字符串
        const svgString = adaptor.outerHTML(math);

        return svgString;

    } catch (error) {
        console.error('MathJax 转换错误:', error.message);
        // 返回一个错误提示或空字符串，具体取决于您的需求
        return `<svg xmlns="http://www.w3.org/2000/svg" style="color:red;">Error: ${error.message}</svg>`;
    }
}

// --- 多次调用示例 ---
// const svg1 = texToSvg('E = mc^2');
// console.log('--- 公式 1 (E=mc^2) ---');
// console.log(svg1.substring(0, 200) + '...'); // 打印前 200 个字符

// const svg2 = texToSvg('\\sum_{n=1}^{\\infty} \\frac{1}{n^2} = \\frac{\\pi^2}{6}');
// console.log('\n--- 公式 2 (Basel Problem) ---');
// console.log(svg2.substring(0, 200) + '...');

// 4. 如果需要，您还可以检查转换结果的完整性
// console.log(svg1);
// console.log(svg2);