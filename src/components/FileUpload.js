import React from 'react';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf';
import { extractDatesFromText } from '../utils/dateExtractor.js'; // make sure this path is correct

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js`;

function FileUpload({ setExtractedText, setEvents }) {
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file || file.type !== 'application/pdf') {
      alert('Please upload a PDF file.');
      return;
    }

    const reader = new FileReader();

    reader.onload = async function () {
      const typedarray = new Uint8Array(this.result);

      const pdf = await pdfjsLib.getDocument({ data: typedarray }).promise;

      let text = '';
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const pageText = content.items.map((item) => item.str).join(' ');
        text += pageText + '\n';
      }

      // Set extracted text for preview
      setExtractedText(text);

      // ✅ Extract dates and create calendar events
      const events = extractDatesFromText(text).map((event) => ({
        title: event.title,
        start: event.date.toISOString().split('T')[0], // Format: YYYY-MM-DD
      }));
      setEvents(events);
    };

    reader.readAsArrayBuffer(file);
  };

  return (
    <div>
      <label htmlFor="upload">Upload Course Outline (PDF): </label>
      <input type="file" id="upload" accept="application/pdf" onChange={handleFileUpload} />
    </div>
  );
}

export default FileUpload;
