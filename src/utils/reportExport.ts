import { domToPng } from 'modern-screenshot';
import { jsPDF } from 'jspdf';
import PptxGenJS from 'pptxgenjs';
import type { Report } from '../types/chart';
import { getBrandTheme } from '../theme/brands';

async function captureElement(element: HTMLElement): Promise<string> {
  const dataUrl = await domToPng(element, {
    scale: 3,
    backgroundColor: '#ffffff',
    style: { fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" },
  });
  if (!dataUrl) throw new Error('Capture returned empty');
  return dataUrl;
}

export async function exportReportPdf(report: Report, previewContainer: HTMLElement): Promise<void> {
  const slug = `${report.clientName || 'report'}-${report.title || 'untitled'}`.toLowerCase().replace(/[^a-z0-9]+/g, '-');

  const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
  const pageW = pdf.internal.pageSize.getWidth();
  const pageH = pdf.internal.pageSize.getHeight();
  const margin = 12;

  // Capture cover page
  const coverEl = previewContainer.querySelector('[data-report-cover]') as HTMLElement;
  if (coverEl) {
    const coverImg = await captureElement(coverEl);
    const cw = coverEl.offsetWidth;
    const ch = coverEl.offsetHeight;
    const scale = Math.min((pageW - margin * 2) / cw, (pageH - margin * 2) / ch);
    const imgW = cw * scale;
    const imgH = ch * scale;
    pdf.addImage(coverImg, 'PNG', (pageW - imgW) / 2, (pageH - imgH) / 2, imgW, imgH);
  }

  // Capture each chart page
  const chartEls = previewContainer.querySelectorAll('[data-report-chart]');
  for (let i = 0; i < chartEls.length; i++) {
    pdf.addPage();
    const el = chartEls[i] as HTMLElement;
    const img = await captureElement(el);
    const cw = el.offsetWidth;
    const ch = el.offsetHeight;
    const scale = Math.min((pageW - margin * 2) / cw, (pageH - margin * 2) / ch);
    const imgW = cw * scale;
    const imgH = ch * scale;
    pdf.addImage(img, 'PNG', (pageW - imgW) / 2, margin, imgW, imgH);

    // Page number footer
    pdf.setFontSize(8);
    pdf.setTextColor(155, 148, 136);
    pdf.text(`Page ${i + 2} of ${chartEls.length + 1}`, pageW / 2, pageH - 8, { align: 'center' });

    // Confidentiality footer
    const confLabel = report.confidentiality === 'internal' ? 'INTERNAL USE ONLY' : report.confidentiality === 'public' ? 'PUBLIC' : 'CONFIDENTIAL';
    pdf.text(confLabel, pageW - margin, pageH - 8, { align: 'right' });
  }

  pdf.save(`${slug}.pdf`);
}

export async function exportReportPptx(report: Report, previewContainer: HTMLElement): Promise<void> {
  const slug = `${report.clientName || 'report'}-${report.title || 'untitled'}`.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const theme = getBrandTheme(report.brandTheme ?? 'economist');

  const pres = new PptxGenJS();
  const slideW = 10;
  const slideH = 7.5;

  // Title slide
  const titleSlide = pres.addSlide();
  titleSlide.addShape('rect' as unknown as PptxGenJS.ShapeType, {
    x: 0, y: 0, w: slideW, h: 2.5,
    fill: { color: theme.masthead.background.replace('#', '') },
  });
  if (report.firmName) {
    titleSlide.addText(report.firmName, {
      x: 0.8, y: 0.5, w: 8.4, h: 0.4,
      fontSize: 10, fontFace: 'Helvetica Neue',
      color: 'FFFFFF', bold: true,
    });
  }
  titleSlide.addText(report.title || 'Untitled Report', {
    x: 0.8, y: report.firmName ? 1.0 : 0.7, w: 8.4, h: 1.0,
    fontSize: 24, fontFace: 'Helvetica Neue',
    color: 'FFFFFF', bold: true,
  });
  if (report.clientName) {
    titleSlide.addText(`Prepared for: ${report.clientName}`, {
      x: 0.8, y: 3.2, w: 8.4, h: 0.4,
      fontSize: 14, fontFace: 'Helvetica Neue', color: '1A1714',
    });
  }
  if (report.date) {
    titleSlide.addText(report.date, {
      x: 0.8, y: 3.8, w: 4, h: 0.3,
      fontSize: 11, fontFace: 'Helvetica Neue', color: '7A7468',
    });
  }
  const confLabel = report.confidentiality === 'internal' ? 'INTERNAL USE ONLY' : report.confidentiality === 'public' ? 'PUBLIC' : 'CONFIDENTIAL';
  titleSlide.addText(confLabel, {
    x: 0.8, y: 6.8, w: 8.4, h: 0.3,
    fontSize: 8, fontFace: 'Helvetica Neue', color: '9B9488', bold: true,
  });

  // Chart slides
  const chartEls = previewContainer.querySelectorAll('[data-report-chart]');
  for (let i = 0; i < chartEls.length; i++) {
    const el = chartEls[i] as HTMLElement;
    const img = await captureElement(el);
    const slide = pres.addSlide();

    const cw = el.offsetWidth;
    const ch = el.offsetHeight;
    const maxW = slideW - 1;
    const maxH = slideH - 1;
    const scale = Math.min(maxW / cw, maxH / ch);
    const imgW = cw * scale;
    const imgH = ch * scale;

    slide.addImage({
      data: img,
      x: (slideW - imgW) / 2,
      y: (slideH - imgH) / 2,
      w: imgW,
      h: imgH,
    });
  }

  await pres.writeFile({ fileName: `${slug}.pptx` });
}
