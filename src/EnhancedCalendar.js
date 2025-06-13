import { useState } from 'react';
import { format, addMinutes, isSameDay, parseISO } from 'date-fns';
import { RRule } from 'rrule';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const initialEvents = [
  // Example starter event
  {
    id: 1,
    title: 'CS2209 – Assignment 1 due',
    date: '2025-02-14',
    reminderMinutesBefore: 60,
    recurrence: null
  }
];

export default function CalendarApp() {
  const [events, setEvents] = useState(initialEvents);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const showReminder = (event) => {
    const reminderTime = addMinutes(new Date(event.date), -event.reminderMinutesBefore);
    const now = new Date();
    if (reminderTime > now) {
      setTimeout(() => toast(`Reminder: ${event.title}`), reminderTime - now);
    }
  };

  const handleDrop = (eventId, newDate) => {
    setEvents((prev) =>
      prev.map((e) => (e.id === eventId ? { ...e, date: newDate.toISOString().split('T')[0] } : e))
    );
  };

  const handleDelete = (id) => setEvents(events.filter((e) => e.id !== id));

  const handleSave = (updatedEvent) => {
    setEvents((prev) =>
      prev.map((e) => (e.id === updatedEvent.id ? updatedEvent : e))
    );
    setSelectedEvent(null);
  };

  const filteredEvents = events.filter((e) =>
    e.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const recurringInstances = (event) => {
    if (!event.recurrence) return [event];
    const rule = RRule.fromString(event.recurrence);
    const dates = rule.between(new Date('2025-01-01'), new Date('2025-12-31'));
    return dates.map((d, idx) => ({ ...event, date: format(d, 'yyyy-MM-dd'), id: `${event.id}-${idx}` }));
  };

  const allEvents = filteredEvents.flatMap(recurringInstances);

  return (
    <div className="p-4">
      <ToastContainer />
      <h1 className="text-2xl font-bold mb-4">📅 Enhanced Calendar</h1>
      <input
        type="text"
        className="border p-2 mb-4 w-full"
        placeholder="Search events..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <div className="grid grid-cols-7 gap-4">
        {Array.from({ length: 30 }, (_, i) => {
          const day = new Date(2025, 1, i + 1); // February 2025
          const dayEvents = allEvents.filter((e) => isSameDay(parseISO(e.date), day));
          return (
            <div key={i} className="border p-2 rounded shadow-md">
              <div className="font-semibold">{format(day, 'MMM d')}</div>
              {dayEvents.map((e) => (
                <div key={e.id} className="bg-blue-100 p-1 mt-1 rounded cursor-pointer" onClick={() => setSelectedEvent(e)}>
                  {e.title}
                </div>
              ))}
            </div>
          );
        })}
      </div>

      {selectedEvent && (
        <div className="fixed top-10 right-10 bg-white border p-4 shadow-xl w-80">
          <h2 className="text-lg font-semibold mb-2">Edit Event</h2>
          <input
            className="border p-1 mb-2 w-full"
            value={selectedEvent.title}
            onChange={(e) => setSelectedEvent({ ...selectedEvent, title: e.target.value })}
          />
          <input
            type="date"
            className="border p-1 mb-2 w-full"
            value={selectedEvent.date}
            onChange={(e) => setSelectedEvent({ ...selectedEvent, date: e.target.value })}
          />
          <input
            type="number"
            placeholder="Reminder (min before)"
            className="border p-1 mb-2 w-full"
            value={selectedEvent.reminderMinutesBefore || 0}
            onChange={(e) => setSelectedEvent({ ...selectedEvent, reminderMinutesBefore: Number(e.target.value) })}
          />
          <select
            className="border p-1 mb-2 w-full"
            value={selectedEvent.recurrence || ''}
            onChange={(e) => setSelectedEvent({ ...selectedEvent, recurrence: e.target.value || null })}
          >
            <option value="">No repeat</option>
            <option value="FREQ=WEEKLY;BYDAY=FR">Weekly on Friday</option>
            <option value="FREQ=MONTHLY;BYMONTHDAY=14">Monthly on 14th</option>
          </select>
          <div className="flex justify-between">
            <button className="bg-blue-500 text-white px-3 py-1" onClick={() => handleSave(selectedEvent)}>Save</button>
            <button className="bg-red-500 text-white px-3 py-1" onClick={() => handleDelete(selectedEvent.id)}>Delete</button>
          </div>
        </div>
      )}
    </div>
  );
}
