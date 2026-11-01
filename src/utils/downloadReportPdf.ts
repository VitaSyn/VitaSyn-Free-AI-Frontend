export async function downloadReportPdf(element: HTMLElement, filename: string) {
  const { default: html2pdf } = await import('html2pdf.js');
  const safeFilename = filename
    .replace(/[<>:"/\\|?*\u0000-\u001f]/g, '-')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '') || 'assessment-report';

  const exportElement = element.cloneNode(true) as HTMLElement;
  exportElement.style.position = 'fixed';
  exportElement.style.left = '-10000px';
  exportElement.style.top = '0';
  exportElement.style.width = '640px';
  exportElement.style.maxWidth = 'none';
  exportElement.style.height = 'auto';
  exportElement.style.maxHeight = 'none';
  exportElement.style.overflow = 'visible';
  exportElement.scrollTop = 0;
  exportElement.scrollLeft = 0;
  exportElement.querySelectorAll<HTMLElement>('*').forEach((child) => {
    child.scrollTop = 0;
    child.scrollLeft = 0;
  });
  document.body.appendChild(exportElement);

  let pdfBlob: Blob;
  try {
    pdfBlob = await html2pdf()
      .set({
        margin: [10, 10, 10, 10],
        image: { type: 'jpeg', quality: 0.94 },
        html2canvas: {
          scale: 2.5,
          useCORS: true,
          backgroundColor: '#ffffff',
          windowWidth: 640,
          onclone: (clonedDocument: Document, clonedElement: HTMLElement) => {
            clonedDocument.documentElement.classList.remove('dark');
            clonedDocument.body.classList.remove('dark');

            const report = clonedElement.matches('[data-pdf-report]')
              ? clonedElement
              : clonedDocument.querySelector<HTMLElement>('.html2pdf__container [data-pdf-report]');
            if (!report) throw new Error('Could not find the report content to export.');

            report.classList.add('pdf-export-root');
            report.style.width = '640px';
            report.style.maxWidth = 'none';
            report.style.height = 'auto';
            report.style.maxHeight = 'none';
            report.style.overflow = 'visible';
            report.style.position = 'static';
            report.style.padding = '32px';
            report.style.backgroundColor = '#ffffff';
            report.style.color = '#111827';
            report.style.border = '0';
            report.style.borderRadius = '0';
            report.style.boxShadow = 'none';
            report.querySelectorAll('[data-pdf-ignore]').forEach((item) => item.remove());

            const answers = report.querySelector<HTMLElement>('[data-pdf-answers]');
            answers?.style.setProperty('break-inside', 'avoid', 'important');
            answers?.querySelector<HTMLElement>('[data-pdf-answers-grid]')?.style.setProperty(
              'grid-template-columns',
              'minmax(0, 1fr)',
              'important'
            );
            answers?.querySelectorAll<HTMLElement>('[data-pdf-answers-grid] > *').forEach((row) => {
              row.style.setProperty('break-inside', 'avoid', 'important');
            });
            answers?.querySelectorAll<HTMLElement>('[data-pdf-answer-label]').forEach((label) => {
              label.style.setProperty('white-space', 'normal', 'important');
              label.style.setProperty('overflow', 'visible', 'important');
              label.style.setProperty('text-overflow', 'clip', 'important');
              label.style.setProperty('min-width', '0', 'important');
              label.style.setProperty('line-height', '1.5', 'important');
            });

            const colorCanvas = clonedDocument.createElement('canvas');
            colorCanvas.width = 1;
            colorCanvas.height = 1;
            const context = colorCanvas.getContext('2d', { willReadFrequently: true });
            if (!context) throw new Error('Could not prepare report colors for PDF export.');

            const normalizeColor = (color: string) => {
              context.fillStyle = '#010203';
              const initialColor = context.fillStyle;
              context.fillStyle = color;
              if (
                context.fillStyle === initialColor &&
                color.toLowerCase() !== '#010203' &&
                color.toLowerCase() !== 'rgb(1, 2, 3)'
              ) {
                throw new Error(`Could not convert report color "${color}" for PDF export.`);
              }
              context.clearRect(0, 0, 1, 1);
              context.fillRect(0, 0, 1, 1);
              const [red, green, blue, alpha] = context.getImageData(0, 0, 1, 1).data;
              return `rgba(${red}, ${green}, ${blue}, ${alpha / 255})`;
            };

            const elements = [report, ...report.querySelectorAll<HTMLElement | SVGElement>('*')];
            for (const element of elements) {
              const computed = clonedDocument.defaultView?.getComputedStyle(element);
              if (!computed) throw new Error('Could not read report styles for PDF export.');
              if (element instanceof HTMLElement) {
                element.scrollTop = 0;
                element.scrollLeft = 0;
              }
              for (let index = 0; index < computed.length; index++) {
                const property = computed[index];
                const value = computed.getPropertyValue(property);
                if (!value || property.startsWith('--') || !/\b(?:oklab|oklch|lab|lch|color-mix|color)\(/i.test(value)) continue;
                if (property.includes('color')) {
                  element.style.setProperty(property, normalizeColor(value), 'important');
                } else if (property.includes('shadow') || property === 'filter') {
                  element.style.setProperty(property, 'none', 'important');
                }
              }
              element.style.setProperty('background-image', 'none', 'important');
              element.style.setProperty('box-shadow', 'none', 'important');
              element.style.setProperty('text-shadow', 'none', 'important');
              element.style.setProperty('filter', 'none', 'important');
            }
          },
        },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      })
      .from(exportElement)
      .outputPdf('blob');
  } finally {
    exportElement.remove();
  }

  if (!(pdfBlob instanceof Blob)) {
    throw new Error('PDF generation did not return a downloadable file.');
  }

  const objectUrl = URL.createObjectURL(pdfBlob);
  const downloadLink = document.createElement('a');
  downloadLink.href = objectUrl;
  downloadLink.download = `${safeFilename}.pdf`;
  downloadLink.hidden = true;
  document.body.appendChild(downloadLink);
  downloadLink.click();
  downloadLink.remove();
  window.setTimeout(() => URL.revokeObjectURL(objectUrl), 30_000);
}