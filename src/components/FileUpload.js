import React from 'react';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf';

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js`;

import { extractDatesFromText } from '../utils/dateExtractor'; // Add this import at the top

// Inside reader.onload after setExtractedText(text):
const events = extractDatesFromText(text).map((event) => ({
  title: event.title,
  start: event.date.toISOString().split('T')[0], // Format: YYYY-MM-DD
}));
setEvents(events);



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

      setExtractedText(text);
      // We'll handle date extraction in a future step
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
