import { parse } from 'chrono-node';

export function extractDatesFromText(text) {
  const results = parse(text);
  return results.map((result) => ({
    title: result.text,
    date: result.start.date(),
  }));
}
