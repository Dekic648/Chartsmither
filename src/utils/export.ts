import { toPng, toSvg } from 'html-to-image';
import { saveAs } from 'file-saver';

export async function exportPng(element: HTMLElement, filename = 'chart.png') {
  const dataUrl = await toPng(element, {
    pixelRatio: 3,
    backgroundColor: '#ffffff',
    style: {
      // Ensure fonts render in export
      fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
    },
  });
  saveAs(dataUrl, filename);
}

export async function exportSvg(element: HTMLElement, filename = 'chart.svg') {
  const dataUrl = await toSvg(element, {
    backgroundColor: '#ffffff',
    style: {
      fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
    },
  });
  saveAs(dataUrl, filename);
}

export function exportHtml(element: HTMLElement, filename = 'chart.html') {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Chart — ChartCraft</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background: #fff; display: flex; justify-content: center; padding: 24px; }
</style>
</head>
<body>
${element.outerHTML}
</body>
</html>`;
  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  saveAs(blob, filename);
}

export function copyEmbedCode(element: HTMLElement): string {
  const code = `<div style="max-width:620px;margin:0 auto">\n${element.outerHTML}\n</div>`;
  navigator.clipboard.writeText(code);
  return code;
}
