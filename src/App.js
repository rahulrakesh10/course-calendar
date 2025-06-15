import React, { useState } from 'react';
import FileUpload from './components/FileUpload';
import TextPreview from './components/TextPreview';
import CalendarView from './components/CalendarView'; 
import BigCalendarView from './BigCalendarView';
import { extractDatesFromText } from './dateExtractor';

function App() {
  const [text, setText] = useState('');
  const [events, setEvents] = useState([]);

  const handleTextExtracted = extractedText => {
    setText(extractedText);
    const parsed = extractDatesFromText(extractedText);
    setEvents(parsed.map(ev => ({
      title: ev.title,
      start: ev.date,
      end: ev.date
    })));
  };

  return (
    <div>
      <FileUpload onTextExtracted={handleTextExtracted} />
      <TextPreview text={text} />
-     <CalendarView events={events} />
+     <BigCalendarView events={events} />
    </div>
  );
}

export default App;
