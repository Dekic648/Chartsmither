import { toPng, toSvg } from 'html-to-image';

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function dataUrlToBlob(dataUrl: string): Blob {
  const [header, base64] = dataUrl.split(',');
  const mime = header.match(/:(.*?);/)?.[1] || 'application/octet-stream';
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return new Blob([bytes], { type: mime });
}

export async function exportPng(element: HTMLElement, filename = 'chart.png') {
  const dataUrl = await toPng(element, {
    pixelRatio: 3,
    backgroundColor: '#ffffff',
    style: {
      fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
    },
  });
  downloadBlob(dataUrlToBlob(dataUrl), filename);
}

export async function exportSvg(element: HTMLElement, filename = 'chart.svg') {
  const dataUrl = await toSvg(element, {
    backgroundColor: '#ffffff',
    style: {
      fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
    },
  });
  // toSvg returns a data URL; extract the SVG markup
  const svgText = decodeURIComponent(dataUrl.split(',')[1] || '');
  const blob = new Blob([svgText], { type: 'image/svg+xml;charset=utf-8' });
  downloadBlob(blob, filename);
}

export function exportHtml(element: HTMLElement, filename = 'chart.html') {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Chart — Chartsmither</title>
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
  downloadBlob(blob, filename);
}

export async function copyEmbedCode(element: HTMLElement): Promise<string> {
  const code = `<div style="max-width:620px;margin:0 auto">\n${element.outerHTML}\n</div>`;
  await navigator.clipboard.writeText(code);
  return code;
}
