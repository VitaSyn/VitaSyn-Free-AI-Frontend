export async function downloadReportPdf(element: HTMLElement, filename: string) {
  const { default: html2pdf } = await import('html2pdf.js');
  const safeFilename = filename
    .replace(/[<>:"/\\|?*\u0000-\u001f]/g, '-')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '') || 'assessment-report';

  await html2pdf()
    .set({
      filename: `${safeFilename}.pdf`,
      margin: [10, 10, 10, 10],
      image: { type: 'png' },
      html2canvas: {
        scale: 3,
        useCORS: true,
        backgroundColor: '#ffffff',
        windowWidth: 760,
        onclone: (clonedDocument: Document) => {
          clonedDocument.documentElement.classList.remove('dark');
          clonedDocument.body.classList.remove('dark');

          const report = clonedDocument.querySelector<HTMLElement>('[data-pdf-report]');
          if (!report) return;

          report.classList.add('pdf-export-root');
          report.style.width = '760px';
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

          const style = clonedDocument.createElement('style');
          style.textContent = `
            .pdf-export-root .text-zinc-400,
            .pdf-export-root .text-zinc-500,
            .pdf-export-root .text-zinc-600 { color: #374151 !important; }
            .pdf-export-root .text-zinc-700 { color: #1f2937 !important; }
            .pdf-export-root .text-lime-500,
            .pdf-export-root .text-lime-600,
            .pdf-export-root .text-lime-700 { color: #3f6212 !important; }
            .pdf-export-root .text-amber-500,
            .pdf-export-root .text-amber-600,
            .pdf-export-root .text-amber-700 { color: #92400e !important; }
            .pdf-export-root .text-red-600 { color: #991b1b !important; }
            .pdf-export-root [class*="bg-lime-500/"] { background-color: #ecfccb !important; }
            .pdf-export-root [class*="bg-amber-400/"],
            .pdf-export-root [class*="bg-amber-500/"] { background-color: #fef3c7 !important; }
            .pdf-export-root [class*="bg-red-500/"] { background-color: #fee2e2 !important; }
            .pdf-export-root [class*="bg-zinc-50"] { background-color: #f3f4f6 !important; }
            .pdf-export-root .rounded-xl,
            .pdf-export-root .rounded-2xl,
            .pdf-export-root li { break-inside: avoid; page-break-inside: avoid; }
          `;
          clonedDocument.head.appendChild(style);
        },
      },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
    })
    .from(element)
    .save();
}