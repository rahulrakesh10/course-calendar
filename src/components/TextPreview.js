import React from 'react';

function TextPreview({ text }) {
  return (
    <div style={{ marginTop: '1rem' }}>
      <h2>Extracted Text</h2>
      <textarea value={text} rows={15} style={{ width: '100%' }} readOnly />
    </div>
  );
}

export default TextPreview;
