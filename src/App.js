import React, { useState } from 'react';
import FileUpload from './FileUpload';
import TextPreview from './TextPreview';
import CalendarView from './CalendarView'; // your old one (optional)
import EnhancedCalendar from './EnhancedCalendar'; // new advanced one

function App() {
  const [extractedText, setExtractedText] = useState('');
  const [events, setEvents] = useState([]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">📚 Course Calendar App</h1>

      <FileUpload setExtractedText={setExtractedText} setEvents={setEvents} />
      <TextPreview text={extractedText} />

      {/* Your original basic calendar if you still want it */}
      {/* <CalendarView events={events} /> */}

      {/* NEW Enhanced Calendar */}
      <EnhancedCalendar />
    </div>
  );
}

export default App;
