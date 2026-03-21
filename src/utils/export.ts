import { domToPng, domToSvg } from 'modern-screenshot';
import { jsPDF } from 'jspdf';
import PptxGenJS from 'pptxgenjs';

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

export async function exportPng(element: HTMLElement, filename = 'chart.png', pixelRatio = 3) {
  const dataUrl = await domToPng(element, {
    scale: pixelRatio,
    backgroundColor: '#ffffff',
    style: {
      fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
    },
  });
  if (!dataUrl) throw new Error('PNG export returned empty');
  downloadBlob(dataUrlToBlob(dataUrl), filename);
}

export async function exportSvg(element: HTMLElement, filename = 'chart.svg') {
  const dataUrl = await domToSvg(element, {
    backgroundColor: '#ffffff',
    style: {
      fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
    },
  });
  if (!dataUrl) throw new Error('SVG export returned empty');
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

export async function exportPdf(element: HTMLElement, filename = 'chart.pdf', title?: string) {
  const dataUrl = await domToPng(element, {
    scale: 4,
    backgroundColor: '#ffffff',
    style: { fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" },
  });
  if (!dataUrl) throw new Error('PDF capture failed');

  // Get element dimensions for proper aspect ratio
  const w = element.offsetWidth;
  const h = element.offsetHeight;
  const isLandscape = w > h;

  const pdf = new jsPDF({
    orientation: isLandscape ? 'landscape' : 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageW = pdf.internal.pageSize.getWidth();
  const pageH = pdf.internal.pageSize.getHeight();
  const margin = 15;
  const availW = pageW - margin * 2;
  const availH = pageH - margin * 2 - (title ? 12 : 0);

  // Scale chart to fit page
  const scale = Math.min(availW / w, availH / h);
  const imgW = w * scale;
  const imgH = h * scale;
  const x = (pageW - imgW) / 2;
  let y = margin;

  if (title) {
    pdf.setFontSize(12);
    pdf.setTextColor(26, 23, 20);
    pdf.text(title, pageW / 2, y + 6, { align: 'center' });
    y += 12;
  }

  pdf.addImage(dataUrl, 'PNG', x, y, imgW, imgH);
  pdf.save(filename);
}

export async function exportPptx(element: HTMLElement, filename = 'chart.pptx', title?: string) {
  const dataUrl = await domToPng(element, {
    scale: 4,
    backgroundColor: '#ffffff',
    style: { fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" },
  });
  if (!dataUrl) throw new Error('PPTX capture failed');

  const pres = new PptxGenJS();
  const slide = pres.addSlide();

  // Slide dimensions in inches (default 10x7.5)
  const slideW = 10;
  const slideH = 7.5;

  const w = element.offsetWidth;
  const h = element.offsetHeight;
  const margin = 0.5;
  const availW = slideW - margin * 2;
  const availH = slideH - margin * 2 - (title ? 0.6 : 0);

  const scale = Math.min(availW / w, availH / h);
  const imgW = w * scale;
  const imgH = h * scale;
  const x = (slideW - imgW) / 2;
  let y = margin;

  if (title) {
    slide.addText(title, {
      x: margin,
      y: margin,
      w: slideW - margin * 2,
      h: 0.5,
      fontSize: 14,
      fontFace: 'Helvetica Neue',
      color: '1A1714',
      bold: true,
      align: 'center',
    });
    y += 0.6;
  }

  slide.addImage({
    data: dataUrl,
    x,
    y,
    w: imgW,
    h: imgH,
  });

  await pres.writeFile({ fileName: filename });
}

export async function copyEmbedCode(element: HTMLElement): Promise<string> {
  const code = `<div style="max-width:620px;margin:0 auto">\n${element.outerHTML}\n</div>`;
  await navigator.clipboard.writeText(code);
  return code;
}
