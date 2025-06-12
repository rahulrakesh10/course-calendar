import { parse } from 'chrono-node';

export function extractDatesFromText(text) {
  const results = parse(text);

  // 1. Detect most common 4-digit number (likely course code)
  const courseCodeMatch = text.match(/\b\d{4}\b/g) || [];
  const frequencyMap = {};

  courseCodeMatch.forEach(code => {
    frequencyMap[code] = (frequencyMap[code] || 0) + 1;
  });

  const mostFrequentCode = Object.entries(frequencyMap)
    .sort((a, b) => b[1] - a[1])[0]?.[0] || null;

  // Optional: look for course prefix like CS/STAT/BIO/etc
  const coursePrefixMatch = text.match(/\b[A-Z]{2,4}\s?(\d{4})\b/);
  const coursePrefix = coursePrefixMatch ? coursePrefixMatch[0].replace(/\s+/g, '') : `Course ${mostFrequentCode}`;

  return results
    .map((result) => {
      const contextWindow = 80;
      const start = Math.max(0, result.index - contextWindow);
      const end = Math.min(text.length, result.index + result.text.length + contextWindow);
      const snippet = text.slice(start, end).replace(/\n/g, ' ').toLowerCase();

      // Filter to relevant events
      if (!/due|midterm|final exam|test|exam/.test(snippet)) return null;

      // Label priority
      if (snippet.includes('final exam')) return { title: `${coursePrefix} – Final Exam`, date: result.start.date() };
      if (snippet.includes('midterm')) return { title: `${coursePrefix} – Midterm`, date: result.start.date() };
      if (snippet.includes('test')) return { title: `${coursePrefix} – Test`, date: result.start.date() };
      if (snippet.includes('exam')) return { title: `${coursePrefix} – Exam`, date: result.start.date() };

      const match = snippet.match(/(assignment|project|quiz)\s*\d*\s*due/i);
      const shortTitle = match ? match[0].trim() : 'Due Date';

      return {
        title: `${coursePrefix} – ${shortTitle.charAt(0).toUpperCase() + shortTitle.slice(1)}`,
        date: result.start.date(),
      };
    })
    .filter(Boolean);
}
