import { parse } from 'chrono-node';

export function extractDatesFromText(text) {
  const lines = text.split(/[\n.]/); // split by line or sentence
  const courseCodeMatch = text.match(/\b\d{4}\b/g) || [];
  const frequencyMap = {};

  courseCodeMatch.forEach(code => {
    frequencyMap[code] = (frequencyMap[code] || 0) + 1;
  });

  const mostFrequentCode = Object.entries(frequencyMap)
    .sort((a, b) => b[1] - a[1])[0]?.[0] || null;

  const coursePrefixMatch = text.match(/\b[A-Z]{2,4}\s?(\d{4})\b/);
  const coursePrefix = coursePrefixMatch ? coursePrefixMatch[0].replace(/\s+/g, '') : `Course ${mostFrequentCode}`;

  const seen = new Set();
  const events = [];

  for (const fragment of lines) {
    const subText = fragment.trim();
    if (!subText) continue;

    const results = parse(subText);
    for (const result of results) {
      const snippet = subText.toLowerCase();

      if (!/due|midterm|final exam|test|exam/.test(snippet)) continue;

      let label = '';
      if (snippet.includes('final exam')) label = 'Final Exam';
      else if (snippet.includes('midterm')) label = 'Midterm';
      else if (snippet.includes('test')) label = 'Test';
      else if (snippet.includes('exam')) label = 'Exam';
      else {
        const match = snippet.match(/(assignment|project|quiz)\s*\d*\s*due/i);
        if (match) {
          label = match[0].trim().replace(/\s+/g, ' ');
          label = label.charAt(0).toUpperCase() + label.slice(1);
        }
      }

      if (label) {
        const key = `${label}-${result.start.date().toDateString()}`;
        if (!seen.has(key)) {
          seen.add(key);
          events.push({
            title: `${coursePrefix} – ${label}`,
            date: result.start.date()
          });
        }
      }
    }
  }

  return events;
}
