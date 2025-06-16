import React, { useState } from 'react';
import FileUpload from './components/FileUpload';
import TextPreview from './components/TextPreview';
import CalendarView from './components/CalendarView'; 

function App() {
  const [extractedText, setExtractedText] = useState('');
  const [events, setEvents] = useState([]); 

  return (
    <div className="App" style={{ padding: '2rem' }}>
      <h1>📚 Course Outline Calendar</h1>
      <FileUpload setExtractedText={setExtractedText} setEvents={setEvents} />
      <TextPreview text={extractedText} />
      <CalendarView events={events} />
    </div>
  );
}

export default App;
