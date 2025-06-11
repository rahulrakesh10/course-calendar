import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';

import '@fullcalendar/daygrid/main.css';  // ✅ fixed stylesheet

function CalendarView({ events }) {
  return (
    <div style={{ marginTop: '2rem' }}>
      <h2>📅 Important Dates</h2>
      <FullCalendar
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        events={events}
        height="auto"
      />
    </div>
  );
}

export default CalendarView;
