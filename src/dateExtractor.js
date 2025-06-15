import { parse } from 'chrono-node';

export function extractDatesFromText(text) {
  const results = parse(text);

  // Find course code
  const courseCodeMatch = text.match(/\b[A-Z]{2,4}\s?\d{4}\b/);
  const coursePrefix = courseCodeMatch ? courseCodeMatch[0].replace(/\s+/g, '') : 'Course';

  return results
    .map(result => {
      const contextWindow = 80;
      const start = Math.max(0, result.index - contextWindow);
      const end = Math.min(text.length, result.index + result.text.length + contextWindow);
      const snippet = text.slice(start, end).toLowerCase().replace(/\n/g, ' ');

      // Only include assignment- or activity-style events
      const match = snippet.match(/(assignment|project|quiz)\s*\d*\s*due/i);
      if (!match) return null;

      const title = match[0].trim().replace(/\s+/g, ' ');
      return {
        title: `${coursePrefix} – ${title.charAt(0).toUpperCase() + title.slice(1)}`,
        date: result.start.date()
      };
    })
    .filter(Boolean);
}
